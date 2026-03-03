"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePassword = exports.logout = exports.refreshToken = exports.getMe = exports.resendVerification = exports.verifyEmail = exports.socialLogin = exports.login = exports.register = exports.convertTemplateToSteps = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const crypto_1 = __importDefault(require("crypto"));
const User_1 = __importDefault(require("../models/User"));
const Progress_1 = __importDefault(require("../models/Progress"));
const SkillGap_1 = __importDefault(require("../models/SkillGap"));
const LearningPath_1 = __importDefault(require("../models/LearningPath"));
const RefreshToken_1 = __importDefault(require("../models/RefreshToken"));
const TokenBlacklist_1 = __importDefault(require("../models/TokenBlacklist"));
const auth_middleware_1 = require("../middleware/auth.middleware");
const learningPathTemplates_1 = require("../data/learningPathTemplates");
const sendTokenResponse = (user, statusCode, res, accessToken, refreshToken) => {
    // Cookie options
    const cookieOptions = {
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Match refreshToken expiry
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
    };
    // Access token cookie (short-lived)
    const accessCookieOptions = {
        ...cookieOptions,
        expires: new Date(Date.now() + 15 * 60 * 1000), // Match accessToken expiry
    };
    res.status(statusCode)
        .cookie('accessToken', accessToken, accessCookieOptions)
        .cookie('refreshToken', refreshToken, cookieOptions)
        .json({
        success: true,
        data: {
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                avatar: user.avatar,
                role: user.role,
                preferences: user.preferences,
                currentLearningPathId: user.currentLearningPathId,
            },
            accessToken, // Still send in body for client flexibility, but cookies are priority
            refreshToken,
        },
    });
};
// Shared helper: convert a learning path template into step documents
const convertTemplateToSteps = (template) => {
    if (!template)
        return [];
    return template.modules.flatMap((module, moduleIdx) => module.milestones.map((milestone, msIdx) => ({
        title: `${module.title}: ${milestone.title}`,
        description: milestone.description,
        order: moduleIdx * 10 + msIdx + 1,
        completed: false,
        estimatedTime: milestone.checklistItems.reduce((sum, item) => sum + item.estimatedHours * 60, 0),
        milestoneId: milestone.id,
        moduleId: module.id,
        checklist: milestone.checklistItems.map(item => ({
            id: item.id,
            title: item.title,
            description: item.description,
            completed: false,
            estimatedHours: item.estimatedHours,
            resourceType: item.resourceType,
            isRequired: item.isRequired,
            url: item.url,
        })),
        quizTopic: milestone.quizTopic,
        passingScore: milestone.passingScore,
    })));
};
exports.convertTemplateToSteps = convertTemplateToSteps;
// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res, next) => {
    const session = await mongoose_1.default.startSession();
    session.startTransaction();
    try {
        const { name, email, password, learningPathId } = req.body;
        // Check if user exists
        const existingUser = await User_1.default.findOne({ email });
        if (existingUser) {
            await session.abortTransaction();
            session.endSession();
            res.status(400).json({
                success: false,
                error: 'User already exists',
            });
            return;
        }
        // Get template for learning path
        const template = (0, learningPathTemplates_1.getPathById)(learningPathId) || learningPathTemplates_1.allLearningPaths[0];
        // Generate verification token
        const verificationToken = crypto_1.default.randomBytes(32).toString('hex');
        const verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
        // Create user within transaction
        const [user] = await User_1.default.create([{
                name,
                email,
                password,
                verificationToken,
                verificationTokenExpires,
                isVerified: false,
            }], { session });
        // Create initial progress record
        await Progress_1.default.create([{
                userId: user._id,
                skillLevel: 0,
                learningProgress: 0,
                topicsCompleted: 0,
                totalTopics: template.modules.length * 3,
                weakAreas: [],
                strongAreas: [],
                quizScores: [],
                studyTime: [],
                improvementData: [],
                topicProgress: template.modules.map(module => ({
                    topicId: module.id,
                    topicName: module.title,
                    masteryLevel: 0,
                    timeSpentMinutes: 0,
                    lessonsCompleted: 0,
                    totalLessons: module.milestones.length * 2,
                    status: 'locked',
                })),
            }], { session });
        // Create initial skill gaps based on the path
        await SkillGap_1.default.create([{
                userId: user._id,
                skills: template.modules.map(module => ({
                    topic: module.title,
                    currentLevel: 0,
                    targetLevel: 100,
                    priority: 'medium',
                })),
            }], { session });
        // Create initial learning path using shared helper
        const steps = (0, exports.convertTemplateToSteps)(template);
        const [learningPath] = await LearningPath_1.default.create([{
                userId: user._id,
                title: template.title,
                description: template.description,
                category: template.category,
                difficulty: template.difficulty,
                steps,
                currentStepIndex: 0,
                progress: 0,
                totalWeeks: template.totalWeeks,
                startedAt: new Date(),
            }], { session });
        // Update user with current path
        user.currentLearningPathId = learningPath._id;
        await user.save({ session });
        // Commit all changes atomically
        await session.commitTransaction();
        session.endSession();
        // Generate tokens (outside transaction — not critical)
        const { accessToken, refreshToken } = await (0, auth_middleware_1.generateTokens)(user._id.toString(), {
            userAgent: req.headers['user-agent'],
            ip: req.ip,
        });
        sendTokenResponse(user, 201, res, accessToken, refreshToken);
    }
    catch (error) {
        await session.abortTransaction();
        session.endSession();
        next(error);
    }
};
exports.register = register;
// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        // Validate email & password
        if (!email || !password) {
            res.status(400).json({
                success: false,
                error: 'Please provide email and password',
            });
            return;
        }
        // Check for user
        const user = await User_1.default.findOne({ email }).select('+password');
        if (!user) {
            res.status(401).json({
                success: false,
                error: 'Invalid credentials',
            });
            return;
        }
        // Check password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            res.status(401).json({
                success: false,
                error: 'Invalid credentials',
            });
            return;
        }
        const { accessToken, refreshToken } = await (0, auth_middleware_1.generateTokens)(user._id.toString(), {
            userAgent: req.headers['user-agent'],
            ip: req.ip,
        });
        sendTokenResponse(user, 200, res, accessToken, refreshToken);
    }
    catch (error) {
        next(error);
    }
};
exports.login = login;
// @desc    Social Login / Firebase Bridge
// @route   POST /api/auth/social
// @access  Public
const socialLogin = async (req, res, next) => {
    try {
        const { idToken, name, email, avatar } = req.body;
        if (!idToken || !email) {
            res.status(400).json({ success: false, error: 'Authorization token and email are required' });
            return;
        }
        /*
        HIGH-03: VERIFICATION LOGIC
        In production: verify idToken using firebase-admin SDK:
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        if (decodedToken.email !== email) throw new Error('Identity mismatch');
        */
        let user = await User_1.default.findOne({ email });
        if (!user) {
            // Create user if not exists
            user = await User_1.default.create({
                name: name || email.split('@')[0],
                email,
                avatar,
                password: crypto_1.default.randomUUID(), // Random password for social users
                role: 'student',
            });
            // Note: In a real app, you would also trigger Progress/LearningPath creation here 
            // similar to the register function.
        }
        const { accessToken, refreshToken } = await (0, auth_middleware_1.generateTokens)(user._id.toString(), {
            userAgent: req.headers['user-agent'],
            ip: req.ip,
        });
        sendTokenResponse(user, 200, res, accessToken, refreshToken);
    }
    catch (error) {
        next(error);
    }
};
exports.socialLogin = socialLogin;
// @desc    Verify email address
// @route   POST /api/auth/verify-email
// @access  Public
const verifyEmail = async (req, res, next) => {
    try {
        const { token } = req.body;
        if (!token) {
            res.status(400).json({ success: false, error: 'Verification token is required' });
            return;
        }
        const user = await User_1.default.findOne({
            verificationToken: token,
            verificationTokenExpires: { $gt: new Date() },
        });
        if (!user) {
            res.status(400).json({ success: false, error: 'Invalid or expired verification token' });
            return;
        }
        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpires = undefined;
        await user.save();
        res.status(200).json({
            success: true,
            message: 'Email verified successfully',
        });
    }
    catch (error) {
        next(error);
    }
};
exports.verifyEmail = verifyEmail;
// @desc    Resend verification email
// @route   POST /api/auth/resend-verification
// @access  Private
const resendVerification = async (req, res, next) => {
    try {
        const user = req.user;
        if (!user)
            return;
        if (user.isVerified) {
            res.status(400).json({ success: false, error: 'Email is already verified' });
            return;
        }
        const verificationToken = crypto_1.default.randomBytes(32).toString('hex');
        user.verificationToken = verificationToken;
        user.verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);
        await user.save();
        // In production: send email using Nodemailer/SendGrid
        console.log(`Verification email sent to ${user.email} with token: ${verificationToken}`);
        res.status(200).json({
            success: true,
            message: 'Verification email sent',
        });
    }
    catch (error) {
        next(error);
    }
};
exports.resendVerification = resendVerification;
// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res, next) => {
    try {
        const user = req.user;
        res.status(200).json({
            success: true,
            data: {
                id: user?._id,
                name: user?.name,
                email: user?.email,
                avatar: user?.avatar,
                preferences: user?.preferences,
            },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getMe = getMe;
// @desc    Refresh access token
// @route   POST /api/auth/refresh
// @access  Public
const refreshToken = async (req, res, _next) => {
    try {
        // MED-07: Extract token from body or cookies
        const token = req.body.refreshToken || req.cookies?.refreshToken;
        if (!token) {
            res.status(400).json({
                success: false,
                error: 'Please provide a refresh token',
            });
            return;
        }
        const decoded = await (0, auth_middleware_1.verifyRefreshToken)(token);
        const { accessToken, refreshToken: newRefreshToken } = await (0, auth_middleware_1.generateTokens)(decoded.id, { userAgent: req.headers['user-agent'], ip: req.ip });
        const user = await User_1.default.findById(decoded.id);
        sendTokenResponse(user, 200, res, accessToken, newRefreshToken);
    }
    catch (error) {
        const message = error instanceof Error ? error.message : 'Invalid refresh token';
        res.status(401).json({
            success: false,
            error: message,
        });
    }
};
exports.refreshToken = refreshToken;
// @desc    Logout user / Invalidate tokens
// @route   POST /api/auth/logout
// @access  Private
const logout = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        const accessToken = authHeader?.split(' ')[1];
        const { refreshToken: token } = req.body;
        // Blacklist access token if provided (HIGH-10: Use jti)
        if (accessToken) {
            const decoded = jsonwebtoken_1.default.decode(accessToken);
            const jti = decoded?.jti;
            const expiresAt = decoded?.exp ? new Date(decoded.exp * 1000) : new Date(Date.now() + 15 * 60 * 1000);
            if (jti) {
                await TokenBlacklist_1.default.create({
                    jti,
                    expiresAt,
                    reason: 'logout',
                });
            }
        }
        // Revoke refresh token if provided
        if (token) {
            await RefreshToken_1.default.updateOne({ token }, { isRevoked: true });
        }
        // MED-07: Clear cookies
        res.cookie('accessToken', 'none', {
            expires: new Date(Date.now() + 10 * 1000),
            httpOnly: true,
        });
        res.cookie('refreshToken', 'none', {
            expires: new Date(Date.now() + 10 * 1000),
            httpOnly: true,
        });
        res.status(200).json({
            success: true,
            message: 'Logged out successfully',
        });
    }
    catch (error) {
        next(error);
    }
};
exports.logout = logout;
// @desc    Update password
// @route   PUT /api/auth/password
// @access  Private
const updatePassword = async (req, res, next) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const user = await User_1.default.findById(req.user?._id).select('+password');
        if (!user) {
            res.status(404).json({
                success: false,
                error: 'User not found',
            });
            return;
        }
        // Check current password
        const isMatch = await user.comparePassword(currentPassword);
        if (!isMatch) {
            res.status(401).json({
                success: false,
                error: 'Invalid current password',
            });
            return;
        }
        // Prevent reusing current password
        const isSamePassword = await user.comparePassword(newPassword);
        if (isSamePassword) {
            res.status(400).json({
                success: false,
                error: 'New password must be different from current password',
            });
            return;
        }
        user.password = newPassword;
        await user.save();
        res.status(200).json({
            success: true,
            message: 'Password updated successfully',
        });
    }
    catch (error) {
        next(error);
    }
};
exports.updatePassword = updatePassword;
//# sourceMappingURL=auth.controller.js.map
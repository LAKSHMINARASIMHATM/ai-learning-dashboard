import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import User from '../models/User';
import Progress from '../models/Progress';
import SkillGap from '../models/SkillGap';
import LearningPath from '../models/LearningPath';
import RefreshToken from '../models/RefreshToken';
import TokenBlacklist from '../models/TokenBlacklist';
import { generateTokens, verifyRefreshToken, generateAccessToken } from '../middleware/auth.middleware';
import { AuthRequest } from '../types';
import { getPathById, allLearningPaths } from '../data/learningPathTemplates';

const sendTokenResponse = (
    user: any,
    statusCode: number,
    res: Response,
    accessToken: string,
    refreshToken: string
) => {
    // Cookie options
    const cookieOptions: any = {
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
export const convertTemplateToSteps = (template: ReturnType<typeof getPathById>) => {
    if (!template) return [];
    return template.modules.flatMap((module, moduleIdx) =>
        module.milestones.map((milestone, msIdx) => ({
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
        }))
    );
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
export const register = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { name, email, password, learningPathId } = req.body;

        // Check if user exists
        const existingUser = await User.findOne({ email });
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
        const template = getPathById(learningPathId) || allLearningPaths[0];

        // Generate verification token
        const verificationToken = crypto.randomBytes(32).toString('hex');
        const verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

        // Create user within transaction
        const [user] = await User.create([{
            name,
            email,
            password,
            verificationToken,
            verificationTokenExpires,
            isVerified: false,
        }], { session });

        // Create initial progress record
        await Progress.create([{
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
        await SkillGap.create([{
            userId: user._id,
            skills: template.modules.map(module => ({
                topic: module.title,
                currentLevel: 0,
                targetLevel: 100,
                priority: 'medium',
            })),
        }], { session });

        // Create initial learning path using shared helper
        const steps = convertTemplateToSteps(template);

        const [learningPath] = await LearningPath.create([{
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
        const { accessToken, refreshToken } = await generateTokens(user._id.toString(), {
            userAgent: req.headers['user-agent'],
            ip: req.ip,
        });

        sendTokenResponse(user, 201, res, accessToken, refreshToken);
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        next(error);
    }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
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
        const user = await User.findOne({ email }).select('+password');

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

        const { accessToken, refreshToken } = await generateTokens(user._id.toString(), {
            userAgent: req.headers['user-agent'],
            ip: req.ip,
        });

        sendTokenResponse(user, 200, res, accessToken, refreshToken);
    } catch (error) {
        next(error);
    }
};

// @desc    Social Login / Firebase Bridge
// @route   POST /api/auth/social
// @access  Public
export const socialLogin = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
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

        let user = await User.findOne({ email });

        if (!user) {
            // Create user if not exists
            user = await User.create({
                name: name || email.split('@')[0],
                email,
                avatar,
                password: crypto.randomUUID(), // Random password for social users
                role: 'student',
            });

            // Note: In a real app, you would also trigger Progress/LearningPath creation here 
            // similar to the register function.
        }

        const { accessToken, refreshToken } = await generateTokens(user._id.toString(), {
            userAgent: req.headers['user-agent'],
            ip: req.ip,
        });

        sendTokenResponse(user, 200, res, accessToken, refreshToken);
    } catch (error) {
        next(error);
    }
};

// @desc    Verify email address
// @route   POST /api/auth/verify-email
// @access  Public
export const verifyEmail = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { token } = req.body;

        if (!token) {
            res.status(400).json({ success: false, error: 'Verification token is required' });
            return;
        }

        const user = await User.findOne({
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
    } catch (error) {
        next(error);
    }
};

// @desc    Resend verification email
// @route   POST /api/auth/resend-verification
// @access  Private
export const resendVerification = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const user = req.user;
        if (!user) return;

        if (user.isVerified) {
            res.status(400).json({ success: false, error: 'Email is already verified' });
            return;
        }

        const verificationToken = crypto.randomBytes(32).toString('hex');
        user.verificationToken = verificationToken;
        user.verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);
        await user.save();

        // In production: send email using Nodemailer/SendGrid
        console.log(`Verification email sent to ${user.email} with token: ${verificationToken}`);

        res.status(200).json({
            success: true,
            message: 'Verification email sent',
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
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
    } catch (error) {
        next(error);
    }
};

// @desc    Refresh access token
// @route   POST /api/auth/refresh
// @access  Public
export const refreshToken = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
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

        const decoded = await verifyRefreshToken(token);
        const { accessToken, refreshToken: newRefreshToken } = await generateTokens(
            decoded.id,
            { userAgent: req.headers['user-agent'], ip: req.ip }
        );

        const user = await User.findById(decoded.id);
        sendTokenResponse(user, 200, res, accessToken, newRefreshToken);
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Invalid refresh token';
        res.status(401).json({
            success: false,
            error: message,
        });
    }
};

// @desc    Logout user / Invalidate tokens
// @route   POST /api/auth/logout
// @access  Private
export const logout = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const authHeader = req.headers.authorization;
        const accessToken = authHeader?.split(' ')[1];
        const { refreshToken: token } = req.body;

        // Blacklist access token if provided (HIGH-10: Use jti)
        if (accessToken) {
            const decoded = jwt.decode(accessToken) as any;
            const jti = decoded?.jti;
            const expiresAt = decoded?.exp ? new Date(decoded.exp * 1000) : new Date(Date.now() + 15 * 60 * 1000);

            if (jti) {
                await TokenBlacklist.create({
                    jti,
                    expiresAt,
                    reason: 'logout',
                });
            }
        }

        // Revoke refresh token if provided
        if (token) {
            await RefreshToken.updateOne(
                { token },
                { isRevoked: true }
            );
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
    } catch (error) {
        next(error);
    }
};

// @desc    Update password
// @route   PUT /api/auth/password
// @access  Private
export const updatePassword = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { currentPassword, newPassword } = req.body;

        const user = await User.findById(req.user?._id).select('+password');

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
    } catch (error) {
        next(error);
    }
};

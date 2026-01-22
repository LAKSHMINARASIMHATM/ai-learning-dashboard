import { Request, Response, NextFunction } from 'express';
import User from '../models/User';
import Progress from '../models/Progress';
import SkillGap from '../models/SkillGap';
import LearningPath from '../models/LearningPath';
import { generateToken } from '../middleware/auth.middleware';
import { AuthRequest } from '../types';
import { getPathById, allLearningPaths } from '../data/learningPathTemplates';

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
export const register = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { name, email, password, learningPathId } = req.body;

        // Check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            res.status(400).json({
                success: false,
                error: 'User already exists',
            });
            return;
        }

        // Create user
        const user = await User.create({
            name,
            email,
            password,
        });

        // Get template for learning path
        const template = getPathById(learningPathId) || allLearningPaths[0];

        // Create initial progress record
        await Progress.create({
            userId: user._id,
            skillLevel: 0,
            learningProgress: 0,
            topicsCompleted: 0,
            totalTopics: template.modules.length * 3, // Rough estimate
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
        });

        // Create initial skill gaps based on the path
        await SkillGap.create({
            userId: user._id,
            skills: template.modules.map(module => ({
                topic: module.title,
                currentLevel: 0,
                targetLevel: 100,
                priority: 'medium',
            })),
        });

        // Create initial learning path from template
        const steps = template.modules.flatMap((module, moduleIdx) =>
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
                })),
                quizTopic: milestone.quizTopic,
                passingScore: milestone.passingScore,
            }))
        );

        const learningPath = await LearningPath.create({
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
        });

        // Update user with current path
        user.currentLearningPathId = learningPath._id;
        await user.save();

        // Generate token
        const token = generateToken(user._id.toString());

        res.status(201).json({
            success: true,
            data: {
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    preferences: user.preferences,
                    currentLearningPathId: user.currentLearningPathId,
                },
                token,
            },
        });
    } catch (error) {
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

        const token = generateToken(user._id.toString());

        res.status(200).json({
            success: true,
            data: {
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    preferences: user.preferences,
                },
                token,
            },
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

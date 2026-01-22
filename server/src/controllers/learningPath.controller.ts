import { Response, NextFunction } from 'express';
import LearningPath from '../models/LearningPath';
import Progress from '../models/Progress';
import User from '../models/User';
import { AuthRequest } from '../types';
import {
    allLearningPaths,
    getPathById,
    LearningPathTemplate,
    Milestone,
    ChecklistItem
} from '../data/learningPathTemplates';

// @desc    Get available learning path templates
// @route   GET /api/learning-path/templates
// @access  Private
export const getPathTemplates = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const templates = allLearningPaths.map(path => ({
            id: path.id,
            title: path.title,
            description: path.description,
            category: path.category,
            totalWeeks: path.totalWeeks,
            difficulty: path.difficulty,
            moduleCount: path.modules.length,
            outcomes: path.outcomes,
            targetRoles: path.targetRoles,
        }));

        res.status(200).json({
            success: true,
            count: templates.length,
            data: templates,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get template details with full checklist
// @route   GET /api/learning-path/templates/:templateId
// @access  Private
export const getTemplateDetails = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const template = getPathById(req.params.templateId);

        if (!template) {
            res.status(404).json({
                success: false,
                error: 'Learning path template not found',
            });
            return;
        }

        res.status(200).json({
            success: true,
            data: template,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Start a learning path from template
// @route   POST /api/learning-path/start
// @access  Private
export const startLearningPath = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { templateId } = req.body;
        const userId = req.user?._id;

        const template = getPathById(templateId);
        if (!template) {
            res.status(404).json({
                success: false,
                error: 'Learning path template not found',
            });
            return;
        }

        // Check if user already has this path
        let existingPath = await LearningPath.findOne({ userId, 'steps.title': template.title });
        if (existingPath) {
            res.status(200).json({
                success: true,
                message: 'You already have this learning path',
                data: existingPath,
            });
            return;
        }

        // Convert template to learning path with checklist structure
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
            userId,
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

        // Update user with learning path reference
        await User.findByIdAndUpdate(userId, {
            currentLearningPathId: learningPath._id,
            $addToSet: { enrolledPaths: learningPath._id },
        });

        res.status(201).json({
            success: true,
            message: `Started ${template.title} learning path`,
            data: learningPath,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get user's current learning path with progress
// @route   GET /api/learning-path
// @access  Private
export const getLearningPath = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const userId = req.user?._id;

        let learningPath = await LearningPath.findOne({ userId }).sort({ updatedAt: -1 });

        // If no path exists, create a default one
        if (!learningPath) {
            const defaultTemplate = allLearningPaths[0]; // Full Stack
            const steps = defaultTemplate.modules.flatMap((module, moduleIdx) =>
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

            learningPath = await LearningPath.create({
                userId,
                title: defaultTemplate.title,
                description: defaultTemplate.description,
                category: defaultTemplate.category,
                difficulty: defaultTemplate.difficulty,
                steps,
                currentStepIndex: 0,
                progress: 0,
                totalWeeks: defaultTemplate.totalWeeks,
                startedAt: new Date(),
            });
        }

        res.status(200).json({
            success: true,
            data: learningPath,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update checklist item completion
// @route   PUT /api/learning-path/checklist/:stepIndex/:itemId
// @access  Private
export const updateChecklistItem = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { stepIndex, itemId } = req.params;
        const { completed } = req.body;
        const userId = req.user?._id;

        const learningPath = await LearningPath.findOne({ userId }).sort({ updatedAt: -1 });

        if (!learningPath) {
            res.status(404).json({ success: false, error: 'Learning path not found' });
            return;
        }

        const step = learningPath.steps[parseInt(stepIndex)];
        if (!step) {
            res.status(404).json({ success: false, error: 'Step not found' });
            return;
        }

        // Find and update the checklist item
        const checklistItem = step.checklist?.find((item: { id: string }) => item.id === itemId);
        if (checklistItem) {
            checklistItem.completed = completed;
            checklistItem.completedAt = completed ? new Date() : undefined;
        }

        // Check if all required items in step are completed
        const requiredItems = step.checklist?.filter((item: { isRequired: boolean }) => item.isRequired) || [];
        const completedRequired = requiredItems.filter((item: { completed: boolean }) => item.completed).length;
        step.completed = completedRequired === requiredItems.length && requiredItems.length > 0;

        // Recalculate overall progress
        const completedSteps = learningPath.steps.filter(s => s.completed).length;
        learningPath.progress = Math.round((completedSteps / learningPath.steps.length) * 100);

        // Auto-advance to next step if current is complete
        if (step.completed && learningPath.currentStepIndex === parseInt(stepIndex)) {
            learningPath.currentStepIndex = Math.min(
                learningPath.currentStepIndex + 1,
                learningPath.steps.length - 1
            );
        }

        await learningPath.save();

        // Update user progress with study time
        if (completed && checklistItem) {
            const progress = await Progress.findOne({ userId });
            if (progress) {
                progress.studyTime.push({
                    day: new Date().toLocaleDateString('en-US', { weekday: 'short' }),
                    hours: checklistItem.estimatedHours || 0.5,
                    topicId: step.moduleId,
                    date: new Date(),
                });
                progress.totalStudyHours = (progress.totalStudyHours || 0) + (checklistItem.estimatedHours || 0.5);
                await progress.save();
            }
        }

        res.status(200).json({
            success: true,
            data: {
                step,
                overallProgress: learningPath.progress,
                currentStepIndex: learningPath.currentStepIndex,
            },
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Mark entire step as complete
// @route   PUT /api/learning-path/step/:stepIndex/complete
// @access  Private
export const completeStep = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { stepIndex } = req.params;
        const userId = req.user?._id;

        const learningPath = await LearningPath.findOne({ userId }).sort({ updatedAt: -1 });

        if (!learningPath) {
            res.status(404).json({ success: false, error: 'Learning path not found' });
            return;
        }

        const step = learningPath.steps[parseInt(stepIndex)];
        if (!step) {
            res.status(404).json({ success: false, error: 'Step not found' });
            return;
        }

        // Mark step and all checklist items as complete
        step.completed = true;
        step.completedAt = new Date();
        if (step.checklist) {
            step.checklist.forEach((item: { completed: boolean; completedAt?: Date }) => {
                item.completed = true;
                item.completedAt = new Date();
            });
        }

        // Recalculate progress
        const completedSteps = learningPath.steps.filter(s => s.completed).length;
        learningPath.progress = Math.round((completedSteps / learningPath.steps.length) * 100);

        // Advance to next step
        if (learningPath.currentStepIndex === parseInt(stepIndex)) {
            learningPath.currentStepIndex = Math.min(
                learningPath.currentStepIndex + 1,
                learningPath.steps.length - 1
            );
        }

        await learningPath.save();

        res.status(200).json({
            success: true,
            data: learningPath,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Adjust learning path based on quiz performance
// @route   POST /api/learning-path/adjust
// @access  Private
export const adjustLearningPath = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { quizTopic, score } = req.body;
        const userId = req.user?._id;

        const learningPath = await LearningPath.findOne({ userId }).sort({ updatedAt: -1 });

        if (!learningPath) {
            res.status(404).json({ success: false, error: 'Learning path not found' });
            return;
        }

        const adjustments: string[] = [];

        if (score >= 90) {
            // High performers can skip related steps
            const relatedSteps = learningPath.steps.filter(
                (step, idx) =>
                    step.quizTopic === quizTopic &&
                    !step.completed &&
                    idx > learningPath.currentStepIndex
            );

            if (relatedSteps.length > 0) {
                // Mark beginner steps as complete for high scorers
                for (const step of relatedSteps.slice(0, 1)) {
                    const stepIdx = learningPath.steps.indexOf(step);
                    learningPath.steps[stepIdx].completed = true;
                    learningPath.steps[stepIdx].completedAt = new Date();
                    learningPath.steps[stepIdx].skippedDueToMastery = true;
                    adjustments.push(`Skipped "${step.title}" - mastery demonstrated`);
                }
            }
        } else if (score < 60) {
            // Low performers need reinforcement - add review items
            const currentStep = learningPath.steps[learningPath.currentStepIndex];
            if (currentStep && currentStep.quizTopic === quizTopic) {
                currentStep.needsReview = true;
                adjustments.push(`Added review materials for ${quizTopic}`);
            }
        }

        // Recalculate progress
        const completedSteps = learningPath.steps.filter(s => s.completed).length;
        learningPath.progress = Math.round((completedSteps / learningPath.steps.length) * 100);

        await learningPath.save();

        res.status(200).json({
            success: true,
            data: {
                adjustments,
                progress: learningPath.progress,
                currentStep: learningPath.steps[learningPath.currentStepIndex],
            },
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get learning path recommendations based on progress
// @route   GET /api/learning-path/recommendations
// @access  Private
export const getPathRecommendations = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const userId = req.user?._id;

        const progress = await Progress.findOne({ userId });
        const learningPath = await LearningPath.findOne({ userId }).sort({ updatedAt: -1 });

        const recommendations: {
            type: 'next_step' | 'review' | 'quiz' | 'new_path';
            title: string;
            description: string;
            priority: 'high' | 'medium' | 'low';
            action?: { type: string; data: unknown };
        }[] = [];

        if (learningPath) {
            const currentStep = learningPath.steps[learningPath.currentStepIndex];

            // Next step recommendation
            if (currentStep && !currentStep.completed) {
                const incompleteItems = currentStep.checklist?.filter(
                    (item: { completed: boolean; isRequired: boolean }) => !item.completed && item.isRequired
                ) || [];

                recommendations.push({
                    type: 'next_step',
                    title: `Continue: ${currentStep.title}`,
                    description: `${incompleteItems.length} items remaining`,
                    priority: 'high',
                    action: { type: 'navigate', data: { stepIndex: learningPath.currentStepIndex } },
                });
            }

            // Quiz recommendation if step has quiz topic
            if (currentStep?.quizTopic) {
                const quizScoresForTopic = progress?.quizScores.filter(
                    qs => qs.quizId?.toString().includes(currentStep.quizTopic?.toLowerCase() || '')
                ) || [];

                if (quizScoresForTopic.length === 0) {
                    recommendations.push({
                        type: 'quiz',
                        title: `Take ${currentStep.quizTopic} Quiz`,
                        description: 'Test your knowledge before moving on',
                        priority: 'medium',
                        action: { type: 'navigate', data: { route: '/quiz', topic: currentStep.quizTopic } },
                    });
                }
            }

            // Review weak areas
            if (progress?.weakAreas && progress.weakAreas.length > 0) {
                recommendations.push({
                    type: 'review',
                    title: 'Review Weak Areas',
                    description: `Focus on: ${progress.weakAreas.slice(0, 3).join(', ')}`,
                    priority: 'medium',
                    action: { type: 'navigate', data: { route: '/analytics', tab: 'topics' } },
                });
            }

            // Suggest new path if close to completion
            if (learningPath.progress >= 80) {
                const otherPaths = allLearningPaths.filter(p => p.title !== learningPath.title);
                if (otherPaths.length > 0) {
                    recommendations.push({
                        type: 'new_path',
                        title: `Consider: ${otherPaths[0].title}`,
                        description: 'You are almost done! Explore other tracks.',
                        priority: 'low',
                        action: { type: 'navigate', data: { route: '/learning-path', templateId: otherPaths[0].id } },
                    });
                }
            }
        }

        res.status(200).json({
            success: true,
            data: recommendations,
        });
    } catch (error) {
        next(error);
    }
};

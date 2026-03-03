"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPathRecommendations = exports.adjustLearningPath = exports.completeStep = exports.updateChecklistItem = exports.getLearningPath = exports.startLearningPath = exports.getTemplateDetails = exports.getPathTemplates = void 0;
const LearningPath_1 = __importDefault(require("../models/LearningPath"));
const Progress_1 = __importDefault(require("../models/Progress"));
const User_1 = __importDefault(require("../models/User"));
const auth_controller_1 = require("./auth.controller");
const learningPathTemplates_1 = require("../data/learningPathTemplates");
// Helper: validate and parse a step index from route params
const parseStepIndex = (stepIndex, stepsLength) => {
    const idx = parseInt(stepIndex, 10);
    if (isNaN(idx) || idx < 0 || idx >= stepsLength)
        return null;
    return idx;
};
// @desc    Get available learning path templates
// @route   GET /api/learning-path/templates
// @access  Private
const getPathTemplates = async (_req, res, next) => {
    try {
        const templates = learningPathTemplates_1.allLearningPaths.map(path => ({
            id: path.id,
            title: path.title,
            description: path.description,
            category: path.category,
            totalWeeks: path.totalWeeks,
            difficulty: path.difficulty,
            moduleCount: path.modules.length,
            outcomes: path.outcomes,
            targetRoles: path.targetRoles,
            tags: path.tags,
        }));
        res.status(200).json({
            success: true,
            count: templates.length,
            data: templates,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getPathTemplates = getPathTemplates;
// @desc    Get template details with full checklist
// @route   GET /api/learning-path/templates/:templateId
// @access  Private
const getTemplateDetails = async (req, res, next) => {
    try {
        const template = (0, learningPathTemplates_1.getPathById)(req.params.templateId);
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
    }
    catch (error) {
        next(error);
    }
};
exports.getTemplateDetails = getTemplateDetails;
// @desc    Start a learning path from template
// @route   POST /api/learning-path/start
// @access  Private
const startLearningPath = async (req, res, next) => {
    try {
        const { templateId } = req.body;
        const userId = req.user?._id;
        const template = (0, learningPathTemplates_1.getPathById)(templateId);
        if (!template) {
            res.status(404).json({
                success: false,
                error: 'Learning path template not found',
            });
            return;
        }
        // Check if user already has this path (fix: match by title, not steps.title)
        const existingPath = await LearningPath_1.default.findOne({ userId, title: template.title });
        if (existingPath) {
            res.status(200).json({
                success: true,
                message: 'You already have this learning path',
                data: existingPath,
            });
            return;
        }
        // Convert template to learning path using shared helper
        const steps = (0, auth_controller_1.convertTemplateToSteps)(template);
        const learningPath = await LearningPath_1.default.create({
            userId,
            title: template.title,
            description: template.description,
            category: template.category,
            difficulty: template.difficulty,
            steps,
            tags: template.tags,
            currentStepIndex: 0,
            progress: 0,
            totalWeeks: template.totalWeeks,
            startedAt: new Date(),
        });
        // Update user with learning path reference
        await User_1.default.findByIdAndUpdate(userId, {
            currentLearningPathId: learningPath._id,
            $addToSet: { enrolledPaths: learningPath._id },
        });
        res.status(201).json({
            success: true,
            message: `Started ${template.title} learning path`,
            data: learningPath,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.startLearningPath = startLearningPath;
// @desc    Get user's current learning path with progress
// @route   GET /api/learning-path
// @access  Private
const getLearningPath = async (req, res, next) => {
    try {
        const userId = req.user?._id;
        let learningPath = await LearningPath_1.default.findOne({ userId }).sort({ updatedAt: -1 });
        // If no path exists, create a default one
        if (!learningPath) {
            const defaultTemplate = learningPathTemplates_1.allLearningPaths[0]; // Full Stack
            const steps = defaultTemplate.modules.flatMap((module, moduleIdx) => module.milestones.map((milestone, msIdx) => ({
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
            })));
            learningPath = await LearningPath_1.default.create({
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
    }
    catch (error) {
        next(error);
    }
};
exports.getLearningPath = getLearningPath;
// @desc    Update checklist item completion
// @route   PUT /api/learning-path/checklist/:stepIndex/:itemId
// @access  Private
const updateChecklistItem = async (req, res, next) => {
    try {
        const { stepIndex, itemId } = req.params;
        const { completed } = req.body;
        const userId = req.user?._id;
        const learningPath = await LearningPath_1.default.findOne({ userId }).sort({ updatedAt: -1 });
        if (!learningPath) {
            res.status(404).json({ success: false, error: 'Learning path not found' });
            return;
        }
        const idx = parseStepIndex(stepIndex, learningPath.steps.length);
        if (idx === null) {
            res.status(400).json({ success: false, error: 'Invalid step index' });
            return;
        }
        const step = learningPath.steps[idx];
        // Find and update the checklist item
        const checklistItem = step.checklist?.find((item) => item.id === itemId);
        if (checklistItem) {
            checklistItem.completed = completed;
            checklistItem.completedAt = completed ? new Date() : undefined;
        }
        // Check if all required items in step are completed
        const requiredItems = step.checklist?.filter((item) => item.isRequired) || [];
        const completedRequired = requiredItems.filter((item) => item.completed).length;
        step.completed = completedRequired === requiredItems.length && requiredItems.length > 0;
        // Recalculate overall progress
        const completedSteps = learningPath.steps.filter(s => s.completed).length;
        learningPath.progress = Math.round((completedSteps / learningPath.steps.length) * 100);
        // Auto-advance to next step if current is complete
        if (step.completed && learningPath.currentStepIndex === idx) {
            learningPath.currentStepIndex = Math.min(learningPath.currentStepIndex + 1, learningPath.steps.length - 1);
        }
        await learningPath.save();
        // Update user progress with study time
        if (completed && checklistItem) {
            const progress = await Progress_1.default.findOne({ userId });
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
    }
    catch (error) {
        next(error);
    }
};
exports.updateChecklistItem = updateChecklistItem;
// @desc    Mark entire step as complete
// @route   PUT /api/learning-path/step/:stepIndex/complete
// @access  Private
const completeStep = async (req, res, next) => {
    try {
        const { stepIndex } = req.params;
        const userId = req.user?._id;
        const learningPath = await LearningPath_1.default.findOne({ userId }).sort({ updatedAt: -1 });
        if (!learningPath) {
            res.status(404).json({ success: false, error: 'Learning path not found' });
            return;
        }
        const idx = parseStepIndex(stepIndex, learningPath.steps.length);
        if (idx === null) {
            res.status(400).json({ success: false, error: 'Invalid step index' });
            return;
        }
        const step = learningPath.steps[idx];
        // Mark step and all checklist items as complete
        step.completed = true;
        step.completedAt = new Date();
        if (step.checklist) {
            step.checklist.forEach((item) => {
                item.completed = true;
                item.completedAt = new Date();
            });
        }
        // Recalculate progress
        const completedSteps = learningPath.steps.filter(s => s.completed).length;
        learningPath.progress = Math.round((completedSteps / learningPath.steps.length) * 100);
        // Advance to next step
        if (learningPath.currentStepIndex === idx) {
            learningPath.currentStepIndex = Math.min(learningPath.currentStepIndex + 1, learningPath.steps.length - 1);
        }
        await learningPath.save();
        res.status(200).json({
            success: true,
            data: learningPath,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.completeStep = completeStep;
// @desc    Adjust learning path based on quiz performance
// @route   POST /api/learning-path/adjust
// @access  Private
const adjustLearningPath = async (req, res, next) => {
    try {
        const { quizTopic, score } = req.body;
        const userId = req.user?._id;
        const learningPath = await LearningPath_1.default.findOne({ userId }).sort({ updatedAt: -1 });
        if (!learningPath) {
            res.status(404).json({ success: false, error: 'Learning path not found' });
            return;
        }
        const adjustments = [];
        if (score >= 90) {
            // High performers can skip related steps
            const relatedSteps = learningPath.steps.filter((step, idx) => step.quizTopic === quizTopic &&
                !step.completed &&
                idx > learningPath.currentStepIndex);
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
        }
        else if (score < 60) {
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
    }
    catch (error) {
        next(error);
    }
};
exports.adjustLearningPath = adjustLearningPath;
// @desc    Get learning path recommendations based on progress
// @route   GET /api/learning-path/recommendations
// @access  Private
const getPathRecommendations = async (req, res, next) => {
    try {
        const userId = req.user?._id;
        const progress = await Progress_1.default.findOne({ userId });
        const learningPath = await LearningPath_1.default.findOne({ userId }).sort({ updatedAt: -1 });
        const recommendations = [];
        if (learningPath) {
            const currentStep = learningPath.steps[learningPath.currentStepIndex];
            // Next step recommendation
            if (currentStep && !currentStep.completed) {
                const incompleteItems = currentStep.checklist?.filter((item) => !item.completed && item.isRequired) || [];
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
                const quizScoresForTopic = progress?.quizScores.filter(qs => qs.quizId?.toString().includes(currentStep.quizTopic?.toLowerCase() || '')) || [];
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
                const otherPaths = learningPathTemplates_1.allLearningPaths.filter(p => p.title !== learningPath.title);
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
    }
    catch (error) {
        next(error);
    }
};
exports.getPathRecommendations = getPathRecommendations;
//# sourceMappingURL=learningPath.controller.js.map
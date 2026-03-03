import { Response, NextFunction } from 'express';
import SkillGap from '../models/SkillGap';
import { Quiz, QuizAttempt } from '../models/Quiz';
import LearningPath from '../models/LearningPath';
import Progress from '../models/Progress';
import { AuthRequest } from '../types';
import { allLearningPaths } from '../data/learningPathTemplates';

// Core topics the system tracks
const TRACKED_TOPICS = ['JavaScript', 'React', 'TypeScript', 'Node.js', 'CSS', 'APIs', 'MongoDB'];

// Compute real skill levels from quiz attempts + learning path progress
const computeSkillLevels = async (userId: string) => {
    // 1. Get quiz performance by topic
    const attempts = await QuizAttempt.find({ userId });
    const quizIds = [...new Set(attempts.map(a => a.quizId.toString()))];
    const quizzes = await Quiz.find({ _id: { $in: quizIds } });
    const quizMap = new Map(quizzes.map(q => [q._id.toString(), q]));

    const topicStats: Record<string, { correct: number; total: number; attempts: number }> = {};

    for (const attempt of attempts) {
        const quiz = quizMap.get(attempt.quizId.toString());
        if (!quiz) continue;

        for (const answer of attempt.answers) {
            const question = quiz.questions.find(q => q.questionId === answer.questionId);
            const topic = question?.topic || quiz.topic;

            if (!topicStats[topic]) {
                topicStats[topic] = { correct: 0, total: 0, attempts: 0 };
            }
            topicStats[topic].total++;
            topicStats[topic].attempts++;
            if (answer.isCorrect) {
                topicStats[topic].correct++;
            }
        }
    }

    // 2. Get learning path completion by module topic
    const learningPaths = await LearningPath.find({ userId, isActive: true });
    const pathCompletion: Record<string, { completed: number; total: number }> = {};

    for (const lp of learningPaths) {
        for (const step of lp.steps) {
            // Map module titles to topics
            const topicHint = detectTopicFromTitle(step.title);
            if (!topicHint) continue;

            if (!pathCompletion[topicHint]) {
                pathCompletion[topicHint] = { completed: 0, total: 0 };
            }
            pathCompletion[topicHint].total++;

            // Count completed checklist items
            const completedItems = step.checklist.filter(c => c.completed).length;
            const totalItems = step.checklist.length;
            if (totalItems > 0) {
                pathCompletion[topicHint].completed += completedItems;
            }
        }
    }

    // 3. Get Progress model data for additional context
    const progress = await Progress.findOne({ userId });
    const progressTopics: Record<string, number> = {};
    if (progress?.topicProgress) {
        for (const tp of progress.topicProgress) {
            progressTopics[tp.topicName] = tp.masteryLevel;
        }
    }

    // 4. Merge all data sources into final skill levels
    const skills = TRACKED_TOPICS.map(topic => {
        let currentLevel = 0;
        let hasData = false;
        let weightedComponents: { value: number; weight: number }[] = [];

        // Quiz score (highest weight - 50%)
        if (topicStats[topic] && topicStats[topic].total > 0) {
            const quizScore = Math.round((topicStats[topic].correct / topicStats[topic].total) * 100);
            weightedComponents.push({ value: quizScore, weight: 50 });
            hasData = true;
        }

        // Learning path completion (30% weight)
        if (pathCompletion[topic] && pathCompletion[topic].total > 0) {
            const completionRate = Math.round((pathCompletion[topic].completed / pathCompletion[topic].total) * 100);
            weightedComponents.push({ value: completionRate, weight: 30 });
            hasData = true;
        }

        // Progress mastery (20% weight)
        if (progressTopics[topic] !== undefined) {
            weightedComponents.push({ value: progressTopics[topic], weight: 20 });
            hasData = true;
        }

        if (hasData) {
            const totalWeight = weightedComponents.reduce((sum, c) => sum + c.weight, 0);
            currentLevel = Math.round(
                weightedComponents.reduce((sum, c) => sum + (c.value * c.weight), 0) / totalWeight
            );
        }

        const targetLevel = 100;
        const gap = targetLevel - currentLevel;
        let priority: 'high' | 'medium' | 'low' = 'low';
        if (gap > 50) priority = 'high';
        else if (gap > 25) priority = 'medium';

        return { topic, currentLevel, targetLevel, gap, priority, hasData };
    });

    return skills;
};

// Map step titles to topics
const detectTopicFromTitle = (title: string): string | null => {
    const lower = title.toLowerCase();
    if (lower.includes('javascript') || lower.includes('es6') || lower.includes('async')) return 'JavaScript';
    if (lower.includes('react') || lower.includes('jsx') || lower.includes('hooks') || lower.includes('component')) return 'React';
    if (lower.includes('typescript') || lower.includes('types') || lower.includes('generics')) return 'TypeScript';
    if (lower.includes('node') || lower.includes('express') || lower.includes('backend')) return 'Node.js';
    if (lower.includes('css') || lower.includes('flexbox') || lower.includes('grid') || lower.includes('responsive')) return 'CSS';
    if (lower.includes('api') || lower.includes('rest') || lower.includes('http')) return 'APIs';
    if (lower.includes('mongo') || lower.includes('database') || lower.includes('mongoose')) return 'MongoDB';
    if (lower.includes('auth') || lower.includes('jwt') || lower.includes('security')) return 'APIs';
    return null;
};

// @desc    Get user's skill gaps (computed from real data)
// @route   GET /api/skill-gaps
// @access  Private
export const getSkillGaps = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const userId = req.user?._id;
        if (!userId) {
            res.status(401).json({ success: false, error: 'Not authenticated' });
            return;
        }

        // Compute real skill levels from quiz + learning path + progress
        const computedSkills = await computeSkillLevels(userId.toString());

        // Check if user has any real data
        const hasAnyData = computedSkills.some(s => s.hasData);

        if (!hasAnyData) {
            // No quiz/learning path data yet — return empty state with zeros
            const defaultSkills = TRACKED_TOPICS.map(topic => ({
                topic,
                currentLevel: 0,
                targetLevel: 100,
                gap: 100,
                priority: 'high' as const,
            }));

            // Upsert into DB
            await SkillGap.findOneAndUpdate(
                { userId },
                { skills: defaultSkills, lastAssessmentDate: new Date() },
                { new: true, upsert: true }
            );

            res.status(200).json({
                success: true,
                data: {
                    skills: defaultSkills,
                    lastAssessmentDate: new Date(),
                    hasRealData: false,
                    message: 'Complete quizzes or learning path steps to see your real skill levels.',
                },
            });
            return;
        }

        // Strip internal flags and persist
        const skills = computedSkills.map(({ hasData, ...rest }) => rest);

        const skillGap = await SkillGap.findOneAndUpdate(
            { userId },
            { skills, lastAssessmentDate: new Date() },
            { new: true, upsert: true }
        );

        res.status(200).json({
            success: true,
            data: {
                ...skillGap?.toObject(),
                hasRealData: true,
            },
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Submit skill assessment
// @route   POST /api/skill-gaps/assessment
// @access  Private
export const submitAssessment = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { skills } = req.body;

        // Calculate priorities based on gaps
        const processedSkills = skills.map((skill: { topic: string; currentLevel: number; targetLevel?: number }) => {
            const gap = (skill.targetLevel || 100) - skill.currentLevel;
            let priority: 'high' | 'medium' | 'low' = 'low';
            if (gap > 50) priority = 'high';
            else if (gap > 25) priority = 'medium';

            return {
                ...skill,
                targetLevel: skill.targetLevel || 100,
                gap,
                priority,
            };
        });

        const skillGap = await SkillGap.findOneAndUpdate(
            { userId: req.user?._id },
            {
                skills: processedSkills,
                lastAssessmentDate: new Date(),
            },
            { new: true, upsert: true }
        );

        res.status(200).json({
            success: true,
            data: skillGap,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get skill improvement recommendations
// @route   GET /api/skill-gaps/recommendations
// @access  Private
export const getRecommendations = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const userId = req.user?._id;
        if (!userId) {
            res.status(401).json({ success: false, error: 'Not authenticated' });
            return;
        }

        // Re-compute from real data
        const computedSkills = await computeSkillLevels(userId.toString());
        const prioritySkills = computedSkills
            .filter(s => s.priority === 'high' || s.priority === 'medium')
            .sort((a, b) => b.gap - a.gap);

        // Build recommendations with learning path links
        const recommendations = prioritySkills.map(skill => {
            // Find matching learning paths
            const matchingPaths = allLearningPaths.filter(path =>
                path.modules.some(m =>
                    m.milestones.some(ms =>
                        ms.checklistItems.some(ci =>
                            ci.title.toLowerCase().includes(skill.topic.toLowerCase()) ||
                            (ms.quizTopic || '').toLowerCase() === skill.topic.toLowerCase()
                        )
                    )
                )
            );

            // Pull specific resource URLs for this topic
            const resources: { title: string; url: string; type: string }[] = [];
            for (const path of matchingPaths) {
                for (const mod of path.modules) {
                    for (const ms of mod.milestones) {
                        for (const ci of ms.checklistItems) {
                            if (ci.url && (
                                ci.title.toLowerCase().includes(skill.topic.toLowerCase()) ||
                                (ms.quizTopic || '').toLowerCase() === skill.topic.toLowerCase()
                            )) {
                                resources.push({
                                    title: ci.title,
                                    url: ci.url,
                                    type: ci.resourceType,
                                });
                            }
                        }
                    }
                }
            }

            const estimatedWeeks = skill.gap > 50 ? '4-6 weeks' : skill.gap > 25 ? '2-4 weeks' : '1-2 weeks';

            return {
                topic: skill.topic,
                currentLevel: skill.currentLevel,
                gap: skill.gap,
                priority: skill.priority,
                suggestion: skill.currentLevel === 0
                    ? `Start learning ${skill.topic} from scratch with beginner-friendly resources`
                    : `Improve your ${skill.topic} skills from ${skill.currentLevel}% to ${skill.targetLevel}%`,
                estimatedTime: estimatedWeeks,
                suggestedPaths: matchingPaths.map(p => ({ id: p.id, title: p.title })),
                resources: resources.slice(0, 5),
            };
        });

        res.status(200).json({
            success: true,
            data: {
                prioritySkills: prioritySkills.map(({ hasData, ...rest }) => rest),
                recommendations,
                lastAssessment: new Date(),
            },
        });
    } catch (error) {
        next(error);
    }
};

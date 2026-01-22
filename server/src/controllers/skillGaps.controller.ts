import { Response, NextFunction } from 'express';
import SkillGap from '../models/SkillGap';
import Resource from '../models/Resource';
import { AuthRequest } from '../types';

// @desc    Get user's skill gaps
// @route   GET /api/skill-gaps
// @access  Private
export const getSkillGaps = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        let skillGap = await SkillGap.findOne({ userId: req.user?._id });

        if (!skillGap) {
            // Create default skill gaps
            skillGap = await SkillGap.create({
                userId: req.user?._id,
                skills: [
                    { topic: 'React', currentLevel: 85, targetLevel: 100, priority: 'low' },
                    { topic: 'JavaScript', currentLevel: 72, targetLevel: 100, priority: 'medium' },
                    { topic: 'TypeScript', currentLevel: 60, targetLevel: 100, priority: 'high' },
                    { topic: 'CSS', currentLevel: 78, targetLevel: 100, priority: 'medium' },
                    { topic: 'APIs', currentLevel: 65, targetLevel: 100, priority: 'high' },
                ],
            });
        }

        res.status(200).json({
            success: true,
            data: skillGap,
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
            if (gap > 30) priority = 'high';
            else if (gap > 15) priority = 'medium';

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
        const skillGap = await SkillGap.findOne({ userId: req.user?._id });

        if (!skillGap) {
            res.status(404).json({
                success: false,
                error: 'No skill assessment found. Please complete an assessment first.',
            });
            return;
        }

        // Get high priority skills
        const prioritySkills = skillGap.skills
            .filter(s => s.priority === 'high')
            .map(s => s.topic);

        // Find matching resources
        const resources = await Resource.find({
            topics: { $in: prioritySkills },
        }).sort({ rating: -1 }).limit(5);

        // Generate recommendations
        const recommendations = prioritySkills.map(topic => ({
            topic,
            suggestion: `Focus on improving your ${topic} skills through structured practice`,
            estimatedTime: '2-4 weeks',
            resources: resources.filter(r => r.topics.includes(topic)),
        }));

        res.status(200).json({
            success: true,
            data: {
                prioritySkills: skillGap.skills.filter(s => s.priority === 'high'),
                recommendations,
                lastAssessment: skillGap.lastAssessmentDate,
            },
        });
    } catch (error) {
        next(error);
    }
};

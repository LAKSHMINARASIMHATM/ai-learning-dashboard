import mongoose, { Schema } from 'mongoose';
import { ISkillGap } from '../types';

const skillGapSchema = new Schema<ISkillGap>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            unique: true,
        },
        skills: [
            {
                topic: { type: String, required: true },
                currentLevel: { type: Number, min: 0, max: 100, required: true },
                targetLevel: { type: Number, min: 0, max: 100, default: 100 },
                gap: { type: Number, min: 0, max: 100 },
                priority: {
                    type: String,
                    enum: ['high', 'medium', 'low'],
                    default: 'medium',
                },
            },
        ],
        lastAssessmentDate: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
    }
);

// Calculate gap before saving
skillGapSchema.pre('save', function (next) {
    this.skills.forEach((skill) => {
        skill.gap = skill.targetLevel - skill.currentLevel;
    });
    next();
});

const SkillGap = mongoose.model<ISkillGap>('SkillGap', skillGapSchema);

export default SkillGap;

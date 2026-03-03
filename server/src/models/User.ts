import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import { IUser } from '../types';

const userSchema = new Schema<IUser>(
    {
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            required: [true, 'Password is required'],
            minlength: 6,
            select: false,
        },
        name: {
            type: String,
            required: [true, 'Name is required'],
            trim: true,
        },
        avatar: {
            type: String,
            default: '',
        },
        role: {
            type: String,
            enum: ['student', 'teacher', 'admin'],
            default: 'student',
        },
        learnerProfile: {
            learningStyle: {
                type: String,
                enum: ['visual', 'auditory', 'kinesthetic', 'reading'],
                default: 'visual',
            },
            secondaryStyle: {
                type: String,
                enum: ['visual', 'auditory', 'kinesthetic', 'reading'],
            },
            academicHistory: [{
                institution: String,
                degree: String,
                fieldOfStudy: String,
                startYear: Number,
                endYear: Number,
                grades: [{
                    subject: String,
                    grade: String,
                    score: Number,
                }],
            }],
            strengths: {
                type: [String],
                default: [],
            },
            weaknesses: {
                type: [String],
                default: [],
            },
            preferredLearningTime: {
                startHour: { type: Number, default: 9 },
                endHour: { type: Number, default: 17 },
                timezone: { type: String, default: 'UTC' },
            },
            averageSessionDuration: {
                type: Number,
                default: 45, // minutes
            },
            learningPace: {
                type: String,
                enum: ['slow', 'moderate', 'fast'],
                default: 'moderate',
            },
            dailyGoalMinutes: {
                type: Number,
                default: 60,
            },
            weeklyGoalHours: {
                type: Number,
                default: 10,
            },
            interests: {
                type: [String],
                default: [],
            },
            careerGoals: {
                type: [String],
                default: [],
            },
        },
        preferences: {
            theme: {
                type: String,
                enum: ['light', 'dark', 'system'],
                default: 'system',
            },
            notifications: {
                type: Boolean,
                default: true,
            },
            emailUpdates: {
                type: Boolean,
                default: true,
            },
            language: {
                type: String,
                default: 'en',
            },
            accessibilityMode: {
                type: Boolean,
                default: false,
            },
            twoFactorEnabled: {
                type: Boolean,
                default: false,
            },
        },
        currentLearningPathId: {
            type: Schema.Types.ObjectId,
            ref: 'LearningPath',
        },
        isVerified: {
            type: Boolean,
            default: false,
        },
        verificationToken: String,
        verificationTokenExpires: Date,
        resetPasswordToken: String,
        resetPasswordExpires: Date,
        lastActive: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
    }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model<IUser>('User', userSchema);

export default User;

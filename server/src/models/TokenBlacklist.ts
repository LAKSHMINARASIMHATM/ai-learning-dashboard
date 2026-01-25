import mongoose, { Schema } from 'mongoose';
import { ITokenBlacklist } from '../types';

const tokenBlacklistSchema = new Schema<ITokenBlacklist>(
    {
        token: {
            type: String,
            required: true,
            unique: true,
            index: true,
        },
        expiresAt: {
            type: Date,
            required: true,
        },
        reason: {
            type: String,
            enum: ['logout', 'revoked', 'security'],
            default: 'logout',
        },
    },
    {
        timestamps: true,
    }
);

// Auto-delete expired blacklisted tokens
tokenBlacklistSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Check if token is blacklisted
tokenBlacklistSchema.statics.isBlacklisted = async function (token: string): Promise<boolean> {
    const entry = await this.findOne({
        token,
        expiresAt: { $gt: new Date() },
    });
    return !!entry;
};

const TokenBlacklist = mongoose.model<ITokenBlacklist>('TokenBlacklist', tokenBlacklistSchema);

export default TokenBlacklist;

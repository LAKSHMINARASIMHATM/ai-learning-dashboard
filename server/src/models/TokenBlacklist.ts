import mongoose, { Schema, Model } from 'mongoose';
import { ITokenBlacklist } from '../types';

interface TokenBlacklistModel extends Model<ITokenBlacklist> {
    isBlacklisted(jti: string): Promise<boolean>;
}

const tokenBlacklistSchema = new Schema<ITokenBlacklist>(
    {
        jti: {
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

// Check if token (jti) is blacklisted
tokenBlacklistSchema.statics.isBlacklisted = async function (jti: string): Promise<boolean> {
    if (!jti) return false;
    const entry = await this.findOne({
        jti,
        expiresAt: { $gt: new Date() },
    });
    return !!entry;
};

const TokenBlacklist = mongoose.model<ITokenBlacklist, TokenBlacklistModel>('TokenBlacklist', tokenBlacklistSchema);

export default TokenBlacklist;

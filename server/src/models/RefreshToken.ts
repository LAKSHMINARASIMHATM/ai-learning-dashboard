import mongoose, { Schema } from 'mongoose';
import { IRefreshToken } from '../types';

const refreshTokenSchema = new Schema<IRefreshToken>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true,
        },
        token: {
            type: String,
            required: true,
            unique: true,
        },
        expiresAt: {
            type: Date,
            required: true,
        },
        isRevoked: {
            type: Boolean,
            default: false,
        },
        deviceInfo: {
            userAgent: String,
            ip: String,
        },
    },
    {
        timestamps: true,
    }
);

// Auto-delete expired tokens
refreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Find valid token
refreshTokenSchema.statics.findValidToken = async function (token: string) {
    return this.findOne({
        token,
        expiresAt: { $gt: new Date() },
        isRevoked: false,
    });
};

// Revoke all tokens for a user
refreshTokenSchema.statics.revokeAllForUser = async function (userId: string) {
    return this.updateMany(
        { userId, isRevoked: false },
        { isRevoked: true }
    );
};

const RefreshToken = mongoose.model<IRefreshToken>('RefreshToken', refreshTokenSchema);

export default RefreshToken;

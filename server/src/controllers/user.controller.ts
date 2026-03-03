import { Response, NextFunction } from 'express';
import User from '../models/User';
import { AuthRequest } from '../types';

// Allowed avatar URL patterns
const isValidAvatarUrl = (url: string): boolean => {
    try {
        const parsed = new URL(url);
        return ['http:', 'https:'].includes(parsed.protocol);
    } catch {
        return false;
    }
};

// @desc    Update user profile
// @route   PUT /api/user/profile
// @access  Private
export const updateProfile = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { name, avatar } = req.body;

        // Validate inputs
        const updates: Record<string, unknown> = {};

        if (name !== undefined) {
            const trimmed = String(name).trim();
            if (trimmed.length < 2 || trimmed.length > 50) {
                res.status(400).json({
                    success: false,
                    error: 'Name must be between 2 and 50 characters',
                });
                return;
            }
            if (!/^[a-zA-Z\s]+$/.test(trimmed)) {
                res.status(400).json({
                    success: false,
                    error: 'Name can only contain letters and spaces',
                });
                return;
            }
            updates.name = trimmed;
        }

        if (avatar !== undefined) {
            if (avatar !== '' && !isValidAvatarUrl(avatar)) {
                res.status(400).json({
                    success: false,
                    error: 'Avatar must be a valid HTTP/HTTPS URL',
                });
                return;
            }
            updates.avatar = avatar;
        }

        if (Object.keys(updates).length === 0) {
            res.status(400).json({
                success: false,
                error: 'No valid fields to update',
            });
            return;
        }

        const user = await User.findByIdAndUpdate(
            req.user?._id,
            { $set: updates },
            { new: true, runValidators: true }
        );

        res.status(200).json({
            success: true,
            data: user,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update user settings/preferences
// @route   PUT /api/user/settings
// @access  Private
export const updateSettings = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { theme, notifications, emailUpdates, language } = req.body;

        // Build only the fields that were actually provided (partial update)
        const updates: Record<string, unknown> = {};

        if (theme !== undefined) updates['preferences.theme'] = theme;
        if (notifications !== undefined) updates['preferences.notifications'] = notifications;
        if (emailUpdates !== undefined) updates['preferences.emailUpdates'] = emailUpdates;
        if (language !== undefined) updates['preferences.language'] = language;

        if (Object.keys(updates).length === 0) {
            res.status(400).json({
                success: false,
                error: 'No settings provided to update',
            });
            return;
        }

        const user = await User.findByIdAndUpdate(
            req.user?._id,
            { $set: updates },
            { new: true, runValidators: true }
        );

        res.status(200).json({
            success: true,
            data: user?.preferences,
        });
    } catch (error) {
        next(error);
    }
};

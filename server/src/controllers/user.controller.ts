import { Response, NextFunction } from 'express';
import User from '../models/User';
import { AuthRequest } from '../types';

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

        const user = await User.findByIdAndUpdate(
            req.user?._id,
            { name, avatar },
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

        const user = await User.findByIdAndUpdate(
            req.user?._id,
            {
                preferences: {
                    theme,
                    notifications,
                    emailUpdates,
                    language,
                },
            },
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

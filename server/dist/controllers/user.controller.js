"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateSettings = exports.updateProfile = void 0;
const User_1 = __importDefault(require("../models/User"));
// Allowed avatar URL patterns
const isValidAvatarUrl = (url) => {
    try {
        const parsed = new URL(url);
        return ['http:', 'https:'].includes(parsed.protocol);
    }
    catch {
        return false;
    }
};
// @desc    Update user profile
// @route   PUT /api/user/profile
// @access  Private
const updateProfile = async (req, res, next) => {
    try {
        const { name, avatar } = req.body;
        // Validate inputs
        const updates = {};
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
        const user = await User_1.default.findByIdAndUpdate(req.user?._id, { $set: updates }, { new: true, runValidators: true });
        res.status(200).json({
            success: true,
            data: user,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.updateProfile = updateProfile;
// @desc    Update user settings/preferences
// @route   PUT /api/user/settings
// @access  Private
const updateSettings = async (req, res, next) => {
    try {
        const { theme, notifications, emailUpdates, language } = req.body;
        // Build only the fields that were actually provided (partial update)
        const updates = {};
        if (theme !== undefined)
            updates['preferences.theme'] = theme;
        if (notifications !== undefined)
            updates['preferences.notifications'] = notifications;
        if (emailUpdates !== undefined)
            updates['preferences.emailUpdates'] = emailUpdates;
        if (language !== undefined)
            updates['preferences.language'] = language;
        if (Object.keys(updates).length === 0) {
            res.status(400).json({
                success: false,
                error: 'No settings provided to update',
            });
            return;
        }
        const user = await User_1.default.findByIdAndUpdate(req.user?._id, { $set: updates }, { new: true, runValidators: true });
        res.status(200).json({
            success: true,
            data: user?.preferences,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.updateSettings = updateSettings;
//# sourceMappingURL=user.controller.js.map
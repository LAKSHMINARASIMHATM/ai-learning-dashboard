import mongoose, { Schema } from 'mongoose';
import { IResource } from '../types';

const resourceSchema = new Schema<IResource>(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            required: true,
        },
        type: {
            type: String,
            enum: ['video', 'article', 'course', 'interactive'],
            required: true,
        },
        duration: {
            type: String,
            required: true,
        },
        difficulty: {
            type: String,
            enum: ['beginner', 'intermediate', 'advanced'],
            required: true,
        },
        rating: {
            type: Number,
            min: 0,
            max: 5,
            default: 0,
        },
        author: {
            type: String,
            required: true,
        },
        url: {
            type: String,
            default: '',
        },
        thumbnailUrl: {
            type: String,
            default: '',
        },
        topics: {
            type: [String],
            default: [],
            index: true,
        },
    },
    {
        timestamps: true,
    }
);

// Index for search
resourceSchema.index({ title: 'text', description: 'text', topics: 'text' });

const Resource = mongoose.model<IResource>('Resource', resourceSchema);

export default Resource;

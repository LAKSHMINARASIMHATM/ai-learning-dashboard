"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createResource = exports.getResource = exports.getRecommendedResources = exports.getResources = void 0;
const Resource_1 = __importDefault(require("../models/Resource"));
const SkillGap_1 = __importDefault(require("../models/SkillGap"));
// Default resources data with REAL-WORLD URLs (will be seeded to DB)
const defaultResources = [
    {
        title: 'TypeScript Full Course for Beginners',
        description: 'Complete TypeScript tutorial covering types, interfaces, generics, decorators, and advanced patterns. Official freeCodeCamp course.',
        type: 'video',
        duration: '5h',
        difficulty: 'intermediate',
        rating: 4.9,
        author: 'freeCodeCamp',
        topics: ['TypeScript', 'JavaScript'],
        url: 'https://www.youtube.com/watch?v=30LWjhZzg50',
        thumbnailUrl: 'https://i.ytimg.com/vi/30LWjhZzg50/maxresdefault.jpg'
    },
    {
        title: 'React Official Documentation',
        description: 'The official React documentation with interactive examples, tutorials, and API reference. Learn React the right way.',
        type: 'article',
        duration: '2h read',
        difficulty: 'beginner',
        rating: 4.9,
        author: 'React Team',
        topics: ['React', 'JavaScript'],
        url: 'https://react.dev/learn',
        thumbnailUrl: 'https://react.dev/images/og-learn.png'
    },
    {
        title: 'React Hooks Tutorial - Complete Course',
        description: 'Master useState, useEffect, useContext, useReducer, useCallback, useMemo, useRef and custom hooks with practical examples.',
        type: 'video',
        duration: '1h 30m',
        difficulty: 'intermediate',
        rating: 4.8,
        author: 'Codevolution',
        topics: ['React', 'JavaScript'],
        url: 'https://www.youtube.com/watch?v=LlvBzyy-558',
        thumbnailUrl: 'https://i.ytimg.com/vi/LlvBzyy-558/maxresdefault.jpg'
    },
    {
        title: 'CSS Grid Layout Crash Course',
        description: 'Learn CSS Grid in under an hour. Cover grid containers, items, areas, and responsive layouts with hands-on examples.',
        type: 'video',
        duration: '48m',
        difficulty: 'beginner',
        rating: 4.7,
        author: 'Traversy Media',
        topics: ['CSS', 'Frontend'],
        url: 'https://www.youtube.com/watch?v=jV8B24rSN5o',
        thumbnailUrl: 'https://i.ytimg.com/vi/jV8B24rSN5o/maxresdefault.jpg'
    },
    {
        title: 'Node.js and Express.js Full Course',
        description: 'Build a complete REST API with Node.js and Express. Covers routing, middleware, authentication, MongoDB integration.',
        type: 'video',
        duration: '8h 16m',
        difficulty: 'intermediate',
        rating: 4.8,
        author: 'freeCodeCamp',
        topics: ['Node.js', 'Backend', 'APIs'],
        url: 'https://www.youtube.com/watch?v=Oe421EPjeBE',
        thumbnailUrl: 'https://i.ytimg.com/vi/Oe421EPjeBE/maxresdefault.jpg'
    },
    {
        title: 'Next.js 14 Full Course',
        description: 'Learn Next.js 14 App Router, Server Components, Server Actions, Authentication, and deployment to Vercel.',
        type: 'video',
        duration: '5h',
        difficulty: 'intermediate',
        rating: 4.9,
        author: 'JavaScript Mastery',
        topics: ['Next.js', 'React', 'TypeScript'],
        url: 'https://www.youtube.com/watch?v=wm5gMKuwSYk',
        thumbnailUrl: 'https://i.ytimg.com/vi/wm5gMKuwSYk/maxresdefault.jpg'
    },
    {
        title: 'MongoDB Crash Course',
        description: 'Learn MongoDB basics including CRUD operations, schemas, indexes, aggregation, and integration with Node.js.',
        type: 'video',
        duration: '1h 30m',
        difficulty: 'beginner',
        rating: 4.7,
        author: 'Traversy Media',
        topics: ['MongoDB', 'Backend', 'Database'],
        url: 'https://www.youtube.com/watch?v=ofme2o29ngU',
        thumbnailUrl: 'https://i.ytimg.com/vi/ofme2o29ngU/maxresdefault.jpg'
    },
    {
        title: 'JavaScript Algorithms and Data Structures',
        description: 'Master algorithms, data structures, and problem-solving for technical interviews. Includes 300+ coding challenges.',
        type: 'interactive',
        duration: '300h',
        difficulty: 'advanced',
        rating: 4.9,
        author: 'freeCodeCamp',
        topics: ['JavaScript', 'Algorithms'],
        url: 'https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/',
        thumbnailUrl: 'https://cdn.freecodecamp.org/platform/universal/fcc_meta_1920X1080-indigo.png'
    },
    {
        title: 'Tailwind CSS Crash Course',
        description: 'Learn Tailwind CSS utility-first framework. Build responsive, modern UIs without writing custom CSS.',
        type: 'video',
        duration: '30m',
        difficulty: 'beginner',
        rating: 4.6,
        author: 'Traversy Media',
        topics: ['CSS', 'Tailwind', 'Frontend'],
        url: 'https://www.youtube.com/watch?v=UBOj6rqRUME',
        thumbnailUrl: 'https://i.ytimg.com/vi/UBOj6rqRUME/maxresdefault.jpg'
    },
    {
        title: 'Git and GitHub for Beginners',
        description: 'Complete tutorial on version control with Git. Learn branches, merging, pull requests, and GitHub workflows.',
        type: 'video',
        duration: '1h',
        difficulty: 'beginner',
        rating: 4.8,
        author: 'freeCodeCamp',
        topics: ['Git', 'GitHub', 'DevOps'],
        url: 'https://www.youtube.com/watch?v=RGOj5yH7evk',
        thumbnailUrl: 'https://i.ytimg.com/vi/RGOj5yH7evk/maxresdefault.jpg'
    },
    {
        title: 'REST API Design Best Practices',
        description: 'Official Microsoft documentation on designing production-ready RESTful APIs with proper versioning and error handling.',
        type: 'article',
        duration: '45 min read',
        difficulty: 'intermediate',
        rating: 4.7,
        author: 'Microsoft',
        topics: ['APIs', 'Backend', 'Architecture'],
        url: 'https://learn.microsoft.com/en-us/azure/architecture/best-practices/api-design',
        thumbnailUrl: 'https://learn.microsoft.com/en-us/media/open-graph-image.png'
    },
    {
        title: 'The Modern JavaScript Tutorial',
        description: 'Comprehensive JavaScript tutorial from basics to advanced. Interactive examples and exercises included.',
        type: 'interactive',
        duration: '40h',
        difficulty: 'beginner',
        rating: 4.9,
        author: 'javascript.info',
        topics: ['JavaScript'],
        url: 'https://javascript.info/',
        thumbnailUrl: 'https://javascript.info/img/sitetoolbar__logo_en.svg'
    },
    {
        title: 'Docker Tutorial for Beginners',
        description: 'Learn Docker containerization. Build, ship, and run applications consistently across environments.',
        type: 'video',
        duration: '2h 46m',
        difficulty: 'intermediate',
        rating: 4.8,
        author: 'TechWorld with Nana',
        topics: ['Docker', 'DevOps', 'Backend'],
        url: 'https://www.youtube.com/watch?v=3c-iBn73dDE',
        thumbnailUrl: 'https://i.ytimg.com/vi/3c-iBn73dDE/maxresdefault.jpg'
    },
    {
        title: 'Python for Everybody',
        description: 'Complete Python course for beginners. Learn programming fundamentals, data structures, and web scraping.',
        type: 'course',
        duration: '13h',
        difficulty: 'beginner',
        rating: 4.9,
        author: 'Dr. Chuck (University of Michigan)',
        topics: ['Python', 'Programming'],
        url: 'https://www.youtube.com/watch?v=8DvywoWv6fI',
        thumbnailUrl: 'https://i.ytimg.com/vi/8DvywoWv6fI/maxresdefault.jpg'
    },
    {
        title: 'AWS Cloud Practitioner Essential',
        description: 'Official AWS training covering cloud concepts, AWS services, security, architecture, and pricing.',
        type: 'course',
        duration: '6h',
        difficulty: 'beginner',
        rating: 4.7,
        author: 'Amazon Web Services',
        topics: ['AWS', 'Cloud', 'DevOps'],
        url: 'https://explore.skillbuilder.aws/learn/course/134/aws-cloud-practitioner-essentials',
        thumbnailUrl: 'https://d1.awsstatic.com/training-and-certification/certification-badges/AWS-Certified-Cloud-Practitioner_badge.634f8a21af2e0e956ed8905a72366146ba22b74c.png'
    },
];
// @desc    Get all resources (with filters)
// @route   GET /api/resources
// @access  Public
const getResources = async (req, res, next) => {
    try {
        const { type, difficulty, topic, search } = req.query;
        // Check if resources exist, if not seed them
        let count = await Resource_1.default.countDocuments();
        if (count === 0) {
            await Resource_1.default.insertMany(defaultResources);
        }
        // Build query
        const query = {};
        if (type)
            query.type = type;
        if (difficulty)
            query.difficulty = difficulty;
        if (topic)
            query.topics = { $in: [topic] };
        if (search) {
            query.$text = { $search: search };
        }
        const resources = await Resource_1.default.find(query).sort({ rating: -1 });
        res.status(200).json({
            success: true,
            count: resources.length,
            data: resources,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getResources = getResources;
// @desc    Get AI-recommended resources based on skill gaps
// @route   GET /api/resources/recommended
// @access  Private
const getRecommendedResources = async (req, res, next) => {
    try {
        // Get user's skill gaps
        const skillGap = await SkillGap_1.default.findOne({ userId: req.user?._id });
        // Get high priority skill gaps
        const weakTopics = skillGap?.skills
            .filter(s => s.priority === 'high' || s.gap > 30)
            .map(s => s.topic) || ['TypeScript', 'APIs'];
        // Find resources matching weak topics
        const matchedResources = await Resource_1.default.find({
            topics: { $in: weakTopics },
        }).sort({ rating: -1 }).limit(4);
        // Get other popular resources
        const otherResources = await Resource_1.default.find({
            topics: { $nin: weakTopics },
        }).sort({ rating: -1 }).limit(6);
        res.status(200).json({
            success: true,
            data: {
                matched: matchedResources.map(r => ({ ...r.toObject(), matched: true })),
                popular: otherResources.map(r => ({ ...r.toObject(), matched: false })),
            },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getRecommendedResources = getRecommendedResources;
// @desc    Get single resource
// @route   GET /api/resources/:id
// @access  Public
const getResource = async (req, res, next) => {
    try {
        const resource = await Resource_1.default.findById(req.params.id);
        if (!resource) {
            res.status(404).json({
                success: false,
                error: 'Resource not found',
            });
            return;
        }
        res.status(200).json({
            success: true,
            data: resource,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getResource = getResource;
// @desc    Create new resource
// @route   POST /api/resources
// @access  Private (Admin)
const createResource = async (req, res, next) => {
    try {
        const resource = await Resource_1.default.create(req.body);
        res.status(201).json({
            success: true,
            data: resource,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.createResource = createResource;
//# sourceMappingURL=resources.controller.js.map
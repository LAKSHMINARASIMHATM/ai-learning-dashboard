import { Response, NextFunction } from 'express';
import { Quiz, QuizAttempt } from '../models/Quiz';
import Progress from '../models/Progress';
import { AuthRequest } from '../types';
import {
    javascriptQuestions,
    reactQuestions,
    typescriptQuestions,
    nodejsQuestions,
    cssQuestions,
    QuestionItem
} from '../data/questionBank';

// Build comprehensive quizzes from question bank
const buildQuizzesFromBank = () => {
    const shuffleArray = <T>(array: T[]): T[] => {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    };

    const selectQuestions = (questions: QuestionItem[], count: number) =>
        shuffleArray(questions).slice(0, count);

    return [
        {
            title: 'JavaScript Fundamentals',
            description: 'Test your understanding of core JavaScript concepts including variables, types, and ES6+ features',
            topic: 'JavaScript',
            difficulty: 'beginner',
            timeLimit: 15,
            passingScore: 70,
            questions: selectQuestions(javascriptQuestions.filter(q => q.difficulty === 'beginner'), 8),
        },
        {
            title: 'JavaScript Intermediate',
            description: 'Challenge yourself with closures, promises, async/await, and modern JavaScript patterns',
            topic: 'JavaScript',
            difficulty: 'intermediate',
            timeLimit: 20,
            passingScore: 70,
            questions: selectQuestions(javascriptQuestions.filter(q => q.difficulty === 'intermediate'), 10),
        },
        {
            title: 'JavaScript Advanced',
            description: 'Master prototypes, event delegation, currying, and memory management',
            topic: 'JavaScript',
            difficulty: 'advanced',
            timeLimit: 25,
            passingScore: 75,
            questions: selectQuestions(javascriptQuestions.filter(q => q.difficulty === 'advanced'), 8),
        },
        {
            title: 'React Fundamentals',
            description: 'Learn JSX, components, props, state, and rendering lists in React',
            topic: 'React',
            difficulty: 'beginner',
            timeLimit: 15,
            passingScore: 70,
            questions: selectQuestions(reactQuestions.filter(q => q.difficulty === 'beginner'), 8),
        },
        {
            title: 'React Hooks Mastery',
            description: 'Deep dive into useState, useEffect, useContext, useCallback, useMemo, and custom hooks',
            topic: 'React',
            difficulty: 'intermediate',
            timeLimit: 20,
            passingScore: 70,
            questions: selectQuestions(reactQuestions.filter(q => q.difficulty === 'intermediate'), 10),
        },
        {
            title: 'Advanced React Patterns',
            description: 'Master HOCs, portals, suspense, reconciliation, and performance optimization',
            topic: 'React',
            difficulty: 'advanced',
            timeLimit: 25,
            passingScore: 75,
            questions: selectQuestions(reactQuestions.filter(q => q.difficulty === 'advanced'), 8),
        },
        {
            title: 'TypeScript Essentials',
            description: 'Learn types, interfaces, enums, and basic TypeScript concepts',
            topic: 'TypeScript',
            difficulty: 'beginner',
            timeLimit: 15,
            passingScore: 70,
            questions: selectQuestions(typescriptQuestions.filter(q => q.difficulty === 'beginner'), 6),
        },
        {
            title: 'TypeScript Advanced',
            description: 'Generics, utility types, mapped types, conditional types, and type guards',
            topic: 'TypeScript',
            difficulty: 'intermediate',
            timeLimit: 20,
            passingScore: 70,
            questions: selectQuestions(typescriptQuestions.filter(q => q.difficulty === 'intermediate' || q.difficulty === 'advanced'), 10),
        },
        {
            title: 'Node.js & APIs',
            description: 'Test your knowledge of Node.js, Express, REST APIs, and backend concepts',
            topic: 'Node.js',
            difficulty: 'intermediate',
            timeLimit: 20,
            passingScore: 70,
            questions: nodejsQuestions,
        },
        {
            title: 'CSS & Responsive Design',
            description: 'Master Flexbox, Grid, animations, and modern CSS techniques',
            topic: 'CSS',
            difficulty: 'beginner',
            timeLimit: 15,
            passingScore: 70,
            questions: cssQuestions,
        },
        {
            title: 'Full Stack Assessment',
            description: 'Comprehensive test covering JavaScript, React, TypeScript, and Node.js',
            topic: 'Full Stack',
            difficulty: 'intermediate',
            timeLimit: 30,
            passingScore: 70,
            questions: [
                ...selectQuestions(javascriptQuestions, 5),
                ...selectQuestions(reactQuestions, 5),
                ...selectQuestions(typescriptQuestions, 3),
                ...selectQuestions(nodejsQuestions, 2),
            ],
        },
        {
            title: 'Initial Skill Assessment',
            description: 'A quick assessment to help us personalize your learning journey.',
            topic: 'General',
            difficulty: 'beginner',
            timeLimit: 10,
            passingScore: 50,
            questions: selectQuestions([...javascriptQuestions, ...reactQuestions, ...cssQuestions], 5),
        },
        {
            title: 'Frontend Fundamentals',
            description: 'Test your knowledge of HTML, CSS, and basic JavaScript',
            topic: 'Frontend',
            difficulty: 'beginner',
            timeLimit: 20,
            passingScore: 65,
            questions: [
                ...selectQuestions(cssQuestions, 4),
                ...selectQuestions(javascriptQuestions.filter(q => q.difficulty === 'beginner'), 6),
            ],
        },
        {
            title: 'Modern JavaScript Deep Dive',
            description: 'Advanced ES6+, async patterns, and functional programming',
            topic: 'JavaScript',
            difficulty: 'advanced',
            timeLimit: 25,
            passingScore: 75,
            questions: selectQuestions(javascriptQuestions.filter(q => q.difficulty === 'intermediate' || q.difficulty === 'advanced'), 12),
        },
        {
            title: 'React Performance & Optimization',
            description: 'Learn about memoization, code splitting, and React best practices',
            topic: 'React',
            difficulty: 'advanced',
            timeLimit: 20,
            passingScore: 75,
            questions: selectQuestions(reactQuestions.filter(q => q.difficulty === 'advanced'), 8),
        },
        {
            title: 'TypeScript Mastery',
            description: 'Advanced types, generics, and TypeScript patterns',
            topic: 'TypeScript',
            difficulty: 'advanced',
            timeLimit: 25,
            passingScore: 80,
            questions: selectQuestions(typescriptQuestions, 10),
        },
        {
            title: 'Backend Development Essentials',
            description: 'Node.js, Express, REST APIs, and server-side concepts',
            topic: 'Backend',
            difficulty: 'intermediate',
            timeLimit: 25,
            passingScore: 70,
            questions: nodejsQuestions,
        },
    ];
};

// Generate personalized recommendations based on quiz performance
const generateRecommendations = (
    topicPerformance: Record<string, number>,
    _errorPatterns: { questionId: string; subtopic?: string }[]
) => {
    const recommendations: {
        topic: string;
        priority: 'high' | 'medium' | 'low';
        reason: string;
        suggestedResources: { title: string; type: string; url: string }[];
    }[] = [];

    // Analyze weak areas (< 70% score)
    for (const [topic, score] of Object.entries(topicPerformance)) {
        if (score < 50) {
            recommendations.push({
                topic,
                priority: 'high',
                reason: `Your ${topic} score is ${score}%. Focus on fundamentals before advancing.`,
                suggestedResources: getResourcesForTopic(topic, 'beginner'),
            });
        } else if (score < 70) {
            recommendations.push({
                topic,
                priority: 'medium',
                reason: `Your ${topic} score is ${score}%. Some concepts need reinforcement.`,
                suggestedResources: getResourcesForTopic(topic, 'intermediate'),
            });
        }
    }

    // If no weak areas, suggest advancing
    if (recommendations.length === 0) {
        const topics = Object.keys(topicPerformance);
        if (topics.length > 0) {
            recommendations.push({
                topic: 'Advanced Topics',
                priority: 'low',
                reason: 'Great work! You are ready to tackle advanced concepts.',
                suggestedResources: [
                    { title: 'Advanced React Patterns', type: 'video', url: 'https://www.youtube.com/watch?v=MfIoAG3e7p4' },
                    { title: 'TypeScript Deep Dive', type: 'article', url: 'https://basarat.gitbook.io/typescript/' },
                    { title: 'System Design Basics', type: 'video', url: 'https://www.youtube.com/watch?v=UzLMhqg3_Wc' },
                ],
            });
        }
    }

    return recommendations.sort((a, b) => {
        const priorityOrder = { high: 0, medium: 1, low: 2 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
};

// @desc    Force reseed quizzes from question bank
// @route   POST /api/quiz/reseed
// @access  Private
export const reseedQuizzes = async (
    _req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        // Delete all existing quizzes
        await Quiz.deleteMany({});

        // Build and insert new quizzes
        const quizzes = buildQuizzesFromBank();
        await Quiz.insertMany(quizzes);

        res.status(200).json({
            success: true,
            message: `Reseeded ${quizzes.length} quizzes successfully`,
            count: quizzes.length,
        });
    } catch (error) {
        next(error);
    }
};

const getResourcesForTopic = (topic: string, level: string) => {
    const resources: Record<string, Record<string, { title: string; type: string; url: string }[]>> = {
        JavaScript: {
            beginner: [
                { title: 'JavaScript Basics - MDN', type: 'article', url: 'https://developer.mozilla.org/en-US/docs/Learn/JavaScript/First_steps' },
                { title: 'JavaScript Crash Course', type: 'video', url: 'https://www.youtube.com/watch?v=hdI2bqOjy3c' },
                { title: 'FreeCodeCamp JS Algorithms', type: 'exercise', url: 'https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/' },
            ],
            intermediate: [
                { title: 'ES6 Features Tutorial', type: 'video', url: 'https://www.youtube.com/watch?v=NCwa_xi0Uuc' },
                { title: 'JavaScript Promises', type: 'article', url: 'https://javascript.info/async' },
                { title: 'You Dont Know JS', type: 'article', url: 'https://github.com/getify/You-Dont-Know-JS' },
            ],
        },
        React: {
            beginner: [
                { title: 'React Official Tutorial', type: 'article', url: 'https://react.dev/learn' },
                { title: 'React JS Full Course', type: 'video', url: 'https://www.youtube.com/watch?v=bMknfKXIFA8' },
                { title: 'React Hooks Introduction', type: 'video', url: 'https://www.youtube.com/watch?v=dpw9EHDh2bM' },
            ],
            intermediate: [
                { title: 'React Hooks in Depth', type: 'video', url: 'https://www.youtube.com/watch?v=TNhaISOUy6Q' },
                { title: 'React Patterns', type: 'article', url: 'https://reactpatterns.com/' },
                { title: 'Advanced React', type: 'course', url: 'https://react.dev/learn/thinking-in-react' },
            ],
        },
        TypeScript: {
            beginner: [
                { title: 'TypeScript Handbook', type: 'article', url: 'https://www.typescriptlang.org/docs/handbook/intro.html' },
                { title: 'TypeScript Crash Course', type: 'video', url: 'https://www.youtube.com/watch?v=BCg4U1FzODs' },
                { title: 'TypeScript Exercises', type: 'exercise', url: 'https://typescript-exercises.github.io/' },
            ],
            intermediate: [
                { title: 'TypeScript Generics', type: 'video', url: 'https://www.youtube.com/watch?v=nViEqpgwxHE' },
                { title: 'Advanced TypeScript', type: 'article', url: 'https://www.typescriptlang.org/docs/handbook/2/types-from-types.html' },
                { title: 'TypeScript Deep Dive', type: 'article', url: 'https://basarat.gitbook.io/typescript/' },
            ],
        },
        'Node.js': {
            beginner: [
                { title: 'Node.js Official Docs', type: 'article', url: 'https://nodejs.org/en/learn' },
                { title: 'Node.js Crash Course', type: 'video', url: 'https://www.youtube.com/watch?v=fBNz5xF-Kx4' },
                { title: 'Express.js Guide', type: 'article', url: 'https://expressjs.com/en/starter/installing.html' },
            ],
            intermediate: [
                { title: 'REST API Design', type: 'video', url: 'https://www.youtube.com/watch?v=fgTGADljAeg' },
                { title: 'Node.js Best Practices', type: 'article', url: 'https://github.com/goldbergyoni/nodebestpractices' },
                { title: 'Authentication with JWT', type: 'video', url: 'https://www.youtube.com/watch?v=mbsmsi7l3r4' },
            ],
        },
        CSS: {
            beginner: [
                { title: 'CSS Flexbox Guide', type: 'article', url: 'https://css-tricks.com/snippets/css/a-guide-to-flexbox/' },
                { title: 'CSS Grid Tutorial', type: 'video', url: 'https://www.youtube.com/watch?v=jV8B24rSN5o' },
                { title: 'Flexbox Froggy Game', type: 'exercise', url: 'https://flexboxfroggy.com/' },
            ],
            intermediate: [
                { title: 'Advanced CSS Animations', type: 'video', url: 'https://www.youtube.com/watch?v=YszONjKpgg4' },
                { title: 'CSS Grid Garden', type: 'exercise', url: 'https://cssgridgarden.com/' },
                { title: 'Modern CSS', type: 'article', url: 'https://moderncss.dev/' },
            ],
        },
    };

    return resources[topic]?.[level] || resources['JavaScript'][level];
};

// @desc    Get all available quizzes
// @route   GET /api/quiz
// @access  Private
export const getQuizzes = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        // Seed quizzes if none exist
        const count = await Quiz.countDocuments();
        if (count === 0) {
            const quizzes = buildQuizzesFromBank();
            await Quiz.insertMany(quizzes);
        }

        const { topic, difficulty } = req.query;
        const query: Record<string, unknown> = { isActive: true };

        if (topic) query.topic = topic;
        if (difficulty) query.difficulty = difficulty;

        const quizzes = await Quiz.find(query).select('-questions.correctAnswer');

        res.status(200).json({
            success: true,
            count: quizzes.length,
            data: quizzes,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get single quiz (without answers for taking)
// @route   GET /api/quiz/:id
// @access  Private
export const getQuiz = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const quiz = await Quiz.findById(req.params.id).select('-questions.correctAnswer -questions.explanation');

        if (!quiz) {
            res.status(404).json({
                success: false,
                error: 'Quiz not found',
            });
            return;
        }

        res.status(200).json({
            success: true,
            data: quiz,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Submit quiz attempt and get personalized recommendations
// @route   POST /api/quiz/:id/submit
// @access  Private
export const submitQuizAttempt = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        console.log('Quiz submission body:', JSON.stringify(req.body, null, 2));
        const { answers, timeSpentMinutes } = req.body;
        const quizId = req.params.id;

        if (!Array.isArray(answers)) {
            res.status(400).json({ success: false, error: 'Answers must be an array' });
            return;
        }

        const quiz = await Quiz.findById(quizId);

        if (!quiz) {
            res.status(404).json({ success: false, error: 'Quiz not found' });
            return;
        }

        // Calculate score and track topic performance
        let correctCount = 0;
        let totalPoints = 0;
        let earnedPoints = 0;
        const topicScores: Record<string, { correct: number; total: number }> = {};
        const wrongTopics: string[] = [];

        const processedAnswers = answers.map((answer: { questionId: string; selectedAnswer: string; timeSpentSeconds: number }) => {
            const question = quiz.questions.find(q => q.questionId === answer.questionId);
            if (!question) return { ...answer, isCorrect: false };

            totalPoints += question.points;
            const isCorrect = answer.selectedAnswer === question.correctAnswer;

            // Track per-topic performance
            const topic = question.topic || quiz.topic;
            if (!topicScores[topic]) {
                topicScores[topic] = { correct: 0, total: 0 };
            }
            topicScores[topic].total++;

            if (isCorrect) {
                correctCount++;
                earnedPoints += question.points;
                topicScores[topic].correct++;
            } else {
                wrongTopics.push(topic);
            }

            return {
                questionId: answer.questionId,
                selectedAnswer: answer.selectedAnswer,
                isCorrect,
                timeSpentSeconds: answer.timeSpentSeconds || 0,
                attempts: 1,
            };
        });

        const score = totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * 100) : 0;
        const passed = score >= quiz.passingScore;

        // Create attempt record
        const attempt = await QuizAttempt.create({
            userId: req.user?._id,
            quizId,
            answers: processedAnswers,
            score,
            totalPoints,
            correctAnswers: correctCount,
            wrongAnswers: quiz.questions.length - correctCount,
            timeSpentMinutes: timeSpentMinutes || 0,
            passed,
            completedAt: new Date(),
        });

        // Update user progress
        const progress = await Progress.findOne({ userId: req.user?._id });
        if (progress) {
            const createdAt = progress.createdAt || new Date();
            const weekNum = Math.ceil((new Date().getTime() - createdAt.getTime()) / (7 * 24 * 60 * 60 * 1000)) || 1;

            progress.quizScores.push({
                week: `Week ${weekNum}`,
                quizId: quizId,
                score,
                totalQuestions: quiz.questions.length,
                correctAnswers: correctCount,
                timeSpentMinutes: timeSpentMinutes || 0,
                date: new Date(),
            });

            // Update topic progress
            for (const [topic, scores] of Object.entries(topicScores)) {
                const topicIndex = progress.topicProgress.findIndex(tp => tp.topicName === topic);
                if (topicIndex >= 0) {
                    const oldMastery = progress.topicProgress[topicIndex].masteryLevel;
                    const newScore = Math.round((scores.correct / scores.total) * 100);
                    progress.topicProgress[topicIndex].masteryLevel = Math.round((oldMastery + newScore) / 2);
                } else {
                    progress.topicProgress.push({
                        topicId: topic.toLowerCase().replace(/\s/g, '-'),
                        topicName: topic,
                        masteryLevel: Math.round((scores.correct / scores.total) * 100),
                        timeSpentMinutes: 0,
                        lessonsCompleted: 0,
                        totalLessons: 10,
                        errorCount: scores.total - scores.correct,
                        retryCount: 0,
                        lastAccessedAt: new Date(),
                        status: 'in_progress',
                    });
                }
            }

            // Update strong/weak areas
            progress.weakAreas = [...new Set([...progress.weakAreas, ...wrongTopics])].slice(0, 5);
            for (const [topic, scores] of Object.entries(topicScores)) {
                if (scores.correct === scores.total) {
                    progress.strongAreas = [...new Set([...progress.strongAreas, topic])].slice(0, 5);
                    progress.weakAreas = progress.weakAreas.filter(w => w !== topic);
                }
            }

            await progress.save();
        }

        // Generate personalized recommendations
        const topicPerformance = Object.fromEntries(
            Object.entries(topicScores).map(([topic, { correct, total }]) => [
                topic,
                Math.round((correct / total) * 100),
            ])
        );
        const recommendations = generateRecommendations(topicPerformance, []);

        // Get correct answers and explanations for review
        const reviewData = quiz.questions.map(q => ({
            questionId: q.questionId,
            question: q.question,
            correctAnswer: q.correctAnswer,
            explanation: q.explanation,
            userAnswer: processedAnswers.find((a: { questionId: string }) => a.questionId === q.questionId)?.selectedAnswer,
            isCorrect: processedAnswers.find((a: { questionId: string }) => a.questionId === q.questionId)?.isCorrect,
        }));

        res.status(201).json({
            success: true,
            data: {
                attemptId: attempt._id,
                score,
                passed,
                correctAnswers: correctCount,
                totalQuestions: quiz.questions.length,
                topicPerformance,
                recommendations,
                review: reviewData,
            },
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get user's quiz history
// @route   GET /api/quiz/history
// @access  Private
export const getQuizHistory = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const attempts = await QuizAttempt.find({ userId: req.user?._id })
            .populate('quizId', 'title topic difficulty')
            .sort({ completedAt: -1 })
            .limit(20);

        res.status(200).json({
            success: true,
            count: attempts.length,
            data: attempts,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get quiz analytics with recommendations
// @route   GET /api/quiz/analytics
// @access  Private
export const getQuizAnalytics = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const attempts = await QuizAttempt.find({ userId: req.user?._id });

        if (attempts.length === 0) {
            res.status(200).json({
                success: true,
                data: {
                    totalAttempts: 0,
                    averageScore: 0,
                    passRate: 0,
                    topicPerformance: {},
                    errorPatterns: [],
                    recommendations: [],
                },
            });
            return;
        }

        const totalScore = attempts.reduce((sum, a) => sum + a.score, 0);
        const passedCount = attempts.filter(a => a.passed).length;

        const questionErrors: Record<string, number> = {};
        const topicScores: Record<string, { correct: number; total: number }> = {};

        // Batch-load all quizzes for these attempts (fixes N+1 query)
        const quizIds = [...new Set(attempts.map(a => a.quizId.toString()))];
        const quizzes = await Quiz.find({ _id: { $in: quizIds } });
        const quizMap = new Map(quizzes.map(q => [q._id.toString(), q]));

        for (const attempt of attempts) {
            const quiz = quizMap.get(attempt.quizId.toString());
            if (!quiz) continue;

            for (const answer of attempt.answers) {
                const question = quiz.questions.find(q => q.questionId === answer.questionId);
                if (!question) continue;

                const topic = question.topic || quiz.topic;
                if (!topicScores[topic]) {
                    topicScores[topic] = { correct: 0, total: 0 };
                }
                topicScores[topic].total++;
                if (answer.isCorrect) {
                    topicScores[topic].correct++;
                } else {
                    questionErrors[answer.questionId] = (questionErrors[answer.questionId] || 0) + 1;
                }
            }
        }

        const errorPatterns = Object.entries(questionErrors)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([questionId, count]) => ({ questionId, errorCount: count }));

        const topicPerformance = Object.fromEntries(
            Object.entries(topicScores).map(([topic, { correct, total }]) => [
                topic,
                Math.round((correct / total) * 100),
            ])
        );

        const recommendations = generateRecommendations(topicPerformance, errorPatterns);

        res.status(200).json({
            success: true,
            data: {
                totalAttempts: attempts.length,
                averageScore: Math.round(totalScore / attempts.length),
                passRate: Math.round((passedCount / attempts.length) * 100),
                topicPerformance,
                errorPatterns,
                recommendations,
            },
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get recommended resources based on performance
// @route   GET /api/quiz/recommendations
// @access  Private
export const getQuizRecommendations = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const progress = await Progress.findOne({ userId: req.user?._id });

        if (!progress) {
            res.status(200).json({
                success: true,
                data: {
                    recommendations: [
                        {
                            topic: 'JavaScript Fundamentals',
                            priority: 'high',
                            reason: 'Start with the basics of web development.',
                            suggestedResources: getResourcesForTopic('JavaScript', 'beginner'),
                        },
                        {
                            topic: 'React Basics',
                            priority: 'medium',
                            reason: 'Learn how to build modern user interfaces.',
                            suggestedResources: getResourcesForTopic('React', 'beginner'),
                        },
                        {
                            topic: 'CSS Layouts',
                            priority: 'low',
                            reason: 'Master Flexbox and Grid for responsive design.',
                            suggestedResources: getResourcesForTopic('CSS', 'beginner'),
                        }
                    ],
                },
            });
            return;
        }

        // Build topic performance from progress
        const topicPerformance: Record<string, number> = {};
        for (const topic of progress.topicProgress) {
            topicPerformance[topic.topicName] = topic.masteryLevel;
        }

        const recommendations = generateRecommendations(topicPerformance, []);

        res.status(200).json({
            success: true,
            data: {
                recommendations,
                weakAreas: progress.weakAreas,
                strongAreas: progress.strongAreas,
            },
        });
    } catch (error) {
        next(error);
    }
};

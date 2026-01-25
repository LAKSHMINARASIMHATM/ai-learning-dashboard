'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { CheckCircle2, XCircle, ArrowRight, RefreshCcw, BookOpen } from 'lucide-react';
import api from '@/lib/api';

interface Question {
    questionId: string;
    question: string;
    type: string;
    options: string[];
    points: number;
}

interface Quiz {
    _id: string;
    title: string;
    description: string;
    topic: string;
    difficulty: string;
    questions: Question[];
    timeLimit: number;
}

export default function QuizPage() {
    const router = useRouter();
    const [quizzes, setQuizzes] = useState<Quiz[]>([]);
    const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<{ questionId: string; selectedAnswer: string; timeSpentSeconds: number }[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchQuizzes();
    }, []);

    const fetchQuizzes = async () => {
        try {
            const data = await api.getQuizzes();
            if (data.success && data.data) {
                setQuizzes(data.data as Quiz[]);
            }
        } catch (error) {
            console.error('Error fetching quizzes:', error);
            toast.error('Failed to load quizzes');
        } finally {
            setLoading(false);
        }
    };

    const startQuiz = (quiz: Quiz) => {
        setSelectedQuiz(quiz);
        setCurrentQuestionIndex(0);
        setAnswers([]);
        setResult(null);
    };

    const handleAnswer = (selectedAnswer: string) => {
        if (!selectedQuiz) return;

        const newAnswers = [...answers];
        const questionId = selectedQuiz.questions[currentQuestionIndex].questionId;

        const existingAnswerIndex = newAnswers.findIndex(a => a.questionId === questionId);
        if (existingAnswerIndex >= 0) {
            newAnswers[existingAnswerIndex].selectedAnswer = selectedAnswer;
        } else {
            newAnswers.push({
                questionId,
                selectedAnswer,
                timeSpentSeconds: 0, // Simplified for now
            });
        }

        setAnswers(newAnswers);
    };

    const nextQuestion = () => {
        if (currentQuestionIndex < (selectedQuiz?.questions.length || 0) - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        }
    };

    const prevQuestion = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
        }
    };

    const submitQuiz = async () => {
        if (!selectedQuiz) return;
        setIsSubmitting(true);
        try {
            const data = await api.submitQuizAttempt(
                selectedQuiz._id,
                answers,
                5 // Simplified
            );
            if (data.success && data.data) {
                setResult(data.data);
                toast.success('Quiz submitted successfully!');
            }
        } catch (error) {
            console.error('Error submitting quiz:', error);
            toast.error('Failed to submit quiz');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return (
            <DashboardLayout>
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
            </DashboardLayout>
        );
    }

    if (result) {
        return (
            <DashboardLayout>
                <div className="max-w-4xl mx-auto">
                    <Card className="mb-8">
                        <CardHeader className="text-center">
                            <div className="flex justify-center mb-4">
                                {result.passed ? (
                                    <CheckCircle2 className="w-16 h-16 text-green-500" />
                                ) : (
                                    <XCircle className="w-16 h-16 text-red-500" />
                                )}
                            </div>
                            <CardTitle className="text-3xl">
                                {result.passed ? 'Congratulations!' : 'Keep Practicing!'}
                            </CardTitle>
                            <CardDescription className="text-lg">
                                You scored {result.score}% in {selectedQuiz?.title}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                                <div className="bg-muted p-4 rounded-lg text-center">
                                    <p className="text-sm text-muted-foreground">Correct Answers</p>
                                    <p className="text-2xl font-bold">{result.correctAnswers} / {result.totalQuestions}</p>
                                </div>
                                <div className="bg-muted p-4 rounded-lg text-center">
                                    <p className="text-sm text-muted-foreground">Status</p>
                                    <p className={`text-2xl font-bold ${result.passed ? 'text-green-500' : 'text-red-500'}`}>
                                        {result.passed ? 'PASSED' : 'FAILED'}
                                    </p>
                                </div>
                                <div className="bg-muted p-4 rounded-lg text-center">
                                    <p className="text-sm text-muted-foreground">Time Spent</p>
                                    <p className="text-2xl font-bold">5 mins</p>
                                </div>
                            </div>

                            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                                <BookOpen className="w-5 h-5 text-primary" />
                                Personalized Recommendations
                            </h3>
                            <div className="grid grid-cols-1 gap-4">
                                {result.recommendations.map((rec: any, index: number) => (
                                    <Card key={index} className="border-l-4 border-l-primary">
                                        <CardContent className="pt-6">
                                            <div className="flex justify-between items-start mb-2">
                                                <h4 className="font-bold text-lg">{rec.topic}</h4>
                                                <span className={`px-2 py-1 rounded text-xs font-medium ${rec.priority === 'high' ? 'bg-red-100 text-red-800' :
                                                    rec.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                                        'bg-blue-100 text-blue-800'
                                                    }`}>
                                                    {rec.priority.toUpperCase()} PRIORITY
                                                </span>
                                            </div>
                                            <p className="text-sm text-muted-foreground mb-4">{rec.reason}</p>
                                            <div className="space-y-2">
                                                {rec.suggestedResources.map((res: any, idx: number) => (
                                                    <a
                                                        key={idx}
                                                        href={res.url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex items-center justify-between p-2 bg-muted hover:bg-muted/80 rounded transition text-sm"
                                                    >
                                                        <span>{res.title}</span>
                                                        <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded capitalize">{res.type}</span>
                                                    </a>
                                                ))}
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>

                            <div className="flex gap-4 mt-8">
                                <Button className="flex-1" onClick={() => setSelectedQuiz(null)}>
                                    Take Another Quiz
                                </Button>
                                <Button variant="outline" className="flex-1" onClick={() => router.push('/recommendations')}>
                                    View All Recommendations
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </DashboardLayout>
        );
    }

    if (selectedQuiz) {
        const currentQuestion = selectedQuiz.questions[currentQuestionIndex];
        const progress = ((currentQuestionIndex + 1) / selectedQuiz.questions.length) * 100;
        const currentAnswer = answers.find(a => a.questionId === currentQuestion.questionId)?.selectedAnswer;

        return (
            <DashboardLayout>
                <div className="max-w-4xl mx-auto">
                    <div className="mb-6">
                        <div className="flex justify-between items-center mb-2">
                            <h2 className="text-2xl font-bold">{selectedQuiz.title}</h2>
                            <span className="text-sm font-medium text-muted-foreground">
                                Question {currentQuestionIndex + 1} of {selectedQuiz.questions.length}
                            </span>
                        </div>
                        <Progress value={progress} className="h-2" />
                    </div>

                    <Card className="mb-6">
                        <CardHeader>
                            <CardTitle className="text-xl leading-relaxed">
                                {currentQuestion.question}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {currentQuestion.options.map((option, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleAnswer(option)}
                                    className={`w-full text-left p-4 rounded-lg border-2 transition-all ${currentAnswer === option
                                        ? 'border-primary bg-primary/5 shadow-sm'
                                        : 'border-muted hover:border-primary/50 hover:bg-muted/50'
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-bold ${currentAnswer === option ? 'border-primary bg-primary text-white' : 'border-muted-foreground'
                                            }`}>
                                            {String.fromCharCode(65 + index)}
                                        </div>
                                        <span>{option}</span>
                                    </div>
                                </button>
                            ))}
                        </CardContent>
                    </Card>

                    <div className="flex justify-between items-center">
                        <Button
                            variant="outline"
                            onClick={prevQuestion}
                            disabled={currentQuestionIndex === 0}
                        >
                            Previous
                        </Button>

                        {currentQuestionIndex === selectedQuiz.questions.length - 1 ? (
                            <Button
                                onClick={submitQuiz}
                                disabled={isSubmitting || answers.length < selectedQuiz.questions.length}
                                className="bg-primary hover:bg-primary/90"
                            >
                                {isSubmitting ? 'Submitting...' : 'Finish Quiz'}
                            </Button>
                        ) : (
                            <Button
                                onClick={nextQuestion}
                                disabled={!currentAnswer}
                                className="flex items-center gap-2"
                            >
                                Next Question <ArrowRight className="w-4 h-4" />
                            </Button>
                        )}
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <h2 className="text-3xl font-bold text-foreground mb-2">Skill Assessments</h2>
                    <p className="text-muted-foreground">
                        Test your knowledge and get personalized learning paths based on your results.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {quizzes.map((quiz) => (
                        <Card key={quiz._id} className="hover:shadow-lg transition-shadow">
                            <CardHeader>
                                <div className="flex justify-between items-start mb-2">
                                    <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${quiz.difficulty === 'beginner' ? 'bg-green-100 text-green-800' :
                                        quiz.difficulty === 'intermediate' ? 'bg-blue-100 text-blue-800' :
                                            'bg-purple-100 text-purple-800'
                                        }`}>
                                        {quiz.difficulty}
                                    </span>
                                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                                        <RefreshCcw className="w-3 h-3" /> {quiz.timeLimit} mins
                                    </span>
                                </div>
                                <CardTitle className="text-xl">{quiz.title}</CardTitle>
                                <CardDescription className="line-clamp-2">{quiz.description}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center gap-2 mb-6">
                                    <span className="bg-primary/10 text-primary px-2 py-1 rounded text-xs font-medium">
                                        {quiz.topic}
                                    </span>
                                    <span className="text-xs text-muted-foreground">
                                        {quiz.questions.length} Questions
                                    </span>
                                </div>
                                <Button className="w-full" onClick={() => startQuiz(quiz)}>
                                    Start Assessment
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </DashboardLayout>
    );
}

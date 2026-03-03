export interface QuestionItem {
    questionId: string;
    question: string;
    type: 'multiple_choice' | 'true_false';
    options: string[];
    correctAnswer: string;
    explanation: string;
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    topic: string;
    subtopic: string;
    points: number;
}
export declare const javascriptQuestions: QuestionItem[];
export declare const reactQuestions: QuestionItem[];
export declare const typescriptQuestions: QuestionItem[];
export declare const nodejsQuestions: QuestionItem[];
export declare const cssQuestions: QuestionItem[];
export declare const allQuestions: {
    javascript: QuestionItem[];
    react: QuestionItem[];
    typescript: QuestionItem[];
    nodejs: QuestionItem[];
    css: QuestionItem[];
};
export declare const getQuestionsByTopic: (topic: string) => QuestionItem[];
export declare const getQuestionsByDifficulty: (questions: QuestionItem[], difficulty: string) => QuestionItem[];
//# sourceMappingURL=questionBank.d.ts.map
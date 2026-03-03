const getApiUrl = () => {
    if (process.env.NEXT_PUBLIC_API_URL) return process.env.NEXT_PUBLIC_API_URL;
    if (typeof window !== 'undefined') {
        return `http://${window.location.hostname}:5000/api`;
    }
    return 'http://localhost:5000/api';
};

const API_URL = getApiUrl();

interface ApiResponse<T> {
    success: boolean;
    data?: T;
    message?: string;
    error?: string;
}

class ApiClient {
    private token: string | null = null;

    constructor() {
        if (typeof window !== 'undefined') {
            this.token = localStorage.getItem('accessToken');
        }
    }

    setToken(accessToken: string, refreshToken?: string) {
        this.token = accessToken;
        if (typeof window !== 'undefined') {
            localStorage.setItem('accessToken', accessToken);
            if (refreshToken) {
                localStorage.setItem('refreshToken', refreshToken);
            }
        }
    }

    clearToken() {
        this.token = null;
        if (typeof window !== 'undefined') {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
        }
    }

    private async request<T>(
        endpoint: string,
        options: RequestInit & { _isRetry?: boolean } = {}
    ): Promise<ApiResponse<T>> {
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
            ...(options.headers || {}),
        };

        if (this.token) {
            (headers as Record<string, string>)['Authorization'] = `Bearer ${this.token}`;
        }

        try {
            const response = await fetch(`${API_URL}${endpoint}`, {
                ...options,
                headers,
                credentials: 'include', // MED-07: Send cookies (including httpOnly)
            });

            const data = await response.json();

            // Handle 401 Unauthorized (Token Expired)
            if (response.status === 401 && !options._isRetry && !endpoint.includes('/auth/login') && !endpoint.includes('/auth/refresh')) {
                if (typeof window !== 'undefined') {
                    const refreshToken = localStorage.getItem('refreshToken');

                    try {
                        // Try to refresh token (always include credentials for cookies)
                        const refreshResponse = await fetch(`${API_URL}/auth/refresh`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ refreshToken }),
                            credentials: 'include',
                        });

                        const refreshData = await refreshResponse.json();

                        if (refreshData.success && refreshData.data?.accessToken) {
                            // Update token
                            this.setToken(refreshData.data.accessToken, refreshData.data.refreshToken);

                            // Retry original request
                            return this.request<T>(endpoint, { ...options, _isRetry: true });
                        }
                    } catch (refreshError) {
                        console.error('Token refresh failed:', refreshError);
                    }
                }

                // If refresh failed or no refresh token, logout
                this.clearToken();
                window.location.href = '/login';
                return { success: false, error: 'Session expired. Please login again.' };
            }

            return data;
        } catch (error) {
            return {
                success: false,
                error: (error as Error).message || 'An error occurred',
            };
        }
    }

    // Auth endpoints
    async register(name: string, email: string, password: string, learningPathId?: string) {
        const result = await this.request<{ user: unknown; accessToken: string; refreshToken: string }>('/auth/register', {
            method: 'POST',
            body: JSON.stringify({ name, email, password, learningPathId }),
        });
        if (result.success && result.data?.accessToken) {
            this.setToken(result.data.accessToken, result.data.refreshToken);
        }
        return result;
    }

    async login(email: string, password: string) {
        const result = await this.request<{ user: unknown; accessToken: string; refreshToken: string }>('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        });
        if (result.success && result.data?.accessToken) {
            this.setToken(result.data.accessToken, result.data.refreshToken);
        }
        return result;
    }

    async socialLogin(profile: { idToken: string; name?: string; email: string; avatar?: string }) {
        const result = await this.request<{ user: unknown; accessToken: string; refreshToken: string }>('/auth/social', {
            method: 'POST',
            body: JSON.stringify(profile),
        });
        if (result.success && result.data?.accessToken) {
            this.setToken(result.data.accessToken, result.data.refreshToken);
        }
        return result;
    }

    async getMe() {
        return this.request('/auth/me');
    }

    async logout() {
        const refreshToken = typeof window !== 'undefined' ? localStorage.getItem('refreshToken') : null;

        try {
            await this.request('/auth/logout', {
                method: 'POST',
                body: JSON.stringify({ refreshToken }),
            });
        } catch (error) {
            console.error('Logout request failed:', error);
        } finally {
            this.clearToken();
            if (typeof window !== 'undefined') {
                window.location.href = '/login';
            }
        }
    }

    // Progress endpoints
    async getProgress() {
        return this.request('/progress');
    }

    async updateProgress(data: Record<string, unknown>) {
        return this.request('/progress', {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    }

    async submitQuizScore(week: string, score: number) {
        return this.request('/progress/quiz', {
            method: 'POST',
            body: JSON.stringify({ week, score }),
        });
    }

    async logStudyTime(day: string, hours: number) {
        return this.request('/progress/study-time', {
            method: 'POST',
            body: JSON.stringify({ day, hours }),
        });
    }

    // Analytics endpoints
    async getQuizScores() {
        return this.request('/analytics/quiz-scores');
    }

    async getStudyTime() {
        return this.request('/analytics/study-time');
    }

    async getImprovement() {
        return this.request('/analytics/improvement');
    }

    async getAnalyticsSummary() {
        return this.request('/analytics/summary');
    }

    // Learning Path endpoints
    async getLearningPath() {
        return this.request('/learning-path');
    }

    async updateLearningStep(stepId: number, status: string, progress: number) {
        return this.request(`/learning-path/step/${stepId}`, {
            method: 'PUT',
            body: JSON.stringify({ status, progress }),
        });
    }

    async generateLearningPath(title: string, difficulty: string, topics: string[]) {
        return this.request('/learning-path/generate', {
            method: 'POST',
            body: JSON.stringify({ title, difficulty, topics }),
        });
    }

    // Resources endpoints
    async getResources(filters?: { type?: string; difficulty?: string; topic?: string }) {
        const params = new URLSearchParams();
        if (filters?.type) params.append('type', filters.type);
        if (filters?.difficulty) params.append('difficulty', filters.difficulty);
        if (filters?.topic) params.append('topic', filters.topic);
        const query = params.toString() ? `?${params.toString()}` : '';
        return this.request(`/resources${query}`);
    }

    async getRecommendedResources() {
        return this.request('/resources/user/recommended');
    }

    async getResource(id: string) {
        return this.request(`/resources/${id}`);
    }

    // AI Assistant endpoints
    async sendMessage(content: string) {
        return this.request('/assistant/chat', {
            method: 'POST',
            body: JSON.stringify({ content }),
        });
    }

    async getChatHistory() {
        return this.request('/assistant/history');
    }

    async clearChatHistory() {
        return this.request('/assistant/history', { method: 'DELETE' });
    }

    async getSuggestions() {
        return this.request('/assistant/suggestions');
    }

    // Skill Gaps endpoints
    async getSkillGaps() {
        return this.request('/skill-gaps');
    }

    async submitAssessment(skills: Array<{ topic: string; currentLevel: number }>) {
        return this.request('/skill-gaps/assessment', {
            method: 'POST',
            body: JSON.stringify({ skills }),
        });
    }

    async getSkillRecommendations() {
        return this.request('/skill-gaps/recommendations');
    }

    // User endpoints
    async updateProfile(name: string, avatar?: string) {
        return this.request('/user/profile', {
            method: 'PUT',
            body: JSON.stringify({ name, avatar }),
        });
    }

    async updateSettings(settings: {
        theme?: string;
        notifications?: boolean;
        emailUpdates?: boolean;
        language?: string;
        twoFactorEnabled?: boolean;
    }) {
        return this.request('/user/settings', {
            method: 'PUT',
            body: JSON.stringify(settings),
        });
    }

    async updatePassword(currentPassword: string, newPassword: string) {
        return this.request('/auth/password', {
            method: 'PUT',
            body: JSON.stringify({ currentPassword, newPassword }),
        });
    }

    // Quiz endpoints
    async getQuizzes(topic?: string, difficulty?: string) {
        const params = new URLSearchParams();
        if (topic) params.append('topic', topic);
        if (difficulty) params.append('difficulty', difficulty);
        const query = params.toString() ? `?${params.toString()}` : '';
        return this.request(`/quiz${query}`);
    }

    async getQuiz(quizId: string) {
        return this.request(`/quiz/${quizId}`);
    }

    async submitQuizAttempt(quizId: string, answers: { questionId: string; selectedAnswer: string; timeSpentSeconds: number }[], timeSpentMinutes: number) {
        return this.request(`/quiz/${quizId}/submit`, {
            method: 'POST',
            body: JSON.stringify({ answers, timeSpentMinutes }),
        });
    }

    async getQuizHistory() {
        return this.request('/quiz/history');
    }

    async getQuizAnalytics() {
        return this.request('/quiz/analytics');
    }

    async getQuizRecommendations() {
        return this.request('/quiz/recommendations');
    }

    // Learning Path Template endpoints
    async getLearningPathTemplates() {
        return this.request('/learning-path/templates');
    }

    async getLearningPathTemplate(templateId: string) {
        return this.request(`/learning-path/templates/${templateId}`);
    }

    async startLearningPath(templateId: string) {
        return this.request('/learning-path/start', {
            method: 'POST',
            body: JSON.stringify({ templateId }),
        });
    }

    async updateChecklistItem(stepIndex: number, itemId: string, completed: boolean) {
        return this.request(`/learning-path/checklist/${stepIndex}/${itemId}`, {
            method: 'PUT',
            body: JSON.stringify({ completed }),
        });
    }

    async completeStep(stepIndex: number) {
        return this.request(`/learning-path/step/${stepIndex}/complete`, {
            method: 'PUT',
        });
    }

    async updateLearnerProfile(profile: {
        preferredLearningTime?: { startHour: number; endHour: number; timezone: string };
        learningPace?: string;
        dailyGoalMinutes?: number;
        weeklyGoalHours?: number;
        interests?: string[];
        careerGoals?: string[];
    }) {
        return this.request('/user/profile', {
            method: 'PUT',
            body: JSON.stringify({ learnerProfile: profile }),
        });
    }

    // Topic Progress endpoints
    async updateTopicProgress(topicId: string, data: {
        masteryLevel?: number;
        timeSpentMinutes?: number;
        lessonsCompleted?: number;
        errorCount?: number;
        retryCount?: number;
    }) {
        return this.request(`/progress/topic/${topicId}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    }

    async getTopicProgress() {
        return this.request('/progress/topics');
    }
}

// Export singleton instance
export const api = new ApiClient();
export default api;

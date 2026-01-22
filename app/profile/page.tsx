'use client';

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    User,
    BookOpen,
    Clock,
    Target,
    Sparkles,
    GraduationCap,
    Plus,
    Trash2,
    Save,
    Loader2
} from 'lucide-react';
import api from '@/lib/api';
import { toast } from 'sonner';

interface AcademicRecord {
    institution: string;
    degree: string;
    fieldOfStudy: string;
    startYear: number;
    endYear?: number;
}

interface LearnerProfile {
    learningStyle: 'visual' | 'auditory' | 'kinesthetic' | 'reading';
    secondaryStyle?: string;
    academicHistory: AcademicRecord[];
    strengths: string[];
    weaknesses: string[];
    preferredLearningTime: {
        startHour: number;
        endHour: number;
        timezone: string;
    };
    averageSessionDuration: number;
    learningPace: 'slow' | 'moderate' | 'fast';
    dailyGoalMinutes: number;
    weeklyGoalHours: number;
    interests: string[];
    careerGoals: string[];
}

const learningStyles = [
    { value: 'visual', label: 'Visual', icon: '👁️', desc: 'Learn best through images, diagrams, and videos' },
    { value: 'auditory', label: 'Auditory', icon: '👂', desc: 'Learn best through listening and discussions' },
    { value: 'kinesthetic', label: 'Kinesthetic', icon: '✋', desc: 'Learn best through hands-on practice' },
    { value: 'reading', label: 'Reading/Writing', icon: '📚', desc: 'Learn best through reading and note-taking' },
];

const learningPaces = [
    { value: 'slow', label: 'Slow & Thorough', desc: 'Take time to deeply understand each concept' },
    { value: 'moderate', label: 'Moderate', desc: 'Balanced pace with good comprehension' },
    { value: 'fast', label: 'Fast', desc: 'Quick learner, prefer rapid progress' },
];

export default function ProfilePage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [profile, setProfile] = useState<LearnerProfile>({
        learningStyle: 'visual',
        academicHistory: [],
        strengths: [],
        weaknesses: [],
        preferredLearningTime: { startHour: 9, endHour: 17, timezone: 'UTC' },
        averageSessionDuration: 45,
        learningPace: 'moderate',
        dailyGoalMinutes: 60,
        weeklyGoalHours: 10,
        interests: [],
        careerGoals: [],
    });

    const [newStrength, setNewStrength] = useState('');
    const [newWeakness, setNewWeakness] = useState('');
    const [newInterest, setNewInterest] = useState('');
    const [newGoal, setNewGoal] = useState('');

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const res = await api.getMe();
            if (res.success && res.data) {
                const userData = res.data as { learnerProfile?: LearnerProfile };
                if (userData.learnerProfile) {
                    setProfile(prev => ({ ...prev, ...userData.learnerProfile }));
                }
            }
        } catch (error) {
            console.error('Failed to fetch profile:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const res = await api.updateLearnerProfile(profile);
            if (res.success) {
                toast.success('Profile saved successfully!');
            } else {
                toast.error('Failed to save profile');
            }
        } catch (error) {
            toast.error('Failed to save profile');
        } finally {
            setSaving(false);
        }
    };

    const addItem = (field: 'strengths' | 'weaknesses' | 'interests' | 'careerGoals', value: string, setter: (v: string) => void) => {
        if (!value.trim()) return;
        setProfile(prev => ({
            ...prev,
            [field]: [...prev[field], value.trim()]
        }));
        setter('');
    };

    const removeItem = (field: 'strengths' | 'weaknesses' | 'interests' | 'careerGoals', index: number) => {
        setProfile(prev => ({
            ...prev,
            [field]: prev[field].filter((_, i) => i !== index)
        }));
    };

    const addAcademicRecord = () => {
        setProfile(prev => ({
            ...prev,
            academicHistory: [...prev.academicHistory, {
                institution: '',
                degree: '',
                fieldOfStudy: '',
                startYear: new Date().getFullYear(),
            }]
        }));
    };

    const updateAcademicRecord = (index: number, field: keyof AcademicRecord, value: string | number) => {
        setProfile(prev => ({
            ...prev,
            academicHistory: prev.academicHistory.map((record, i) =>
                i === index ? { ...record, [field]: value } : record
            )
        }));
    };

    const removeAcademicRecord = (index: number) => {
        setProfile(prev => ({
            ...prev,
            academicHistory: prev.academicHistory.filter((_, i) => i !== index)
        }));
    };

    if (loading) {
        return (
            <DashboardLayout>
                <div className="flex items-center justify-center h-64">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            {/* Header */}
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight mb-2">Learner Profile</h2>
                    <p className="text-muted-foreground">
                        Customize your learning experience based on your preferences
                    </p>
                </div>
                <Button onClick={handleSave} disabled={saving}>
                    {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                    Save Profile
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Learning Style */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Sparkles className="w-5 h-5 text-primary" />
                            Learning Style
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p className="text-sm text-muted-foreground mb-4">
                            How do you learn best? This helps us recommend the right type of content.
                        </p>
                        <div className="grid grid-cols-2 gap-3">
                            {learningStyles.map((style) => (
                                <button
                                    key={style.value}
                                    onClick={() => setProfile(prev => ({ ...prev, learningStyle: style.value as LearnerProfile['learningStyle'] }))}
                                    className={`p-4 rounded-xl border-2 text-left transition-all ${profile.learningStyle === style.value
                                            ? 'border-primary bg-primary/5'
                                            : 'border-border hover:border-primary/50'
                                        }`}
                                >
                                    <span className="text-2xl mb-2 block">{style.icon}</span>
                                    <p className="font-medium">{style.label}</p>
                                    <p className="text-xs text-muted-foreground">{style.desc}</p>
                                </button>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Learning Pace */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Clock className="w-5 h-5 text-cyan-500" />
                            Learning Pace
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p className="text-sm text-muted-foreground mb-4">
                            How quickly do you prefer to progress through material?
                        </p>
                        <div className="space-y-3">
                            {learningPaces.map((pace) => (
                                <button
                                    key={pace.value}
                                    onClick={() => setProfile(prev => ({ ...prev, learningPace: pace.value as LearnerProfile['learningPace'] }))}
                                    className={`w-full p-4 rounded-xl border-2 text-left transition-all ${profile.learningPace === pace.value
                                            ? 'border-primary bg-primary/5'
                                            : 'border-border hover:border-primary/50'
                                        }`}
                                >
                                    <p className="font-medium">{pace.label}</p>
                                    <p className="text-sm text-muted-foreground">{pace.desc}</p>
                                </button>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Study Goals */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Target className="w-5 h-5 text-emerald-500" />
                            Study Goals
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium mb-2">Daily Goal (minutes)</label>
                            <input
                                type="range"
                                min="15"
                                max="180"
                                step="15"
                                value={profile.dailyGoalMinutes}
                                onChange={(e) => setProfile(prev => ({ ...prev, dailyGoalMinutes: parseInt(e.target.value) }))}
                                className="w-full"
                            />
                            <div className="flex justify-between text-sm text-muted-foreground mt-1">
                                <span>15 min</span>
                                <span className="font-bold text-primary">{profile.dailyGoalMinutes} min</span>
                                <span>3 hours</span>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Weekly Goal (hours)</label>
                            <input
                                type="range"
                                min="1"
                                max="40"
                                step="1"
                                value={profile.weeklyGoalHours}
                                onChange={(e) => setProfile(prev => ({ ...prev, weeklyGoalHours: parseInt(e.target.value) }))}
                                className="w-full"
                            />
                            <div className="flex justify-between text-sm text-muted-foreground mt-1">
                                <span>1 hour</span>
                                <span className="font-bold text-primary">{profile.weeklyGoalHours} hours</span>
                                <span>40 hours</span>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Preferred Study Time</label>
                            <div className="flex items-center gap-4">
                                <select
                                    value={profile.preferredLearningTime.startHour}
                                    onChange={(e) => setProfile(prev => ({
                                        ...prev,
                                        preferredLearningTime: { ...prev.preferredLearningTime, startHour: parseInt(e.target.value) }
                                    }))}
                                    className="flex-1 px-3 py-2 rounded-lg border border-border bg-background"
                                >
                                    {Array.from({ length: 24 }, (_, i) => (
                                        <option key={i} value={i}>{i.toString().padStart(2, '0')}:00</option>
                                    ))}
                                </select>
                                <span>to</span>
                                <select
                                    value={profile.preferredLearningTime.endHour}
                                    onChange={(e) => setProfile(prev => ({
                                        ...prev,
                                        preferredLearningTime: { ...prev.preferredLearningTime, endHour: parseInt(e.target.value) }
                                    }))}
                                    className="flex-1 px-3 py-2 rounded-lg border border-border bg-background"
                                >
                                    {Array.from({ length: 24 }, (_, i) => (
                                        <option key={i} value={i}>{i.toString().padStart(2, '0')}:00</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Strengths & Weaknesses */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <BookOpen className="w-5 h-5 text-amber-500" />
                            Strengths & Areas to Improve
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Strengths */}
                        <div>
                            <label className="block text-sm font-medium mb-2 text-emerald-500">Your Strengths</label>
                            <div className="flex gap-2 mb-2">
                                <input
                                    type="text"
                                    value={newStrength}
                                    onChange={(e) => setNewStrength(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && addItem('strengths', newStrength, setNewStrength)}
                                    placeholder="e.g., React, Problem Solving"
                                    className="flex-1 px-3 py-2 rounded-lg border border-border bg-background text-sm"
                                />
                                <Button size="sm" onClick={() => addItem('strengths', newStrength, setNewStrength)}>
                                    <Plus className="w-4 h-4" />
                                </Button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {profile.strengths.map((item, idx) => (
                                    <span key={idx} className="px-3 py-1 bg-emerald-500/10 text-emerald-600 rounded-full text-sm flex items-center gap-2">
                                        {item}
                                        <button onClick={() => removeItem('strengths', idx)} className="hover:text-red-500">
                                            <Trash2 className="w-3 h-3" />
                                        </button>
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Weaknesses */}
                        <div>
                            <label className="block text-sm font-medium mb-2 text-rose-500">Areas to Improve</label>
                            <div className="flex gap-2 mb-2">
                                <input
                                    type="text"
                                    value={newWeakness}
                                    onChange={(e) => setNewWeakness(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && addItem('weaknesses', newWeakness, setNewWeakness)}
                                    placeholder="e.g., TypeScript, Testing"
                                    className="flex-1 px-3 py-2 rounded-lg border border-border bg-background text-sm"
                                />
                                <Button size="sm" onClick={() => addItem('weaknesses', newWeakness, setNewWeakness)}>
                                    <Plus className="w-4 h-4" />
                                </Button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {profile.weaknesses.map((item, idx) => (
                                    <span key={idx} className="px-3 py-1 bg-rose-500/10 text-rose-600 rounded-full text-sm flex items-center gap-2">
                                        {item}
                                        <button onClick={() => removeItem('weaknesses', idx)} className="hover:text-red-500">
                                            <Trash2 className="w-3 h-3" />
                                        </button>
                                    </span>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Academic History */}
                <Card className="lg:col-span-2">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                            <GraduationCap className="w-5 h-5 text-purple-500" />
                            Academic History
                        </CardTitle>
                        <Button variant="outline" size="sm" onClick={addAcademicRecord}>
                            <Plus className="w-4 h-4 mr-2" /> Add Education
                        </Button>
                    </CardHeader>
                    <CardContent>
                        {profile.academicHistory.length === 0 ? (
                            <p className="text-center text-muted-foreground py-8">
                                No academic history added yet. Click "Add Education" to get started.
                            </p>
                        ) : (
                            <div className="space-y-4">
                                {profile.academicHistory.map((record, idx) => (
                                    <div key={idx} className="p-4 rounded-xl border border-border">
                                        <div className="flex justify-between mb-4">
                                            <span className="text-sm font-medium text-muted-foreground">Education {idx + 1}</span>
                                            <button onClick={() => removeAcademicRecord(idx)} className="text-rose-500 hover:text-rose-600">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                            <div>
                                                <label className="block text-xs font-medium mb-1">Institution</label>
                                                <input
                                                    type="text"
                                                    value={record.institution}
                                                    onChange={(e) => updateAcademicRecord(idx, 'institution', e.target.value)}
                                                    placeholder="University name"
                                                    className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-medium mb-1">Degree</label>
                                                <input
                                                    type="text"
                                                    value={record.degree}
                                                    onChange={(e) => updateAcademicRecord(idx, 'degree', e.target.value)}
                                                    placeholder="e.g., Bachelor's"
                                                    className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-medium mb-1">Field of Study</label>
                                                <input
                                                    type="text"
                                                    value={record.fieldOfStudy}
                                                    onChange={(e) => updateAcademicRecord(idx, 'fieldOfStudy', e.target.value)}
                                                    placeholder="e.g., Computer Science"
                                                    className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm"
                                                />
                                            </div>
                                            <div className="flex gap-2">
                                                <div className="flex-1">
                                                    <label className="block text-xs font-medium mb-1">Start Year</label>
                                                    <input
                                                        type="number"
                                                        value={record.startYear}
                                                        onChange={(e) => updateAcademicRecord(idx, 'startYear', parseInt(e.target.value))}
                                                        className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm"
                                                    />
                                                </div>
                                                <div className="flex-1">
                                                    <label className="block text-xs font-medium mb-1">End Year</label>
                                                    <input
                                                        type="number"
                                                        value={record.endYear || ''}
                                                        onChange={(e) => updateAcademicRecord(idx, 'endYear', parseInt(e.target.value) || 0)}
                                                        placeholder="Present"
                                                        className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Interests & Career Goals */}
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Target className="w-5 h-5 text-primary" />
                            Interests & Career Goals
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Interests */}
                            <div>
                                <label className="block text-sm font-medium mb-2">Learning Interests</label>
                                <div className="flex gap-2 mb-2">
                                    <input
                                        type="text"
                                        value={newInterest}
                                        onChange={(e) => setNewInterest(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && addItem('interests', newInterest, setNewInterest)}
                                        placeholder="e.g., Machine Learning, Web3"
                                        className="flex-1 px-3 py-2 rounded-lg border border-border bg-background text-sm"
                                    />
                                    <Button size="sm" onClick={() => addItem('interests', newInterest, setNewInterest)}>
                                        <Plus className="w-4 h-4" />
                                    </Button>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {profile.interests.map((item, idx) => (
                                        <span key={idx} className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm flex items-center gap-2">
                                            {item}
                                            <button onClick={() => removeItem('interests', idx)} className="hover:text-red-500">
                                                <Trash2 className="w-3 h-3" />
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Career Goals */}
                            <div>
                                <label className="block text-sm font-medium mb-2">Career Goals</label>
                                <div className="flex gap-2 mb-2">
                                    <input
                                        type="text"
                                        value={newGoal}
                                        onChange={(e) => setNewGoal(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && addItem('careerGoals', newGoal, setNewGoal)}
                                        placeholder="e.g., Senior Developer, Tech Lead"
                                        className="flex-1 px-3 py-2 rounded-lg border border-border bg-background text-sm"
                                    />
                                    <Button size="sm" onClick={() => addItem('careerGoals', newGoal, setNewGoal)}>
                                        <Plus className="w-4 h-4" />
                                    </Button>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {profile.careerGoals.map((item, idx) => (
                                        <span key={idx} className="px-3 py-1 bg-cyan-500/10 text-cyan-600 rounded-full text-sm flex items-center gap-2">
                                            {item}
                                            <button onClick={() => removeItem('careerGoals', idx)} className="hover:text-red-500">
                                                <Trash2 className="w-3 h-3" />
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Save Button (Mobile) */}
            <div className="mt-8 lg:hidden">
                <Button className="w-full" onClick={handleSave} disabled={saving}>
                    {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                    Save Profile
                </Button>
            </div>
        </DashboardLayout>
    );
}

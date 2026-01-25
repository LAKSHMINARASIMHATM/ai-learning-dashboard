'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
import { auth, googleProvider, githubProvider, microsoftProvider } from '@/lib/firebase';
import { signInWithPopup, signInWithEmailAndPassword } from 'firebase/auth';
import { toast } from 'sonner';
import { Github, Mail, Lock, ArrowRight, ShieldCheck, Zap, Globe } from 'lucide-react';

import { ModeToggle } from '@/components/mode-toggle';

export default function LoginPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [loading, setLoading] = useState(false);

    const handleFirebaseLogin = async (provider: any) => {
        setLoading(true);
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            const idToken = await user.getIdToken();

            // Here you would typically send the idToken to your backend to verify and create a session
            // For now, we'll simulate a successful login
            toast.success(`Welcome ${user.displayName || 'back'}!`);

            // Store minimal user info
            localStorage.setItem('user', JSON.stringify({
                name: user.displayName,
                email: user.email,
                avatar: user.photoURL
            }));

            router.push('/');
        } catch (error: any) {
            console.error('Firebase Auth Error:', error);
            toast.error(error.message || 'Authentication failed');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Try Firebase Email/Password login first
            try {
                await signInWithEmailAndPassword(auth, formData.email, formData.password);
            } catch (fbError) {
                console.warn('Firebase email login failed, falling back to legacy API:', fbError);
            }

            const result = await api.login(formData.email, formData.password);

            if (!result.success || !result.data) {
                throw new Error(result.error || 'Login failed');
            }

            localStorage.setItem('user', JSON.stringify(result.data.user));
            toast.success('Welcome back!');
            router.push('/');
        } catch (err: any) {
            toast.error(err.message || 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col md:flex-row bg-background">
            {/* Left Side - Hero Section */}
            <div className="hidden md:flex md:w-1/2 relative overflow-hidden bg-[#101622] p-12 flex-col justify-between text-white">
                {/* Background Image with Overlay */}
                <div
                    className="absolute inset-0 z-0 opacity-40 bg-cover bg-center grayscale"
                    style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=2022&auto=format&fit=crop")' }}
                />
                <div className="absolute inset-0 z-1 bg-gradient-to-b from-transparent to-[#101622]/90" />

                {/* Logo */}
                <div className="relative z-10 flex items-center gap-3">
                    <div className="bg-[#059669] p-2 rounded-lg">
                        <Zap className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-2xl font-bold tracking-tight">Learn<span className="text-[#059669]">HUB</span></span>
                </div>

                {/* Content */}
                <div className="relative z-10 max-w-lg">
                    <h1 className="text-6xl font-black mb-6 leading-[1.1]">
                        LEARNING<br />
                        <span className="text-[#059669]">REIMAGINED.</span>
                    </h1>
                    <p className="text-xl text-slate-300 font-medium leading-relaxed mb-12">
                        Join thousands of thrifty futurists automating their savings through AI-driven Learning paths.
                    </p>

                    <div className="grid grid-cols-2 gap-8">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-white/10 rounded-lg">
                                <ShieldCheck className="w-5 h-5 text-[#059669]" />
                            </div>
                            <span className="font-bold text-sm tracking-wider uppercase">Secure Data</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-white/10 rounded-lg">
                                <Zap className="w-5 h-5 text-[#059669]" />
                            </div>
                            <span className="font-bold text-sm tracking-wider uppercase">Instant Learning</span>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="relative z-10 flex items-center gap-2 text-slate-400 text-sm font-medium">
                    <Globe className="w-4 h-4" />
                    <span>Global Financial Standards 2025</span>
                </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="flex-1 flex items-center justify-center p-8 bg-white dark:bg-slate-950 relative">
                <div className="absolute top-4 right-4">
                    <ModeToggle />
                </div>
                <div className="w-full max-w-md space-y-8">
                    {/* Header */}
                    <div className="text-center md:text-left">
                        <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-2">Welcome Back</h2>
                        <p className="text-slate-500 dark:text-slate-400 font-medium">
                            Enter your details to access your dashboard
                        </p>
                    </div>

                    {/* Social Logins */}
                    <div className="space-y-3">
                        <button
                            onClick={() => handleFirebaseLogin(googleProvider)}
                            disabled={loading}
                            className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-900 transition-all font-bold text-slate-700 dark:text-slate-200"
                        >
                            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5" alt="Google" />
                            Continue with Google
                        </button>
                        <button
                            onClick={() => handleFirebaseLogin(githubProvider)}
                            disabled={loading}
                            className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-[#181717] hover:bg-[#181717]/90 text-white rounded-xl transition-all font-bold"
                        >
                            <Github className="w-5 h-5" />
                            Continue with GitHub
                        </button>
                        <button
                            onClick={() => handleFirebaseLogin(microsoftProvider)}
                            disabled={loading}
                            className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-900 transition-all font-bold text-slate-700 dark:text-slate-200"
                        >
                            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/microsoft.svg" className="w-5 h-5" alt="Microsoft" />
                            Continue with Microsoft
                        </button>
                    </div>

                    {/* Divider */}
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-slate-200 dark:border-slate-800"></div>
                        </div>
                        <div className="relative flex justify-center text-xs uppercase font-black tracking-widest">
                            <span className="px-4 bg-white dark:bg-slate-950 text-slate-400">OR</span>
                        </div>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-slate-400">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full pl-12 pr-4 py-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 focus:ring-2 focus:ring-[#059669] focus:border-transparent transition-all outline-none font-medium"
                                    placeholder="thrifty@example.com"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-slate-400">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type="password"
                                    required
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="w-full pl-12 pr-4 py-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 focus:ring-2 focus:ring-[#059669] focus:border-transparent transition-all outline-none font-medium"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 px-6 bg-[#059669] hover:bg-[#059669]/90 text-white font-black rounded-xl shadow-lg shadow-[#059669]/20 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
                        >
                            {loading ? 'Processing...' : (
                                <>
                                    Sign In <ArrowRight className="w-5 h-5" />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Footer */}
                    <p className="text-center text-slate-500 dark:text-slate-400 font-bold">
                        Don't have an account? <Link href="/signup" className="text-[#059669] hover:underline">Sign Up</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import {
    auth,
    googleProvider,
    signInWithPopup,
    signInWithEmailAndPassword,
    RecaptchaVerifier,
    signInWithPhoneNumber,
} from '@/lib/firebase';

type Tab = 'email' | 'phone';

declare global {
    interface Window { recaptchaVerifier: RecaptchaVerifier }
}

export default function LoginPage() {
    const [tab, setTab] = useState<Tab>('email');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState('');
    const [confirmationResult, setConfirmationResult] = useState<any>(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const recaptchaRef = useRef<HTMLDivElement>(null);
    const router = useRouter();
    const { user } = useAuth();

    useEffect(() => {
        if (user) {
            router.push(user.isAdmin ? '/admin/dashboard' : '/');
        }
    }, [user, router]);

    const handleEmailLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await signInWithEmailAndPassword(auth, email, password);
            // AuthContext onAuthStateChanged will handle redirect
        } catch (err: any) {
            setError(err.message || 'Invalid email or password');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setError('');
        setLoading(true);
        try {
            await signInWithPopup(auth, googleProvider);
        } catch (err: any) {
            setError(err.message || 'Google sign-in failed');
        } finally {
            setLoading(false);
        }
    };

    const setupRecaptcha = () => {
        if (!window.recaptchaVerifier) {
            window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
                size: 'invisible',
                callback: () => { },
            });
        }
    };

    const sendOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            setupRecaptcha();
            const result = await signInWithPhoneNumber(auth, phone, window.recaptchaVerifier);
            setConfirmationResult(result);
        } catch (err: any) {
            setError(err.message || 'Failed to send OTP');
        } finally {
            setLoading(false);
        }
    };

    const verifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await confirmationResult.confirm(otp);
        } catch (err: any) {
            setError(err.message || 'Invalid OTP');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center bg-rosewood-bg px-4">
            <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
                <h2 className="text-3xl font-serif text-center text-rosewood-primary mb-6">Welcome Back</h2>

                {/* Google Button */}
                <button
                    onClick={handleGoogleLogin}
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-3 border border-gray-300 rounded py-2.5 mb-6 hover:bg-gray-50 transition-colors font-medium text-gray-700"
                >
                    <GoogleIcon />
                    Continue with Google
                </button>

                <div className="flex items-center gap-3 mb-6">
                    <div className="flex-1 h-px bg-gray-200" />
                    <span className="text-sm text-gray-400">or</span>
                    <div className="flex-1 h-px bg-gray-200" />
                </div>

                {/* Tabs */}
                <div className="flex border border-gray-200 rounded mb-6 overflow-hidden">
                    {(['email', 'phone'] as Tab[]).map((t) => (
                        <button
                            key={t}
                            onClick={() => { setTab(t); setError(''); setConfirmationResult(null); }}
                            className={`flex-1 py-2 text-sm font-medium transition-colors ${tab === t ? 'bg-rosewood-primary text-white' : 'text-gray-500 hover:bg-gray-50'}`}
                        >
                            {t === 'email' ? 'Email' : 'Phone'}
                        </button>
                    ))}
                </div>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-sm">{error}</div>
                )}

                {/* Email form */}
                {tab === 'email' && (
                    <form onSubmit={handleEmailLogin} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-rosewood-muted mb-1">Email</label>
                            <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-rosewood-accent outline-none"
                                placeholder="your@email.com" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-rosewood-muted mb-1">Password</label>
                            <input type="password" required value={password} onChange={e => setPassword(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-rosewood-accent outline-none"
                                placeholder="••••••••" />
                        </div>
                        <button type="submit" disabled={loading}
                            className="w-full bg-rosewood-primary text-white py-3 rounded font-semibold hover:bg-rosewood-secondary transition-colors disabled:opacity-60">
                            {loading ? 'Signing in…' : 'Sign In'}
                        </button>
                    </form>
                )}

                {/* Phone form */}
                {tab === 'phone' && (
                    <form onSubmit={confirmationResult ? verifyOtp : sendOtp} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-rosewood-muted mb-1">Phone Number</label>
                            <input type="tel" required value={phone} onChange={e => setPhone(e.target.value)}
                                disabled={!!confirmationResult}
                                className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-rosewood-accent outline-none disabled:bg-gray-100"
                                placeholder="+91 9876543210" />
                        </div>
                        {confirmationResult && (
                            <div>
                                <label className="block text-sm font-medium text-rosewood-muted mb-1">OTP Code</label>
                                <input type="text" required value={otp} onChange={e => setOtp(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-rosewood-accent outline-none"
                                    placeholder="6-digit code" maxLength={6} />
                            </div>
                        )}
                        <div id="recaptcha-container" />
                        <button type="submit" disabled={loading}
                            className="w-full bg-rosewood-primary text-white py-3 rounded font-semibold hover:bg-rosewood-secondary transition-colors disabled:opacity-60">
                            {loading ? 'Please wait…' : confirmationResult ? 'Verify OTP' : 'Send OTP'}
                        </button>
                    </form>
                )}

                <p className="mt-6 text-center text-sm text-gray-500">
                    Don&apos;t have an account?{' '}
                    <Link href="/register" className="text-rosewood-accent hover:underline">Register</Link>
                </p>
            </div>
        </div>
    );
}

function GoogleIcon() {
    return (
        <svg width="18" height="18" viewBox="0 0 48 48">
            <path fill="#FFC107" d="M43.6 20.1H42V20H24v8h11.3C33.7 32.7 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 7.9 3l5.7-5.7C34 6.5 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-3.9z" />
            <path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.6 15.1 18.9 12 24 12c3.1 0 5.8 1.1 7.9 3l5.7-5.7C34 6.5 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
            <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.3 35.3 26.8 36 24 36c-5.2 0-9.6-3.3-11.3-8H6.4C9.8 36.5 16.4 44 24 44z" />
            <path fill="#1976D2" d="M43.6 20.1H42V20H24v8h11.3c-.8 2.3-2.4 4.2-4.4 5.5l6.2 5.2C36.6 40.1 44 34.9 44 24c0-1.3-.1-2.7-.4-3.9z" />
        </svg>
    );
}

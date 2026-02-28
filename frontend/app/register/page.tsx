'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
    auth,
    googleProvider,
    signInWithPopup,
    createUserWithEmailAndPassword,
    updateProfile,
} from '@/lib/firebase';

export default function RegisterPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { user } = useAuth();

    useEffect(() => {
        if (user) {
            router.push(user.isAdmin ? '/admin/dashboard' : '/');
        }
    }, [user, router]);

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (password !== confirm) {
            setError('Passwords do not match');
            return;
        }
        setLoading(true);
        try {
            const result = await createUserWithEmailAndPassword(auth, email, password);
            // Set display name in Firebase
            await updateProfile(result.user, { displayName: name });
            // AuthContext will sync with backend on onAuthStateChanged
        } catch (err: any) {
            setError(err.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleRegister = async () => {
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

    return (
        <div className="min-h-[80vh] flex items-center justify-center bg-rosewood-bg px-4">
            <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
                <h2 className="text-3xl font-serif text-center text-rosewood-primary mb-6">Create Account</h2>

                {/* Google Button */}
                <button
                    onClick={handleGoogleRegister}
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-3 border border-gray-300 rounded py-2.5 mb-6 hover:bg-gray-50 transition-colors font-medium text-gray-700"
                >
                    <GoogleIcon />
                    Continue with Google
                </button>

                <div className="flex items-center gap-3 mb-6">
                    <div className="flex-1 h-px bg-gray-200" />
                    <span className="text-sm text-gray-400">or register with email</span>
                    <div className="flex-1 h-px bg-gray-200" />
                </div>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-sm">{error}</div>
                )}

                <form onSubmit={handleRegister} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-rosewood-muted mb-1">Full Name</label>
                        <input type="text" required value={name} onChange={e => setName(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-rosewood-accent outline-none"
                            placeholder="John Doe" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-rosewood-muted mb-1">Email</label>
                        <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-rosewood-accent outline-none"
                            placeholder="john@example.com" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-rosewood-muted mb-1">Password</label>
                        <input type="password" required minLength={6} value={password} onChange={e => setPassword(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-rosewood-accent outline-none"
                            placeholder="min. 6 characters" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-rosewood-muted mb-1">Confirm Password</label>
                        <input type="password" required value={confirm} onChange={e => setConfirm(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-rosewood-accent outline-none"
                            placeholder="••••••••" />
                    </div>
                    <button type="submit" disabled={loading}
                        className="w-full bg-rosewood-primary text-white py-3 rounded font-semibold hover:bg-rosewood-secondary transition-colors disabled:opacity-60">
                        {loading ? 'Creating account…' : 'Register'}
                    </button>
                </form>

                <p className="mt-6 text-center text-sm text-gray-500">
                    Already have an account?{' '}
                    <Link href="/login" className="text-rosewood-accent hover:underline">Sign In</Link>
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

'use client';

import {
    createContext, useContext, useState,
    useEffect, ReactNode, useCallback,
} from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { auth, signOut } from '@/lib/firebase';
import api from '@/lib/api';

interface AppUser {
    uid: string;
    name: string | null;
    email: string | null;
    isAdmin: boolean;
    photoURL?: string | null;
}

interface AuthContextType {
    user: AppUser | null;
    loading: boolean;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<AppUser | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const syncWithBackend = useCallback(async (firebaseUser: FirebaseUser) => {
        try {
            // Get fresh ID token and sync with our backend to get isAdmin flag
            const idToken = await firebaseUser.getIdToken();
            const { data } = await api.post('/api/auth/sync', {
                name: firebaseUser.displayName,
                email: firebaseUser.email,
            }, {
                headers: { Authorization: `Bearer ${idToken}` },
            });
            setUser({
                uid: firebaseUser.uid,
                name: data.name || firebaseUser.displayName,
                email: firebaseUser.email,
                isAdmin: data.isAdmin ?? false,
                photoURL: firebaseUser.photoURL,
            });
        } catch (err) {
            console.error('Backend sync failed:', err);
            // Still set basic user info even if backend sync fails
            setUser({
                uid: firebaseUser.uid,
                name: firebaseUser.displayName,
                email: firebaseUser.email,
                isAdmin: false,
                photoURL: firebaseUser.photoURL,
            });
        }
    }, []);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                await syncWithBackend(firebaseUser);
            } else {
                setUser(null);
            }
            setLoading(false);
        });
        return () => unsubscribe();
    }, [syncWithBackend]);

    const logout = async () => {
        await signOut(auth);
        setUser(null);
        router.push('/login');
    };

    return (
        <AuthContext.Provider value={{ user, loading, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) throw new Error('useAuth must be used within an AuthProvider');
    return context;
};

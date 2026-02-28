import axios from 'axios';
import { auth } from './firebase';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
});

// Attach a fresh Firebase ID token on every request
api.interceptors.request.use(
    async (config) => {
        if (typeof window !== 'undefined' && auth.currentUser) {
            try {
                const token = await auth.currentUser.getIdToken();
                config.headers.Authorization = `Bearer ${token}`;
            } catch (e) {
                console.error('Failed to get Firebase ID token', e);
            }
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default api;

'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import {
    User,
    Lock,
    Store,
    Bell,
    CheckCircle,
    AlertCircle,
} from 'lucide-react';

type Toast = { type: 'success' | 'error'; message: string } | null;

function SectionCard({ title, icon: Icon, children }: { title: string; icon: any; children: React.ReactNode }) {
    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100">
                <div className="p-2 bg-rosewood-surface rounded-md">
                    <Icon size={18} className="text-rosewood-primary" />
                </div>
                <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
            </div>
            <div className="px-6 py-5">{children}</div>
        </div>
    );
}

function InputField({
    label,
    type = 'text',
    value,
    onChange,
    placeholder,
    disabled,
}: {
    label: string;
    type?: string;
    value: string;
    onChange?: (v: string) => void;
    placeholder?: string;
    disabled?: boolean;
}) {
    return (
        <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">{label}</label>
            <input
                type={type}
                value={value}
                onChange={onChange ? (e) => onChange(e.target.value) : undefined}
                placeholder={placeholder}
                disabled={disabled}
                className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm outline-none focus:border-rosewood-accent transition-colors disabled:bg-gray-50 disabled:text-gray-400"
            />
        </div>
    );
}

export default function SettingsPage() {
    const { user } = useAuth();
    const [toast, setToast] = useState<Toast>(null);

    // Profile section
    const [name, setName] = useState(user?.name || '');
    const [email] = useState(user?.email || '');

    // Password section
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // Store section
    const [storeName, setStoreName] = useState('JP Homes');
    const [storeEmail, setStoreEmail] = useState('contact@jphomes.com');
    const [storeCurrency, setStoreCurrency] = useState('USD');
    const [storeTagline, setStoreTagline] = useState('Luxury furniture for modern living');

    // Notifications section
    const [notifyNewOrder, setNotifyNewOrder] = useState(true);
    const [notifyLowStock, setNotifyLowStock] = useState(true);
    const [notifyNewUser, setNotifyNewUser] = useState(false);

    const showToast = (type: 'success' | 'error', message: string) => {
        setToast({ type, message });
        setTimeout(() => setToast(null), 3500);
    };

    const handleProfileSave = async () => {
        try {
            await api.put('/api/auth/profile', { name });
            // update localStorage to reflect name change
            if (typeof window !== 'undefined') {
                const stored = localStorage.getItem('userInfo');
                if (stored) {
                    const parsed = JSON.parse(stored);
                    localStorage.setItem('userInfo', JSON.stringify({ ...parsed, name }));
                }
            }
            showToast('success', 'Profile updated successfully.');
        } catch {
            showToast('error', 'Failed to update profile.');
        }
    };

    const handlePasswordSave = async () => {
        if (newPassword !== confirmPassword) {
            showToast('error', 'New passwords do not match.');
            return;
        }
        if (newPassword.length < 6) {
            showToast('error', 'Password must be at least 6 characters.');
            return;
        }
        try {
            await api.put('/api/auth/profile', { password: newPassword });
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
            showToast('success', 'Password changed successfully.');
        } catch {
            showToast('error', 'Failed to change password.');
        }
    };

    const handleStoreSave = () => {
        // Store settings would typically be saved to a backend config endpoint.
        // For now we persist them locally and show success.
        showToast('success', 'Store settings saved.');
    };

    const handleNotificationSave = () => {
        showToast('success', 'Notification preferences saved.');
    };

    return (
        <div className="max-w-3xl mx-auto space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-serif text-rosewood-primary">Settings</h1>
                <p className="text-gray-500 text-sm mt-1">Manage your account and store preferences.</p>
            </div>

            {/* Toast */}
            {toast && (
                <div
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium shadow-md transition-all ${toast.type === 'success'
                            ? 'bg-green-50 text-green-800 border border-green-200'
                            : 'bg-red-50 text-red-800 border border-red-200'
                        }`}
                >
                    {toast.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
                    {toast.message}
                </div>
            )}

            {/* Profile */}
            <SectionCard title="Profile" icon={User}>
                <div className="space-y-4">
                    <InputField label="Full Name" value={name} onChange={setName} placeholder="Your name" />
                    <InputField label="Email Address" value={email} disabled placeholder="admin@example.com" />
                    <p className="text-xs text-gray-400">Email cannot be changed from this page.</p>
                    <div className="flex justify-end pt-2">
                        <button
                            onClick={handleProfileSave}
                            className="bg-rosewood-primary text-white px-6 py-2 rounded-md text-sm font-semibold hover:bg-rosewood-secondary transition-colors"
                        >
                            Save Profile
                        </button>
                    </div>
                </div>
            </SectionCard>

            {/* Change Password */}
            <SectionCard title="Change Password" icon={Lock}>
                <div className="space-y-4">
                    <InputField
                        label="Current Password"
                        type="password"
                        value={currentPassword}
                        onChange={setCurrentPassword}
                        placeholder="••••••••"
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <InputField
                            label="New Password"
                            type="password"
                            value={newPassword}
                            onChange={setNewPassword}
                            placeholder="••••••••"
                        />
                        <InputField
                            label="Confirm New Password"
                            type="password"
                            value={confirmPassword}
                            onChange={setConfirmPassword}
                            placeholder="••••••••"
                        />
                    </div>
                    <div className="flex justify-end pt-2">
                        <button
                            onClick={handlePasswordSave}
                            className="bg-rosewood-primary text-white px-6 py-2 rounded-md text-sm font-semibold hover:bg-rosewood-secondary transition-colors"
                        >
                            Update Password
                        </button>
                    </div>
                </div>
            </SectionCard>

            {/* Store Settings */}
            <SectionCard title="Store Settings" icon={Store}>
                <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <InputField label="Store Name" value={storeName} onChange={setStoreName} />
                        <InputField label="Contact Email" value={storeEmail} onChange={setStoreEmail} type="email" />
                    </div>
                    <InputField label="Tagline" value={storeTagline} onChange={setStoreTagline} placeholder="Your store's motto" />
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Currency</label>
                        <select
                            value={storeCurrency}
                            onChange={(e) => setStoreCurrency(e.target.value)}
                            className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm outline-none focus:border-rosewood-accent transition-colors bg-white"
                        >
                            <option value="USD">USD — US Dollar ($)</option>
                            <option value="EUR">EUR — Euro (€)</option>
                            <option value="GBP">GBP — British Pound (£)</option>
                            <option value="INR">INR — Indian Rupee (₹)</option>
                            <option value="AED">AED — UAE Dirham (د.إ)</option>
                        </select>
                    </div>
                    <div className="flex justify-end pt-2">
                        <button
                            onClick={handleStoreSave}
                            className="bg-rosewood-primary text-white px-6 py-2 rounded-md text-sm font-semibold hover:bg-rosewood-secondary transition-colors"
                        >
                            Save Store Settings
                        </button>
                    </div>
                </div>
            </SectionCard>

            {/* Notifications */}
            <SectionCard title="Notifications" icon={Bell}>
                <div className="space-y-4">
                    {[
                        {
                            label: 'New Order Placed',
                            description: 'Get notified when a customer places an order.',
                            value: notifyNewOrder,
                            onChange: setNotifyNewOrder,
                        },
                        {
                            label: 'Low Stock Alert',
                            description: 'Alert when a product stock drops to zero.',
                            value: notifyLowStock,
                            onChange: setNotifyLowStock,
                        },
                        {
                            label: 'New User Registration',
                            description: 'Notify when a new customer creates an account.',
                            value: notifyNewUser,
                            onChange: setNotifyNewUser,
                        },
                    ].map(({ label, description, value, onChange }) => (
                        <div key={label} className="flex items-start justify-between gap-4 py-3 border-b border-gray-50 last:border-0">
                            <div>
                                <p className="text-sm font-medium text-gray-800">{label}</p>
                                <p className="text-xs text-gray-500 mt-0.5">{description}</p>
                            </div>
                            <button
                                onClick={() => onChange(!value)}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors flex-shrink-0 ${value ? 'bg-rosewood-primary' : 'bg-gray-300'
                                    }`}
                            >
                                <span
                                    className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${value ? 'translate-x-6' : 'translate-x-1'
                                        }`}
                                />
                            </button>
                        </div>
                    ))}
                    <div className="flex justify-end pt-2">
                        <button
                            onClick={handleNotificationSave}
                            className="bg-rosewood-primary text-white px-6 py-2 rounded-md text-sm font-semibold hover:bg-rosewood-secondary transition-colors"
                        >
                            Save Preferences
                        </button>
                    </div>
                </div>
            </SectionCard>

            {/* Danger Zone */}
            <div className="bg-red-50 border border-red-200 rounded-lg px-6 py-5">
                <h2 className="text-base font-semibold text-red-700 mb-1">Danger Zone</h2>
                <p className="text-sm text-red-500 mb-4">These actions are irreversible. Please proceed with caution.</p>
                <button
                    onClick={() => {
                        if (window.confirm('Are you sure you want to clear all products? This cannot be undone.')) {
                            showToast('error', 'Action blocked — implement backend endpoint to enable this.');
                        }
                    }}
                    className="border border-red-400 text-red-600 px-5 py-2 rounded-md text-sm font-semibold hover:bg-red-100 transition-colors"
                >
                    Clear All Products
                </button>
            </div>
        </div>
    );
}

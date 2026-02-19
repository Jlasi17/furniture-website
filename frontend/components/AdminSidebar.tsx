'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Package, ShoppingBag, Settings, LogOut } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const AdminSidebar = () => {
    const pathname = usePathname();
    const { logout } = useAuth();

    const links = [
        { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
        { name: 'Products', href: '/admin/products', icon: Package },
        { name: 'Orders', href: '/admin/orders', icon: ShoppingBag }, // Placeholder
        { name: 'Settings', href: '/admin/settings', icon: Settings }, // Placeholder
    ];

    return (
        <div className="w-64 bg-rosewood-primary text-rosewood-surface min-h-screen flex flex-col">
            <div className="p-6">
                <h2 className="text-2xl font-serif font-bold">JP Homes Admin</h2>
            </div>
            <nav className="flex-1 px-4 space-y-2">
                {links.map((link) => {
                    const Icon = link.icon;
                    const isActive = pathname === link.href || pathname.startsWith(link.href + '/');
                    return (
                        <Link
                            key={link.name}
                            href={link.href}
                            className={`flex items-center space-x-3 px-4 py-3 rounded transition-colors ${isActive ? 'bg-rosewood-accent text-rosewood-primary font-semibold' : 'hover:bg-rosewood-secondary'}`}
                        >
                            <Icon size={20} />
                            <span>{link.name}</span>
                        </Link>
                    );
                })}
            </nav>
            <div className="p-4 border-t border-rosewood-secondary">
                <button
                    onClick={logout}
                    className="flex items-center space-x-3 px-4 py-3 w-full text-left text-red-300 hover:text-red-100 hover:bg-rosewood-secondary rounded transition-colors"
                >
                    <LogOut size={20} />
                    <span>Logout</span>
                </button>
            </div>
        </div>
    );
};

export default AdminSidebar;

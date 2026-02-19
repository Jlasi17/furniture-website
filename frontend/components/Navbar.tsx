'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { ShoppingCart, LogOut, User as UserIcon, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
    const { user, logout } = useAuth();
    const { totalItems } = useCart();
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="bg-rosewood-primary text-rosewood-surface shadow-md sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    {/* Logo */}
                    <Link href="/" className="font-serif text-2xl font-bold tracking-wider">
                        JP HOMES
                    </Link>

                    {/* Desktop Links */}
                    <div className="hidden md:flex space-x-8 items-center">
                        <Link href="/" className="hover:text-rosewood-accent transition-colors">Home</Link>
                        <Link href="/shop" className="hover:text-rosewood-accent transition-colors">Shop</Link>
                        <Link href="/about" className="hover:text-rosewood-accent transition-colors">About</Link>

                        {user ? (
                            <div className="flex items-center space-x-4 ml-4">
                                <span className="text-sm opacity-80">Hello, {user.name}</span>
                                {user.isAdmin && (
                                    <Link href="/admin/dashboard" className="text-rosewood-accent border border-rosewood-accent px-3 py-1 rounded hover:bg-rosewood-accent hover:text-rosewood-primary transition-colors">
                                        Dashboard
                                    </Link>
                                )}
                                <button onClick={logout} className="hover:text-red-400" title="Logout">
                                    <LogOut size={20} />
                                </button>
                            </div>
                        ) : (
                            <Link href="/login" className="flex items-center space-x-1 hover:text-rosewood-accent">
                                <UserIcon size={20} />
                                <span>Login</span>
                            </Link>
                        )}

                        {/* Cart Icon with live badge */}
                        <Link href="/cart" className="hover:text-rosewood-accent relative">
                            <ShoppingCart size={22} />
                            {totalItems > 0 && (
                                <span className="absolute -top-2 -right-2 bg-rosewood-accent text-rosewood-primary text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                                    {totalItems > 99 ? '99+' : totalItems}
                                </span>
                            )}
                        </Link>
                    </div>

                    {/* Mobile: cart + hamburger */}
                    <div className="md:hidden flex items-center gap-4">
                        <Link href="/cart" className="relative">
                            <ShoppingCart size={22} />
                            {totalItems > 0 && (
                                <span className="absolute -top-2 -right-2 bg-rosewood-accent text-rosewood-primary text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                                    {totalItems}
                                </span>
                            )}
                        </Link>
                        <button onClick={() => setIsOpen(!isOpen)} className="text-rosewood-surface">
                            {isOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-rosewood-secondary"
                    >
                        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                            <Link href="/" className="block px-3 py-2 rounded-md hover:bg-rosewood-primary" onClick={() => setIsOpen(false)}>Home</Link>
                            <Link href="/shop" className="block px-3 py-2 rounded-md hover:bg-rosewood-primary" onClick={() => setIsOpen(false)}>Shop</Link>
                            <Link href="/cart" className="block px-3 py-2 rounded-md hover:bg-rosewood-primary" onClick={() => setIsOpen(false)}>Cart {totalItems > 0 && `(${totalItems})`}</Link>
                            {user ? (
                                <>
                                    {user.isAdmin && (
                                        <Link href="/admin/dashboard" className="block px-3 py-2 text-rosewood-accent" onClick={() => setIsOpen(false)}>Admin Dashboard</Link>
                                    )}
                                    <button onClick={logout} className="block w-full text-left px-3 py-2 text-red-300">Logout</button>
                                </>
                            ) : (
                                <Link href="/login" className="block px-3 py-2" onClick={() => setIsOpen(false)}>Login</Link>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;

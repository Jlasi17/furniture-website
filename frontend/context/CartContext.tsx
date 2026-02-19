'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface CartItem {
    _id: string;
    name: string;
    image: string;
    price: number;
    quantity: number;
    countInStock: number;
}

interface CartContextType {
    cartItems: CartItem[];
    addToCart: (item: CartItem) => void;
    removeFromCart: (id: string) => void;
    updateQuantity: (id: string, qty: number) => void;
    clearCart: () => void;
    totalItems: number;
    totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);

    // Load from localStorage on mount
    useEffect(() => {
        const stored = localStorage.getItem('cartItems');
        if (stored) {
            try {
                setCartItems(JSON.parse(stored));
            } catch {
                localStorage.removeItem('cartItems');
            }
        }
    }, []);

    // Persist to localStorage on change
    useEffect(() => {
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }, [cartItems]);

    const addToCart = (item: CartItem) => {
        setCartItems((prev) => {
            const existing = prev.find((x) => x._id === item._id);
            if (existing) {
                // Increase quantity, cap at countInStock
                return prev.map((x) =>
                    x._id === item._id
                        ? { ...x, quantity: Math.min(x.quantity + item.quantity, item.countInStock) }
                        : x
                );
            }
            return [...prev, item];
        });
    };

    const removeFromCart = (id: string) => {
        setCartItems((prev) => prev.filter((x) => x._id !== id));
    };

    const updateQuantity = (id: string, qty: number) => {
        setCartItems((prev) =>
            prev.map((x) => (x._id === id ? { ...x, quantity: qty } : x))
        );
    };

    const clearCart = () => setCartItems([]);

    const totalItems = cartItems.reduce((sum, x) => sum + x.quantity, 0);
    const totalPrice = cartItems.reduce((sum, x) => sum + x.price * x.quantity, 0);

    return (
        <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart, totalItems, totalPrice }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const ctx = useContext(CartContext);
    if (!ctx) throw new Error('useCart must be used within CartProvider');
    return ctx;
};

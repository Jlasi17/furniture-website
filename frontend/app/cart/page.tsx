'use client';

import { useCart } from '@/context/CartContext';
import Link from 'next/link';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export default function CartPage() {
    const { cartItems, removeFromCart, updateQuantity, clearCart, totalItems, totalPrice } = useCart();

    if (cartItems.length === 0) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
                <ShoppingBag size={64} className="text-gray-300 mb-4" />
                <h2 className="text-2xl font-serif text-rosewood-primary mb-2">Your cart is empty</h2>
                <p className="text-rosewood-muted mb-6">Looks like you haven't added anything yet.</p>
                <Link
                    href="/shop"
                    className="bg-rosewood-primary text-white px-6 py-3 rounded font-semibold hover:bg-rosewood-secondary transition-colors"
                >
                    Browse Products
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto px-4 py-12">
            <h1 className="text-3xl font-serif text-rosewood-primary mb-8">Your Cart ({totalItems} items)</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Cart Items */}
                <div className="lg:col-span-2 space-y-4">
                    {cartItems.map((item) => {
                        const imgSrc = item.image?.startsWith('http')
                            ? item.image
                            : `${API_URL}${item.image}`;

                        return (
                            <div key={item._id} className="flex gap-4 bg-white rounded-lg p-4 shadow-sm border border-gray-100">
                                <div className="w-24 h-24 rounded overflow-hidden flex-shrink-0 bg-gray-100">
                                    <img src={imgSrc} alt={item.name} className="w-full h-full object-cover" />
                                </div>

                                <div className="flex-1 min-w-0">
                                    <h3 className="font-semibold text-rosewood-text truncate">{item.name}</h3>
                                    <p className="text-rosewood-accent font-bold mt-1">${item.price.toFixed(2)}</p>

                                    {/* Quantity Controls */}
                                    <div className="flex items-center gap-2 mt-3">
                                        <button
                                            onClick={() => item.quantity > 1 ? updateQuantity(item._id, item.quantity - 1) : removeFromCart(item._id)}
                                            className="w-7 h-7 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-100 transition-colors"
                                        >
                                            <Minus size={14} />
                                        </button>
                                        <span className="w-8 text-center font-medium">{item.quantity}</span>
                                        <button
                                            onClick={() => item.quantity < item.countInStock && updateQuantity(item._id, item.quantity + 1)}
                                            disabled={item.quantity >= item.countInStock}
                                            className="w-7 h-7 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-100 transition-colors disabled:opacity-40"
                                        >
                                            <Plus size={14} />
                                        </button>
                                    </div>
                                </div>

                                <div className="flex flex-col items-end justify-between">
                                    <button
                                        onClick={() => removeFromCart(item._id)}
                                        className="text-gray-400 hover:text-red-500 transition-colors"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                    <p className="font-bold text-rosewood-primary">${(item.price * item.quantity).toFixed(2)}</p>
                                </div>
                            </div>
                        );
                    })}

                    <button
                        onClick={clearCart}
                        className="text-sm text-red-400 hover:text-red-600 underline transition-colors"
                    >
                        Clear cart
                    </button>
                </div>

                {/* Order Summary */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 sticky top-6">
                        <h2 className="text-xl font-serif text-rosewood-primary mb-4">Order Summary</h2>

                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between text-rosewood-text">
                                <span>Subtotal ({totalItems} items)</span>
                                <span>${totalPrice.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-rosewood-text">
                                <span>Shipping</span>
                                <span className="text-green-600">Free</span>
                            </div>
                            <div className="border-t pt-3 flex justify-between font-bold text-rosewood-primary text-base">
                                <span>Total</span>
                                <span>${totalPrice.toFixed(2)}</span>
                            </div>
                        </div>

                        <button className="w-full mt-6 bg-rosewood-primary text-white py-3 rounded font-semibold hover:bg-rosewood-secondary transition-colors">
                            Proceed to Checkout
                        </button>

                        <Link
                            href="/shop"
                            className="block text-center mt-3 text-sm text-rosewood-muted hover:text-rosewood-primary transition-colors"
                        >
                            ← Continue Shopping
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import ProductCard from '@/components/ProductCard';
import { Search } from 'lucide-react';

interface Product {
    _id: string;
    name: string;
    price: number;
    image: string;
    category: string;
    inStock: boolean;
}

export default function ShopPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [keyword, setKeyword] = useState('');

    // Filter states could be expanded here

    useEffect(() => {
        fetchProducts();
    }, [keyword]);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const { data } = await api.get(`/api/products?keyword=${keyword}`);
            setProducts(data.products);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        fetchProducts();
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row justify-between items-center mb-8">
                <h1 className="text-3xl font-serif text-rosewood-primary mb-4 md:mb-0">Shop Collection</h1>

                {/* Search Bar */}
                <form onSubmit={handleSearch} className="relative w-full md:w-64">
                    <input
                        type="text"
                        placeholder="Search furniture..."
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:border-rosewood-accent"
                    />
                    <button type="submit" className="absolute right-3 top-2.5 text-gray-400">
                        <Search size={18} />
                    </button>
                </form>
            </div>

            <div className="flex flex-col md:flex-row gap-8">
                {/* Sidebar Filters (Static for now) */}
                <div className="w-full md:w-64 space-y-8 hidden md:block">
                    <div>
                        <h3 className="font-semibold mb-4 text-rosewood-primary">Categories</h3>
                        <ul className="space-y-2 text-sm text-rosewood-muted">
                            <li className="cursor-pointer hover:text-rosewood-accent">All Products</li>
                            <li className="cursor-pointer hover:text-rosewood-accent">Living Room</li>
                            <li className="cursor-pointer hover:text-rosewood-accent">Dining Room</li>
                            <li className="cursor-pointer hover:text-rosewood-accent">Bedroom</li>
                            <li className="cursor-pointer hover:text-rosewood-accent">Office</li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-semibold mb-4 text-rosewood-primary">Price Range</h3>
                        <ul className="space-y-2 text-sm text-rosewood-muted">
                            <li className="cursor-pointer hover:text-rosewood-accent">Under $100</li>
                            <li className="cursor-pointer hover:text-rosewood-accent">$100 - $500</li>
                            <li className="cursor-pointer hover:text-rosewood-accent">$500 - $1000</li>
                            <li className="cursor-pointer hover:text-rosewood-accent">Over $1000</li>
                        </ul>
                    </div>
                </div>

                {/* Product Grid */}
                <div className="flex-1">
                    {loading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[1, 2, 3, 4, 5, 6].map(i => (
                                <div key={i} className="bg-gray-200 h-80 rounded animate-pulse"></div>
                            ))}
                        </div>
                    ) : products.length === 0 ? (
                        <div className="text-center py-20 text-gray-500">No products found.</div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {products.map(product => (
                                <ProductCard key={product._id} product={product} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

'use client';

import { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import api from '@/lib/api';
import ProductCard from '@/components/ProductCard';
import { Search, SlidersHorizontal, X } from 'lucide-react';

interface Product {
    _id: string;
    name: string;
    price: number;
    images?: string[];
    image?: string;
    category: string;
    inStock: boolean;
    countInStock?: number;
}

const CATEGORIES = ['All Products', 'Living Room', 'Dining Room', 'Bedroom', 'Office'];

const PRICE_RANGES = [
    { label: 'All Prices', min: 0, max: Infinity },
    { label: 'Under ₹100', min: 0, max: 100 },
    { label: '₹100 - ₹500', min: 100, max: 500 },
    { label: '₹500 - ₹1000', min: 500, max: 1000 },
    { label: 'Over ₹1000', min: 1000, max: Infinity },
];

// Inner component — allowed to use useSearchParams inside Suspense
function ShopContent() {
    const searchParams = useSearchParams();
    const categoryParam = searchParams.get('category') ?? '';

    const [allProducts, setAllProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [keyword, setKeyword] = useState('');
    const [searchInput, setSearchInput] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All Products');
    const [selectedPrice, setSelectedPrice] = useState(0);
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

    // Sync category from URL param whenever it changes
    useEffect(() => {
        if (categoryParam && CATEGORIES.includes(categoryParam)) {
            setSelectedCategory(categoryParam);
        } else {
            setSelectedCategory('All Products');
        }
    }, [categoryParam]);

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const { data } = await api.get(`/api/products?keyword=${keyword}&pageNumber=1`);
                setAllProducts(data.products);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, [keyword]);

    const filteredProducts = useMemo(() => {
        const range = PRICE_RANGES[selectedPrice];
        return allProducts.filter((p) => {
            const catMatch = selectedCategory === 'All Products' || p.category === selectedCategory;
            const priceMatch = p.price >= range.min && p.price < range.max;
            return catMatch && priceMatch;
        });
    }, [allProducts, selectedCategory, selectedPrice]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setKeyword(searchInput);
    };

    const clearFilters = () => {
        setSelectedCategory('All Products');
        setSelectedPrice(0);
        setSearchInput('');
        setKeyword('');
    };

    const isFiltered = selectedCategory !== 'All Products' || selectedPrice !== 0 || keyword !== '';

    const FilterPanel = () => (
        <div className="space-y-8">
            <div>
                <h3 className="font-semibold mb-4 text-rosewood-primary">Categories</h3>
                <ul className="space-y-2 text-sm">
                    {CATEGORIES.map((cat) => (
                        <li key={cat}>
                            <button
                                onClick={() => {
                                    setSelectedCategory(cat);
                                    setMobileFiltersOpen(false);
                                }}
                                className={`w-full text-left px-3 py-1.5 rounded transition-colors ${selectedCategory === cat
                                    ? 'bg-rosewood-primary text-white font-semibold'
                                    : 'text-rosewood-muted hover:text-rosewood-accent hover:bg-gray-50'
                                    }`}
                            >
                                {cat}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>

            <div>
                <h3 className="font-semibold mb-4 text-rosewood-primary">Price Range</h3>
                <ul className="space-y-2 text-sm">
                    {PRICE_RANGES.map((range, i) => (
                        <li key={range.label}>
                            <button
                                onClick={() => {
                                    setSelectedPrice(i);
                                    setMobileFiltersOpen(false);
                                }}
                                className={`w-full text-left px-3 py-1.5 rounded transition-colors ${selectedPrice === i
                                    ? 'bg-rosewood-primary text-white font-semibold'
                                    : 'text-rosewood-muted hover:text-rosewood-accent hover:bg-gray-50'
                                    }`}
                            >
                                {range.label}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>

            {isFiltered && (
                <button
                    onClick={clearFilters}
                    className="flex items-center gap-1 text-sm text-red-500 hover:text-red-700 transition-colors"
                >
                    <X size={14} /> Clear all filters
                </button>
            )}
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-serif text-rosewood-primary">Shop Collection</h1>
                    {!loading && (
                        <p className="text-sm text-gray-400 mt-1">
                            {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
                            {selectedCategory !== 'All Products' ? ` in ${selectedCategory}` : ''}
                        </p>
                    )}
                </div>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <button
                        className="md:hidden flex items-center gap-2 border border-gray-300 px-3 py-2 rounded text-sm text-rosewood-primary"
                        onClick={() => setMobileFiltersOpen(true)}
                    >
                        <SlidersHorizontal size={16} /> Filters
                        {isFiltered && (
                            <span className="bg-rosewood-primary text-white rounded-full text-xs w-4 h-4 flex items-center justify-center">!</span>
                        )}
                    </button>
                    <form onSubmit={handleSearch} className="relative flex-1 sm:w-64">
                        <input
                            type="text"
                            placeholder="Search furniture..."
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:border-rosewood-accent text-sm"
                        />
                        <button type="submit" className="absolute right-3 top-2.5 text-gray-400">
                            <Search size={16} />
                        </button>
                    </form>
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-8">
                <aside className="hidden md:block w-56 flex-shrink-0">
                    <FilterPanel />
                </aside>

                {mobileFiltersOpen && (
                    <div className="fixed inset-0 z-50 flex md:hidden">
                        <div className="absolute inset-0 bg-black/40" onClick={() => setMobileFiltersOpen(false)} />
                        <div className="relative bg-white w-72 h-full ml-auto p-6 overflow-y-auto">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="font-semibold text-rosewood-primary text-lg">Filters</h2>
                                <button onClick={() => setMobileFiltersOpen(false)}><X size={20} /></button>
                            </div>
                            <FilterPanel />
                        </div>
                    </div>
                )}

                <div className="flex-1">
                    {loading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[1, 2, 3, 4, 5, 6].map((i) => (
                                <div key={i} className="bg-gray-200 h-80 rounded animate-pulse" />
                            ))}
                        </div>
                    ) : filteredProducts.length === 0 ? (
                        <div className="text-center py-20 text-gray-400">
                            <p className="text-lg mb-2">No products found.</p>
                            {isFiltered && (
                                <button onClick={clearFilters} className="text-sm text-rosewood-accent underline">
                                    Clear filters
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredProducts.map((product) => (
                                <ProductCard key={product._id} product={product} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

// Outer page wraps inner component in Suspense — required by Next.js for useSearchParams
export default function ShopPage() {
    return (
        <Suspense fallback={
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-20">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="bg-gray-200 h-80 rounded animate-pulse" />
                    ))}
                </div>
            </div>
        }>
            <ShopContent />
        </Suspense>
    );
}

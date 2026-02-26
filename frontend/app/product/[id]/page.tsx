'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { useParams } from 'next/navigation';
import { ShoppingCart, Plus, Minus, Trash2 } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';
import BackButton from '@/components/BackButton';

interface ProductDetail {
    _id: string;
    name: string;
    description: string;
    price: number;
    category: string;
    material: string;
    color: string;
    size: { length: number; width: number; height: number };
    images: string[];
    inStock: boolean;
    countInStock: number;
}

export default function ProductDetailPage() {
    const { id } = useParams();
    const { addToCart, removeFromCart, cartItems } = useCart();
    const router = useRouter();
    const [product, setProduct] = useState<ProductDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeImage, setActiveImage] = useState('');
    const [qty, setQty] = useState(1);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const { data } = await api.get(`/api/products/${id}`);
                setProduct(data);
                // Handle images: if array, take first. if string, use it.
                if (Array.isArray(data.images) && data.images.length > 0) {
                    setActiveImage(data.images[0]);
                } else if (typeof data.image === 'string') {
                    setActiveImage(data.image);
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        if (id) fetchProduct();
    }, [id]);

    if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    if (!product) return <div className="min-h-screen flex items-center justify-center">Product not found.</div>;

    const imageUrl = activeImage.startsWith('http')
        ? activeImage
        : `${process.env.NEXT_PUBLIC_API_URL}${activeImage}`;

    return (
        <div className="max-w-7xl mx-auto px-4 py-12">
            <BackButton />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {/* Image Gallery */}
                <div>
                    <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4">
                        <img src={imageUrl} alt={product.name} className="w-full h-full object-cover" />
                    </div>
                    {/* Thumbnails (if multiple images exist) */}
                    {product.images && Array.isArray(product.images) && product.images.length > 1 && (
                        <div className="flex gap-4 overflow-x-auto pb-2">
                            {product.images.map((img, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setActiveImage(img)}
                                    className={`w-20 h-20 flex-shrink-0 rounded overflow-hidden border-2 ${activeImage === img ? 'border-rosewood-accent' : 'border-transparent'}`}
                                >
                                    <img
                                        src={img.startsWith('http') ? img : `${process.env.NEXT_PUBLIC_API_URL}${img}`}
                                        alt=""
                                        className="w-full h-full object-cover"
                                    />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Product Info */}
                <div>
                    <span className="text-sm text-rosewood-accent font-semibold tracking-wider uppercase">{product.category}</span>
                    <h1 className="text-4xl font-serif text-rosewood-primary mt-2 mb-4">{product.name}</h1>
                    <p className="text-3xl font-medium text-rosewood-secondary mb-6">₹{product.price}</p>

                    <p className="text-gray-600 mb-8 leading-relaxed">
                        {product.description}
                    </p>

                    <div className="grid grid-cols-2 gap-4 mb-8 text-sm">
                        <div>
                            <span className="block text-gray-500">Material</span>
                            <span className="font-semibold text-rosewood-primary">{product.material}</span>
                        </div>
                        <div>
                            <span className="block text-gray-500">Color</span>
                            <span className="font-semibold text-rosewood-primary">{product.color}</span>
                        </div>
                        <div>
                            <span className="block text-gray-500">Dimensions</span>
                            <span className="font-semibold text-rosewood-primary">
                                {product.size.length}"L x {product.size.width}"W x {product.size.height}"H
                            </span>
                        </div>
                        <div>
                            <span className="block text-gray-500">Stock Status</span>
                            <span className={`font-semibold ${product.inStock ? 'text-green-600' : 'text-red-500'}`}>
                                {product.inStock ? 'In Stock' : 'Out of Stock'}
                            </span>
                        </div>
                    </div>

                    {/* Quantity + Add to Cart */}
                    <div className="flex items-center gap-4 mb-4">
                        <div className="flex items-center border border-gray-300 rounded">
                            <button
                                onClick={() => setQty((q) => Math.max(1, q - 1))}
                                className="px-3 py-2 hover:bg-gray-100 transition-colors"
                            >
                                <Minus size={16} />
                            </button>
                            <span className="px-4 py-2 font-medium">{qty}</span>
                            <button
                                onClick={() => setQty((q) => Math.min(product.countInStock ?? 99, q + 1))}
                                className="px-3 py-2 hover:bg-gray-100 transition-colors"
                            >
                                <Plus size={16} />
                            </button>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-3 mt-4">
                        <button
                            className={`px-8 py-4 rounded font-semibold transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${cartItems.some((x) => x._id === product._id)
                                ? 'bg-green-600 text-white'
                                : 'bg-rosewood-primary text-white hover:bg-rosewood-secondary'
                                }`}
                            disabled={!product.inStock}
                            onClick={() => {
                                if (!product.inStock) return;
                                addToCart({
                                    _id: product._id,
                                    name: product.name,
                                    image: product.images?.[0] ?? '',
                                    price: product.price,
                                    quantity: qty,
                                    countInStock: product.countInStock ?? 99,
                                });
                            }}
                        >
                            <ShoppingCart size={20} />
                            {!product.inStock
                                ? 'Out of Stock'
                                : cartItems.some((x) => x._id === product._id)
                                    ? 'In Cart ✓'
                                    : 'Add to Cart'}
                        </button>

                        {cartItems.some((x) => x._id === product._id) && (
                            <button
                                onClick={() => removeFromCart(product._id)}
                                className="px-6 py-4 rounded font-semibold border border-red-300 text-red-500 hover:bg-red-50 transition-colors flex items-center gap-2"
                            >
                                <Trash2 size={18} /> Remove from Cart
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

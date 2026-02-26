'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useCart } from '@/context/CartContext';
import { ShoppingCart, CheckCircle2 } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

interface ProductProps {
    product: {
        _id: string;
        name: string;
        images?: string[];
        image?: string;
        price: number;
        category: string;
        inStock: boolean;
        countInStock?: number;
    };
}

const ProductCard = ({ product }: ProductProps) => {
    const { addToCart, cartItems } = useCart();

    const inCart = cartItems.some((x) => x._id === product._id);

    // Support both `images[]` (API) and `image` (legacy)
    const rawImage =
        (Array.isArray(product.images) && product.images.length > 0)
            ? product.images[0]
            : product.image ?? '';

    const imageUrl = rawImage.startsWith('http')
        ? rawImage
        : rawImage ? `${API_URL}${rawImage}` : '';

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        addToCart({
            _id: product._id,
            name: product.name,
            image: rawImage,
            price: product.price,
            quantity: 1,
            countInStock: product.countInStock ?? 99,
        });
    };

    return (
        <motion.div
            whileHover={{ y: -5 }}
            className="group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 relative"
        >
            <Link href={`/product/${product._id}`}>
                <div className="relative h-64 w-full bg-gray-100 overflow-hidden">
                    {imageUrl ? (
                        <img
                            src={imageUrl}
                            alt={product.name}
                            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300 text-sm">No image</div>
                    )}
                    {!product.inStock && (
                        <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                            Out of Stock
                        </div>
                    )}
                    {inCart && (
                        <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                            <CheckCircle2 size={12} /> In Cart
                        </div>
                    )}
                </div>
                <div className="p-4">
                    <p className="text-xs text-rosewood-muted uppercase tracking-wider mb-1">{product.category}</p>
                    <h3 className="text-lg font-medium text-rosewood-primary truncate">{product.name}</h3>
                    <div className="flex items-center justify-between mt-2">
                        <p className="text-rosewood-accent font-semibold">₹{product.price}</p>
                        <button
                            onClick={handleAddToCart}
                            disabled={!product.inStock}
                            title={inCart ? 'Add more to cart' : 'Add to cart'}
                            className={`p-2 rounded-full transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${inCart
                                ? 'bg-green-500 text-white hover:bg-green-600'
                                : 'bg-rosewood-primary text-white hover:bg-rosewood-secondary'
                                }`}
                        >
                            {inCart ? <CheckCircle2 size={16} /> : <ShoppingCart size={16} />}
                        </button>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
};

export default ProductCard;

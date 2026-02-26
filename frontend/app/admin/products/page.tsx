'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import Link from 'next/link';
import { Plus, Edit, Trash2 } from 'lucide-react';

export default function AdminProductsPage() {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [togglingId, setTogglingId] = useState<string | null>(null);

    const fetchProducts = async () => {
        try {
            const { data } = await api.get('/api/products?pageNumber=1');
            setProducts(data.products);
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const deleteHandler = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await api.delete(`/api/products/${id}`);
                fetchProducts();
            } catch (error) {
                console.error(error);
                alert('Failed to delete product');
            }
        }
    };

    const toggleStockHandler = async (product: any) => {
        setTogglingId(product._id);
        try {
            await api.put(`/api/products/${product._id}`, { inStock: !product.inStock });
            // Optimistically update in place instead of full refetch
            setProducts((prev) =>
                prev.map((p) => p._id === product._id ? { ...p, inStock: !p.inStock } : p)
            );
        } catch (error) {
            console.error(error);
            alert('Failed to update stock status');
        } finally {
            setTogglingId(null);
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-serif text-rosewood-primary">Products</h1>
                <Link href="/admin/products/new" className="bg-rosewood-primary text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-rosewood-secondary transition-colors">
                    <Plus size={18} /> Add Product
                </Link>
            </div>

            {loading ? (
                <div>Loading...</div>
            ) : (
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {products.map((product) => {
                                const firstImage = product.images?.[0];
                                const imgSrc = firstImage
                                    ? firstImage.startsWith('http')
                                        ? firstImage
                                        : `${process.env.NEXT_PUBLIC_API_URL}${firstImage}`
                                    : null;

                                return (
                                    <tr key={product._id}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="h-10 w-10 rounded overflow-hidden bg-gray-100 flex items-center justify-center">
                                                {imgSrc ? (
                                                    <img src={imgSrc} alt={product.name} className="h-full w-full object-cover" />
                                                ) : (
                                                    <span className="text-gray-300 text-xs">No img</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">₹{product.price}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.category}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <button
                                                onClick={() => toggleStockHandler(product)}
                                                disabled={togglingId === product._id}
                                                title="Click to toggle stock status"
                                                className={`px-2 py-0.5 inline-flex items-center gap-1 text-xs leading-5 font-semibold rounded-full transition-opacity cursor-pointer hover:opacity-80 disabled:opacity-50 ${product.inStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                                            >
                                                {togglingId === product._id ? (
                                                    <span className="inline-block h-3 w-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                                ) : null}
                                                {product.inStock ? 'In Stock' : 'Out of Stock'}
                                            </button>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <Link
                                                href={`/admin/products/${product._id}/edit`}
                                                className="text-indigo-600 hover:text-indigo-900 mr-4 inline-flex items-center"
                                                title="Edit"
                                            >
                                                <Edit size={18} />
                                            </Link>
                                            <button onClick={() => deleteHandler(product._id)} className="text-red-600 hover:text-red-900" title="Delete">
                                                <Trash2 size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

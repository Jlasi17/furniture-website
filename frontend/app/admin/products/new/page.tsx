'use client';

import { useState } from 'react';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';
import { Upload, X } from 'lucide-react';

export default function AddProductPage() {
    const [name, setName] = useState('');
    const [price, setPrice] = useState(0);
    const [images, setImages] = useState<string[]>([]);
    const [category, setCategory] = useState('');
    const [description, setDescription] = useState('');
    const [countInStock, setCountInStock] = useState(0);
    const [material, setMaterial] = useState('');
    const [color, setColor] = useState('');
    const [size, setSize] = useState({ length: 0, width: 0, height: 0 });
    const [uploading, setUploading] = useState(false);
    const router = useRouter();

    const uploadFileHandler = async (e: any) => {
        const files = Array.from(e.target.files);
        const formData = new FormData();
        files.forEach((file: any) => {
            formData.append('images', file);
        });
        setUploading(true);

        try {
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            };

            const { data } = await api.post('/api/products/upload', formData, config);
            // data is array of paths
            setImages((prev) => [...prev, ...data]);
            setUploading(false);
        } catch (error) {
            console.error(error);
            setUploading(false);
        }
    };

    const removeImage = (index: number) => {
        setImages(images.filter((_, i) => i !== index));
    };

    const submitHandler = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/api/products', {
                name,
                price,
                images,
                category,
                description,
                countInStock,
                material,
                color,
                size
            });
            router.push('/admin/products');
        } catch (error) {
            console.error(error);
            alert('Failed to create product');
        }
    };

    return (
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow my-8">
            <h1 className="text-2xl font-serif text-rosewood-primary mb-6">Add New Product</h1>

            <form onSubmit={submitHandler} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                        <input
                            type="text"
                            className="w-full border border-gray-300 rounded px-4 py-2 outline-none focus:border-rosewood-accent"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                        <input
                            type="text"
                            className="w-full border border-gray-300 rounded px-4 py-2 outline-none focus:border-rosewood-accent"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            placeholder="e.g. Sofa, Bed"
                            required
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
                        <input
                            type="number"
                            className="w-full border border-gray-300 rounded px-4 py-2 outline-none focus:border-rosewood-accent"
                            value={price}
                            onChange={(e) => setPrice(Number(e.target.value))}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Stock Count</label>
                        <input
                            type="number"
                            className="w-full border border-gray-300 rounded px-4 py-2 outline-none focus:border-rosewood-accent"
                            value={countInStock}
                            onChange={(e) => setCountInStock(Number(e.target.value))}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
                        <input
                            type="text"
                            className="w-full border border-gray-300 rounded px-4 py-2 outline-none focus:border-rosewood-accent"
                            value={color}
                            onChange={(e) => setColor(e.target.value)}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Material</label>
                        <input
                            type="text"
                            className="w-full border border-gray-300 rounded px-4 py-2 outline-none focus:border-rosewood-accent"
                            value={material}
                            onChange={(e) => setMaterial(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Dimensions (L x W x H)</label>
                        <div className="flex space-x-2">
                            <input
                                type="number" placeholder="L"
                                className="w-full border border-gray-300 rounded px-2 py-2 outline-none"
                                value={size.length}
                                onChange={(e) => setSize({ ...size, length: Number(e.target.value) })}
                            />
                            <input
                                type="number" placeholder="W"
                                className="w-full border border-gray-300 rounded px-2 py-2 outline-none"
                                value={size.width}
                                onChange={(e) => setSize({ ...size, width: Number(e.target.value) })}
                            />
                            <input
                                type="number" placeholder="H"
                                className="w-full border border-gray-300 rounded px-2 py-2 outline-none"
                                value={size.height}
                                onChange={(e) => setSize({ ...size, height: Number(e.target.value) })}
                            />
                        </div>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                        className="w-full border border-gray-300 rounded px-4 py-2 outline-none h-32 focus:border-rosewood-accent"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    ></textarea>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Images</label>
                    <div className="flex flex-wrap gap-4 mb-2">
                        {images.map((img, idx) => (
                            <div key={idx} className="relative w-24 h-24 border rounded overflow-hidden group">
                                <img src={img.startsWith('http') ? img : `${process.env.NEXT_PUBLIC_API_URL}${img}`} alt="" className="w-full h-full object-cover" />
                                <button
                                    type="button"
                                    onClick={() => removeImage(idx)}
                                    className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-bl opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <X size={12} />
                                </button>
                            </div>
                        ))}
                        <label className="w-24 h-24 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded cursor-pointer hover:border-rosewood-accent hover:bg-gray-50 transition-colors">
                            <Upload size={24} className="text-gray-400" />
                            <span className="text-xs text-gray-500 mt-1">Upload</span>
                            <input type="file" className="hidden" multiple onChange={uploadFileHandler} />
                        </label>
                    </div>
                    {uploading && <p className="text-sm text-blue-500">Uploading...</p>}
                </div>

                <div className="flex justify-end pt-4 border-t">
                    <button
                        type="submit"
                        className="bg-rosewood-primary text-white px-8 py-3 rounded font-semibold hover:bg-rosewood-secondary transition-colors"
                        disabled={uploading}
                    >
                        Create Product
                    </button>
                </div>
            </form>
        </div>
    );
}

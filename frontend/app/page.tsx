'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import ProductCard from '@/components/ProductCard';

const CATEGORIES = [
  {
    name: 'Living Room',
    img: '/categories/living-room.jpg',
  },
  {
    name: 'Bedroom',
    img: '/categories/bedroom.jpg',
  },
  {
    name: 'Dining Room',
    img: '/categories/dining-room.jpg',
  },
];

export default function Home() {
  const [bestSellers, setBestSellers] = useState<any[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  useEffect(() => {
    const fetchBestSellers = async () => {
      try {
        const { data } = await api.get('/api/products?pageNumber=1');
        // Show first 4 products as best sellers
        setBestSellers(data.products.slice(0, 4));
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingProducts(false);
      }
    };
    fetchBestSellers();
  }, []);

  return (
    <div className="bg-rosewood-bg">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center bg-[url('https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center">
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative z-10 text-center text-white px-4">
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="font-serif text-5xl md:text-7xl font-bold mb-6"
          >
            Crafted for Comfort. Designed for Life.
          </motion.h1>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg md:text-xl mb-8 max-w-2xl mx-auto"
          >
            Discover our exclusive collection of premium wooden furniture. Timeless designs that redefine your space.
          </motion.p>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Link href="/shop" className="inline-flex items-center bg-rosewood-accent text-rosewood-primary px-8 py-3 rounded text-lg font-semibold hover:bg-white transition-colors">
              Shop Collection <ArrowRight className="ml-2" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 max-w-7xl mx-auto px-4">
        <h2 className="font-serif text-3xl md:text-4xl text-center mb-12 text-rosewood-primary">Shop by Category</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {CATEGORIES.map((cat, i) => (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <Link
                href={`/shop?category=${encodeURIComponent(cat.name)}`}
                className="group relative h-80 overflow-hidden rounded-lg cursor-pointer block"
              >
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/45 transition-colors z-10" />
                <img
                  src={cat.img}
                  alt={cat.name}
                  className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute bottom-6 left-6 z-20">
                  <h3 className="text-2xl font-serif text-white">{cat.name}</h3>
                  <span className="text-rosewood-accent text-sm group-hover:underline">View Products</span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Best Sellers */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="font-serif text-3xl md:text-4xl text-rosewood-primary mb-2">Best Sellers</h2>
              <p className="text-rosewood-muted">Handpicked favorites just for you.</p>
            </div>
            <Link href="/shop" className="text-rosewood-primary border-b border-rosewood-primary hover:text-rosewood-accent hover:border-rosewood-accent transition-colors">
              View All
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            {loadingProducts
              ? [1, 2, 3, 4].map((i) => (
                <div key={i} className="animate-pulse bg-gray-200 h-80 rounded-lg" />
              ))
              : bestSellers.length > 0
                ? bestSellers.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))
                : [1, 2, 3, 4].map((i) => (
                  <div key={i} className="animate-pulse bg-gray-200 h-80 rounded-lg" />
                ))
            }
          </div>
        </div>
      </section>

      {/* Newsletter / CTA */}
      <section className="bg-rosewood-primary text-rosewood-surface py-20 text-center px-4">
        <h2 className="font-serif text-3xl mb-4">Join the JP Homes Family</h2>
        <p className="mb-8 max-w-lg mx-auto opacity-80">Subscribe to our newsletter for exclusive offers, design tips, and new arrivals.</p>
        <div className="flex max-w-md mx-auto">
          <input type="email" placeholder="Your email address" className="flex-grow px-4 py-3 rounded-l text-rosewood-text focus:outline-none" />
          <button className="bg-rosewood-accent text-rosewood-primary px-6 py-3 rounded-r font-semibold hover:bg-white transition-colors">Subscribe</button>
        </div>
      </section>
    </div>
  );
}

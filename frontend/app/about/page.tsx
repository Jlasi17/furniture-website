'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Leaf, Shield, Truck, HeartHandshake } from 'lucide-react';
import BackButton from '@/components/BackButton';

const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    show: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, delay: i * 0.15 },
    }),
};

const values = [
    {
        icon: Leaf,
        title: 'Sustainably Sourced',
        desc: 'Every piece is crafted from responsibly harvested wood, ensuring forests thrive for generations to come.',
    },
    {
        icon: Shield,
        title: 'Built to Last',
        desc: 'We use time-tested joinery methods and premium finishes so your furniture ages beautifully, not poorly.',
    },
    {
        icon: Truck,
        title: 'White-Glove Delivery',
        desc: 'Free delivery and in-home setup anywhere in the country. We don\'t leave until everything is perfect.',
    },
    {
        icon: HeartHandshake,
        title: 'After-Sale Care',
        desc: 'Our craftsmen back every piece with a 5-year warranty and free touch-up service.',
    },
];


const stats = [
    { value: '12+', label: 'Years of Craft' },
    { value: '4,800+', label: 'Happy Homes' },
    { value: '100%', label: 'Solid Wood' },
    { value: '5★', label: 'Average Rating' },
];

export default function AboutPage() {
    return (
        <div className="bg-rosewood-bg">
            <div className="max-w-7xl mx-auto px-4 pt-6">
                <BackButton />
            </div>

            {/* ── Hero ── */}
            <section className="relative h-[70vh] flex items-center justify-center bg-[url('https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center">
                <div className="absolute inset-0 bg-black/50" />
                <div className="relative z-10 text-center text-white px-4 max-w-3xl mx-auto">
                    <motion.p
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
                        className="text-rosewood-accent uppercase tracking-widest text-sm mb-4"
                    >
                        Our Story
                    </motion.p>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.15 }}
                        className="font-serif text-5xl md:text-7xl font-bold mb-6 leading-tight"
                    >
                        Furniture with a Soul
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}
                        className="text-lg md:text-xl opacity-90 max-w-xl mx-auto"
                    >
                        JP Homes was born from a simple belief — your home deserves furniture as unique as the life you live in it.
                    </motion.p>
                </div>
            </section>

            {/* ── Stats Bar ── */}
            <section className="bg-rosewood-primary text-rosewood-surface py-10">
                <div className="max-w-5xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                    {stats.map((s, i) => (
                        <motion.div key={s.label} custom={i} initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp}>
                            <p className="text-3xl md:text-4xl font-serif font-bold text-rosewood-accent">{s.value}</p>
                            <p className="text-sm opacity-80 mt-1">{s.label}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* ── Our Story ── */}
            <section className="py-24 max-w-7xl mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                    <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
                        <div className="relative">
                            <img
                                src="https://images.unsplash.com/photo-1503602642458-232111445657?q=80&w=800&auto=format&fit=crop"
                                alt="Workshop"
                                className="rounded-lg shadow-xl object-cover h-[480px] w-full"
                            />
                            <div className="absolute -bottom-6 -right-6 w-40 h-40 rounded-lg overflow-hidden shadow-lg border-4 border-white hidden md:block">
                                <img
                                    src="https://images.unsplash.com/photo-1565791380713-1756b9a05343?q=80&w=300&auto=format&fit=crop"
                                    alt="Detail"
                                    className="object-cover w-full h-full"
                                />
                            </div>
                        </div>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
                        <p className="text-rosewood-accent uppercase tracking-widest text-sm mb-3">Who We Are</p>
                        <h2 className="font-serif text-4xl text-rosewood-primary mb-6 leading-snug">
                            Two Decades of <br />Handcrafted Excellence
                        </h2>
                        <p className="text-gray-600 leading-relaxed mb-4">
                            JP Homes started in a small workshop in 2012, with a single lathe and a passionate team of three. We were tired of flat-pack furniture that fell apart after a year, so we set out to build heirloom-quality pieces that could be passed down through families.
                        </p>
                        <p className="text-gray-600 leading-relaxed mb-8">
                            Today, our artisans blend traditional Indian woodworking techniques with contemporary Scandinavian silhouettes — creating furniture that is both timeless and refreshingly modern. Every joint is hand-fitted, every surface hand-sanded, and every finish mixed in-house.
                        </p>
                        <Link
                            href="/shop"
                            className="inline-flex items-center bg-rosewood-primary text-white px-7 py-3 rounded font-semibold hover:bg-rosewood-secondary transition-colors gap-2"
                        >
                            Explore the Collection <ArrowRight size={18} />
                        </Link>
                    </motion.div>
                </div>
            </section>

            {/* ── Values ── */}
            <section className="bg-white py-24">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center mb-14">
                        <p className="text-rosewood-accent uppercase tracking-widest text-sm mb-2">What We Stand For</p>
                        <h2 className="font-serif text-4xl text-rosewood-primary">Our Core Values</h2>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {values.map((v, i) => (
                            <motion.div
                                key={v.title}
                                custom={i}
                                initial="hidden"
                                whileInView="show"
                                viewport={{ once: true }}
                                variants={fadeUp}
                                className="flex flex-col items-start p-6 rounded-xl border border-gray-100 hover:shadow-md transition-shadow bg-rosewood-bg"
                            >
                                <div className="p-3 bg-rosewood-primary rounded-lg mb-4">
                                    <v.icon size={24} className="text-rosewood-accent" />
                                </div>
                                <h3 className="font-semibold text-rosewood-primary text-lg mb-2">{v.title}</h3>
                                <p className="text-gray-500 text-sm leading-relaxed">{v.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Team ── */}
            <section className="py-24 max-w-7xl mx-auto px-4">
                <div className="text-center mb-14">
                    <p className="text-rosewood-accent uppercase tracking-widest text-sm mb-2">The People Behind the Craft</p>
                    <h2 className="font-serif text-4xl text-rosewood-primary">Meet Our Team</h2>
                </div>
                <div className="text-center py-16 border-2 border-dashed border-gray-200 rounded-2xl">
                    <p className="text-gray-400 text-lg">Team profiles coming soon.</p>
                </div>
            </section>

            {/* ── CTA ── */}
            <section className="bg-rosewood-primary text-rosewood-surface py-24 text-center px-4">
                <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
                    <h2 className="font-serif text-4xl md:text-5xl mb-5">Ready to transform your home?</h2>
                    <p className="opacity-80 max-w-lg mx-auto mb-10 text-lg">
                        Browse our full collection and find the piece that speaks to your space.
                    </p>
                    <Link
                        href="/shop"
                        className="inline-flex items-center bg-rosewood-accent text-rosewood-primary px-10 py-4 rounded text-lg font-semibold hover:bg-white transition-colors gap-2"
                    >
                        Shop Now <ArrowRight size={20} />
                    </Link>
                </motion.div>
            </section>

        </div>
    );
}

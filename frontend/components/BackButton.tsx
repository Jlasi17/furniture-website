'use client';

import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';

export default function BackButton() {
    const router = useRouter();
    return (
        <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-1 text-sm text-rosewood-muted hover:text-rosewood-primary transition-colors mb-6 group"
        >
            <ChevronLeft size={18} className="group-hover:-translate-x-0.5 transition-transform" />
            Back
        </button>
    );
}

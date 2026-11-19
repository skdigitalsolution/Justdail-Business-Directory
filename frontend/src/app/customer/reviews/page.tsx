'use client';

import React from 'react';
import Link from 'next/link';
import { Star, Search } from 'lucide-react';
import { DashboardLayout } from '@/components/DashboardLayout';

export default function CustomerReviewsPage() {
  return (
    <DashboardLayout
      role="CONSUMER"
      title="My Ratings & Reviews"
      subtitle="Manage reviews and feedback you have shared with the community."
    >
      <div className="bg-white rounded-2xl border border-gray-200/90 p-8 sm:p-12 text-center shadow-card">
        <div className="w-14 h-14 rounded-2xl bg-brand-green-light text-brand-green flex items-center justify-center mx-auto mb-4 border border-brand-green/20">
          <Star className="w-7 h-7" />
        </div>
        <h3 className="text-lg font-black text-brand-navy mb-1">No Reviews Written</h3>
        <p className="text-xs text-gray-500 max-w-sm mx-auto mb-6">
          Share your experience with local clinics, restaurants, and technicians to help other consumers.
        </p>
        <Link href="/search" className="btn-green">
          <span>Explore Places to Review</span>
        </Link>
      </div>
    </DashboardLayout>
  );
}

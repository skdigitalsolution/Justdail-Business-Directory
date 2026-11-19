'use client';

import React from 'react';
import Link from 'next/link';
import { Bookmark, Search, ArrowRight } from 'lucide-react';
import { DashboardLayout } from '@/components/DashboardLayout';

export default function CustomerSavedPage() {
  return (
    <DashboardLayout
      role="CONSUMER"
      title="Saved Places & Bookmarks"
      subtitle="Access your bookmarked businesses, clinics, restaurants, and local services."
    >
      <div className="bg-white rounded-2xl border border-gray-200/90 p-8 sm:p-12 text-center shadow-card">
        <div className="w-14 h-14 rounded-2xl bg-brand-blue-light text-brand-blue flex items-center justify-center mx-auto mb-4 border border-brand-blue/20">
          <Bookmark className="w-7 h-7" />
        </div>
        <h3 className="text-lg font-black text-brand-navy mb-1">No Saved Listings Yet</h3>
        <p className="text-xs text-gray-500 max-w-sm mx-auto mb-6">
          Bookmark verified businesses across India while searching to easily access them here.
        </p>
        <Link href="/search" className="btn-primary">
          <Search className="w-3.5 h-3.5" />
          <span>Browse Directory</span>
        </Link>
      </div>
    </DashboardLayout>
  );
}

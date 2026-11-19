'use client';

import React from 'react';
import Link from 'next/link';
import { MessageSquare, Search } from 'lucide-react';
import { DashboardLayout } from '@/components/DashboardLayout';

export default function CustomerEnquiriesPage() {
  return (
    <DashboardLayout
      role="CONSUMER"
      title="My Lead Inquiries"
      subtitle="Track quotes and responses from verified local merchants."
    >
      <div className="bg-white rounded-2xl border border-gray-200/90 p-8 sm:p-12 text-center shadow-card">
        <div className="w-14 h-14 rounded-2xl bg-brand-orange-light text-brand-orange flex items-center justify-center mx-auto mb-4 border border-brand-orange/20">
          <MessageSquare className="w-7 h-7" />
        </div>
        <h3 className="text-lg font-black text-brand-navy mb-1">No Active Inquiries</h3>
        <p className="text-xs text-gray-500 max-w-sm mx-auto mb-6">
          When you request quotes from verified service providers, their responses will appear here.
        </p>
        <Link href="/categories" className="btn-accent">
          <span>Find Services</span>
        </Link>
      </div>
    </DashboardLayout>
  );
}

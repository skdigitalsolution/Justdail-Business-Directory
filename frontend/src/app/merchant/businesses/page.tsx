'use client';

import React from 'react';
import Link from 'next/link';
import { Building2, PlusCircle } from 'lucide-react';
import { DashboardLayout } from '@/components/DashboardLayout';

export default function MerchantBusinessesPage() {
  return (
    <DashboardLayout
      role="BUSINESS_OWNER"
      title="My Business Listings"
      subtitle="Manage your company profiles, addresses, contact details, and catalog photos."
    >
      <div className="bg-white rounded-2xl border border-gray-200/90 p-8 sm:p-12 text-center shadow-card">
        <div className="w-14 h-14 rounded-2xl bg-brand-blue-light text-brand-blue flex items-center justify-center mx-auto mb-4 border border-brand-blue/20">
          <Building2 className="w-7 h-7" />
        </div>
        <h3 className="text-lg font-black text-brand-navy mb-1">No Active Listings Yet</h3>
        <p className="text-xs text-gray-500 max-w-sm mx-auto mb-6">
          Register your business enterprise to start receiving customer calls and inquiries across your city.
        </p>
        <Link href="/add-business" className="btn-primary">
          <PlusCircle className="w-3.5 h-3.5" />
          <span>+ Add Business Listing</span>
        </Link>
      </div>
    </DashboardLayout>
  );
}

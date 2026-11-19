'use client';

import React from 'react';
import { Star, ShieldCheck } from 'lucide-react';
import { DashboardLayout } from '@/components/DashboardLayout';

export default function MerchantReviewsPage() {
  return (
    <DashboardLayout
      role="BUSINESS_OWNER"
      title="Customer Reviews & Reputation"
      subtitle="Monitor customer feedback and provide verified merchant responses."
    >
      <div className="bg-white rounded-2xl border border-gray-200/90 p-8 sm:p-12 text-center shadow-card">
        <div className="w-14 h-14 rounded-2xl bg-brand-green-light text-brand-green flex items-center justify-center mx-auto mb-4 border border-brand-green/20">
          <Star className="w-7 h-7" />
        </div>
        <h3 className="text-lg font-black text-brand-navy mb-1">No Reviews to Moderate</h3>
        <p className="text-xs text-gray-500 max-w-sm mx-auto mb-4">
          Genuine customer ratings will appear here once your storefront starts receiving visits.
        </p>
      </div>
    </DashboardLayout>
  );
}

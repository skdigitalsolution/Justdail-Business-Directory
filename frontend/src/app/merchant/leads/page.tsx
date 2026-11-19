'use client';

import React from 'react';
import { MessageSquare, PhoneCall } from 'lucide-react';
import { DashboardLayout } from '@/components/DashboardLayout';

export default function MerchantLeadsPage() {
  return (
    <DashboardLayout
      role="BUSINESS_OWNER"
      title="Customer Leads & Quotes"
      subtitle="View high-intent customer requests, phone inquiries, and quote submissions."
    >
      <div className="bg-white rounded-2xl border border-gray-200/90 p-8 sm:p-12 text-center shadow-card">
        <div className="w-14 h-14 rounded-2xl bg-brand-orange-light text-brand-orange flex items-center justify-center mx-auto mb-4 border border-brand-orange/20">
          <MessageSquare className="w-7 h-7" />
        </div>
        <h3 className="text-lg font-black text-brand-navy mb-1">No Leads Received Yet</h3>
        <p className="text-xs text-gray-500 max-w-sm mx-auto mb-4">
          Once your business listing is verified and active, direct customer inquiries will populate in real time.
        </p>
      </div>
    </DashboardLayout>
  );
}

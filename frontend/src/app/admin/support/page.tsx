'use client';

import React from 'react';
import { Headphones, CheckCircle2 } from 'lucide-react';
import { DashboardLayout } from '@/components/DashboardLayout';

export default function AdminSupportPage() {
  return (
    <DashboardLayout
      role="SALES_SUPPORT_AGENT"
      title="Customer & Merchant Support Desk"
      subtitle="Resolve inbound dispute tickets, listing correction requests, and user help inquiries."
    >
      <div className="bg-white rounded-2xl border border-gray-200/90 p-8 sm:p-12 text-center shadow-card">
        <div className="w-14 h-14 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mx-auto mb-4 border border-purple-100">
          <Headphones className="w-7 h-7" />
        </div>
        <h3 className="text-lg font-black text-brand-navy mb-1">Support Desk Clear</h3>
        <p className="text-xs text-gray-500 max-w-sm mx-auto mb-4">
          All consumer inquiries, merchant questions, and listing correction tickets have been resolved.
        </p>
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>0 Active Tickets</span>
        </span>
      </div>
    </DashboardLayout>
  );
}

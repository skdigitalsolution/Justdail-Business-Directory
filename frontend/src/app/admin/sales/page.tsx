'use client';

import React from 'react';
import { DollarSign, TrendingUp, Users } from 'lucide-react';
import { DashboardLayout } from '@/components/DashboardLayout';

export default function AdminSalesPage() {
  return (
    <DashboardLayout
      role="SALES_SUPPORT_AGENT"
      title="Sales & Advertising CRM"
      subtitle="Track high-intent merchant leads, advertising packages, renewals, and outreach pipelines."
    >
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-2xl border border-gray-200/90 p-5 shadow-card">
          <span className="text-xs font-bold text-gray-400 uppercase">Pipeline Leads</span>
          <div className="text-2xl font-black text-brand-navy mt-1">0</div>
          <span className="text-[11px] text-gray-500">Unassigned merchant inquiries</span>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200/90 p-5 shadow-card">
          <span className="text-xs font-bold text-gray-400 uppercase">Active Subscriptions</span>
          <div className="text-2xl font-black text-brand-blue mt-1">0</div>
          <span className="text-[11px] text-gray-500">Paid merchant accounts</span>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200/90 p-5 shadow-card">
          <span className="text-xs font-bold text-gray-400 uppercase">Renewals Pending</span>
          <div className="text-2xl font-black text-brand-green mt-1">0</div>
          <span className="text-[11px] text-gray-500">Expiring in next 30 days</span>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200/90 p-8 text-center shadow-card">
        <h3 className="text-base font-bold text-brand-navy mb-1">CRM Pipeline Active</h3>
        <p className="text-xs text-gray-500 max-w-sm mx-auto">
          Merchant onboarding conversion pipeline ready for lead assignment.
        </p>
      </div>
    </DashboardLayout>
  );
}

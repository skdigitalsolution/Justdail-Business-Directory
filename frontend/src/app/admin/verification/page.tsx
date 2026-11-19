'use client';

import React from 'react';
import { FileCheck, ShieldCheck } from 'lucide-react';
import { DashboardLayout } from '@/components/DashboardLayout';

export default function AdminVerificationPage() {
  return (
    <DashboardLayout
      role="VERIFICATION_OFFICER"
      title="Merchant Verification Queue"
      subtitle="Inspect government tax registrations (GST/PAN), physical addresses, and trade licenses."
    >
      <div className="bg-white rounded-2xl border border-gray-200/90 p-8 sm:p-12 text-center shadow-card">
        <div className="w-14 h-14 rounded-2xl bg-brand-green-light text-brand-green flex items-center justify-center mx-auto mb-4 border border-brand-green/20">
          <FileCheck className="w-7 h-7" />
        </div>
        <h3 className="text-lg font-black text-brand-navy mb-1">Verification Queue Clear</h3>
        <p className="text-xs text-gray-500 max-w-sm mx-auto mb-4">
          All submitted merchant business documents and KYC applications have been reviewed.
        </p>
        <span className="badge-verified">0 Pending Tasks</span>
      </div>
    </DashboardLayout>
  );
}

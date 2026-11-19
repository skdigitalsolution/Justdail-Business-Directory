'use client';

import React from 'react';
import { FileText, ShieldAlert } from 'lucide-react';
import { DashboardLayout } from '@/components/DashboardLayout';

export default function AdminModerationPage() {
  return (
    <DashboardLayout
      role="CONTENT_MODERATOR"
      title="Content & Review Moderation Queue"
      subtitle="Audit business profile copy, catalogue photos, consumer review disputes, and flag reports."
    >
      <div className="bg-white rounded-2xl border border-gray-200/90 p-8 sm:p-12 text-center shadow-card">
        <div className="w-14 h-14 rounded-2xl bg-brand-orange-light text-brand-orange flex items-center justify-center mx-auto mb-4 border border-brand-orange/20">
          <FileText className="w-7 h-7" />
        </div>
        <h3 className="text-lg font-black text-brand-navy mb-1">Moderation Queue Clear</h3>
        <p className="text-xs text-gray-500 max-w-sm mx-auto mb-4">
          No disputed reviews or unapproved business profile revisions pending review.
        </p>
        <span className="badge-accent">All Listings Compliant</span>
      </div>
    </DashboardLayout>
  );
}

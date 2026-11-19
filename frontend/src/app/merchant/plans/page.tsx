'use client';

import React from 'react';
import Link from 'next/link';
import { DollarSign, CheckCircle2, ArrowRight } from 'lucide-react';
import { DashboardLayout } from '@/components/DashboardLayout';

export default function MerchantPlansPage() {
  return (
    <DashboardLayout
      role="BUSINESS_OWNER"
      title="Growth & Visibility Plans"
      subtitle="Boost your directory ranking, verified badge status, and customer outreach volume."
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Basic Free */}
        <div className="bg-white rounded-2xl border border-gray-200/90 p-6 shadow-card flex flex-col justify-between">
          <div>
            <span className="badge-category mb-3">CURRENT ACTIVE TIER</span>
            <h3 className="text-xl font-black text-brand-navy mt-2">Free Listing</h3>
            <div className="text-3xl font-black text-brand-navy my-3">₹0<span className="text-xs text-gray-400 font-normal">/forever</span></div>
            <ul className="text-xs text-gray-600 space-y-2 mt-4">
              <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-brand-green" /> Standard directory listing</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-brand-green" /> Direct customer phone calls</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-brand-green" /> Zero middleman commission</li>
            </ul>
          </div>
          <div className="mt-6 pt-4 border-t border-gray-100">
            <span className="text-xs font-bold text-gray-400 block text-center">Active by Default</span>
          </div>
        </div>

        {/* Growth Verified */}
        <div className="bg-white rounded-2xl border-2 border-brand-blue p-6 shadow-card flex flex-col justify-between relative">
          <span className="absolute -top-3 right-6 badge-accent">RECOMMENDED</span>
          <div>
            <span className="badge-verified mb-3">PRIORITY DISCOVERY</span>
            <h3 className="text-xl font-black text-brand-navy mt-2">Verified Growth</h3>
            <div className="text-3xl font-black text-brand-navy my-3">₹999<span className="text-xs text-gray-400 font-normal">/month</span></div>
            <ul className="text-xs text-gray-600 space-y-2 mt-4">
              <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-brand-green" /> Verified Merchant Trust Badge</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-brand-green" /> Top 5 category search placement</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-brand-green" /> Direct WhatsApp chat button</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-brand-green" /> Priority lead alerts via SMS</li>
            </ul>
          </div>
          <div className="mt-6 pt-4 border-t border-gray-100">
            <Link href="/pricing" className="btn-primary w-full text-center">
              <span>Upgrade to Verified</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Premium Enterprise */}
        <div className="bg-white rounded-2xl border border-gray-200/90 p-6 shadow-card flex flex-col justify-between">
          <div>
            <span className="badge-accent mb-3">MAXIMUM EXPOSURE</span>
            <h3 className="text-xl font-black text-brand-navy mt-2">City Leader</h3>
            <div className="text-3xl font-black text-brand-navy my-3">₹2,499<span className="text-xs text-gray-400 font-normal">/month</span></div>
            <ul className="text-xs text-gray-600 space-y-2 mt-4">
              <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-brand-green" /> Homepage spotlight promotion</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-brand-green" /> #1 Top ranked in your city</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-brand-green" /> Dedicated account manager</li>
            </ul>
          </div>
          <div className="mt-6 pt-4 border-t border-gray-100">
            <Link href="/pricing" className="btn-outline w-full text-center">
              <span>Contact Sales</span>
            </Link>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

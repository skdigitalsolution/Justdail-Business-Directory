import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Check, ShieldCheck } from 'lucide-react';

export default function PricingPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full flex-1">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-blue hover:underline mb-6"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Home</span>
      </Link>

      <div className="text-center max-w-2xl mx-auto mb-12">
        <span className="text-xs font-bold uppercase tracking-wider text-brand-blue">
          Merchant Subscriptions
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-brand-navy tracking-tight mt-1 mb-3">
          Promote Your Business Across India
        </h1>
        <p className="text-sm text-gray-600">
          Transparent visibility tiers designed for single-location merchants and multi-city enterprises.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {/* Tier 1 */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 flex flex-col justify-between shadow-sm">
          <div>
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Free Starter</span>
            <h3 className="text-xl font-bold text-brand-navy mt-1">₹0 / month</h3>
            <p className="text-xs text-gray-500 mt-1 mb-6">Standard discovery in local city directory.</p>
            <ul className="text-xs space-y-3 text-gray-700">
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600 shrink-0" /> Basic Business Profile</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600 shrink-0" /> Contact Phone & Address</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600 shrink-0" /> Consumer Ratings & Reviews</li>
            </ul>
          </div>
          <Link href="/add-business" className="mt-8 block w-full py-2.5 text-center text-xs font-bold rounded-xl bg-gray-100 hover:bg-gray-200 text-brand-navy transition-colors">
            Get Started Free
          </Link>
        </div>

        {/* Tier 2 (Highlighted) */}
        <div className="bg-white rounded-2xl border-2 border-brand-blue p-6 flex flex-col justify-between shadow-lg relative">
          <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-brand-blue text-white shadow-sm">
            Most Popular
          </span>
          <div>
            <span className="text-xs font-bold text-brand-blue uppercase tracking-wider">Verified Pro</span>
            <h3 className="text-xl font-bold text-brand-navy mt-1">₹1,999 / month</h3>
            <p className="text-xs text-gray-500 mt-1 mb-6">Top placement in category search with Verified Badge.</p>
            <ul className="text-xs space-y-3 text-gray-700">
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-brand-blue shrink-0" /> Verified Merchant Trust Badge</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-brand-blue shrink-0" /> Priority Category Placement</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-brand-blue shrink-0" /> Direct Lead Inquiries via SMS</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-brand-blue shrink-0" /> Image Showcase & Catalog (Up to 25 items)</li>
            </ul>
          </div>
          <Link href="/add-business" className="mt-8 block w-full py-2.5 text-center text-xs font-bold rounded-xl bg-brand-blue hover:bg-brand-blue-hover text-white transition-colors shadow-sm">
            Upgrade to Pro
          </Link>
        </div>

        {/* Tier 3 */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 flex flex-col justify-between shadow-sm">
          <div>
            <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">Enterprise Platinum</span>
            <h3 className="text-xl font-bold text-brand-navy mt-1">₹4,999 / month</h3>
            <p className="text-xs text-gray-500 mt-1 mb-6">Multi-city coverage and featured banner rotation.</p>
            <ul className="text-xs space-y-3 text-gray-700">
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-amber-600 shrink-0" /> Multi-Branch Location Manager</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-amber-600 shrink-0" /> Featured Homepage Banner Placement</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-amber-600 shrink-0" /> Dedicated Account Manager</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-amber-600 shrink-0" /> Real-time Analytics & Competitor Insights</li>
            </ul>
          </div>
          <Link href="/contact" className="mt-8 block w-full py-2.5 text-center text-xs font-bold rounded-xl bg-gray-100 hover:bg-gray-200 text-brand-navy transition-colors">
            Contact Sales
          </Link>
        </div>
      </div>
    </div>
  );
}

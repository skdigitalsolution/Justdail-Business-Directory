import React from 'react';
import Link from 'next/link';
import { PlusCircle, ShieldCheck, ArrowLeft, CheckCircle2 } from 'lucide-react';

export default function AddBusinessPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full flex-1">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-blue hover:underline mb-6"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Home</span>
      </Link>

      <div className="bg-white rounded-3xl border border-gray-200 p-8 sm:p-12 shadow-sm">
        <div className="w-14 h-14 rounded-2xl bg-blue-50 text-brand-blue flex items-center justify-center mb-6">
          <PlusCircle className="w-7 h-7" />
        </div>

        <span className="inline-block px-3 py-1 rounded-full text-xs font-extrabold uppercase bg-blue-100 text-brand-blue mb-3">
          Merchant Onboarding Portal
        </span>

        <h1 className="text-2xl sm:text-3xl font-black text-brand-navy mb-3">
          List Your Business on Justdial Directory
        </h1>

        <p className="text-sm text-gray-600 mb-8 leading-relaxed">
          Create your business profile, upload storefront media, define working hours, and receive
          verified leads directly from local consumers. Self-serve merchant registration is scheduled
          for release in upcoming development phases following the Authentication & RBAC milestone.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="p-4 rounded-xl border border-gray-100 bg-brand-bg">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 mb-2" />
            <h4 className="font-bold text-sm text-brand-navy">Free Profile</h4>
            <p className="text-xs text-gray-500 mt-1">
              Zero listing fees for standard enterprise presence.
            </p>
          </div>
          <div className="p-4 rounded-xl border border-gray-100 bg-brand-bg">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 mb-2" />
            <h4 className="font-bold text-sm text-brand-navy">Verified Trust</h4>
            <p className="text-xs text-gray-500 mt-1">
              KYC and location verification for consumer trust.
            </p>
          </div>
          <div className="p-4 rounded-xl border border-gray-100 bg-brand-bg">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 mb-2" />
            <h4 className="font-bold text-sm text-brand-navy">Customer Leads</h4>
            <p className="text-xs text-gray-500 mt-1">
              Direct telephone inquiries with zero commissions.
            </p>
          </div>
        </div>

        <div className="pt-6 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-xs text-gray-500">
            Phase 02 Status: Merchant UI Planned • Auth Guard Active
          </span>
          <Link
            href="/"
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-brand-blue hover:bg-brand-blue-hover text-white text-xs font-bold transition-colors text-center"
          >
            Return to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}

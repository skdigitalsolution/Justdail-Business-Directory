'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Building2,
  ShieldCheck,
  TrendingUp,
  MessageSquare,
  PlusCircle,
  AlertTriangle,
  Lock,
  ArrowRight,
  ShieldAlert,
  Loader2,
  PhoneCall,
  CheckCircle2,
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { api } from '@/lib/api';

export default function MerchantDashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, hasAnyRole } = useAuth();
  const [serverCheckFailed, setServerCheckFailed] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/login');
      return;
    }

    if (isAuthenticated) {
      // Validate server-side role check against backend endpoint
      api.checkMerchantAccess().catch(() => {
        setServerCheckFailed(true);
      });
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-brand-blue" />
      </div>
    );
  }

  if (!user) return null;

  const isAuthorized =
    hasAnyRole(['BUSINESS_OWNER', 'MERCHANT_STAFF', 'SUPER_ADMIN']) &&
    !serverCheckFailed;

  // 403 Forbidden State for Consumers or unauthorized visitors
  if (!isAuthorized) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full">
        <div className="bg-white rounded-3xl border border-red-200 p-8 sm:p-12 text-center shadow-lg">
          <div className="w-16 h-16 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto mb-4 border border-red-100">
            <ShieldAlert className="w-8 h-8" />
          </div>

          <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-red-100 text-red-800 mb-2">
            HTTP 403 — ACCESS RESTRICTED
          </span>

          <h1 className="text-2xl sm:text-3xl font-black text-brand-navy mb-3">
            Merchant Workspace Access Denied
          </h1>

          <p className="text-sm text-gray-600 max-w-xl mx-auto mb-6 leading-relaxed">
            Your authenticated account (<strong className="font-mono">{user.mobile}</strong>) currently carries the{' '}
            <strong className="text-brand-navy">[{user.roles.join(', ')}]</strong> role.
            Merchant dashboards require the <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs font-bold">BUSINESS_OWNER</code> or{' '}
            <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs font-bold">MERCHANT_STAFF</code> privilege.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/add-business"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-brand-blue hover:bg-brand-blue-hover text-white text-xs sm:text-sm font-bold shadow-md transition-colors"
            >
              <span>+ Register a Business to Become a Merchant</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/customer/dashboard"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-brand-navy text-xs sm:text-sm font-bold transition-colors"
            >
              <span>Return to Consumer Dashboard</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Authorized Merchant View
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-8">
      {/* Header Banner */}
      <div className="bg-brand-navy text-white rounded-3xl p-6 sm:p-10 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="relative z-10">
          <span className="inline-block px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-brand-amber text-brand-navy mb-3">
            MERCHANT PORTAL
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            Enterprise Merchant Command Center
          </h1>
          <p className="text-xs sm:text-sm text-gray-300 mt-1">
            Manage your verified company listing, customer inquiries, and subscription visibility.
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-3">
          <Link
            href="/add-business"
            className="px-5 py-3 rounded-xl bg-brand-blue hover:bg-brand-blue-hover text-white text-xs font-bold shadow-lg transition-colors flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4" />
            <span>+ Add New Branch / Listing</span>
          </Link>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-2xs">
          <span className="text-xs font-bold text-gray-400 uppercase">My Listings</span>
          <div className="text-2xl font-black text-brand-navy mt-1">0</div>
          <span className="text-[11px] text-gray-500">Active public storefronts</span>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-2xs">
          <span className="text-xs font-bold text-gray-400 uppercase">Customer Leads</span>
          <div className="text-2xl font-black text-brand-navy mt-1">0</div>
          <span className="text-[11px] text-gray-500">Quotes &amp; calls received</span>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-2xs">
          <span className="text-xs font-bold text-gray-400 uppercase">Verification</span>
          <div className="text-2xl font-black text-amber-600 mt-1">Pending</div>
          <span className="text-[11px] text-gray-500">GST &amp; Document Review</span>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-2xs">
          <span className="text-xs font-bold text-gray-400 uppercase">Visibility Tier</span>
          <div className="text-2xl font-black text-emerald-600 mt-1">Basic Free</div>
          <span className="text-[11px] text-gray-500">Zero commission active</span>
        </div>
      </div>
    </div>
  );
}

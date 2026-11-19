'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ShieldAlert,
  ShieldCheck,
  Users,
  FileCheck,
  DollarSign,
  Headphones,
  FileText,
  Lock,
  ArrowRight,
  Loader2,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { api } from '@/lib/api';

const ADMIN_ROLES = [
  'SUPER_ADMIN',
  'CONTENT_MODERATOR',
  'VERIFICATION_OFFICER',
  'SALES_SUPPORT_AGENT',
  'FINANCE_MANAGER',
];

export default function AdminDashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, hasAnyRole, hasPermission } = useAuth();
  const [serverCheckFailed, setServerCheckFailed] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/login');
      return;
    }

    if (isAuthenticated) {
      // Validate server-side role check against backend endpoint
      api.checkAdminAccess().catch(() => {
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
    hasAnyRole(ADMIN_ROLES as any) && !serverCheckFailed;

  // 403 Forbidden State for Consumers or Merchants
  if (!isAuthorized) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full">
        <div className="bg-white rounded-3xl border border-red-200 p-8 sm:p-12 text-center shadow-lg">
          <div className="w-16 h-16 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto mb-4 border border-red-100">
            <ShieldAlert className="w-8 h-8" />
          </div>

          <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-red-100 text-red-800 mb-2">
            HTTP 403 — PRIVILEGED ROUTE RESTRICTED
          </span>

          <h1 className="text-2xl sm:text-3xl font-black text-brand-navy mb-3">
            Administrative Command Center Restricted
          </h1>

          <p className="text-sm text-gray-600 max-w-xl mx-auto mb-6 leading-relaxed">
            Your account (<strong className="font-mono">{user.mobile}</strong>) does not hold administrative staff authority.
            Current roles: <strong className="text-brand-navy">[{user.roles.join(', ')}]</strong>.
            This area is strictly reserved for verified platform governance and operations personnel.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/customer/dashboard"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-brand-blue hover:bg-brand-blue-hover text-white text-xs sm:text-sm font-bold shadow-md transition-colors"
            >
              <span>Return to Customer Dashboard</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const isSuperAdmin = user.roles.includes('SUPER_ADMIN');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-8">
      {/* Header Banner */}
      <div className="bg-brand-navy text-white rounded-3xl p-6 sm:p-10 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-red-500/20 text-red-300 border border-red-500/30">
              RESTRICTED ADMINISTRATION
            </span>
            <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-blue-500/20 text-blue-300 border border-blue-500/30">
              Role: {user.roles.join(' & ')}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-white">
            Platform Command &amp; Operations Center
          </h1>
          <p className="text-xs sm:text-sm text-gray-300 mt-1">
            Real-time directory governance, merchant verification vetting, and RBAC matrix enforcement.
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <span className="text-[11px] text-gray-400 block font-mono">Authenticated User</span>
            <span className="text-xs font-bold text-white">{user.name || user.mobile}</span>
          </div>
        </div>
      </div>

      {/* Role-Segregated Operational Workspaces */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Verification Officer Workspace */}
        {(isSuperAdmin || hasPermission('verification:inspect')) && (
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-2xs hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase text-brand-blue">Verification Queue</span>
              <div className="p-2.5 rounded-xl bg-blue-50 text-brand-blue">
                <FileCheck className="w-5 h-5" />
              </div>
            </div>
            <h3 className="font-extrabold text-lg text-brand-navy">Merchant Vetting</h3>
            <p className="text-xs text-gray-500 mt-1 leading-relaxed">
              Review submitted GST certificates, PAN cards, and trade licenses before granting verified trust badges.
            </p>
            <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-brand-blue">
              <span>0 Pending Applications</span>
              <span className="text-gray-400">Up to date</span>
            </div>
          </div>
        )}

        {/* Content Moderator Workspace */}
        {(isSuperAdmin || hasPermission('content:moderate')) && (
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-2xs hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase text-amber-600">Content Moderation</span>
              <div className="p-2.5 rounded-xl bg-amber-50 text-brand-amber">
                <FileText className="w-5 h-5" />
              </div>
            </div>
            <h3 className="font-extrabold text-lg text-brand-navy">Review &amp; Listing Auditing</h3>
            <p className="text-xs text-gray-500 mt-1 leading-relaxed">
              Inspect user-submitted business descriptions, media files, and disputed consumer reviews.
            </p>
            <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-amber-700">
              <span>0 Flagged Content</span>
              <span className="text-gray-400">Queue clear</span>
            </div>
          </div>
        )}

        {/* Finance Manager Workspace */}
        {(isSuperAdmin || hasPermission('finance:view')) && (
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-2xs hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase text-emerald-600">Financial Ledger</span>
              <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600">
                <DollarSign className="w-5 h-5" />
              </div>
            </div>
            <h3 className="font-extrabold text-lg text-brand-navy">Merchant Subscriptions</h3>
            <p className="text-xs text-gray-500 mt-1 leading-relaxed">
              Audit payment gateway transactions, GST tax invoices, and merchant renewal contracts.
            </p>
            <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-emerald-700">
              <span>₹0 Total Volume</span>
              <span className="text-gray-400">Phase 03 Active</span>
            </div>
          </div>
        )}

        {/* Support Agent Workspace */}
        {(isSuperAdmin || hasPermission('support:tickets:manage')) && (
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-2xs hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase text-purple-600">Support Desk</span>
              <div className="p-2.5 rounded-xl bg-purple-50 text-purple-600">
                <Headphones className="w-5 h-5" />
              </div>
            </div>
            <h3 className="font-extrabold text-lg text-brand-navy">Merchant Outreach</h3>
            <p className="text-xs text-gray-500 mt-1 leading-relaxed">
              Manage incoming support tickets and assist merchants with directory listing onboarding.
            </p>
            <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-purple-700">
              <span>0 Open Tickets</span>
              <span className="text-gray-400">All resolved</span>
            </div>
          </div>
        )}

        {/* Super Admin Security Audit */}
        {isSuperAdmin && (
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-2xs hover:shadow-md transition-shadow col-span-1 md:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase text-red-600">Super Administrator</span>
              <div className="p-2.5 rounded-xl bg-red-50 text-red-600">
                <Lock className="w-5 h-5" />
              </div>
            </div>
            <h3 className="font-extrabold text-lg text-brand-navy">Security Audit &amp; Role Matrix</h3>
            <p className="text-xs text-gray-500 mt-1 leading-relaxed">
              Inspect authentication sessions, mobile OTP challenges, and role allocations across all platform accounts.
            </p>
            <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
              <span className="font-bold text-emerald-600">RBAC Database Tables Active</span>
              <span className="text-gray-400 font-mono">MySQL 8 • justdials-business</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

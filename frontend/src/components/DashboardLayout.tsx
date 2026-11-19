'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  UserRole,
  RoleType,
} from '@/types';
import {
  LayoutDashboard,
  Building2,
  ShieldCheck,
  UserCheck,
  FileCheck,
  FileText,
  DollarSign,
  Headphones,
  LogOut,
  ArrowLeft,
  Bookmark,
  MessageSquare,
  Star,
  Settings,
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface DashboardLayoutProps {
  role: UserRole;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  role,
  title,
  subtitle,
  children,
}) => {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const getNavItems = (): NavItem[] => {
    switch (role) {
      case 'BUSINESS_OWNER':
      case 'MERCHANT_STAFF':
        return [
          { label: 'Overview', href: '/merchant/dashboard', icon: LayoutDashboard },
          { label: 'My Listings', href: '/merchant/businesses', icon: Building2 },
          { label: 'Customer Leads', href: '/merchant/leads', icon: MessageSquare },
          { label: 'Reviews & Ratings', href: '/merchant/reviews', icon: Star },
          { label: 'Plans & Growth', href: '/merchant/plans', icon: DollarSign },
          { label: 'Account Profile', href: '/customer/profile', icon: UserCheck },
        ];
      case 'SUPER_ADMIN':
      case 'CONTENT_MODERATOR':
      case 'VERIFICATION_OFFICER':
      case 'SALES_SUPPORT_AGENT':
      case 'FINANCE_MANAGER':
        return [
          { label: 'Command Center', href: '/admin/dashboard', icon: LayoutDashboard },
          { label: 'Verification Queue', href: '/admin/verification', icon: FileCheck },
          { label: 'Content Moderation', href: '/admin/moderation', icon: FileText },
          { label: 'Sales CRM', href: '/admin/sales', icon: DollarSign },
          { label: 'Support Desk', href: '/admin/support', icon: Headphones },
          { label: 'Account Profile', href: '/customer/profile', icon: UserCheck },
        ];
      default:
        return [
          { label: 'Overview', href: '/customer/dashboard', icon: LayoutDashboard },
          { label: 'My Profile', href: '/customer/profile', icon: UserCheck },
          { label: 'Saved Places', href: '/customer/saved', icon: Bookmark },
          { label: 'My Inquiries', href: '/customer/enquiries', icon: MessageSquare },
          { label: 'My Reviews', href: '/customer/reviews', icon: Star },
        ];
    }
  };

  const navItems = getNavItems();

  const getRoleBadgeStyle = (r: UserRole) => {
    if (r === 'SUPER_ADMIN') {
      return 'bg-red-50 text-red-700 border-red-200';
    }
    if (r === 'BUSINESS_OWNER' || r === 'MERCHANT_STAFF') {
      return 'bg-brand-blue-light text-brand-blue border-brand-blue/20';
    }
    return 'bg-brand-green-light text-brand-green border-brand-green/20';
  };

  return (
    <div className="min-h-screen flex flex-col bg-brand-bg text-brand-navy">
      {/* Top Navigation Strip */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-lg bg-brand-navy flex items-center justify-center text-white border border-brand-navy-light/40">
                <span className="text-xs font-black text-brand-orange">L</span>
                <span className="text-xs font-black text-brand-blue -ml-0.5">F</span>
              </div>
              <span className="font-black text-base tracking-tight text-brand-navy">
                Local<span className="text-brand-blue">Find</span>
              </span>
            </Link>

            <span className="hidden sm:inline-block text-gray-300">|</span>

            <span
              className={`hidden sm:inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider border ${getRoleBadgeStyle(
                role,
              )}`}
            >
              {role.replace('_', ' ')}
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs">
            {user && (
              <div className="hidden md:flex flex-col text-right">
                <span className="font-bold text-brand-navy">{user.name || user.mobile}</span>
                <span className="text-[10px] text-gray-500 font-mono">{user.mobile}</span>
              </div>
            )}

            <Link
              href="/"
              className="px-3 py-1.5 rounded-lg border border-gray-200 hover:border-brand-blue text-gray-700 hover:text-brand-blue font-semibold transition-colors flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Public Directory</span>
            </Link>

            <button
              type="button"
              onClick={() => logout()}
              className="px-3 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 font-semibold transition-colors flex items-center gap-1"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Workspace Layout */}
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 flex flex-col md:flex-row gap-8">
        {/* Sidebar Nav */}
        <aside className="w-full md:w-60 shrink-0">
          <div className="bg-white rounded-2xl border border-gray-200/90 shadow-card p-3 space-y-1">
            <div className="px-3 py-2 text-[10px] font-extrabold uppercase tracking-wider text-gray-400">
              Workspace Navigation
            </div>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-brand-blue text-white shadow-xs'
                      : 'text-gray-700 hover:bg-brand-blue-light hover:text-brand-blue'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-gray-400'}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </aside>

        {/* Content Pane */}
        <main className="flex-1 min-w-0">
          <div className="mb-6">
            <h1 className="text-2xl font-black text-brand-navy tracking-tight">{title}</h1>
            {subtitle && <p className="text-xs sm:text-sm text-gray-500 mt-1">{subtitle}</p>}
          </div>

          {children}
        </main>
      </div>
    </div>
  );
};

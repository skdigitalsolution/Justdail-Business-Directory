'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  User,
  ShieldCheck,
  Bookmark,
  MessageSquare,
  Star,
  Search,
  ArrowRight,
  Phone,
  CheckCircle2,
  Building2,
  Clock,
  Loader2,
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

export default function CustomerDashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/login');
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-8">
      {/* Welcome Banner */}
      <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 text-brand-blue flex items-center justify-center font-black text-xl shadow-inner border border-blue-100">
            {user.name ? user.name.slice(0, 2).toUpperCase() : user.mobile.slice(-2)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-brand-navy">
                Welcome, {user.name || 'Consumer'}!
              </h1>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                <span>Verified</span>
              </span>
            </div>
            <p className="text-xs text-gray-500 font-mono mt-0.5">
              Mobile: {user.mobile} • Role: {user.roles.join(', ')}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/customer/profile"
            className="px-4 py-2.5 rounded-xl border border-gray-300 hover:border-brand-blue text-xs font-bold text-gray-700 hover:text-brand-blue transition-colors"
          >
            Edit Profile
          </Link>
          <Link
            href="/search"
            className="px-5 py-2.5 rounded-xl bg-brand-blue hover:bg-brand-blue-hover text-xs font-bold text-white shadow-sm transition-colors flex items-center gap-1.5"
          >
            <Search className="w-3.5 h-3.5" />
            <span>Search Directory</span>
          </Link>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        {/* Saved Listings */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase text-gray-400">Bookmarked</span>
            <div className="p-2 rounded-xl bg-blue-50 text-brand-blue">
              <Bookmark className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-brand-navy">0</div>
          <p className="text-xs text-gray-500 mt-1">Saved businesses in your account</p>
          <div className="mt-4 pt-3 border-t border-gray-100">
            <Link
              href="/search"
              className="text-xs font-bold text-brand-blue hover:underline inline-flex items-center gap-1"
            >
              <span>Explore places to save</span>
              <span>&rarr;</span>
            </Link>
          </div>
        </div>

        {/* Lead Inquiries */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase text-gray-400">Inquiries</span>
            <div className="p-2 rounded-xl bg-amber-50 text-brand-amber">
              <MessageSquare className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-brand-navy">0</div>
          <p className="text-xs text-gray-500 mt-1">Direct quote requests sent</p>
          <div className="mt-4 pt-3 border-t border-gray-100">
            <span className="text-xs text-gray-400 font-medium">No open inquiries</span>
          </div>
        </div>

        {/* Written Reviews */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase text-gray-400">My Reviews</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <Star className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-brand-navy">0</div>
          <p className="text-xs text-gray-500 mt-1">Ratings and feedback published</p>
          <div className="mt-4 pt-3 border-t border-gray-100">
            <span className="text-xs text-gray-400 font-medium">No reviews written yet</span>
          </div>
        </div>
      </div>

      {/* Recommended Discovery Strip */}
      <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-black text-brand-navy">
              Explore Popular Indian Services
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Quick access to essential everyday categories near you.
            </p>
          </div>
          <Link
            href="/categories"
            className="text-xs font-bold text-brand-blue hover:underline inline-flex items-center gap-1"
          >
            <span>All Categories</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Restaurants & Cafes', slug: 'restaurants' },
            { label: 'Hospitals & Clinics', slug: 'hospitals' },
            { label: 'Home Repairs', slug: 'home-services' },
            { label: 'Real Estate', slug: 'real-estate' },
          ].map((item) => (
            <Link
              key={item.slug}
              href={`/search?category=${item.slug}`}
              className="p-4 rounded-xl border border-gray-200 hover:border-brand-blue hover:bg-blue-50/50 transition-all text-center"
            >
              <Building2 className="w-5 h-5 text-brand-blue mx-auto mb-2" />
              <span className="text-xs font-bold text-brand-navy block truncate">
                {item.label}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

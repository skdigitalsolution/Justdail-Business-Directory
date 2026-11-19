'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Search, MapPin, Building2, ArrowLeft, Filter, ShieldAlert } from 'lucide-react';
import { SearchBar } from '@/components/SearchBar';

function SearchResultsContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const city = searchParams.get('city') || '';
  const category = searchParams.get('category') || '';

  const hasSearchParams = query || city || category;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1">
      {/* Search Header Bar */}
      <div className="mb-8">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-blue hover:underline mb-4"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Home</span>
        </Link>
        <h1 className="text-2xl sm:text-3xl font-black text-brand-navy mb-4">
          Local Business Search Directory
        </h1>
        <div className="max-w-3xl">
          <SearchBar
            initialQuery={query}
            initialCity={city ? city.charAt(0).toUpperCase() + city.slice(1) : 'Mumbai'}
          />
        </div>
      </div>

      {/* Query Filter Pills */}
      {hasSearchParams && (
        <div className="flex flex-wrap items-center gap-2 mb-8 bg-white p-3 rounded-xl border border-gray-200 text-xs shadow-2xs">
          <span className="font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1">
            <Filter className="w-3.5 h-3.5 text-brand-blue" />
            <span>Active Filters:</span>
          </span>
          {query && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-50 text-brand-blue font-semibold border border-blue-200">
              Query: &quot;{query}&quot;
            </span>
          )}
          {city && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 font-semibold border border-amber-200">
              City: {city.toUpperCase()}
            </span>
          )}
          {category && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-purple-50 text-purple-800 font-semibold border border-purple-200">
              Category: {category}
            </span>
          )}
        </div>
      )}

      {/* Honest Empty State per Rule 13 */}
      <div className="bg-white rounded-3xl border border-gray-200 p-8 sm:p-14 text-center shadow-sm">
        <div className="w-16 h-16 rounded-2xl bg-amber-50 text-brand-amber flex items-center justify-center mx-auto mb-4">
          <Search className="w-8 h-8" />
        </div>

        <span className="inline-block px-3 py-1 rounded-full text-xs font-extrabold uppercase bg-amber-100 text-amber-800 mb-3">
          Directory Index Notice
        </span>

        <h2 className="text-xl sm:text-2xl font-bold text-brand-navy mb-3">
          {hasSearchParams
            ? `No Verified Listings Found for "${query || category || 'Local Services'}" in ${city ? city.toUpperCase() : 'selected area'}`
            : 'Select a Category or Enter a Business to Search'}
        </h2>

        <p className="text-sm text-gray-600 max-w-lg mx-auto mb-8 leading-relaxed">
          The All-India business search index is undergoing initial compilation and verified merchant
          onboarding. In accordance with platform integrity rules, no fabricated or unverified
          businesses are presented.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/add-business"
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-brand-blue hover:bg-brand-blue-hover text-white text-xs sm:text-sm font-bold shadow-md transition-colors"
          >
            + List a Business in {city ? city.toUpperCase() : 'This City'}
          </Link>
          <Link
            href="/categories"
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-brand-navy text-xs sm:text-sm font-bold transition-colors"
          >
            Browse All 12 Categories
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 py-16 text-center text-sm text-gray-500">
          Loading Search Results...
        </div>
      }
    >
      <SearchResultsContent />
    </Suspense>
  );
}

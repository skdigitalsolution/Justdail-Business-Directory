import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Building2, ShieldCheck, MapPin, Sparkles } from 'lucide-react';

export default function BusinessDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full flex-1">
      <Link
        href="/search"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-blue hover:text-brand-blue-hover mb-6"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to LocalFind Directory Search</span>
      </Link>

      <div className="bg-white rounded-3xl border border-gray-200/90 p-8 sm:p-12 shadow-card text-center">
        <div className="w-16 h-16 rounded-2xl bg-brand-blue-light text-brand-blue flex items-center justify-center mx-auto mb-4 border border-brand-blue/20">
          <Building2 className="w-8 h-8" />
        </div>

        <span className="inline-block px-3 py-1 rounded-full text-xs font-mono font-bold uppercase bg-brand-bg text-brand-navy border border-gray-200 mb-3">
          Identifier: {params.slug}
        </span>

        <h1 className="text-2xl sm:text-3xl font-black text-brand-navy mb-2">
          Business Storefront Under Verification
        </h1>

        <p className="text-xs sm:text-sm text-gray-500 max-w-lg mx-auto mb-8 leading-relaxed">
          Storefront photo gallery, operational business hours, customer review ratings, direct call options,
          and instant lead quote requests will be connected in upcoming business data releases.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/search"
            className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 rounded-xl bg-brand-blue hover:bg-brand-blue-hover text-white text-xs font-bold shadow-sm transition-colors"
          >
            Explore Directory Search
          </Link>

          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-brand-navy text-xs font-bold transition-colors"
          >
            LocalFind Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}

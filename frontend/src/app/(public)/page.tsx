'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ShieldCheck,
  CheckCircle2,
  Building2,
  MapPin,
  ArrowRight,
  TrendingUp,
  Sparkles,
  Layers,
  Search,
  Filter,
  PhoneCall,
  Play,
} from 'lucide-react';
import { SearchBar } from '@/components/SearchBar';
import { HeroBanner } from '@/components/HeroBanner';
import { CategoryCard, CategoryItem } from '@/components/CategoryCard';
import { api } from '@/lib/api';
import { HealthResponse, DatabaseHealthResponse } from '@/types';

// Featured and Compact Category Lists using Real High-Resolution Photography
const FEATURED_CATEGORIES: CategoryItem[] = [
  {
    id: 'cat-1',
    name: 'Restaurants & Dining',
    slug: 'restaurants',
    image: '/images/categories/restaurants.jpg',
    badge: 'Popular',
    description: 'Fine dining, multicuisine restaurants, cafes, rooftop lounges, and authentic local street food.',
    count: '24,000+ verified spots',
  },
  {
    id: 'cat-2',
    name: 'Hotels & Resorts',
    slug: 'hotels',
    image: '/images/categories/hotels.jpg',
    badge: 'Trending',
    description: 'Luxury suites, boutique stays, heritage resorts, and premier business accommodations across India.',
    count: '18,500+ stays nationwide',
  },
];

const COMPACT_CATEGORIES: CategoryItem[] = [
  {
    id: 'cat-3',
    name: 'Hospitals & Clinics',
    slug: 'hospitals',
    image: '/images/categories/hospitals.jpg',
    badge: 'Essential',
    count: '15,200+ healthcare centers',
  },
  {
    id: 'cat-4',
    name: 'Home Services & Repairs',
    slug: 'home-services',
    image: '/images/categories/home-services.jpg',
    badge: 'Top Search',
    count: '32,000+ technicians',
  },
  {
    id: 'cat-5',
    name: 'Beauty & Salons',
    slug: 'beauty-salons',
    image: '/images/categories/beauty-salons.jpg',
    count: '19,000+ spas & salons',
  },
  {
    id: 'cat-6',
    name: 'Education & Coaching',
    slug: 'education',
    image: '/images/categories/education.jpg',
    count: '14,000+ institutes',
  },
  {
    id: 'cat-7',
    name: 'Real Estate & Builders',
    slug: 'real-estate',
    image: '/images/categories/real-estate.jpg',
    count: '21,000+ properties & agents',
  },
  {
    id: 'cat-8',
    name: 'Automotive & Car Care',
    slug: 'automotive',
    image: '/images/categories/automotive.jpg',
    count: '16,800+ garages & dealers',
  },
  {
    id: 'cat-9',
    name: 'Construction & Architects',
    slug: 'construction',
    image: '/images/categories/construction.jpg',
    count: '11,400+ contractors',
  },
  {
    id: 'cat-10',
    name: 'Electronics & Gadgets',
    slug: 'electronics',
    image: '/images/categories/electronics.jpg',
    count: '28,000+ retail outlets',
  },
  {
    id: 'cat-11',
    name: 'Travel & Transport',
    slug: 'travel',
    image: '/images/categories/travel.jpg',
    count: '12,500+ tour operators',
  },
  {
    id: 'cat-12',
    name: 'Fitness & Gyms',
    slug: 'fitness',
    image: '/images/categories/fitness.jpg',
    count: '9,800+ fitness centers',
  },
];

// City Metadata using Real Indian City Photographs
interface CityCardItem {
  name: string;
  state: string;
  slug: string;
  tag: string;
  image: string;
}

const CITIES: CityCardItem[] = [
  { name: 'Mumbai', state: 'Maharashtra', slug: 'mumbai', tag: 'Financial Capital', image: '/images/cities/mumbai.jpg' },
  { name: 'Delhi', state: 'NCR', slug: 'delhi', tag: 'National Capital', image: '/images/cities/delhi.jpg' },
  { name: 'Bengaluru', state: 'Karnataka', slug: 'bengaluru', tag: 'Silicon Valley of India', image: '/images/cities/bengaluru.jpg' },
  { name: 'Hyderabad', state: 'Telangana', slug: 'hyderabad', tag: 'Cyber City & Pharma Hub', image: '/images/cities/hyderabad.jpg' },
  { name: 'Chennai', state: 'Tamil Nadu', slug: 'chennai', tag: 'Automobile & Healthcare Hub', image: '/images/cities/chennai.jpg' },
  { name: 'Pune', state: 'Maharashtra', slug: 'pune', tag: 'IT & Manufacturing Center', image: '/images/cities/pune.jpg' },
  { name: 'Kolkata', state: 'West Bengal', slug: 'kolkata', tag: 'Commercial & Cultural Hub', image: '/images/cities/kolkata.jpg' },
  { name: 'Ahmedabad', state: 'Gujarat', slug: 'ahmedabad', tag: 'Textile & Commercial Center', image: '/images/cities/ahmedabad.jpg' },
  { name: 'Jaipur', state: 'Rajasthan', slug: 'jaipur', tag: 'Heritage & Trade Capital', image: '/images/cities/jaipur.jpg' },
  { name: 'Surat', state: 'Gujarat', slug: 'surat', tag: 'Diamond & Silk Hub', image: '/images/cities/surat.jpg' },
];

const POPULAR_SEARCH_BADGES = [
  'Dentists',
  'Plumbers',
  'Restaurants',
  'Packers & Movers',
  'Interior Designers',
  'Electricians',
  'Car Care',
];

const VERIFIED_TABS = ['All', 'Restaurants', 'Healthcare', 'Home Services', 'Education'];

export default function HomePage() {
  const [activeTab, setActiveTab] = useState('All');
  const [apiHealth, setApiHealth] = useState<HealthResponse | null>(null);
  const [dbHealth, setDbHealth] = useState<DatabaseHealthResponse | null>(null);

  // Background health check from Phase 01 to preserve verified system telemetry
  useEffect(() => {
    let isMounted = true;
    async function checkHealth() {
      try {
        const [a, d] = await Promise.allSettled([
          api.getHealth(),
          api.getDatabaseHealth(),
        ]);
        if (isMounted) {
          if (a.status === 'fulfilled') setApiHealth(a.value);
          if (d.status === 'fulfilled') setDbHealth(d.value);
        }
      } catch {
        // Silently preserve offline state
      }
    }
    checkHealth();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="flex flex-col gap-14 sm:gap-20 pb-16">
      {/* ========================================================
          STEP 3 — CINEMATIC HERO VIDEO SECTION
          ======================================================== */}
      <section className="relative w-full overflow-hidden min-h-[560px] md:min-h-[620px] max-h-[700px] flex items-center justify-center bg-brand-navy">
        {/* Background Video with Fallback Poster */}
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster="/images/hero-poster.jpg"
          className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none"
        >
          <source src="/videos/hero-background.mp4" type="video/mp4" />
        </video>

        {/* Cinematic Vignette and Dark Gradient Overlays for Guaranteed Text Legibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-brand-navy/95 via-brand-navy/80 to-brand-navy" />
        <div className="absolute inset-0 bg-black/35 pointer-events-none" />

        {/* Hero Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-16 sm:py-20 flex flex-col items-center">
          {/* Trust Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-white/10 backdrop-blur-md text-amber-300 border border-white/15 mb-5 shadow-lg">
            <Sparkles className="w-3.5 h-3.5 text-brand-amber animate-pulse" />
            <span>India&apos;s Verified Local Business Directory</span>
          </div>

          {/* Master Headline */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-white leading-[1.15] mb-4 drop-shadow-md">
            Discover the Best <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-sky-200 to-amber-300">
              Businesses Across India
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-base md:text-lg text-gray-200 max-w-2xl mx-auto mb-8 leading-relaxed font-normal drop-shadow">
            Search top-rated restaurants, home services, healthcare, hotels, and local professionals.
            Verified contact numbers, authentic addresses, and genuine ratings.
          </p>

          {/* Floating Premium Search Bar Container */}
          <div className="w-full max-w-3xl mx-auto mb-6 p-2 rounded-2xl bg-white/15 backdrop-blur-lg border border-white/25 shadow-2xl">
            <SearchBar className="w-full" />
          </div>

          {/* Popular Search Badges */}
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-gray-200">
            <span className="font-bold text-gray-300 uppercase tracking-wider text-[11px]">
              Popular:
            </span>
            {POPULAR_SEARCH_BADGES.map((badge) => (
              <Link
                key={badge}
                href={`/search?q=${encodeURIComponent(badge)}`}
                className="px-3 py-1 rounded-full bg-white/15 hover:bg-white/25 text-white border border-white/20 backdrop-blur-sm transition-all duration-200 font-medium hover:border-brand-amber hover:text-amber-200"
              >
                {badge}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================
          STEP 4 — HERO PROMOTIONAL BANNER SLIDER
          ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full -mt-8 sm:-mt-12 relative z-20">
        <HeroBanner />
      </section>

      {/* ========================================================
          STEP 5 — PHOTOGRAPHY-LED CATEGORIES (EDITORIAL GRID)
          ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4 pb-4 border-b border-gray-200">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-blue mb-1">
              <Building2 className="w-4 h-4" />
              <span>Browse by Industry</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-brand-navy tracking-tight">
              Popular Business Categories
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Explore 12 essential commercial sectors with verified providers nationwide.
            </p>
          </div>

          <Link
            href="/categories"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-blue hover:text-brand-blue-hover transition-colors"
          >
            <span>View All Categories</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Asymmetric Editorial Grid: 2 Featured Highlight Cards on Top */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
          {FEATURED_CATEGORIES.map((cat) => (
            <CategoryCard key={cat.id} category={cat} variant="featured" />
          ))}
        </div>

        {/* 10 Compact Photography Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
          {COMPACT_CATEGORIES.map((cat) => (
            <CategoryCard key={cat.id} category={cat} variant="compact" />
          ))}
        </div>
      </section>

      {/* ========================================================
          STEP 6 — VERIFIED & TRENDING BUSINESSES (HONEST PHASE 02 STATE)
          ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-4 pb-4 border-b border-gray-200">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-600 mb-1">
              <ShieldCheck className="w-4 h-4" />
              <span>Verified Merchant Discovery</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-brand-navy tracking-tight">
              Verified &amp; Trending Businesses
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Hand-verified merchants upholding strict quality, licensing, and consumer satisfaction standards.
            </p>
          </div>

          <Link
            href="/add-business"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-blue hover:text-brand-blue-hover"
          >
            <span>Register Your Enterprise</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2 mb-6">
          {VERIFIED_TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === tab
                  ? 'bg-brand-navy text-white shadow-md'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Honest Onboarding State per Rule 7 */}
        <div className="bg-white rounded-3xl border border-gray-200 p-8 sm:p-12 text-center shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4 border border-emerald-100 shadow-inner">
            <ShieldCheck className="w-8 h-8" />
          </div>

          <h3 className="text-xl font-bold text-brand-navy mb-2">
            Active Multi-Tier Onboarding: {activeTab === 'All' ? 'All Commercial Sectors' : `${activeTab} Sector`}
          </h3>

          <p className="text-sm text-gray-600 max-w-xl mx-auto mb-6 leading-relaxed">
            We are actively vetting and authenticating business licenses, GST registrations, and direct contact
            details across India. Listings only appear here after legal document inspection and telephone verification.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/add-business"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-brand-blue hover:bg-brand-blue-hover text-white text-xs sm:text-sm font-bold shadow-md transition-colors"
            >
              <span>+ Register as Verified Merchant</span>
            </Link>
            <Link
              href="/categories"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-brand-navy text-xs sm:text-sm font-bold transition-colors"
            >
              <span>Browse All Categories</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ========================================================
          STEP 7 — PLATFORM SHOWCASE VIDEO SECTION
          ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="relative rounded-3xl overflow-hidden bg-brand-navy text-white p-6 sm:p-10 md:p-12 border border-gray-800 shadow-2xl">
          {/* Subtle Ambient Radial Glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-brand-blue/20 rounded-full blur-3xl pointer-events-none" />

          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto mb-8 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-brand-blue/30 text-blue-300 border border-blue-500/30 mb-3">
              <Sparkles className="w-3.5 h-3.5 text-brand-amber" />
              <span>Platform Experience</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-white">
              Explore More. Discover Better.
            </h2>
            <p className="text-xs sm:text-sm text-gray-300 mt-2">
              Watch how our directory connects millions of buyers with verified local service providers across India.
            </p>
          </div>

          {/* Video Container */}
          <div className="relative z-10 max-w-4xl mx-auto rounded-2xl overflow-hidden shadow-2xl border border-white/20 aspect-video bg-black">
            <video
              controls
              playsInline
              preload="metadata"
              poster="/images/showcase-poster.jpg"
              className="w-full h-full object-cover"
            >
              <source src="/videos/showcase.mp4" type="video/mp4" />
              Your browser does not support HTML5 video playback.
            </video>
          </div>

          {/* Quick Metrics Bar */}
          <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto mt-8 pt-6 border-t border-gray-800 text-center">
            <div>
              <div className="text-xl sm:text-2xl font-black text-white">100%</div>
              <div className="text-[11px] text-gray-400 mt-0.5">Verified Indian Businesses</div>
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black text-brand-amber">10+</div>
              <div className="text-[11px] text-gray-400 mt-0.5">Metro &amp; Tier-1 Cities</div>
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black text-white">500+</div>
              <div className="text-[11px] text-gray-400 mt-0.5">Commercial Categories</div>
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black text-emerald-400">0%</div>
              <div className="text-[11px] text-gray-400 mt-0.5">Hidden Commission Fees</div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          STEP 8 — EXPLORE CITIES BY PHOTOGRAPHY
          ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-brand-blue mb-2">
            <MapPin className="w-4 h-4" />
            <span>All-India Footprint</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-brand-navy tracking-tight mb-2">
            Explore Businesses by City
          </h2>
          <p className="text-xs sm:text-sm text-gray-500">
            Access local directories across India&apos;s leading commercial and industrial centers.
          </p>
        </div>

        {/* 10 Cities Grid with Real Indian City Photography */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4">
          {CITIES.map((city) => (
            <Link
              key={city.name}
              href={`/search?city=${city.slug}`}
              className="group relative h-60 rounded-2xl overflow-hidden border border-gray-200 bg-brand-navy shadow-sm hover:shadow-xl hover:border-brand-blue/50 transition-all duration-300 flex flex-col justify-end p-4"
            >
              {/* Background City Image */}
              <Image
                src={city.image}
                alt={`${city.name} business directory`}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
              />

              {/* Gradient Vignette */}
              <div className="absolute inset-0 bg-gradient-to-t from-brand-navy via-brand-navy/60 to-transparent opacity-90 group-hover:opacity-80 transition-opacity" />

              {/* City Content */}
              <div className="relative z-10">
                <span className="inline-block px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-white/20 backdrop-blur-md text-white mb-1.5 border border-white/20">
                  {city.state}
                </span>
                <h3 className="text-lg font-black text-white group-hover:text-amber-300 transition-colors">
                  {city.name}
                </h3>
                <p className="text-[11px] text-gray-300 font-medium line-clamp-1">{city.tag}</p>
                <div className="mt-2 pt-2 border-t border-white/15 flex items-center justify-between text-[11px] font-semibold text-blue-200">
                  <span>Explore City</span>
                  <span className="group-hover:translate-x-1 transition-transform text-brand-amber">&rarr;</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ========================================================
          STEP 9 — HOW IT WORKS SECTION (COMPACT 3-STEP)
          ======================================================== */}
      <section className="bg-brand-bg/80 border-y border-gray-200 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-blue">
              Simple 3-Step Workflow
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-brand-navy tracking-tight mt-1">
              How the Directory Works
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Connect with reputable merchants in three transparent steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {/* Step 1 */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm relative hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-brand-blue flex items-center justify-center font-black text-lg mb-4">
                1
              </div>
              <h3 className="text-lg font-bold text-brand-navy mb-2">
                Search &amp; Discover
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Filter by specific category, local locality, or city across 500+ commercial categories throughout India.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm relative hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-brand-amber flex items-center justify-center font-black text-lg mb-4">
                2
              </div>
              <h3 className="text-lg font-bold text-brand-navy mb-2">
                Compare &amp; Verify
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Inspect official verification badges, customer reviews, operational hours, and direct addresses.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm relative hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-black text-lg mb-4">
                3
              </div>
              <h3 className="text-lg font-bold text-brand-navy mb-2">
                Connect Directly
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Call directly, send an instant lead enquiry, or visit merchant locations without middleman commissions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          STEP 10 — MERCHANT GROWTH CTA (SPLIT-SCREEN WITH REAL PHOTOGRAPHY)
          ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="rounded-3xl bg-brand-navy text-white overflow-hidden shadow-2xl border border-gray-800 grid grid-cols-1 lg:grid-cols-12">
          {/* Left Column: Copy & Actions */}
          <div className="lg:col-span-7 p-8 sm:p-12 md:p-14 flex flex-col justify-center relative">
            <div className="absolute top-0 left-0 w-80 h-80 bg-brand-blue/20 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10">
              <span className="inline-block px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-brand-amber text-brand-navy mb-4 shadow">
                FOR BUSINESS OWNERS
              </span>

              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white mb-4 leading-tight">
                Your Business Deserves <br className="hidden sm:inline" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-sky-200 to-amber-200">
                  to Be Discovered.
                </span>
              </h2>

              <p className="text-sm sm:text-base text-gray-300 mb-8 leading-relaxed max-w-xl">
                Join thousands of verified business owners reaching local customers daily across India.
                Turn high-intent local searches into direct customer calls, foot traffic, and confirmed deals.
              </p>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-8">
                <Link
                  href="/add-business"
                  className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-brand-blue hover:bg-brand-blue-hover text-white text-sm font-bold shadow-lg transition-colors"
                >
                  <span>+ List Your Business</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/pricing"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-sm font-bold border border-white/20 transition-colors"
                >
                  <span>View Merchant Plans</span>
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-gray-800 text-xs text-gray-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Direct Customer Inquiries</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Zero Commission Fees</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Verified Trust Badge</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Real Commercial Photography */}
          <div className="lg:col-span-5 relative min-h-[340px] lg:min-h-full">
            <Image
              src="/images/merchant-cta.jpg"
              alt="Indian business entrepreneur welcoming customers"
              fill
              sizes="(max-width: 1024px) 100vw, 40vw"
              className="object-cover object-center"
            >
            </Image>
            <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-brand-navy via-brand-navy/30 to-transparent" />

            {/* Floating Trust Metric Card */}
            <div className="absolute bottom-6 right-6 left-6 sm:left-auto sm:max-w-xs bg-brand-navy/85 backdrop-blur-md border border-white/20 p-4 rounded-2xl shadow-xl text-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-brand-amber/20 flex items-center justify-center text-brand-amber">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-lg font-black text-white">100,000+</div>
                  <div className="text-[11px] text-gray-300">Inquiries Generated Monthly</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          STEP 11 — LIVE ARCHITECTURE & TELEMETRY STRIP (Preserved from Phase 01)
          ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-5 flex flex-col md:flex-row items-center justify-between gap-4 text-xs shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-lg text-brand-blue">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-brand-navy block">
                Production Infrastructure Status
              </span>
              <span className="text-gray-500">
                Next.js 14 App Router • NestJS v10 REST • MySQL 8 (justdials-business)
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-gray-600 font-mono text-[11px]">
            <span className="flex items-center gap-1.5">
              <span
                className={`w-2 h-2 rounded-full ${
                  apiHealth?.status === 'ok' ? 'bg-emerald-500' : 'bg-gray-400'
                }`}
              />
              Backend API:{' '}
              <strong className="text-brand-navy">
                {apiHealth?.status === 'ok' ? 'Online' : 'Checking'}
              </strong>
            </span>

            <span className="flex items-center gap-1.5">
              <span
                className={`w-2 h-2 rounded-full ${
                  dbHealth?.status === 'connected' ? 'bg-emerald-500' : 'bg-gray-400'
                }`}
              />
              MySQL 8:{' '}
              <strong className="text-brand-navy">
                {dbHealth?.status === 'connected'
                  ? `Connected (${dbHealth.latencyMs}ms)`
                  : 'Checking'}
              </strong>
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}

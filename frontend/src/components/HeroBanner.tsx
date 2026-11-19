'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Pause, Play, Sparkles } from 'lucide-react';

export interface BannerItem {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  ctaText: string;
  ctaLink: string;
  image: string;
  imageAlt: string;
}

export const INITIAL_BANNERS: BannerItem[] = [
  {
    id: 'banner-1',
    title: 'Verified Home Maintenance & Repairs',
    subtitle: 'Connect with certified electricians, plumbers, and technicians across 500+ Indian cities.',
    badge: 'TOP RATED SERVICES',
    ctaText: 'Find Local Technicians',
    ctaLink: '/search?category=home-services',
    image: '/images/banners/banner-home-services.jpg',
    imageAlt: 'Professional Home Cleaning and AC Repair Services in India',
  },
  {
    id: 'banner-2',
    title: 'Trusted Clinics & Super-Specialty Hospitals',
    subtitle: 'Access 24/7 emergency care, diagnostic centers, and certified doctors in your neighborhood.',
    badge: 'HEALTHCARE ESSENTIALS',
    ctaText: 'Discover Clinics',
    ctaLink: '/search?category=hospitals',
    image: '/images/banners/banner-healthcare.jpg',
    imageAlt: 'Verified Healthcare Specialists and Hospitals across India',
  },
  {
    id: 'banner-3',
    title: 'Grow Your Business With 10x More Leads',
    subtitle: 'Create a free verified listing today and reach high-intent customers searching in your city.',
    badge: 'MERCHANT ONBOARDING',
    ctaText: 'Add Your Business Free',
    ctaLink: '/add-business',
    image: '/images/banners/banner-merchant-grow.jpg',
    imageAlt: 'Local Business Growth and Lead Generation Marketplace',
  },
  {
    id: 'banner-4',
    title: 'Exclusive Merchant Deals & Festive Offers',
    subtitle: 'Explore local promotions, seasonal discounts, and verified merchant packages near you.',
    badge: 'SPECIAL OFFERS',
    ctaText: 'Explore Local Deals',
    ctaLink: '/search?category=restaurants',
    image: '/images/banners/banner-festive-deals.jpg',
    imageAlt: 'Exclusive Deals from Top Verified Local Merchants',
  },
];

interface HeroBannerProps {
  banners?: BannerItem[];
  autoPlayInterval?: number;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  banners = INITIAL_BANNERS,
  autoPlayInterval = 6000,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);

  const total = banners.length;

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % total);
  }, [total]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  useEffect(() => {
    if (isPaused) return;

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) return;

    const timer = setInterval(() => {
      nextSlide();
    }, autoPlayInterval);

    return () => clearInterval(timer);
  }, [isPaused, nextSlide, autoPlayInterval]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') prevSlide();
    else if (e.key === 'ArrowRight') nextSlide();
  };

  const current = banners[currentIndex];

  return (
    <section
      ref={sliderRef}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      aria-roledescription="carousel"
      aria-label="Promotional Services & Deals"
      className="relative w-full rounded-3xl overflow-hidden shadow-2xl border border-gray-200/80 focus:outline-none focus:ring-2 focus:ring-brand-blue group"
    >
      {/* Slide Visual Wrapper */}
      <div className="relative w-full aspect-[21/9] min-h-[300px] sm:min-h-[360px] md:min-h-[420px] bg-brand-navy flex items-center">
        {/* Background Photograph */}
        <div className="absolute inset-0">
          <Image
            src={current.image}
            alt={current.imageAlt}
            fill
            priority={currentIndex === 0}
            className="object-cover object-center transform scale-105 transition-transform duration-1000 ease-out"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 95vw, 1280px"
          />
          {/* Cinematic Duotone & Dark Vignette Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-brand-navy/95 via-brand-navy/75 to-black/40" />
        </div>

        {/* Foreground Editorial Text */}
        <div className="relative z-10 max-w-2xl px-6 sm:px-12 md:px-16 py-8 text-white">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-brand-amber text-brand-navy mb-4 shadow-md">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{current.badge}</span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-5xl font-black tracking-tight text-white mb-3 leading-[1.15]">
            {current.title}
          </h2>

          <p className="text-xs sm:text-base text-gray-200 max-w-xl mb-8 leading-relaxed font-normal">
            {current.subtitle}
          </p>

          <div>
            <Link
              href={current.ctaLink}
              className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-brand-blue hover:bg-brand-blue-hover text-white font-bold text-xs sm:text-sm transition-all shadow-lg hover:shadow-xl hover:translate-x-0.5"
            >
              <span>{current.ctaText}</span>
              <span className="text-lg">→</span>
            </Link>
          </div>
        </div>

        {/* Pause/Play Controls */}
        <button
          onClick={() => setIsPaused(!isPaused)}
          aria-label={isPaused ? 'Resume autoplay' : 'Pause autoplay'}
          className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-black/40 hover:bg-black/60 text-white/90 hover:text-white backdrop-blur-sm transition-all"
        >
          {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
        </button>

        {/* Arrow Controls */}
        <button
          onClick={prevSlide}
          aria-label="Previous promotional slide"
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/90 hover:bg-white text-brand-navy shadow-xl hover:scale-110 transition-all opacity-90 group-hover:opacity-100"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <button
          onClick={nextSlide}
          aria-label="Next promotional slide"
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/90 hover:bg-white text-brand-navy shadow-xl hover:scale-110 transition-all opacity-90 group-hover:opacity-100"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Pagination Indicators */}
      <div
        className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 bg-black/40 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10"
        role="tablist"
        aria-label="Slider Pagination"
      >
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            aria-label={`Go to slide ${index + 1}`}
            aria-selected={currentIndex === index}
            role="tab"
            className={`transition-all duration-300 rounded-full ${
              currentIndex === index
                ? 'w-7 h-2 bg-brand-amber'
                : 'w-2 h-2 bg-white/50 hover:bg-white'
            }`}
          />
        ))}
      </div>
    </section>
  );
};

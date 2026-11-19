import React from 'react';
import Link from 'next/link';
import { POPULAR_CITIES } from '@/lib/constants';
import { ShieldCheck, MapPin, Building2, Sparkles } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-brand-navy text-white/80 border-t border-brand-navy-light/40 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Brand Col */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-8 h-8 rounded-lg bg-brand-navy-light flex items-center justify-center border border-white/20">
                <span className="text-sm font-black text-brand-orange">L</span>
                <span className="text-sm font-black text-brand-blue -ml-0.5">F</span>
              </div>
              <span className="font-black text-white text-lg tracking-tight">
                Local<span className="text-brand-blue">Find</span> <span className="text-brand-orange text-xs uppercase font-extrabold tracking-wider">India</span>
              </span>
            </div>
            <p className="text-xs text-gray-300 leading-relaxed max-w-sm mb-4">
              All-India modern local business discovery and search directory connecting customers with verified
              services, merchants, and professionals across India.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/10 border border-white/15 text-xs text-blue-200">
              <ShieldCheck className="w-4 h-4 text-brand-green" />
              <span>Verified Merchant Directory Framework</span>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-brand-blue" />
              <span>Top Categories</span>
            </h4>
            <ul className="text-xs space-y-2 text-gray-300">
              <li><Link href="/search?category=restaurants" className="hover:text-white transition-colors">Restaurants &amp; Dining</Link></li>
              <li><Link href="/search?category=hospitals" className="hover:text-white transition-colors">Hospitals &amp; Healthcare</Link></li>
              <li><Link href="/search?category=hotels" className="hover:text-white transition-colors">Hotels &amp; Resorts</Link></li>
              <li><Link href="/search?category=home-services" className="hover:text-white transition-colors">Home Services</Link></li>
              <li><Link href="/search?category=education" className="hover:text-white transition-colors">Education &amp; Coaching</Link></li>
              <li><Link href="/categories" className="text-brand-orange hover:underline font-bold">View All 12 Categories &rarr;</Link></li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">
              Quick Links
            </h4>
            <ul className="text-xs space-y-2 text-gray-300">
              <li><Link href="/about" className="hover:text-white transition-colors">About LocalFind</Link></li>
              <li><Link href="/add-business" className="hover:text-white transition-colors">List Your Business</Link></li>
              <li><Link href="/pricing" className="hover:text-white transition-colors">Merchant Plans</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Customer Support</Link></li>
              <li><Link href="/login" className="hover:text-white transition-colors">Sign In / Register</Link></li>
            </ul>
          </div>

          {/* Trust & Legal */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">
              Trust &amp; Legal
            </h4>
            <ul className="text-xs space-y-2 text-gray-300">
              <li><Link href="/about" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="/about" className="hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link href="/about" className="hover:text-white transition-colors">Verification Guidelines</Link></li>
              <li><Link href="/about" className="hover:text-white transition-colors">Content Moderation</Link></li>
            </ul>
          </div>
        </div>

        {/* Popular Cities Strip */}
        <div className="border-t border-white/10 pt-8 pb-6">
          <div className="flex items-center gap-2 mb-3">
            <MapPin className="w-3.5 h-3.5 text-brand-orange" />
            <span className="text-xs font-bold uppercase tracking-wider text-white">
              Explore Popular Indian Cities
            </span>
          </div>
          <div className="flex flex-wrap gap-2 text-xs text-gray-300">
            {POPULAR_CITIES.map((city) => (
              <Link
                key={city}
                href={`/search?city=${city.toLowerCase()}`}
                className="hover:text-white hover:border-brand-blue transition-colors bg-white/5 px-2.5 py-1 rounded-lg border border-white/10"
              >
                {city}
              </Link>
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-400 gap-2">
          <span>
            &copy; {new Date().getFullYear()} LocalFind India Directory Platform. All rights reserved.
          </span>
          <span className="font-mono text-gray-400">
            Next.js 14 • NestJS • MySQL 8
          </span>
        </div>
      </div>
    </footer>
  );
};

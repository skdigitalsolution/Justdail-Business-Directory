import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ShieldCheck, HeartHandshake, Award } from 'lucide-react';

export default function AboutPage() {
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
        <span className="text-xs font-bold uppercase tracking-wider text-brand-blue">
          About the Platform
        </span>
        <h1 className="text-3xl font-black text-brand-navy mt-1 mb-4">
          All-India Business Directory
        </h1>
        <p className="text-sm text-gray-600 leading-relaxed mb-8">
          The Justdial Business Directory Platform is an enterprise discovery solution engineered to
          connect consumers with verified local services and businesses across India. Built on modern
          high-performance web standards (Next.js 14, NestJS, and MySQL 8), our goal is to empower local
          merchants with honest visibility and give consumers transparent local search.
        </p>

        <div className="space-y-6 pt-6 border-t border-gray-100 text-xs text-gray-600 leading-relaxed">
          <div id="privacy">
            <h3 className="font-bold text-sm text-brand-navy mb-1">Privacy Policy</h3>
            <p>
              We adhere to strict data privacy principles. Merchant and consumer records are never sold to
              third-party brokers. Passwords and sensitive authentication credentials are encrypted using
              industry standard one-way salted hashing.
            </p>
          </div>

          <div id="terms">
            <h3 className="font-bold text-sm text-brand-navy mb-1">Terms & Conditions</h3>
            <p>
              All listed businesses must be legally registered commercial or professional entities in India.
              Fabrication of reviews or deceptive marketing is strictly prohibited under directory governance.
            </p>
          </div>

          <div id="verification">
            <h3 className="font-bold text-sm text-brand-navy mb-1">Verification Guidelines</h3>
            <p>
              Merchants requesting a Verified Badge undergo phone authentication and business documentation
              review (GST/Trade License) conducted by our verification officers.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Mail, MessageSquare, HelpCircle } from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full flex-1">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-blue hover:underline mb-6"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Home</span>
      </Link>

      <div className="bg-white rounded-3xl border border-gray-200 p-8 sm:p-12 shadow-sm mb-8">
        <span className="text-xs font-bold uppercase tracking-wider text-brand-blue">
          Customer & Merchant Support
        </span>
        <h1 className="text-3xl font-black text-brand-navy mt-1 mb-3">
          Contact Directory Support
        </h1>
        <p className="text-sm text-gray-600 mb-8">
          Have an inquiry regarding listing your business, verification status, or local search results?
          Our platform support team is here to assist.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <div className="p-5 rounded-2xl bg-brand-bg border border-gray-100 flex items-start gap-3">
            <Mail className="w-5 h-5 text-brand-blue shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-sm text-brand-navy">Merchant Assistance</h4>
              <p className="text-xs text-gray-500 mt-0.5">support@justdialdirectory.internal</p>
              <span className="text-[10px] text-gray-400">Response within 24 business hours</span>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-brand-bg border border-gray-100 flex items-start gap-3">
            <MessageSquare className="w-5 h-5 text-brand-amber shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-sm text-brand-navy">Verification Queries</h4>
              <p className="text-xs text-gray-500 mt-0.5">verification@justdialdirectory.internal</p>
              <span className="text-[10px] text-gray-400">KYC and documentation status</span>
            </div>
          </div>
        </div>

        {/* FAQs */}
        <div id="faq" className="pt-8 border-t border-gray-100">
          <h3 className="font-bold text-base text-brand-navy mb-4 flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-brand-blue" />
            <span>Frequently Asked Questions</span>
          </h3>

          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-xl border border-gray-200">
              <h5 className="font-bold text-brand-navy mb-1">Is listing a business free on the platform?</h5>
              <p className="text-gray-600">Yes, standard business registration is 100% free with no hidden maintenance fees.</p>
            </div>

            <div className="p-4 rounded-xl border border-gray-200">
              <h5 className="font-bold text-brand-navy mb-1">How does a merchant earn the Verified Badge?</h5>
              <p className="text-gray-600">Verification officers review your official trade license/GST and perform a phone validation test.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

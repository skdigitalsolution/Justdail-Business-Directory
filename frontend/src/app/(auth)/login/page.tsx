'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ShieldCheck,
  Smartphone,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  AlertCircle,
  Loader2,
  Lock,
} from 'lucide-react';
import { api, ApiError } from '@/lib/api';

export default function LoginPage() {
  const router = useRouter();

  const [mobileDigits, setMobileDigits] = useState('');
  const [fullName, setFullName] = useState('');
  const [consentAccepted, setConsentAccepted] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleMobileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow digits up to 10
    const raw = e.target.value.replace(/\D/g, '').slice(0, 10);
    setMobileDigits(raw);
    if (errorMessage) setErrorMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (mobileDigits.length !== 10) {
      setErrorMessage('Please enter a valid 10-digit Indian mobile number.');
      return;
    }

    if (!/^[6-9]\d{9}$/.test(mobileDigits)) {
      setErrorMessage('Indian mobile numbers must begin with digits 6, 7, 8, or 9.');
      return;
    }

    if (!consentAccepted) {
      setErrorMessage('Please agree to the Terms of Service & Privacy Policy to proceed.');
      return;
    }

    setLoading(true);
    const fullMobile = `+91${mobileDigits}`;

    try {
      const res = await api.requestOtp(fullMobile, consentAccepted);

      // Transition to verification screen with parameters
      const params = new URLSearchParams();
      params.set('mobile', fullMobile);
      if (fullName.trim()) params.set('name', fullName.trim());
      if (res.devOtp) params.set('devOtp', res.devOtp);

      router.push(`/verify-otp?${params.toString()}`);
    } catch (err) {
      if (err instanceof ApiError) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage('Failed to send verification code. Please check your network.');
      }
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-5xl bg-white rounded-3xl border border-gray-200 shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[580px]">
        {/* Left Column: Commercial Photography & Trust Points */}
        <div className="hidden lg:flex lg:col-span-5 relative bg-brand-navy text-white flex-col justify-between p-10 overflow-hidden">
          <Image
            src="/images/merchant-cta.jpg"
            alt="Verified Indian Commerce Platform"
            fill
            sizes="40vw"
            priority
            className="object-cover object-center opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-navy via-brand-navy/60 to-brand-navy/40" />

          {/* Top Trust Pill */}
          <div className="relative z-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/10 backdrop-blur-md text-amber-300 border border-white/15">
              <Sparkles className="w-3.5 h-3.5 text-brand-amber" />
              <span>All-India Directory</span>
            </div>
            <h2 className="text-3xl font-black tracking-tight text-white mt-4 leading-tight">
              One Secure Account. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-sky-200 to-amber-200">
                Endless Local Connections.
              </span>
            </h2>
            <p className="text-xs text-gray-300 mt-2 leading-relaxed">
              Log in to save favorite businesses, request quotes, post verified reviews, or manage your commercial enterprise.
            </p>
          </div>

          {/* Bottom Bullet Points */}
          <div className="relative z-10 space-y-3 pt-6 border-t border-white/15 text-xs text-gray-200">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Instant OTP authentication (Passwordless)</span>
            </div>
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Encrypted server sessions with HttpOnly cookies</span>
            </div>
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Direct access to Consumer, Merchant &amp; Staff portals</span>
            </div>
          </div>
        </div>

        {/* Right Column: OTP Request Form */}
        <div className="lg:col-span-7 p-6 sm:p-10 md:p-12 flex flex-col justify-center">
          <div className="max-w-md w-full mx-auto">
            {/* Header */}
            <div className="mb-8">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold text-brand-blue bg-blue-50 border border-blue-100 mb-2">
                <ShieldCheck className="w-3.5 h-3.5 text-brand-blue" />
                <span>Verified OTP Login</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-brand-navy tracking-tight">
                Welcome to Justdial Directory
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                Enter your mobile number to receive a secure one-time verification code.
              </p>
            </div>

            {/* Error Notification Alert */}
            {errorMessage && (
              <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-start gap-3">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="font-bold block">Authentication Notice</strong>
                  <span>{errorMessage}</span>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Optional Full Name (Helpful for new profiles) */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                  Your Full Name <span className="text-gray-400 font-normal lowercase">(optional)</span>
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Ramesh Patel"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 text-sm font-medium text-brand-navy placeholder-gray-400 focus:outline-none focus:border-brand-blue focus:ring-2 focus:ring-blue-100 transition-all"
                  maxLength={100}
                />
              </div>

              {/* Indian Mobile Number with Country Code */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                  Mobile Number <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center rounded-xl border border-gray-300 overflow-hidden focus-within:border-brand-blue focus-within:ring-2 focus-within:ring-blue-100 transition-all bg-white">
                  <div className="px-3.5 py-3 bg-gray-50 border-r border-gray-300 text-xs font-bold text-brand-navy flex items-center gap-1.5 shrink-0 select-none">
                    <Smartphone className="w-4 h-4 text-brand-blue" />
                    <span>+91</span>
                  </div>
                  <input
                    type="tel"
                    inputMode="numeric"
                    autoComplete="tel-national"
                    value={mobileDigits}
                    onChange={handleMobileChange}
                    placeholder="98765 43210"
                    required
                    className="w-full px-4 py-3 text-sm font-semibold tracking-wide text-brand-navy placeholder-gray-400 focus:outline-none bg-transparent"
                  />
                </div>
                <p className="text-[11px] text-gray-400 mt-1">
                  Standard Indian 10-digit mobile number.
                </p>
              </div>

              {/* Consent Checkbox */}
              <div className="flex items-start gap-2.5 pt-1">
                <input
                  id="consent"
                  type="checkbox"
                  checked={consentAccepted}
                  onChange={(e) => setConsentAccepted(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-gray-300 text-brand-blue focus:ring-brand-blue"
                />
                <label htmlFor="consent" className="text-[11px] text-gray-600 leading-snug">
                  I agree to the{' '}
                  <Link href="/about" className="text-brand-blue underline font-semibold">
                    Terms of Service
                  </Link>{' '}
                  and consent to receiving transactional verification SMS messages.
                </label>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-6 rounded-xl bg-brand-blue hover:bg-brand-blue-hover text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Dispatching Verification Code...</span>
                  </>
                ) : (
                  <>
                    <span>Send Verification Code</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Bottom Security Assurance */}
            <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-center gap-2 text-[11px] text-gray-400">
              <Lock className="w-3.5 h-3.5 text-emerald-500" />
              <span>TLS 256-bit encrypted • DLT Template Compliant</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

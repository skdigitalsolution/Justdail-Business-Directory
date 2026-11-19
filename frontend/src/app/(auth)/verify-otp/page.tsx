'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  ShieldCheck,
  ArrowRight,
  AlertCircle,
  Loader2,
  Clock,
  RotateCw,
  Edit2,
  Lock,
  Sparkles,
} from 'lucide-react';
import { api, ApiError } from '@/lib/api';
import { useAuth, getDashboardRoute } from '@/lib/auth-context';

function VerifyOtpContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setUserSession } = useAuth();

  const mobileParam = searchParams.get('mobile') || '';
  const nameParam = searchParams.get('name') || '';
  const devOtpParam = searchParams.get('devOtp') || '';

  const [otp, setOtp] = useState('');
  const [cooldown, setCooldown] = useState(60);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  // Redirect if no mobile number supplied
  useEffect(() => {
    if (!mobileParam) {
      router.replace('/login');
    }
  }, [mobileParam, router]);

  // 60-second Resend countdown timer
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => {
      setCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const clean = e.target.value.replace(/\D/g, '').slice(0, 6);
    setOtp(clean);
    if (errorMessage) setErrorMessage(null);
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (otp.length !== 6) {
      setErrorMessage('Please enter the complete 6-digit verification code.');
      return;
    }

    setLoading(true);

    try {
      const res = await api.verifyOtp(mobileParam, otp, nameParam);

      if (res.success && res.user) {
        setUserSession(res.user);
        setSuccessNotice('Authentication verified! Redirecting to your workspace...');

        // Determine destination based on backend-confirmed roles
        const destination = getDashboardRoute(res.user.roles);
        setTimeout(() => {
          router.push(destination);
        }, 700);
      }
    } catch (err) {
      if (err instanceof ApiError) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage('Verification failed. Please check the code and try again.');
      }
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (cooldown > 0 || resending) return;

    setResending(true);
    setErrorMessage(null);

    try {
      const res = await api.resendOtp(mobileParam);
      setCooldown(res.cooldownSeconds || 60);
      setSuccessNotice('A new verification code has been dispatched.');
      setTimeout(() => setSuccessNotice(null), 4000);
    } catch (err) {
      if (err instanceof ApiError) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage('Failed to resend OTP. Please wait a moment.');
      }
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-md bg-white rounded-3xl border border-gray-200 shadow-xl p-6 sm:p-10">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 text-brand-blue flex items-center justify-center mx-auto mb-3 shadow-inner">
            <Lock className="w-7 h-7" />
          </div>

          <h1 className="text-2xl font-black text-brand-navy tracking-tight">
            Verify Mobile Number
          </h1>

          <div className="flex items-center justify-center gap-2 mt-2 text-xs text-gray-500">
            <span>Code sent to:</span>
            <strong className="text-brand-navy font-mono font-bold">{mobileParam}</strong>
            <Link
              href="/login"
              className="text-brand-blue hover:underline inline-flex items-center gap-0.5 ml-1"
              title="Edit mobile number"
            >
              <Edit2 className="w-3 h-3" />
              <span>Edit</span>
            </Link>
          </div>
        </div>

        {/* Development Mode Simulated OTP Display */}
        {devOtpParam && (
          <div className="mb-6 p-3 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center justify-between shadow-2xs">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-brand-amber shrink-0" />
              <div>
                <span className="font-extrabold block">Simulated Local OTP</span>
                <span className="text-[11px] text-amber-700">Development mode active</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setOtp(devOtpParam)}
              className="px-2.5 py-1 bg-amber-200 hover:bg-amber-300 rounded-lg font-mono font-bold text-xs transition-colors"
            >
              Auto-Fill: {devOtpParam}
            </button>
          </div>
        )}

        {/* Notifications */}
        {errorMessage && (
          <div className="mb-5 p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successNotice && (
          <div className="mb-5 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>{successNotice}</span>
          </div>
        )}

        {/* Verification Form */}
        <form onSubmit={handleVerify} className="space-y-6">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2 text-center">
              Enter 6-Digit One-Time Password
            </label>
            <input
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              autoFocus
              value={otp}
              onChange={handleOtpChange}
              placeholder="• • • • • •"
              maxLength={6}
              className="w-full text-center tracking-[0.5em] text-2xl font-black font-mono py-3 px-4 rounded-2xl border-2 border-gray-300 focus:border-brand-blue focus:ring-4 focus:ring-blue-100 outline-none transition-all text-brand-navy"
            />
          </div>

          <button
            type="submit"
            disabled={loading || otp.length !== 6}
            className="w-full py-3.5 px-6 rounded-xl bg-brand-blue hover:bg-brand-blue-hover text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Verifying Authentication...</span>
              </>
            ) : (
              <>
                <span>Verify &amp; Continue</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Resend Cooldown Counter */}
        <div className="mt-6 pt-5 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-gray-400" />
            {cooldown > 0 ? (
              <span>
                Resend code in <strong className="font-bold text-brand-navy">{cooldown}s</strong>
              </span>
            ) : (
              <span>Didn&apos;t receive code?</span>
            )}
          </div>

          <button
            type="button"
            onClick={handleResend}
            disabled={cooldown > 0 || resending}
            className={`font-bold inline-flex items-center gap-1 transition-colors ${
              cooldown > 0
                ? 'text-gray-300 cursor-not-allowed'
                : 'text-brand-blue hover:underline cursor-pointer'
            }`}
          >
            {resending && <RotateCw className="w-3 h-3 animate-spin" />}
            <span>Resend OTP</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default function VerifyOtpPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-brand-blue" />
        </div>
      }
    >
      <VerifyOtpContent />
    </Suspense>
  );
}

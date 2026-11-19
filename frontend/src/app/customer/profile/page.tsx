'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  User,
  ShieldCheck,
  Smartphone,
  Mail,
  Lock,
  Save,
  CheckCircle2,
  AlertCircle,
  Loader2,
  KeyRound,
  Shield,
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { api, ApiError } from '@/lib/api';

export default function CustomerProfilePage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, refreshUser } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/login');
    }
  }, [isLoading, isAuthenticated, router]);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
    }
  }, [user]);

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-brand-blue" />
      </div>
    );
  }

  if (!user) return null;

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    try {
      const res = await api.updateProfile({
        name: name.trim() || undefined,
        email: email.trim() || undefined,
      });

      if (res.success) {
        await refreshUser();
        setSuccessMessage('Profile information updated successfully.');
        setTimeout(() => setSuccessMessage(null), 4000);
      }
    } catch (err) {
      if (err instanceof ApiError) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage('Failed to update profile. Please try again.');
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-brand-navy tracking-tight">
          Account Profile &amp; Security
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          Manage your verified contact details and platform permissions.
        </p>
      </div>

      {/* Notifications */}
      {successMessage && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-3">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-3">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-sm">
        <form onSubmit={handleUpdate} className="space-y-6">
          {/* Mobile Number (Read-Only Verified) */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
              Verified Mobile Number
            </label>
            <div className="flex items-center rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
              <Smartphone className="w-4 h-4 text-gray-400 mr-2.5 shrink-0" />
              <span className="text-sm font-bold font-mono text-brand-navy flex-1">
                {user.mobile}
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                <span>Verified</span>
              </span>
            </div>
            <p className="text-[11px] text-gray-400 mt-1.5 flex items-center gap-1">
              <Lock className="w-3 h-3 text-gray-400" />
              <span>
                To change your verified mobile number, an additional cryptographic OTP challenge will be required.
              </span>
            </p>
          </div>

          {/* Account Status Pill */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
              Account Status
            </label>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
                {user.accountStatus}
              </span>
              <span className="text-xs text-gray-500">
                Active member in good standing with unhindered directory access.
              </span>
            </div>
          </div>

          {/* Display Name */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
              Display Name
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your full name"
                maxLength={100}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 text-sm font-medium text-brand-navy placeholder-gray-400 focus:outline-none focus:border-brand-blue focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </div>

          {/* Email Address */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
              Email Address <span className="text-gray-400 font-normal lowercase">(optional)</span>
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                maxLength={255}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 text-sm font-medium text-brand-navy placeholder-gray-400 focus:outline-none focus:border-brand-blue focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </div>

          {/* Submit */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 rounded-xl bg-brand-blue hover:bg-brand-blue-hover text-white text-xs font-bold shadow-sm transition-colors flex items-center gap-2 disabled:opacity-60 cursor-pointer disabled:cursor-not-allowed"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving Updates...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Role-Based Permissions Inspection Box */}
      <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-sm">
        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
          <Shield className="w-5 h-5 text-brand-blue" />
          <h2 className="text-base font-bold text-brand-navy">
            Assigned Roles &amp; Security Entitlements
          </h2>
        </div>

        <div className="space-y-4">
          <div>
            <span className="text-xs font-bold text-gray-500 uppercase block mb-1.5">
              Platform Roles
            </span>
            <div className="flex flex-wrap gap-2">
              {user.roles.map((r) => (
                <span
                  key={r}
                  className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-blue-50 text-brand-blue border border-blue-200"
                >
                  {r}
                </span>
              ))}
            </div>
          </div>

          <div>
            <span className="text-xs font-bold text-gray-500 uppercase block mb-1.5">
              Granted Permissions ({user.permissions.length})
            </span>
            <div className="flex flex-wrap gap-1.5 max-h-40 overflow-y-auto p-2 bg-gray-50 rounded-xl border border-gray-200 font-mono text-[11px] text-gray-600">
              {user.permissions.map((p) => (
                <span
                  key={p}
                  className="px-2 py-0.5 rounded bg-white border border-gray-200 text-brand-navy"
                >
                  {p}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

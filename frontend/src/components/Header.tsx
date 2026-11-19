'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  MapPin,
  Search,
  User,
  PlusCircle,
  Menu,
  X,
  ChevronDown,
  Building2,
  Tag,
  ShieldCheck,
  LogOut,
  LayoutDashboard,
  UserCheck,
} from 'lucide-react';
import { POPULAR_CITIES } from '@/lib/constants';
import { useAuth } from '@/lib/auth-context';

export const Header: React.FC = () => {
  const router = useRouter();
  const { user, isAuthenticated, primaryRole, dashboardRoute, logout } = useAuth();

  const [selectedCity, setSelectedCity] = useState('Mumbai');
  const [cityDropdownOpen, setCityDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const userDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close user dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        userDropdownRef.current &&
        !userDropdownRef.current.contains(event.target as Node)
      ) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim() && !selectedCity) return;
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.set('q', searchQuery.trim());
    if (selectedCity) params.set('city', selectedCity.toLowerCase());
    router.push(`/search?${params.toString()}`);
    setMobileMenuOpen(false);
  };

  const formatRoleLabel = (role: string) => {
    switch (role) {
      case 'SUPER_ADMIN':
        return 'Super Admin';
      case 'BUSINESS_OWNER':
        return 'Business Owner';
      case 'MERCHANT_STAFF':
        return 'Merchant Staff';
      case 'CONTENT_MODERATOR':
        return 'Moderator';
      case 'VERIFICATION_OFFICER':
        return 'Verification';
      case 'FINANCE_MANAGER':
        return 'Finance';
      case 'SALES_SUPPORT_AGENT':
        return 'Support';
      default:
        return 'Consumer';
    }
  };

  const getInitials = (name?: string | null, mobile?: string) => {
    if (name) {
      const parts = name.trim().split(' ');
      if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
      return name.substring(0, 2).toUpperCase();
    }
    return mobile?.slice(-2) || 'JD';
  };

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-200 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-md border-b border-gray-200'
          : 'bg-white border-b border-gray-200'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          {/* LocalFind India Brand Logo */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
            <div className="w-10 h-10 rounded-xl bg-brand-navy flex items-center justify-center shadow-sm group-hover:bg-brand-navy-light transition-colors relative overflow-hidden border border-brand-navy-light/40">
              <span className="text-lg font-black text-brand-orange">L</span>
              <span className="text-lg font-black text-brand-blue -ml-0.5">F</span>
              <div className="absolute bottom-0 inset-x-0 h-1 bg-brand-orange" />
            </div>
            <div className="flex flex-col">
              <span className="font-black text-xl tracking-tight text-brand-navy leading-none">
                Local<span className="text-brand-blue">Find</span>
              </span>
              <span className="text-[9px] font-extrabold text-brand-orange tracking-widest leading-none mt-1 uppercase">
                India Directory
              </span>
            </div>
          </Link>

          {/* Desktop Search & Location Bar */}
          <div className="hidden lg:flex flex-1 max-w-2xl items-center bg-gray-50 border border-gray-300 rounded-xl overflow-visible shadow-sm focus-within:border-brand-blue focus-within:ring-2 focus-within:ring-blue-100 transition-all">
            {/* Location Selector Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setCityDropdownOpen(!cityDropdownOpen)}
                className="flex items-center gap-1.5 px-3.5 py-2.5 text-xs font-bold text-brand-navy border-r border-gray-300 hover:bg-gray-100 transition-colors rounded-l-xl"
                aria-expanded={cityDropdownOpen}
                aria-haspopup="listbox"
              >
                <MapPin className="w-4 h-4 text-brand-blue shrink-0" />
                <span className="truncate max-w-[100px]">{selectedCity}</span>
                <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
              </button>

              {cityDropdownOpen && (
                <ul
                  className="absolute left-0 top-full mt-1.5 w-48 bg-white border border-gray-200 rounded-xl shadow-xl py-1.5 z-50 text-xs font-semibold text-brand-navy max-h-60 overflow-y-auto"
                  role="listbox"
                >
                  <li className="px-3 py-1.5 text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                    Select Indian City
                  </li>
                  {POPULAR_CITIES.map((city) => (
                    <li
                      key={city}
                      onClick={() => {
                        setSelectedCity(city);
                        setCityDropdownOpen(false);
                      }}
                      className={`px-3.5 py-2 hover:bg-blue-50 hover:text-brand-blue cursor-pointer flex items-center justify-between ${
                        selectedCity === city ? 'bg-blue-50 text-brand-blue font-bold' : ''
                      }`}
                      role="option"
                      aria-selected={selectedCity === city}
                    >
                      <span>{city}</span>
                      {selectedCity === city && <span className="text-brand-blue">✓</span>}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Keyword Input */}
            <form onSubmit={handleSearchSubmit} className="flex-1 flex items-center">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search doctors, hotels, car repairs, restaurants..."
                className="w-full bg-transparent px-3 py-2 text-xs font-medium text-brand-navy placeholder-gray-400 focus:outline-none"
              />
              <button
                type="submit"
                aria-label="Submit Search"
                className="px-4 py-2 bg-brand-blue hover:bg-brand-blue-hover text-white rounded-r-xl transition-colors shrink-0 flex items-center justify-center m-0.5"
              >
                <Search className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* Desktop Right CTAs */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/categories"
              className="text-xs font-bold text-gray-700 hover:text-brand-blue px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Categories
            </Link>

            {/* Authenticated User Menu or Login Link */}
            {isAuthenticated && user ? (
              <div className="relative" ref={userDropdownRef}>
                <button
                  type="button"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-gray-200 hover:border-brand-blue bg-white shadow-2xs hover:shadow transition-all"
                  aria-expanded={userDropdownOpen}
                >
                  <div className="w-7 h-7 rounded-lg bg-blue-100 text-brand-blue flex items-center justify-center text-xs font-black">
                    {getInitials(user.name, user.mobile)}
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-xs font-bold text-brand-navy max-w-[110px] truncate leading-tight">
                      {user.name || user.mobile}
                    </span>
                    <span className="text-[10px] font-semibold text-brand-blue leading-tight">
                      {formatRoleLabel(primaryRole)}
                    </span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-gray-400 ml-0.5" />
                </button>

                {/* User Dropdown Menu */}
                {userDropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-gray-200 rounded-2xl shadow-xl py-2 z-50 text-xs text-brand-navy">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="font-extrabold text-sm text-brand-navy truncate">
                        {user.name || 'Verified User'}
                      </p>
                      <p className="text-[11px] text-gray-500 font-mono mt-0.5">{user.mobile}</p>
                      <span className="inline-block mt-1.5 px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider bg-blue-50 text-brand-blue">
                        {formatRoleLabel(primaryRole)}
                      </span>
                    </div>

                    <div className="py-1">
                      <Link
                        href={dashboardRoute}
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 hover:bg-gray-50 text-gray-700 hover:text-brand-blue font-semibold"
                      >
                        <LayoutDashboard className="w-4 h-4 text-brand-blue" />
                        <span>Workspace Dashboard</span>
                      </Link>

                      <Link
                        href="/customer/profile"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 hover:bg-gray-50 text-gray-700 hover:text-brand-blue font-semibold"
                      >
                        <UserCheck className="w-4 h-4 text-gray-500" />
                        <span>My Account Profile</span>
                      </Link>
                    </div>

                    <div className="border-t border-gray-100 pt-1">
                      <button
                        type="button"
                        onClick={() => {
                          setUserDropdownOpen(false);
                          logout();
                        }}
                        className="w-full flex items-center gap-2.5 px-4 py-2 hover:bg-red-50 text-red-600 font-semibold text-left"
                      >
                        <LogOut className="w-4 h-4 text-red-500" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-700 hover:text-brand-blue px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <User className="w-4 h-4 text-gray-500" />
                <span>Login / Sign Up</span>
              </Link>
            )}

            <Link
              href="/add-business"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-brand-blue hover:bg-brand-blue-hover px-4 py-2.5 rounded-xl transition-colors shadow-sm"
            >
              <PlusCircle className="w-4 h-4" />
              <span>+ Free Listing</span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <Link
              href="/add-business"
              className="text-xs font-bold text-white bg-brand-blue px-2.5 py-1.5 rounded-lg shrink-0"
            >
              + List
            </Link>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-gray-600 hover:text-brand-navy hover:bg-gray-100 transition-colors"
              aria-label="Toggle Mobile Navigation"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Input Strip */}
        <div className="lg:hidden pb-3">
          <form
            onSubmit={handleSearchSubmit}
            className="flex items-center bg-gray-50 border border-gray-300 rounded-xl overflow-hidden shadow-sm"
          >
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              aria-label="Select City"
              className="bg-transparent text-xs font-bold text-brand-navy px-2.5 py-2 border-r border-gray-300 outline-none"
            >
              {POPULAR_CITIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search services or categories..."
              className="w-full bg-transparent px-2.5 py-2 text-xs font-medium text-brand-navy outline-none"
            />
            <button
              type="submit"
              aria-label="Search"
              className="p-2.5 bg-brand-blue text-white shrink-0"
            >
              <Search className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 px-4 py-6 space-y-4 shadow-xl">
          {isAuthenticated && user && (
            <div className="p-3 bg-blue-50/70 rounded-xl border border-blue-100 flex items-center justify-between">
              <div>
                <p className="font-extrabold text-sm text-brand-navy">{user.name || user.mobile}</p>
                <span className="text-[10px] font-bold text-brand-blue uppercase">
                  {formatRoleLabel(primaryRole)}
                </span>
              </div>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  logout();
                }}
                className="text-xs font-bold text-red-600 hover:underline flex items-center gap-1"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout</span>
              </button>
            </div>
          )}

          <nav className="flex flex-col space-y-2 text-sm font-semibold text-brand-navy">
            {isAuthenticated && (
              <>
                <Link
                  href={dashboardRoute}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2.5 p-2.5 rounded-lg hover:bg-gray-50 text-brand-blue font-bold"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Go to Workspace Dashboard</span>
                </Link>
                <Link
                  href="/customer/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2.5 p-2.5 rounded-lg hover:bg-gray-50"
                >
                  <UserCheck className="w-4 h-4 text-gray-500" />
                  <span>My Profile</span>
                </Link>
              </>
            )}

            <Link
              href="/categories"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2.5 p-2.5 rounded-lg hover:bg-gray-50"
            >
              <Tag className="w-4 h-4 text-brand-blue" />
              <span>Browse Categories</span>
            </Link>
            <Link
              href="/search"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2.5 p-2.5 rounded-lg hover:bg-gray-50"
            >
              <Building2 className="w-4 h-4 text-brand-blue" />
              <span>Explore Businesses</span>
            </Link>
            <Link
              href="/pricing"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2.5 p-2.5 rounded-lg hover:bg-gray-50"
            >
              <ShieldCheck className="w-4 h-4 text-brand-blue" />
              <span>Advertise &amp; Plans</span>
            </Link>

            {!isAuthenticated && (
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2.5 p-2.5 rounded-lg hover:bg-gray-50 text-brand-blue font-bold"
              >
                <User className="w-4 h-4" />
                <span>Login / Sign Up</span>
              </Link>
            )}
          </nav>

          <div className="pt-4 border-t border-gray-100 flex flex-col gap-2">
            <Link
              href="/add-business"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2.5 px-4 rounded-xl bg-brand-blue text-white text-xs font-bold shadow-sm"
            >
              + List Your Business Free
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

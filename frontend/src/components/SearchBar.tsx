'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, MapPin } from 'lucide-react';
import { POPULAR_CITIES } from '@/lib/constants';

interface SearchBarProps {
  initialQuery?: string;
  initialCity?: string;
  className?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  initialQuery = '',
  initialCity = 'Mumbai',
  className = '',
}) => {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);
  const [city, setCity] = useState(initialCity);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() && !city) return;

    const params = new URLSearchParams();
    if (query.trim()) params.set('q', query.trim());
    if (city) params.set('city', city.toLowerCase());

    router.push(`/search?${params.toString()}`);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`w-full max-w-4xl bg-white rounded-2xl shadow-card hover:shadow-card-hover border border-gray-200/90 p-2 sm:p-2.5 flex flex-col md:flex-row items-center gap-2 transition-all ${className}`}
      role="search"
      aria-label="LocalFind Business Search"
    >
      {/* City Dropdown Selector */}
      <div className="flex items-center px-3 py-1.5 gap-2 w-full md:w-56 border-b md:border-b-0 md:border-r border-gray-200">
        <MapPin className="w-5 h-5 text-brand-orange shrink-0" />
        <select
          value={city}
          onChange={(e) => setCity(e.target.value)}
          aria-label="Filter by City"
          className="w-full text-xs sm:text-sm font-bold text-brand-navy outline-none bg-transparent cursor-pointer py-1"
        >
          {POPULAR_CITIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {/* Service / Business Input */}
      <div className="flex-1 flex items-center px-3 py-1.5 gap-2 w-full">
        <Search className="w-5 h-5 text-gray-400 shrink-0" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for Doctors, Hotels, AC Repair, Packers, Caterers..."
          aria-label="Search query"
          className="w-full text-xs sm:text-sm font-medium text-brand-navy outline-none bg-transparent placeholder-gray-400 py-1"
        />
      </div>

      {/* Submit Button (LocalFind Orange CTA) */}
      <button
        type="submit"
        className="w-full md:w-auto px-8 py-3 rounded-xl bg-brand-orange hover:bg-brand-orange-hover text-white text-sm font-bold transition-all shadow-sm hover:shadow shrink-0 flex items-center justify-center gap-2 active:scale-95"
      >
        <span>Search</span>
        <Search className="w-4 h-4" />
      </button>
    </form>
  );
};

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Building2 } from 'lucide-react';
import { CategoryCard, CategoryItem } from '@/components/CategoryCard';

const ALL_CATEGORIES: CategoryItem[] = [
  { id: 'c1', name: 'Restaurants & Dining', slug: 'restaurants', image: '/images/categories/restaurants.svg', badge: 'Popular' },
  { id: 'c2', name: 'Hotels & Resorts', slug: 'hotels', image: '/images/categories/hotels.svg' },
  { id: 'c3', name: 'Hospitals & Clinics', slug: 'hospitals', image: '/images/categories/hospitals.svg', badge: 'Essential' },
  { id: 'c4', name: 'Beauty & Salons', slug: 'beauty-salons', image: '/images/categories/beauty-salons.svg' },
  { id: 'c5', name: 'Home Services & Repair', slug: 'home-services', image: '/images/categories/home-services.svg', badge: 'Top Search' },
  { id: 'c6', name: 'Education & Coaching', slug: 'education', image: '/images/categories/education.svg' },
  { id: 'c7', name: 'Real Estate & Rentals', slug: 'real-estate', image: '/images/categories/real-estate.svg' },
  { id: 'c8', name: 'Automotive & Repairs', slug: 'automotive', image: '/images/categories/automotive.svg' },
  { id: 'c9', name: 'Construction & Architects', slug: 'construction', image: '/images/categories/construction.svg' },
  { id: 'c10', name: 'Electronics & Gadgets', slug: 'electronics', image: '/images/categories/electronics.svg' },
  { id: 'c11', name: 'Travel & Transport', slug: 'travel', image: '/images/categories/travel.svg' },
  { id: 'c12', name: 'Fitness & Gyms', slug: 'fitness', image: '/images/categories/fitness.svg' },
];

export default function CategoriesPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex-1">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-blue hover:underline mb-4"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Home</span>
      </Link>

      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-blue mb-1">
        <Building2 className="w-4 h-4" />
        <span>Commercial Directory</span>
      </div>
      <h1 className="text-3xl sm:text-4xl font-black text-brand-navy tracking-tight mb-2">
        All Business Categories
      </h1>
      <p className="text-sm text-gray-600 mb-8 max-w-xl">
        Explore 12 primary verified business classifications serving consumers across Indian cities.
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {ALL_CATEGORIES.map((cat) => (
          <CategoryCard key={cat.id} category={cat} />
        ))}
      </div>
    </div>
  );
}

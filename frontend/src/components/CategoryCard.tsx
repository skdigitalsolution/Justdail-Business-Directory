import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

export interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  image: string;
  badge?: string;
  description?: string;
  count?: string;
}

interface CategoryCardProps {
  category: CategoryItem;
  variant?: 'featured' | 'compact';
}

export const CategoryCard: React.FC<CategoryCardProps> = ({
  category,
  variant = 'compact',
}) => {
  const isFeatured = variant === 'featured';

  return (
    <Link
      href={`/search?category=${category.slug}`}
      className={`group relative overflow-hidden rounded-2xl border border-gray-200/80 bg-brand-navy shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-brand-blue/50 flex flex-col justify-end ${
        isFeatured ? 'h-64 sm:h-72 md:h-80' : 'h-48 sm:h-52'
      }`}
    >
      {/* Background Image */}
      <Image
        src={category.image}
        alt={category.name}
        fill
        sizes={
          isFeatured
            ? '(max-width: 768px) 100vw, 50vw'
            : '(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw'
        }
        className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
      />

      {/* Gradient Vignette Overlays for Maximum Text Contrast */}
      <div className="absolute inset-0 bg-gradient-to-t from-brand-navy via-brand-navy/60 to-transparent opacity-90 group-hover:opacity-80 transition-opacity" />
      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />

      {/* Top Badge */}
      {category.badge && (
        <div className="absolute top-3 left-3 z-10">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-brand-amber text-brand-navy shadow-md">
            {category.badge}
          </span>
        </div>
      )}

      {/* Top-Right Arrow Action */}
      <div className="absolute top-3 right-3 z-10 w-7 h-7 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white opacity-0 group-hover:opacity-100 group-hover:bg-brand-blue transition-all duration-300 transform translate-y-1 group-hover:translate-y-0 shadow">
        <ArrowUpRight className="w-4 h-4" />
      </div>

      {/* Bottom Content */}
      <div className="relative z-10 p-4 sm:p-5 flex flex-col">
        <h3
          className={`font-black text-white tracking-tight leading-snug group-hover:text-amber-300 transition-colors ${
            isFeatured ? 'text-lg sm:text-xl md:text-2xl mb-1' : 'text-sm sm:text-base'
          }`}
        >
          {category.name}
        </h3>
        {isFeatured && category.description && (
          <p className="text-xs text-gray-200 line-clamp-2 mt-1 hidden sm:block font-normal leading-relaxed">
            {category.description}
          </p>
        )}
        <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/15 text-[11px] font-semibold text-blue-200">
          <span>{category.count || 'Explore verified listings'}</span>
          <span className="group-hover:translate-x-1 transition-transform inline-flex items-center gap-0.5 text-brand-amber">
            <span>Discover</span>
            <span>&rarr;</span>
          </span>
        </div>
      </div>
    </Link>
  );
};

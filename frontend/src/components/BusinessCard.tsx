import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Star, ShieldCheck, MapPin, Phone, ArrowUpRight, MessageSquare } from 'lucide-react';
import { BusinessListing } from '@/types';

interface BusinessCardProps {
  business: BusinessListing;
}

export const BusinessCard: React.FC<BusinessCardProps> = ({ business }) => {
  return (
    <article className="group bg-white rounded-2xl border border-gray-200/90 overflow-hidden shadow-card hover:shadow-card-hover hover:border-brand-blue transition-all duration-200 flex flex-col justify-between">
      {/* Cover Image */}
      <div className="relative w-full aspect-[16/9] bg-brand-bg overflow-hidden">
        <Image
          src={business.image || '/images/placeholders/business-cover.svg'}
          alt={`${business.name} storefront in ${business.city}`}
          fill
          className="object-cover object-center group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />

        {/* Gradient Vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/60 via-transparent to-transparent opacity-60" />

        {business.verified && (
          <span className="absolute top-2.5 left-2.5 inline-flex items-center gap-1 text-[10px] font-bold text-brand-green bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-full border border-brand-green/20 shadow-xs">
            <ShieldCheck className="w-3.5 h-3.5 text-brand-green" />
            <span>Verified Merchant</span>
          </span>
        )}

        <span className="absolute bottom-2.5 right-2.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-brand-navy/85 text-white backdrop-blur-sm">
          {business.category}
        </span>
      </div>

      {/* Details Body */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="font-extrabold text-base text-brand-navy group-hover:text-brand-blue transition-colors line-clamp-1">
              <Link href={`/business/${business.id}`}>{business.name}</Link>
            </h3>
          </div>

          {/* Ratings & Reviews */}
          <div className="flex items-center gap-2 mb-3">
            {business.rating ? (
              <span className="inline-flex items-center gap-1 bg-brand-green text-white font-extrabold text-xs px-2 py-0.5 rounded-lg shadow-2xs">
                <span>{business.rating.toFixed(1)}</span>
                <Star className="w-3 h-3 fill-current" />
              </span>
            ) : (
              <span className="text-xs text-gray-400 italic">No ratings yet</span>
            )}

            {business.reviewCount !== undefined && business.reviewCount > 0 && (
              <span className="text-xs text-gray-500 font-semibold">
                ({business.reviewCount} verified reviews)
              </span>
            )}
          </div>

          {/* Location */}
          <div className="flex items-center gap-1.5 text-xs text-gray-600 mb-1">
            <MapPin className="w-3.5 h-3.5 text-brand-blue shrink-0" />
            <span className="line-clamp-1">
              {business.location}, {business.city}
            </span>
          </div>
        </div>

        {/* Action CTAs */}
        <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
          {business.phone ? (
            <a
              href={`tel:${business.phone}`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-brand-green-light hover:bg-brand-green text-brand-green hover:text-white text-xs font-bold transition-colors"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Call Now</span>
            </a>
          ) : (
            <Link
              href={`/business/${business.id}`}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-brand-blue-light text-brand-blue text-xs font-bold"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Enquire</span>
            </Link>
          )}

          <Link
            href={`/business/${business.id}`}
            className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-xl bg-brand-orange hover:bg-brand-orange-hover text-white text-xs font-bold transition-colors shadow-2xs"
          >
            <span>View Details</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </article>
  );
};

import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, ArrowRight } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-20 text-center">
      <div className="max-w-md mx-auto space-y-6">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#E7E3DC]/60 text-[#9A7955] mb-2">
          <Compass size={32} strokeWidth={1.5} />
        </div>
        <div>
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#9A7955] font-semibold block">
            404 Error
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#1C1C1A] mt-2">
            Silhouette Not Found
          </h1>
          <p className="text-xs text-[#A59A8A] mt-3 leading-relaxed">
            The archive, creation, or page you are seeking may have been moved, retired from the seasonal catalogue, or does not exist.
          </p>
        </div>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/"
            className="w-full sm:w-auto px-6 py-3 bg-[#1C1C1A] text-[#F8F5EF] text-xs uppercase tracking-widest hover:bg-[#9A7955] transition-colors"
          >
            Return to Storefront
          </Link>
          <Link
            to="/shop"
            className="w-full sm:w-auto px-6 py-3 border border-[#1C1C1A] text-[#1C1C1A] text-xs uppercase tracking-widest hover:bg-[#1C1C1A] hover:text-[#F8F5EF] transition-colors flex items-center justify-center gap-2"
          >
            <span>Explore Collection</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}

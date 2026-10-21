import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Search, X, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { closeSearch } from '../../store/uiSlice';
import api from '../../services/api';
import { formatPKR } from '../../utils/currency';

export default function SearchModal() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isOpen = useSelector((state) => state.ui.isSearchOpen);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery('');
      setResults([]);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') dispatch(closeSearch());
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [dispatch]);

  useEffect(() => {
    if (!query.trim() || query.length < 2) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setLoading(true);
        const res = await api.get(`/products?search=${encodeURIComponent(query)}&limit=6`);
        setResults(res.data.products || []);
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    dispatch(closeSearch());
    navigate(`/shop?search=${encodeURIComponent(query.trim())}`);
  };

  const handleSelectProduct = (slug) => {
    dispatch(closeSearch());
    navigate(`/product/${slug}`);
  };

  const quickTerms = ['Kurta Shalwar', 'Raw Silk Kalidar', 'Peshawari Chappal', 'Khussa', 'Chronograph Watch', 'Oud Perfume', 'Kids Angrakha'];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => dispatch(closeSearch())}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <div className="relative min-h-screen flex items-start justify-center p-4 sm:p-6 md:p-20">
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.98 }}
              transition={{ duration: 0.25 }}
              className="relative w-full max-w-3xl bg-[#F8F5EF] shadow-2xl border border-[#E7E3DC] p-6 sm:p-8 rounded-none overflow-hidden"
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => dispatch(closeSearch())}
                className="absolute top-6 right-6 text-[#1C1C1A] hover:text-[#9A7955]"
                aria-label="Close search modal"
              >
                <X size={22} strokeWidth={1.5} />
              </button>

              {/* Form */}
              <form onSubmit={handleSubmit} className="mt-4">
                <div className="relative flex items-center border-b-2 border-[#1C1C1A] pb-2">
                  <Search size={24} className="text-[#9A7955] mr-3" strokeWidth={1.5} />
                  <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search by ensemble name, fabric, embroidery, SKU..."
                    className="w-full bg-transparent text-lg sm:text-xl font-serif text-[#1C1C1A] placeholder-[#A59A8A] focus:outline-hidden"
                  />
                  {query && (
                    <button
                      type="button"
                      onClick={() => setQuery('')}
                      className="text-xs uppercase tracking-wider text-[#A59A8A] hover:text-[#1C1C1A] mr-2"
                    >
                      Clear
                    </button>
                  )}
                  <button
                    type="submit"
                    className="p-1 text-[#1C1C1A] hover:text-[#9A7955]"
                    aria-label="Submit search"
                  >
                    <ArrowRight size={20} />
                  </button>
                </div>
              </form>

              {/* Quick Search Tags */}
              <div className="mt-5 flex items-center gap-2 flex-wrap">
                <span className="text-[11px] uppercase tracking-wider text-[#A59A8A]">Curated searches:</span>
                {quickTerms.map((term) => (
                  <button
                    key={term}
                    type="button"
                    onClick={() => setQuery(term)}
                    className="px-2.5 py-1 text-[11px] bg-[#E7E3DC]/60 hover:bg-[#9A7955] hover:text-white transition-colors text-[#1C1C1A]"
                  >
                    {term}
                  </button>
                ))}
              </div>

              {/* Live Results */}
              <div className="mt-8 max-h-[50vh] overflow-y-auto">
                {loading && (
                  <div className="py-8 text-center text-sm uppercase tracking-widest text-[#A59A8A]">
                    Curating matching pieces...
                  </div>
                )}

                {!loading && query && results.length === 0 && (
                  <div className="py-8 text-center">
                    <p className="font-serif text-lg text-[#1C1C1A]">No pieces found matching "{query}"</p>
                    <p className="text-xs text-[#A59A8A] mt-1">Try exploring Pret, Couture, or Lawn collections.</p>
                  </div>
                )}

                {!loading && results.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {results.map((product) => (
                      <div
                        key={product._id}
                        onClick={() => handleSelectProduct(product.slug)}
                        className="flex items-center gap-4 p-3 bg-white/70 hover:bg-white border border-[#E7E3DC] cursor-pointer transition-all hover:border-[#9A7955]"
                      >
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-16 h-20 object-cover bg-[#E7E3DC]"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-[10px] uppercase tracking-widest text-[#A59A8A]">
                            {product.category?.name || product.subCategory}
                          </p>
                          <h4 className="font-serif text-sm text-[#1C1C1A] truncate hover:text-[#9A7955]">
                            {product.name}
                          </h4>
                          <p className="text-xs font-medium text-[#1C1C1A] mt-1">
                            {formatPKR(product.price)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}

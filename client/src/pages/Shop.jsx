import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, X, ChevronDown, SlidersHorizontal } from 'lucide-react';
import api from '../services/api';
import ProductCard from '../components/products/ProductCard';

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Filters from URL
  const selectedCategory = searchParams.get('category') || '';
  const selectedSort = searchParams.get('sort') || 'newest';
  const selectedSize = searchParams.get('size') || '';
  const searchQuery = searchParams.get('search') || '';
  const page = parseInt(searchParams.get('page') || '1', 10);
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';

  useEffect(() => {
    // Load categories for filter bar
    api.get('/categories').then((res) => {
      setCategories(res.data.categories || []);
    }).catch(console.error);
  }, []);

  useEffect(() => {
    const fetchCatalog = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        if (selectedCategory) params.set('category', selectedCategory);
        if (selectedSort) params.set('sort', selectedSort);
        if (selectedSize) params.set('size', selectedSize);
        if (searchQuery) params.set('search', searchQuery);
        if (minPrice) params.set('minPrice', minPrice);
        if (maxPrice) params.set('maxPrice', maxPrice);
        params.set('page', page);
        params.set('limit', '12');

        const res = await api.get(`/products?${params.toString()}`);
        setProducts(res.data.products || []);
        setTotalCount(res.data.totalCount || 0);
        setTotalPages(res.data.totalPages || 1);
      } catch (error) {
        console.error('Failed to load shop catalog:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCatalog();
  }, [selectedCategory, selectedSort, selectedSize, searchQuery, page, minPrice, maxPrice]);

  const updateFilter = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    newParams.set('page', '1'); // Reset to page 1 on filter
    setSearchParams(newParams);
  };

  const clearAllFilters = () => {
    setSearchParams(new URLSearchParams());
  };

  const sizes = ['XS', 'S', 'M', 'L', 'XL', '3-4Y', '5-6Y', '7-8Y', '37', '38', '39', '40', '41', '42', '43', '34mm', '42mm', '50ml', '100ml'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
      {/* Editorial Header */}
      <div className="mb-10 text-center max-w-2xl mx-auto">
        <span className="text-[10px] uppercase tracking-[0.25em] text-[#9A7955] font-semibold block mb-2">
          Atelier Catalog
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl text-[#1C1C1A] font-light">
          {searchQuery ? `Search: "${searchQuery}"` : selectedCategory ? `${selectedCategory.toUpperCase()} COLLECTION` : 'All Ensembles'}
        </h1>
        <p className="text-xs sm:text-sm text-[#A59A8A] mt-2 font-light">
          Showing {totalCount} authentic Pakistani luxury pieces priced in PKR with nationwide Cash on Delivery.
        </p>
      </div>

      {/* Filter and Sort Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-8 border-b border-[#E7E3DC] gap-4">
        {/* Category Pills (Desktop) */}
        <div className="hidden lg:flex items-center gap-2 overflow-x-auto pb-1">
          <button
            type="button"
            onClick={() => updateFilter('category', '')}
            className={`px-3 py-1.5 text-xs uppercase tracking-wider transition-colors ${
              !selectedCategory ? 'bg-[#1C1C1A] text-white' : 'bg-white border border-[#E7E3DC] text-[#1C1C1A] hover:border-[#9A7955]'
            }`}
          >
            All Pieces
          </button>
          {categories.map((cat) => (
            <button
              key={cat._id}
              type="button"
              onClick={() => updateFilter('category', cat.slug)}
              className={`px-3 py-1.5 text-xs uppercase tracking-wider transition-colors whitespace-nowrap ${
                selectedCategory === cat.slug ? 'bg-[#1C1C1A] text-white' : 'bg-white border border-[#E7E3DC] text-[#1C1C1A] hover:border-[#9A7955]'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Mobile Filter Button */}
        <div className="flex items-center justify-between lg:justify-end gap-3 w-full lg:w-auto">
          <button
            type="button"
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-[#E7E3DC] text-xs uppercase tracking-wider text-[#1C1C1A] hover:border-[#9A7955]"
          >
            <SlidersHorizontal size={14} />
            <span>Refine Filters</span>
          </button>

          {/* Sort Dropdown */}
          <div className="relative flex items-center">
            <select
              value={selectedSort}
              onChange={(e) => updateFilter('sort', e.target.value)}
              className="appearance-none bg-white border border-[#E7E3DC] px-4 py-2 pr-8 text-xs uppercase tracking-wider text-[#1C1C1A] focus:outline-hidden focus:border-[#9A7955] cursor-pointer"
            >
              <option value="newest">Sort: Newest First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="best-selling">Sort: Best Sellers</option>
            </select>
            <ChevronDown size={14} className="absolute right-2.5 text-[#A59A8A] pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Expandable Mobile/Desktop Filter Panel */}
      {mobileFilterOpen && (
        <div className="bg-white p-6 mb-8 border border-[#E7E3DC] animate-fadeIn">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#E7E3DC]">
            <h3 className="font-serif text-lg text-[#1C1C1A]">Refine Selection</h3>
            <button
              type="button"
              onClick={clearAllFilters}
              className="text-xs uppercase tracking-wider text-[#9A7955] hover:underline"
            >
              Reset All
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {/* Category selection */}
            <div>
              <h4 className="text-xs uppercase tracking-widest font-semibold text-[#1C1C1A] mb-3">Category</h4>
              <div className="space-y-1.5 max-h-40 overflow-y-auto">
                <button
                  type="button"
                  onClick={() => updateFilter('category', '')}
                  className={`block text-xs py-1 hover:text-[#9A7955] ${!selectedCategory ? 'font-bold text-[#9A7955]' : 'text-[#A59A8A]'}`}
                >
                  All Categories
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat._id}
                    type="button"
                    onClick={() => updateFilter('category', cat.slug)}
                    className={`block text-xs py-1 hover:text-[#9A7955] ${selectedCategory === cat.slug ? 'font-bold text-[#9A7955]' : 'text-[#A59A8A]'}`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Size selection */}
            <div>
              <h4 className="text-xs uppercase tracking-widest font-semibold text-[#1C1C1A] mb-3">Sizes</h4>
              <div className="flex flex-wrap gap-2">
                {sizes.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => updateFilter('size', selectedSize === s ? '' : s)}
                    className={`w-9 h-9 text-xs flex items-center justify-center border ${
                      selectedSize === s ? 'bg-[#1C1C1A] text-white border-[#1C1C1A]' : 'border-[#E7E3DC] text-[#1C1C1A] hover:border-[#9A7955]'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range Filter */}
            <div>
              <h4 className="text-xs uppercase tracking-widest font-semibold text-[#1C1C1A] mb-3">Price Range (PKR)</h4>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="Min Rs."
                  value={minPrice}
                  onChange={(e) => updateFilter('minPrice', e.target.value)}
                  className="w-full text-xs p-2 border border-[#E7E3DC] focus:outline-hidden focus:border-[#9A7955]"
                />
                <span className="text-[#A59A8A]">-</span>
                <input
                  type="number"
                  placeholder="Max Rs."
                  value={maxPrice}
                  onChange={(e) => updateFilter('maxPrice', e.target.value)}
                  className="w-full text-xs p-2 border border-[#E7E3DC] focus:outline-hidden focus:border-[#9A7955]"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Product Grid */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
            <div key={n} className="animate-pulse space-y-3">
              <div className="aspect-3/4 bg-[#E7E3DC]" />
              <div className="h-4 bg-[#E7E3DC] w-3/4" />
              <div className="h-3 bg-[#E7E3DC] w-1/2" />
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-24 bg-white border border-[#E7E3DC] p-8">
          <p className="font-serif text-2xl text-[#1C1C1A]">No Ensembles Found</p>
          <p className="text-xs text-[#A59A8A] mt-2 max-w-sm mx-auto">
            No pieces match your selected filter criteria. Try adjusting your category or resetting the filters.
          </p>
          <button
            type="button"
            onClick={clearAllFilters}
            className="mt-6 px-6 py-2.5 bg-[#1C1C1A] text-white text-xs uppercase tracking-widest hover:bg-[#9A7955] transition-colors"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8">
          {products.map((product, idx) => (
            <ProductCard key={product._id} product={product} index={idx} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-16 flex items-center justify-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => updateFilter('page', p.toString())}
              className={`w-10 h-10 text-xs font-medium transition-colors ${
                page === p
                  ? 'bg-[#1C1C1A] text-white'
                  : 'bg-white border border-[#E7E3DC] text-[#1C1C1A] hover:border-[#9A7955]'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

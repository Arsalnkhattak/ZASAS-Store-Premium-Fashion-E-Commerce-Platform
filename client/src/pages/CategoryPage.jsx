import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import api from '../services/api';
import ProductCard from '../components/products/ProductCard';

export default function CategoryPage() {
  const { slug } = useParams();
  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategoryData = async () => {
      try {
        setLoading(true);
        const [catRes, prodRes] = await Promise.all([
          api.get(`/categories/${slug}`),
          api.get(`/products?category=${slug}&limit=24`),
        ]);
        setCategory(catRes.data.category);
        setProducts(prodRes.data.products || []);
      } catch (error) {
        console.error('Failed to load category:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategoryData();
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <p className="text-xs uppercase tracking-widest text-[#A59A8A]">Opening Atelier Archive...</p>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="font-serif text-2xl text-[#1C1C1A]">Collection Not Found</h2>
        <Link to="/shop" className="text-xs uppercase tracking-widest text-[#9A7955] mt-4 inline-block">
          Return to Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-12 pb-20">
      {/* Editorial Header Banner */}
      <div className="relative min-h-[35vh] sm:min-h-[45vh] flex items-center justify-center bg-[#1C1C1A] text-white overflow-hidden">
        {category.image && (
          <div
            className="absolute inset-0 bg-cover bg-center opacity-40 scale-105"
            style={{ backgroundImage: `url('${category.image}')` }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1C1C1A] via-transparent to-black/30" />
        <div className="relative max-w-4xl mx-auto px-4 text-center py-16 z-10 space-y-3">
          <Link
            to="/shop"
            className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-widest text-[#D9C8BE] hover:text-white mb-2 transition-colors"
          >
            <ArrowLeft size={13} />
            <span>All Collections</span>
          </Link>
          <h1 className="font-serif text-4xl sm:text-6xl text-[#F8F5EF] font-light">
            {category.name}
          </h1>
          <p className="text-xs sm:text-sm text-[#E7E3DC] max-w-xl mx-auto font-light leading-relaxed">
            {category.tagline || category.description}
          </p>
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between pb-4 mb-8 border-b border-[#E7E3DC]">
          <span className="text-xs uppercase tracking-widest text-[#A59A8A]">
            Showing {products.length} Designs
          </span>
          <span className="text-xs text-[#9A7955] uppercase tracking-wider font-medium">
            Cash On Delivery Available
          </span>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-20 bg-white border border-[#E7E3DC] p-8">
            <p className="font-serif text-xl text-[#1C1C1A]">New Ensembles In Creation</p>
            <p className="text-xs text-[#A59A8A] mt-2">
              Our master artisans are presently crafting new editions for this collection.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8">
            {products.map((product, idx) => (
              <ProductCard key={product._id} product={product} index={idx} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

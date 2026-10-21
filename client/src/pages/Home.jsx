import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight, Sparkles, Shield, Compass } from 'lucide-react';
import api from '../services/api';
import ProductCard from '../components/products/ProductCard';

export default function Home() {
  const [newArrivals, setNewArrivals] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const [arrivalsRes, sellersRes, catsRes] = await Promise.all([
          api.get('/products/new-arrivals?limit=4'),
          api.get('/products/featured?limit=4'),
          api.get('/categories'),
        ]);
        setNewArrivals(arrivalsRes.data.products || []);
        setBestSellers(sellersRes.data.products || []);
        setCategories(catsRes.data.categories || []);
      } catch (error) {
        console.error('Failed to load homepage catalog:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchHomeData();
  }, []);

  return (
    <div className="space-y-20 sm:space-y-28 pb-20">
      {/* 1. Campaign Hero */}
      <section className="relative min-h-[85vh] sm:min-h-[90vh] flex items-center justify-center bg-[#1C1C1A] text-white overflow-hidden">
        {/* Hero Background Image with Smooth Editorial Reveal */}
        <motion.div
          initial={{ scale: 1.1, opacity: 0.4 }}
          animate={{ scale: 1, opacity: 0.65 }}
          transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=85&w=2000')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1C1C1A] via-transparent to-[#1C1C1A]/40" />

        {/* Hero Typography Container */}
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-20 z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md border border-white/20 text-[#F8F5EF] text-[10px] sm:text-xs uppercase tracking-[0.3em] font-medium mb-6"
          >
            <Sparkles size={13} className="text-[#9A7955]" />
            <span>The Festive & Bridal Atelier 2026</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.35 }}
            className="font-serif text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight leading-[1.08] font-light text-[#F8F5EF]"
          >
            Poetry in Pure <br />
            <span className="italic font-normal text-[#D9C8BE]">Silks & Zardozi</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-6 text-xs sm:text-sm md:text-base text-[#E7E3DC] max-w-xl mx-auto font-light leading-relaxed tracking-wide"
          >
            Subcontinental heirlooms reimagined with architectural restraint. Hand-dyed raw silks, sculpted micro-velvet peplums, and gossamer tissue ensembles crafted in Pakistan.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.65 }}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              to="/shop"
              className="w-full sm:w-auto px-8 py-3.5 bg-[#F8F5EF] text-[#1C1C1A] text-xs uppercase tracking-[0.25em] font-medium hover:bg-[#9A7955] hover:text-white transition-all duration-300 flex items-center justify-center gap-2 group"
            >
              <span>Explore The Collection</span>
              <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/category/men"
              className="w-full sm:w-auto px-8 py-3.5 border border-white/50 text-[#F8F5EF] text-xs uppercase tracking-[0.25em] font-medium hover:bg-white hover:text-[#1C1C1A] transition-all duration-300"
            >
              Men's Eastern Wear
            </Link>
          </motion.div>
        </div>
      </section>

      {/* 2. Featured Collections Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-4 border-b border-[#E7E3DC]">
          <div>
            <span className="text-[11px] uppercase tracking-[0.25em] text-[#9A7955] font-semibold">
              Curated Dimensions
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#1C1C1A] mt-1">
              Explore The Ateliers
            </h2>
          </div>
          <Link
            to="/shop"
            className="mt-4 md:mt-0 text-xs uppercase tracking-widest text-[#1C1C1A] hover:text-[#9A7955] flex items-center gap-1.5 transition-colors font-medium"
          >
            <span>View All Categories</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat, idx) => {
            return (
              <motion.div
                key={cat._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.08 }}
                className="relative overflow-hidden group aspect-4/3 border border-[#E7E3DC]"
              >
                <img
                  src={cat.image}
                  alt={cat.name}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
                <div className="absolute inset-0 p-6 flex flex-col justify-end text-white">
                  <span className="text-[9px] uppercase tracking-[0.25em] text-[#D9C8BE] mb-1 font-semibold">
                    Atelier Collection
                  </span>
                  <h3 className="font-serif text-xl sm:text-2xl font-light text-[#F8F5EF] mb-1.5">
                    {cat.name}
                  </h3>
                  <p className="text-[11px] text-[#E7E3DC] line-clamp-2 font-light mb-3">
                    {cat.tagline || cat.description}
                  </p>
                  <Link
                    to={`/category/${cat.slug}`}
                    className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#F8F5EF] font-medium group-hover:text-[#9A7955] transition-colors"
                  >
                    <span>Discover Ensembles</span>
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* 3. New Arrivals (Backend Live Data) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-4 border-b border-[#E7E3DC]">
          <div>
            <span className="text-[11px] uppercase tracking-[0.25em] text-[#9A7955] font-semibold">
              Freshly Unveiled
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#1C1C1A] mt-1">
              New Arrivals
            </h2>
          </div>
          <Link
            to="/shop?sort=newest"
            className="mt-4 md:mt-0 text-xs uppercase tracking-widest text-[#1C1C1A] hover:text-[#9A7955] flex items-center gap-1.5 transition-colors font-medium"
          >
            <span>Browse Full Edition</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="animate-pulse space-y-3">
                <div className="aspect-3/4 bg-[#E7E3DC]" />
                <div className="h-4 bg-[#E7E3DC] w-3/4" />
                <div className="h-3 bg-[#E7E3DC] w-1/2" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            {newArrivals.map((product, idx) => (
              <ProductCard key={product._id} product={product} index={idx} />
            ))}
          </div>
        )}
      </section>

      {/* 4. Editorial Story Section */}
      <section className="bg-[#E7E3DC]/40 py-20 border-y border-[#E7E3DC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="lg:col-span-6 space-y-6"
            >
              <span className="text-[11px] uppercase tracking-[0.25em] text-[#9A7955] font-semibold">
                The ZASAS Manifesto
              </span>
              <h2 className="font-serif text-3xl sm:text-5xl text-[#1C1C1A] font-light leading-tight">
                Honoring Century-Old Pakistani Needlecraft Through Modern Geometry
              </h2>
              <div className="space-y-4 text-xs sm:text-sm text-[#1C1C1A]/80 leading-relaxed font-light">
                <p>
                  Rooted in Karachi and drawing heritage from Lahore’s historic Walled City artisans, ZASAS was founded to challenge the fleeting ephemerality of fast-fashion with heirlooms of enduring distinction.
                </p>
                <p>
                  Every silhouette begins with responsibly sourced Pakistani pure raw silks, organic Swiss voiles, and Italian velvet weaves. Master karigars spend hundreds of hours setting uncut polki, silver tilla, and delicate French knots by hand.
                </p>
              </div>
              <div className="pt-2 flex items-center gap-8">
                <div>
                  <span className="font-serif text-3xl text-[#1C1C1A] block">280+</span>
                  <span className="text-[10px] uppercase tracking-wider text-[#A59A8A]">Hours per couture piece</span>
                </div>
                <div className="w-px h-10 bg-[#A59A8A]/40" />
                <div>
                  <span className="font-serif text-3xl text-[#1C1C1A] block">100%</span>
                  <span className="text-[10px] uppercase tracking-wider text-[#A59A8A]">Pure Pakistani weaves</span>
                </div>
              </div>
              <div className="pt-4">
                <Link
                  to="/about"
                  className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-semibold text-[#1C1C1A] hover:text-[#9A7955] transition-colors"
                >
                  <span>Read The Atelier Chronicle</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="lg:col-span-6 relative"
            >
              <div className="aspect-4/5 overflow-hidden shadow-2xl bg-[#E7E3DC]">
                <img
                  src="https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&q=80&w=1400"
                  alt="ZASAS Atelier Craftsmanship"
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-[#1C1C1A] text-white p-6 hidden sm:block max-w-xs shadow-xl">
                <p className="font-serif italic text-sm text-[#D9C8BE]">
                  "Elegance is not about standing out, but about being remembered."
                </p>
                <span className="block text-[9px] uppercase tracking-widest text-[#A59A8A] mt-2">
                  ZASAS Head of Design
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 5. Best Sellers Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-4 border-b border-[#E7E3DC]">
          <div>
            <span className="text-[11px] uppercase tracking-[0.25em] text-[#9A7955] font-semibold">
              Atelier Icons
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#1C1C1A] mt-1">
              Best Sellers
            </h2>
          </div>
          <Link
            to="/shop?sort=best-selling"
            className="mt-4 md:mt-0 text-xs uppercase tracking-widest text-[#1C1C1A] hover:text-[#9A7955] flex items-center gap-1.5 transition-colors font-medium"
          >
            <span>View All Icons</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
          {bestSellers.map((product, idx) => (
            <ProductCard key={product._id} product={product} index={idx} />
          ))}
        </div>
      </section>

      {/* 6. Campaign Full-Bleed Banner */}
      <section className="relative py-28 sm:py-36 bg-[#1C1C1A] text-white overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-40"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=80&w=2000')`,
          }}
        />
        <div className="relative max-w-4xl mx-auto px-4 text-center z-10 space-y-6">
          <span className="text-[11px] uppercase tracking-[0.3em] text-[#9A7955] font-semibold">
            Seasonal Campaign
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl font-light text-[#F8F5EF]">
            Bespoke Bridal Consultations
          </h2>
          <p className="text-xs sm:text-sm text-[#E7E3DC] max-w-xl mx-auto font-light leading-relaxed">
            Schedule a private one-on-one design appointment at our Karachi flagship atelier or via high-definition video concierge for overseas patrons across Dubai, London, and North America.
          </p>
          <div className="pt-4">
            <Link
              to="/contact"
              className="inline-block px-8 py-3.5 bg-[#9A7955] text-white text-xs uppercase tracking-[0.25em] font-medium hover:bg-[#7D5F3F] transition-colors"
            >
              Book An Appointment
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

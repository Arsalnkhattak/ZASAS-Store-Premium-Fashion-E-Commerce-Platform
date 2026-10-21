import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Feather, Scissors, Compass } from 'lucide-react';
import { BRAND_INFO } from '../utils/constants';

export default function About() {
  return (
    <div className="pb-24">
      {/* Hero Header */}
      <section className="relative min-h-[50vh] sm:min-h-[60vh] flex items-center justify-center bg-[#1C1C1A] text-white overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-45 scale-105"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&q=80&w=2000')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1C1C1A] via-transparent to-[#1C1C1A]/60" />

        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center space-y-4">
          <span className="text-[10px] sm:text-xs uppercase tracking-[0.35em] text-[#9A7955] font-semibold block">
            The Atelier Legacy
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-light tracking-wide text-[#F8F5EF] leading-tight">
            Crafting Pakistani Couture With Quiet Grandeur
          </h1>
          <p className="text-xs sm:text-sm text-[#A59A8A] max-w-2xl mx-auto font-light leading-relaxed">
            Founded with an uncompromising devotion to master craftsmanship, pure raw silks, and subcontinental heirloom traditions reimagined for the modern world.
          </p>
        </div>
      </section>

      {/* Narrative Section 1: The Genesis */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          <div className="lg:col-span-6 space-y-6">
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#9A7955] font-semibold block">
              Origin & Ethos
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl text-[#1C1C1A] font-light leading-snug">
              Between Karachi&apos;s Coastal Rhythm & Ancient Weaving Looms
            </h2>
            <div className="space-y-4 text-xs sm:text-sm text-[#4A4843] leading-relaxed font-light">
              <p>
                ZASAS was established with a singular manifesto: to liberate contemporary Pakistani fashion from fleeting fads while preserving centuries-old artisanal lineages. We believe true luxury whispers rather than shouts.
              </p>
              <p>
                Every silhouette begins as a poetic concept in our Karachi design studio before being brought to life through hundreds of hours of delicate handwork. From the crisp rustle of pure 80g raw silk to gossamer organza dupattas edged with antique tilla, each garment is conceived as a future heirloom.
              </p>
              <p>
                Our collections celebrate the duality of the modern Pakistani woman—unabashedly cosmopolitan yet profoundly anchored in heritage, poise, and dignified elegance.
              </p>
            </div>
            <div className="pt-2 flex items-center gap-8 border-t border-[#E7E3DC]">
              <div>
                <span className="font-serif text-2xl font-light text-[#1C1C1A]">2021</span>
                <span className="block text-[10px] uppercase tracking-wider text-[#A59A8A] mt-0.5">Established</span>
              </div>
              <div className="w-px h-8 bg-[#E7E3DC]" />
              <div>
                <span className="font-serif text-2xl font-light text-[#1C1C1A]">100%</span>
                <span className="block text-[10px] uppercase tracking-wider text-[#A59A8A] mt-0.5">Authentic Handcraft</span>
              </div>
              <div className="w-px h-8 bg-[#E7E3DC]" />
              <div>
                <span className="font-serif text-2xl font-light text-[#1C1C1A]">DHA, Karachi</span>
                <span className="block text-[10px] uppercase tracking-wider text-[#A59A8A] mt-0.5">Flagship Atelier</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 relative">
            <div className="aspect-[4/5] bg-[#E7E3DC] overflow-hidden shadow-lg border border-[#E7E3DC]">
              <img
                src="https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=80&w=1200"
                alt="ZASAS Atelier Craftsmanship"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-white p-6 border border-[#E7E3DC] max-w-xs shadow-md hidden sm:block">
              <p className="font-serif italic text-sm text-[#1C1C1A] leading-relaxed">
                &ldquo;Elegance is not about catching somebody&apos;s eye, it&apos;s about staying in their memory.&rdquo;
              </p>
              <span className="text-[10px] uppercase tracking-widest text-[#9A7955] block mt-2">
                — Creative Director, ZASAS
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Artisanal Pillars */}
      <section className="bg-[#F0EDE6] mt-24 sm:mt-32 py-20 border-y border-[#E7E3DC]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#9A7955] font-semibold block">
              The Pillars of Our Atelier
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl text-[#1C1C1A] font-light">
              Mastery In Every Thread
            </h2>
            <p className="text-xs text-[#A59A8A] leading-relaxed">
              We uphold uncompromising standards of artisanal ethics, pure textile integrity, and refined tailoring.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 border border-[#E7E3DC] space-y-4">
              <div className="w-12 h-12 bg-[#F8F5EF] text-[#9A7955] flex items-center justify-center">
                <Scissors size={22} strokeWidth={1.5} />
              </div>
              <h3 className="font-serif text-lg text-[#1C1C1A]">Artisanal Embroidery</h3>
              <p className="text-xs text-[#4A4843] leading-relaxed">
                Traditional zardozi, dabka, nakshi, and marori embroidery executed entirely by master artisans with generational knowledge in our dedicated workshops.
              </p>
            </div>

            <div className="bg-white p-8 border border-[#E7E3DC] space-y-4">
              <div className="w-12 h-12 bg-[#F8F5EF] text-[#9A7955] flex items-center justify-center">
                <Feather size={22} strokeWidth={1.5} />
              </div>
              <h3 className="font-serif text-lg text-[#1C1C1A]">Pure Natural Silks</h3>
              <p className="text-xs text-[#4A4843] leading-relaxed">
                We reject synthetic compromises. Only pure mulberry silks, authentic Pakistani raw silks, lightweight gossamer chiffons, and premium long-staple cotton lawns.
              </p>
            </div>

            <div className="bg-white p-8 border border-[#E7E3DC] space-y-4">
              <div className="w-12 h-12 bg-[#F8F5EF] text-[#9A7955] flex items-center justify-center">
                <Sparkles size={22} strokeWidth={1.5} />
              </div>
              <h3 className="font-serif text-lg text-[#1C1C1A]">Made-to-Measure Formals</h3>
              <p className="text-xs text-[#4A4843] leading-relaxed">
                Each formal and bridal ensemble undergoes private fitting consultations to ensure perfect silhouette drape, personalized color palettes, and impeccable finish.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Flagship Showroom Invitation */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-32">
        <div className="bg-[#1C1C1A] text-white p-8 sm:p-14 lg:p-16 border border-[#333330] flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-xl">
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#9A7955] font-semibold block">
              Private Concierge
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl text-[#F8F5EF] font-light">
              Visit The Karachi Flagship Atelier
            </h3>
            <p className="text-xs text-[#A59A8A] leading-relaxed">
              Experience the tactile luxury of our collections in person. Private bridal consultations, custom color swatch selections, and bespoke measurements are held by appointment at our DHA Karachi studio.
            </p>
            <div className="text-xs text-[#A59A8A] pt-2">
              <p>📍 {BRAND_INFO.address}</p>
              <p>📞 {BRAND_INFO.phone} • WhatsApp: {BRAND_INFO.whatsapp}</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto shrink-0">
            <Link
              to="/contact"
              className="px-6 py-3.5 bg-[#9A7955] text-white text-xs uppercase tracking-widest text-center hover:bg-[#7D5F3F] transition-colors"
            >
              Book An Appointment
            </Link>
            <Link
              to="/shop"
              className="px-6 py-3.5 border border-white/20 text-[#F8F5EF] text-xs uppercase tracking-widest text-center hover:border-white transition-colors"
            >
              Browse The Shop
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

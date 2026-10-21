import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, ShieldCheck, Truck, RefreshCw, CreditCard } from 'lucide-react';
import { BRAND_INFO } from '../../utils/constants';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;
    setSubscribed(true);
    setEmail('');
  };

  return (
    <footer className="bg-[#1C1C1A] text-[#F8F5EF] pt-16 pb-12 border-t border-[#333330]">
      {/* Brand Values Ribbon */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 mb-12 border-b border-[#333330]">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="flex items-center gap-4">
            <Truck className="text-[#9A7955] shrink-0" size={28} strokeWidth={1.5} />
            <div>
              <h4 className="text-xs uppercase tracking-widest font-medium">Nationwide Express Delivery</h4>
              <p className="text-[11px] text-[#A59A8A] mt-0.5">Complimentary shipping over Rs. 10,000</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <CreditCard className="text-[#9A7955] shrink-0" size={28} strokeWidth={1.5} />
            <div>
              <h4 className="text-xs uppercase tracking-widest font-medium">Cash on Delivery (COD)</h4>
              <p className="text-[11px] text-[#A59A8A] mt-0.5">Pay conveniently at your doorstep</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <RefreshCw className="text-[#9A7955] shrink-0" size={28} strokeWidth={1.5} />
            <div>
              <h4 className="text-xs uppercase tracking-widest font-medium">7-Day Atelier Exchanges</h4>
              <p className="text-[11px] text-[#A59A8A] mt-0.5">Hassle-free size and silhouette adjustment</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <ShieldCheck className="text-[#9A7955] shrink-0" size={28} strokeWidth={1.5} />
            <div>
              <h4 className="text-xs uppercase tracking-widest font-medium">100% Authentic Handcraft</h4>
              <p className="text-[11px] text-[#A59A8A] mt-0.5">Pure raw silks, dabka, and zardozi</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          {/* Brand Column */}
          <div className="md:col-span-4 space-y-4">
            <Link to="/" className="inline-block">
              <span className="font-serif text-3xl tracking-[0.25em] font-light uppercase text-[#F8F5EF]">
                ZASAS
              </span>
              <span className="block text-[8px] tracking-[0.35em] text-[#9A7955] uppercase font-sans">
                Haute Couture & Pret
              </span>
            </Link>
            <p className="text-xs text-[#A59A8A] leading-relaxed max-w-sm">
              An authentic Pakistani luxury fashion atelier dedicated to refined minimalism, timeless subcontinental silhouettes, and exquisite artisanal craft.
            </p>
            <div className="text-[11px] text-[#A59A8A] space-y-1 pt-2">
              <p>Karachi Atelier: Plot 14-C, 10th Commercial, Phase 5 DHA</p>
              <p>Concierge: {BRAND_INFO.phone} • {BRAND_INFO.email}</p>
            </div>
          </div>

          {/* Collections */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="text-xs uppercase tracking-[0.2em] font-semibold text-[#9A7955]">Collections</h4>
            <ul className="space-y-2 text-xs text-[#A59A8A]">
              <li><Link to="/category/women" className="hover:text-white transition-colors">Women's Collection</Link></li>
              <li><Link to="/category/men" className="hover:text-white transition-colors">Men's Eastern Wear</Link></li>
              <li><Link to="/category/kids" className="hover:text-white transition-colors">Kids' Festive Atelier</Link></li>
              <li><Link to="/category/watches" className="hover:text-white transition-colors">Horology & Watches</Link></li>
              <li><Link to="/category/footwear" className="hover:text-white transition-colors">Artisanal Shoes & Khussas</Link></li>
              <li><Link to="/category/fragrances" className="hover:text-white transition-colors">Haute Parfumerie & Oud</Link></li>
            </ul>
          </div>

          {/* Customer Care */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs uppercase tracking-[0.2em] font-semibold text-[#9A7955]">Customer Concierge</h4>
            <ul className="space-y-2 text-xs text-[#A59A8A]">
              <li><Link to="/shipping-policy" className="hover:text-white transition-colors">Shipping & Cash on Delivery</Link></li>
              <li><Link to="/returns-policy" className="hover:text-white transition-colors">Returns & Exchanges Policy</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Atelier Appointments & Inquiries</Link></li>
              <li><Link to="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
            </ul>
          </div>

          {/* Newsletter Subscription */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs uppercase tracking-[0.2em] font-semibold text-[#9A7955]">The Atelier Gazette</h4>
            <p className="text-xs text-[#A59A8A] leading-relaxed">
              Subscribe for private invitations to seasonal trunk shows, festive edits, and preview access.
            </p>
            {subscribed ? (
              <div className="flex items-center gap-2 text-xs text-[#9A7955] bg-[#333330]/50 p-3">
                <CheckCircle2 size={16} />
                <span>Thank you. You have been added to our private registry.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="flex">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    className="bg-[#2A2A28] text-xs px-3 py-2.5 text-white placeholder-[#A59A8A] focus:outline-hidden focus:ring-1 focus:ring-[#9A7955] flex-1 border border-[#333330]"
                  />
                  <button
                    type="submit"
                    className="bg-[#9A7955] text-white px-4 hover:bg-[#7D5F3F] transition-colors flex items-center justify-center"
                    aria-label="Subscribe to newsletter"
                  >
                    <ArrowRight size={16} />
                  </button>
                </div>
                <p className="text-[10px] text-[#A59A8A]">We respect your privacy. Unsubscribe at any time.</p>
              </form>
            )}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 pt-8 border-t border-[#333330] flex flex-col md:flex-row items-center justify-between text-[11px] text-[#A59A8A] gap-4">
          <p>© {new Date().getFullYear()} ZASAS Haute Couture & Pret. All Rights Reserved. Karachi, Pakistan.</p>
          <div className="flex items-center gap-4 tracking-wider uppercase text-[10px]">
            <span>Currency: PKR (₨)</span>
            <span>•</span>
            <span>COD Active</span>
            <span>•</span>
            <span>Safepay Verified</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

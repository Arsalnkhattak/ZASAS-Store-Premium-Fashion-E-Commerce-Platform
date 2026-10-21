import React from 'react';
import { BRAND_INFO } from '../../utils/constants';

export default function Terms() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
      <div className="space-y-3 pb-8 border-b border-[#E7E3DC]">
        <span className="text-[10px] uppercase tracking-[0.25em] text-[#9A7955] font-semibold block">
          Legal Framework
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl text-[#1C1C1A]">
          Terms & Conditions of Service
        </h1>
        <p className="text-xs text-[#A59A8A]">
          Last revised: October 2026 • Governing ZASAS website and transactions in Pakistan.
        </p>
      </div>

      <div className="mt-10 space-y-12 text-xs sm:text-sm text-[#4A4843] leading-relaxed">
        <section className="space-y-4">
          <h2 className="font-serif text-xl text-[#1C1C1A]">1. Agreement to Terms</h2>
          <p>
            Welcome to the digital boutique of ZASAS Haute Couture & Pret. By browsing our website, placing an order, or utilizing our concierge services, you agree to comply with and be bound by the following terms, conditions, and operational policies.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="font-serif text-xl text-[#1C1C1A]">2. Artisanal Craftsmanship & Color Variance</h2>
          <p>
            All ZASAS garments are handcrafted by skilled artisans employing traditional techniques. Due to the intrinsic nature of hand-dyeing, block printing, and manual needlework (zardozi, resham, dabka):
          </p>
          <ul className="list-disc pl-5 space-y-1 text-[#4A4843]">
            <li>Slight variations in thread hue, motif placement, and fabric grain are hallmarks of artisanal authenticity, not imperfections.</li>
            <li>We photograph collections under studio lighting calibrated to represent colors faithfully; however, monitor and mobile display profiles may cause minor perceptual variance.</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="font-serif text-xl text-[#1C1C1A]">3. Pricing & Currency</h2>
          <p>
            All prices displayed on this website are listed in Pakistani Rupees (PKR) and are inclusive of applicable federal and provincial sales taxes unless specifically indicated otherwise. We reserve the right to correct typographical pricing discrepancies without prior notice.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="font-serif text-xl text-[#1C1C1A]">4. Order Confirmation & Refusal</h2>
          <p>
            Receipt of an electronic order confirmation does not constitute our legal acceptance of your purchase. ZASAS reserves the right to decline or cancel any order for reasons including inventory unavailability, suspected fraudulent activity, unauthorized coupon usage, or failure of telephone/WhatsApp COD verification.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="font-serif text-xl text-[#1C1C1A]">5. Intellectual Property</h2>
          <p>
            All editorial photography, bespoke embroidery motifs, garment silhouettes, brand trademarks, logos, typography, and copywriting published on this domain remain the exclusive intellectual property of ZASAS (Private) Limited. Unauthorized reproduction or commercial imitation is strictly prohibited.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="font-serif text-xl text-[#1C1C1A]">6. Governing Law & Jurisdiction</h2>
          <p>
            These terms and any contracts formed hereunder shall be governed by and construed in accordance with the laws of the Islamic Republic of Pakistan. Any legal disputes arising shall be subject to the exclusive jurisdiction of the competent courts of Karachi, Sindh.
          </p>
        </section>
      </div>
    </div>
  );
}

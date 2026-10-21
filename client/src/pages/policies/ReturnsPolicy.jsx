import React from 'react';
import { RefreshCw, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';
import { BRAND_INFO } from '../../utils/constants';

export default function ReturnsPolicy() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
      <div className="space-y-3 pb-8 border-b border-[#E7E3DC]">
        <span className="text-[10px] uppercase tracking-[0.25em] text-[#9A7955] font-semibold block">
          Client Care & Guarantees
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl text-[#1C1C1A]">
          Returns & Exchanges Policy
        </h1>
        <p className="text-xs text-[#A59A8A]">
          Last revised: October 2026 • Valid for online and boutique purchases.
        </p>
      </div>

      <div className="mt-10 space-y-12 text-xs sm:text-sm text-[#4A4843] leading-relaxed">
        {/* Core Policy */}
        <section className="space-y-4">
          <h2 className="font-serif text-xl text-[#1C1C1A]">1. The 7-Day Exchange Window</h2>
          <p>
            At ZASAS, we are dedicated to ensuring you cherish every piece you acquire. If you are not completely content with the sizing or silhouette of your ready-to-wear pret purchase, you may initiate an exchange within <strong>7 calendar days</strong> from the date of delivery.
          </p>
          <div className="p-4 bg-white border border-[#E7E3DC] space-y-2">
            <h4 className="font-semibold text-xs uppercase tracking-wider text-[#1C1C1A]">Eligibility Requirements:</h4>
            <ul className="list-disc pl-5 space-y-1.5 text-xs text-[#4A4843]">
              <li>Garments must be unworn, unwashed, unaltered, and without fragrance or cosmetic marks.</li>
              <li>Original security seal, brand tags, and bespoke fabric garment bags must remain completely intact.</li>
              <li>Valid proof of purchase (Order confirmation email or invoice number) must accompany the request.</li>
            </ul>
          </div>
        </section>

        {/* Non-Exchangeable Items */}
        <section className="space-y-4">
          <h2 className="font-serif text-xl text-[#1C1C1A]">2. Non-Exchangeable & Non-Refundable Items</h2>
          <p>Due to health regulations and bespoke craftsmanship standards, the following creations cannot be returned or exchanged:</p>
          <ul className="list-disc pl-5 space-y-1 text-[#4A4843]">
            <li>Customized made-to-measure couture or bridal ensembles.</li>
            <li>Items sold under seasonal Archive Clearance or &ldquo;Final Sale&rdquo; promotions.</li>
            <li>Unstitched luxury fabrics that have been cut, sewn, or laundered.</li>
            <li>Earrings and personal fine jewelry accessories for hygiene considerations.</li>
          </ul>
        </section>

        {/* Exchange Procedure */}
        <section className="space-y-4">
          <h2 className="font-serif text-xl text-[#1C1C1A]">3. How to Initiate an Exchange</h2>
          <ol className="list-decimal pl-5 space-y-2 text-[#4A4843]">
            <li>
              <strong>Notify Concierge:</strong> Contact our client support via WhatsApp at <a href={`https://wa.me/923008272727`} className="text-[#9A7955] underline">{BRAND_INFO.whatsapp}</a> or email <a href={`mailto:${BRAND_INFO.email}`} className="text-[#9A7955] underline">{BRAND_INFO.email}</a> within 7 days, stating your Order Number and preferred replacement size or style.
            </li>
            <li>
              <strong>Reverse Courier Pickup:</strong> For eligible exchanges within Karachi, Lahore, and Islamabad, our courier partner can arrange a doorstep pickup (pickup fee of Rs. 350 applies unless due to atelier error). Patrons in other locations may ship the parcel directly to our Karachi atelier.
            </li>
            <li>
              <strong>Inspection & Dispatch:</strong> Upon arrival and quality verification by our atelier staff, your replacement piece will be dispatched within 2 to 3 business days, or a store credit code with 1-year validity will be issued.
            </li>
          </ol>
        </section>

        {/* Damaged or Defective Items */}
        <section className="space-y-4">
          <h2 className="font-serif text-xl text-[#1C1C1A]">4. Damaged or Defective Creations</h2>
          <p>
            Each ZASAS creation undergoes a rigorous triple-tier quality inspection prior to release. In the rare event that an item arrives with an artisanal fault or transit damage:
          </p>
          <p>
            Please photograph the defect and notify us within <strong>48 hours</strong> of parcel receipt. We will promptly arrange an immediate complimentary replacement or full refund, including all shipping fees.
          </p>
        </section>
      </div>
    </div>
  );
}

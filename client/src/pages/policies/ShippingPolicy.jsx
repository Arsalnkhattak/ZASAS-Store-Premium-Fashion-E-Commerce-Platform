import React from 'react';
import { Truck, CheckCircle2, AlertCircle, Clock, ShieldCheck } from 'lucide-react';
import { BRAND_INFO } from '../../utils/constants';

export default function ShippingPolicy() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
      <div className="space-y-3 pb-8 border-b border-[#E7E3DC]">
        <span className="text-[10px] uppercase tracking-[0.25em] text-[#9A7955] font-semibold block">
          Client Concierge & Logistics
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl text-[#1C1C1A]">
          Shipping & Delivery Policy
        </h1>
        <p className="text-xs text-[#A59A8A]">
          Last revised: October 2026 • Valid nationwide across Pakistan & International destinations.
        </p>
      </div>

      <div className="mt-10 space-y-12 text-xs sm:text-sm text-[#4A4843] leading-relaxed">
        {/* Shipping Rates Overview */}
        <section className="space-y-4">
          <h2 className="font-serif text-xl text-[#1C1C1A]">1. Domestic Shipping Rates & Timeline</h2>
          <p>
            At ZASAS, every creation is carefully wrapped in tissue, protected in our signature bespoke garment packaging, and dispatched via premier logistics carriers (TCS, Leopards Courier, Trax, and Call Courier).
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div className="p-5 bg-white border border-[#E7E3DC] space-y-1.5">
              <span className="text-[10px] uppercase tracking-wider text-[#9A7955] font-semibold block">Karachi Delivery</span>
              <p className="font-serif text-lg text-[#1C1C1A]">1 – 2 Business Days</p>
              <p className="text-xs text-[#A59A8A]">Direct dispatch from our DHA Karachi fulfillment studio.</p>
            </div>
            <div className="p-5 bg-white border border-[#E7E3DC] space-y-1.5">
              <span className="text-[10px] uppercase tracking-wider text-[#9A7955] font-semibold block">Major Cities (Lahore, ISB, RWP)</span>
              <p className="font-serif text-lg text-[#1C1C1A]">2 – 3 Business Days</p>
              <p className="text-xs text-[#A59A8A]">Express air cargo service with end-to-end tracking.</p>
            </div>
            <div className="p-5 bg-white border border-[#E7E3DC] space-y-1.5">
              <span className="text-[10px] uppercase tracking-wider text-[#9A7955] font-semibold block">Other Regional Cities</span>
              <p className="font-serif text-lg text-[#1C1C1A]">3 – 5 Business Days</p>
              <p className="text-xs text-[#A59A8A]">Comprehensive nationwide coverage across all provinces.</p>
            </div>
          </div>
          <div className="p-4 bg-[#F8F5EF] border border-[#E7E3DC] text-xs space-y-1">
            <p className="font-medium text-[#1C1C1A]">Complimentary Shipping Threshold:</p>
            <p className="text-[#4A4843]">
              Orders with a total product value exceeding <strong>Rs. {BRAND_INFO.freeShippingThreshold.toLocaleString()}</strong> qualify for complimentary standard shipping across all Pakistan. For orders below this threshold, a flat delivery fee of <strong>Rs. {BRAND_INFO.standardShippingFee}</strong> applies. Express Priority shipping is available at <strong>Rs. {BRAND_INFO.expressShippingFee}</strong>.
            </p>
          </div>
        </section>

        {/* Cash on Delivery (COD) Guidelines */}
        <section className="space-y-4">
          <h2 className="font-serif text-xl text-[#1C1C1A]">2. Cash on Delivery (COD) Protocol</h2>
          <p>
            To ensure complete trust and peace of mind, ZASAS offers Cash on Delivery across Pakistan up to an order ceiling of <strong>Rs. 75,000</strong>.
          </p>
          <ul className="list-disc pl-5 space-y-2 text-[#4A4843]">
            <li>
              <strong>Verification Call/WhatsApp:</strong> First-time patrons or orders exceeding Rs. 20,000 may receive a polite verification call or WhatsApp message from our dispatch team before parcel release.
            </li>
            <li>
              <strong>Exact Cash Requirement:</strong> Please ensure the exact bill amount is available at the time of delivery, as courier delivery riders often carry limited change.
            </li>
            <li>
              <strong>Parcel Inspection:</strong> Under standard Pakistan courier regulations, flyers cannot be opened prior to handing payment to the rider. Once accepted and paid, if there are any sizing concerns or defects, our 7-day atelier exchange policy takes immediate effect.
            </li>
          </ul>
        </section>

        {/* Made-to-Order Couture Timelines */}
        <section className="space-y-4">
          <h2 className="font-serif text-xl text-[#1C1C1A]">3. Haute Couture & Custom Formals Lead Times</h2>
          <p>
            Ensembles categorized under <em>Haute Couture</em> or custom-stitched orders are meticulously handcrafted to client measurements. These pieces carry custom manufacturing timelines:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-[#4A4843]">
            <li><strong>Luxury Pret & Festive Stitched:</strong> 2 to 3 weeks.</li>
            <li><strong>Formals & Evening Wear:</strong> 4 to 6 weeks.</li>
            <li><strong>Bridal Trousseaus:</strong> 8 to 12 weeks.</li>
          </ul>
          <p className="text-xs text-[#A59A8A]">
            You will receive periodic photo updates on embroidery progress via WhatsApp from your dedicated concierge consultant.
          </p>
        </section>

        {/* Tracking & Dispatches */}
        <section className="space-y-4">
          <h2 className="font-serif text-xl text-[#1C1C1A]">4. Order Tracking</h2>
          <p>
            As soon as your parcel is handed over to the courier partner, an automated SMS and email containing your tracking number (CN) and direct courier portal link will be dispatched to your registered contact details.
          </p>
          <p>
            Patrons can also check live order status at any time in the <strong>Account Orders</strong> section of our website or by contacting <a href={`mailto:${BRAND_INFO.email}`} className="text-[#9A7955] underline">{BRAND_INFO.email}</a>.
          </p>
        </section>
      </div>
    </div>
  );
}

import React from 'react';
import { Shield, Lock, Eye, FileText } from 'lucide-react';
import { BRAND_INFO } from '../../utils/constants';

export default function PrivacyPolicy() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
      <div className="space-y-3 pb-8 border-b border-[#E7E3DC]">
        <span className="text-[10px] uppercase tracking-[0.25em] text-[#9A7955] font-semibold block">
          Client Confidentiality & Trust
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl text-[#1C1C1A]">
          Privacy Policy
        </h1>
        <p className="text-xs text-[#A59A8A]">
          Last revised: October 2026 • ZASAS Haute Couture & Pret (Private) Limited.
        </p>
      </div>

      <div className="mt-10 space-y-12 text-xs sm:text-sm text-[#4A4843] leading-relaxed">
        <section className="space-y-4">
          <h2 className="font-serif text-xl text-[#1C1C1A]">1. Commitment to Discretion</h2>
          <p>
            At ZASAS, we consider the discretion and confidentiality of our esteemed clientele sacred. This policy outlines how personal details collected during your visits to our online boutique, showroom appointments, and order placements are safeguarded.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="font-serif text-xl text-[#1C1C1A]">2. Information We Collect</h2>
          <p>We collect essential operational information necessary to provide seamless luxury shopping:</p>
          <ul className="list-disc pl-5 space-y-1.5 text-[#4A4843]">
            <li><strong>Contact Details:</strong> Your full name, delivery address, contact phone number, and email address.</li>
            <li><strong>Order History:</strong> Ensembles acquired, sizes chosen, transaction records, and bespoke tailoring measurements.</li>
            <li><strong>Device & Session Data:</strong> Technical logs, cookies, and session indicators to preserve your shopping bag and wishlist across devices.</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="font-serif text-xl text-[#1C1C1A]">3. Payment Data Security</h2>
          <p>
            ZASAS does <strong>not</strong> store or hold debit card numbers, credit card CVV codes, or digital banking passwords on our local servers. All online electronic card payments are processed securely through certified, State Bank of Pakistan-compliant payment gateways (e.g. Safepay, 1Bill, PayFast) featuring end-to-end TLS 256-bit encryption.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="font-serif text-xl text-[#1C1C1A]">4. Third-Party Disclosures</h2>
          <p>
            We strictly do <strong>not</strong> sell, rent, or trade your personal information with external advertising networks or data brokers. Data is shared exclusively with:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-[#4A4843]">
            <li>Authorized courier delivery partners solely for dispatching your parcels.</li>
            <li>SMS/Email gateways to relay order updates and shipping notices.</li>
            <li>Regulatory and legal bodies when mandated by Pakistan law.</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="font-serif text-xl text-[#1C1C1A]">5. Patron Rights & Inquiries</h2>
          <p>
            You retain the right to view, correct, or request the erasure of your personal profile and address records at any time. For privacy inquiries, please address your correspondence to our Data Custodian at <a href={`mailto:${BRAND_INFO.email}`} className="text-[#9A7955] underline">{BRAND_INFO.email}</a>.
          </p>
        </section>
      </div>
    </div>
  );
}

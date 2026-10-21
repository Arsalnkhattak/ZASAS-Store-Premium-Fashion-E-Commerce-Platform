import React, { useEffect, useState } from 'react';
import { Settings, ShieldCheck, Truck, CreditCard, Store, CheckCircle, Info } from 'lucide-react';
import api from '../../services/api';
import { formatPKR } from '../../utils/currency';
import { BRAND_INFO } from '../../utils/constants';

export default function AdminSettings() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/settings')
      .then((res) => setSettings(res.data.settings))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-8 bg-[#E7E3DC] w-48" />
        <div className="h-64 bg-[#E7E3DC]" />
      </div>
    );
  }

  const gateway = settings?.paymentGateway;

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      <div className="pb-4 border-b border-[#E7E3DC]">
        <span className="text-[10px] uppercase tracking-[0.25em] text-[#9A7955] font-semibold block">
          Configuration & Infrastructure
        </span>
        <h1 className="font-serif text-3xl text-[#1C1C1A] mt-0.5">
          Atelier System Settings
        </h1>
        <p className="text-xs text-[#A59A8A] mt-1">
          Operational configurations for Pakistani commerce, logistics, and payment gateways.
        </p>
      </div>

      <div className="space-y-6">
        {/* Store Profile */}
        <div className="bg-white border border-[#E7E3DC] p-6 space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-[#E7E3DC]">
            <Store size={20} className="text-[#9A7955]" />
            <h2 className="font-serif text-lg text-[#1C1C1A]">Brand Identity & Locale</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs">
            <div>
              <span className="text-[10px] uppercase tracking-wider text-[#A59A8A] block">Storefront Title</span>
              <p className="font-medium text-[#1C1C1A] mt-1">{settings?.storeName || BRAND_INFO.fullName}</p>
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-wider text-[#A59A8A] block">Primary Market</span>
              <p className="font-medium text-[#1C1C1A] mt-1">Pakistan Nationwide</p>
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-wider text-[#A59A8A] block">Operating Currency</span>
              <p className="font-mono font-bold text-[#1C1C1A] mt-1">PKR (Pakistani Rupee ₨)</p>
            </div>
          </div>
        </div>

        {/* Shipping Rates */}
        <div className="bg-white border border-[#E7E3DC] p-6 space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-[#E7E3DC]">
            <Truck size={20} className="text-[#9A7955]" />
            <h2 className="font-serif text-lg text-[#1C1C1A]">Domestic Logistics & Courier Policy</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs">
            <div className="p-4 bg-[#F8F5EF] border border-[#E7E3DC] space-y-1">
              <span className="text-[10px] uppercase tracking-wider text-[#9A7955] font-semibold block">
                Free Shipping Threshold
              </span>
              <p className="font-serif text-xl font-bold text-[#1C1C1A]">
                {formatPKR(settings?.freeShippingThreshold || BRAND_INFO.freeShippingThreshold)}
              </p>
              <p className="text-[11px] text-[#A59A8A]">Complimentary courier above this subtotal.</p>
            </div>

            <div className="p-4 bg-[#F8F5EF] border border-[#E7E3DC] space-y-1">
              <span className="text-[10px] uppercase tracking-wider text-[#9A7955] font-semibold block">
                Standard Shipping Fee
              </span>
              <p className="font-serif text-xl font-bold text-[#1C1C1A]">
                {formatPKR(settings?.standardShippingFee || BRAND_INFO.standardShippingFee)}
              </p>
              <p className="text-[11px] text-[#A59A8A]">Applies to orders below the free threshold.</p>
            </div>

            <div className="p-4 bg-[#F8F5EF] border border-[#E7E3DC] space-y-1">
              <span className="text-[10px] uppercase tracking-wider text-[#9A7955] font-semibold block">
                Express Priority Delivery
              </span>
              <p className="font-serif text-xl font-bold text-[#1C1C1A]">
                {formatPKR(settings?.expressShippingFee || BRAND_INFO.expressShippingFee)}
              </p>
              <p className="text-[11px] text-[#A59A8A]">Same day / next morning air express.</p>
            </div>
          </div>
        </div>

        {/* Payment Gateway */}
        <div className="bg-white border border-[#E7E3DC] p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#E7E3DC]">
            <div className="flex items-center gap-3">
              <CreditCard size={20} className="text-[#9A7955]" />
              <h2 className="font-serif text-lg text-[#1C1C1A]">Pakistani Payment Processing Gateway</h2>
            </div>
            <span
              className={`text-[9px] uppercase tracking-wider px-2 py-0.5 font-semibold ${
                gateway?.isConfigured
                  ? 'bg-emerald-50 text-emerald-700'
                  : 'bg-amber-50 text-amber-700'
              }`}
            >
              {gateway?.isConfigured ? 'Live Configured' : 'COD Active Nationwide'}
            </span>
          </div>

          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-[#A59A8A] block">Gateway Provider</span>
                <p className="font-medium text-[#1C1C1A] mt-0.5 uppercase">{gateway?.provider || 'Safepay'}</p>
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-wider text-[#A59A8A] block">Environment Mode</span>
                <p className="font-medium text-[#1C1C1A] mt-0.5">{gateway?.sandbox ? 'Sandbox (Testnet)' : 'Production'}</p>
              </div>
            </div>

            <div>
              <span className="text-[10px] uppercase tracking-wider text-[#A59A8A] block mb-1">Supported Pakistani Channels</span>
              <div className="flex flex-wrap gap-2">
                {gateway?.supportedMethods?.map((m) => (
                  <span
                    key={m}
                    className="px-2.5 py-1 bg-[#F8F5EF] border border-[#E7E3DC] text-[11px] text-[#1C1C1A]"
                  >
                    {m}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-4 bg-[#F8F5EF] border border-[#E7E3DC] flex items-start gap-3">
              <Info size={16} className="text-[#9A7955] shrink-0 mt-0.5" />
              <p className="text-[11px] text-[#4A4843] leading-relaxed">
                {gateway?.notice ||
                  'Cash on Delivery (COD) is unconditionally operational across all cities in Pakistan. To enable online Card & Wallet checkout, configure SAFEPAY_API_KEY and SAFEPAY_SECRET_KEY in your server environment variables.'}
              </p>
            </div>
          </div>
        </div>

        {/* Flagship Atelier Showroom */}
        <div className="bg-white border border-[#E7E3DC] p-6 space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-[#E7E3DC]">
            <ShieldCheck size={20} className="text-[#9A7955]" />
            <h2 className="font-serif text-lg text-[#1C1C1A]">Headquarters & Flagship Atelier</h2>
          </div>

          <div className="text-xs text-[#4A4843] space-y-2">
            <p><strong>Physical Address:</strong> {BRAND_INFO.address}</p>
            <p><strong>Concierge Telephone:</strong> {BRAND_INFO.phone}</p>
            <p><strong>VIP WhatsApp:</strong> {BRAND_INFO.whatsapp}</p>
            <p><strong>Inquiries Inbox:</strong> {BRAND_INFO.email}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

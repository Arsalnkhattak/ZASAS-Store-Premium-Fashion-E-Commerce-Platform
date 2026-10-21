import React, { useState } from 'react';
import { Mail, Phone, MessageSquare, MapPin, Clock, CheckCircle2, ArrowRight } from 'lucide-react';
import { BRAND_INFO } from '../utils/constants';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'pret',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate inquiry dispatch
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      setFormData({ name: '', email: '', phone: '', subject: 'pret', message: '' });
    }, 700);
  };

  return (
    <div className="pb-24">
      {/* Header */}
      <section className="bg-[#1C1C1A] text-white py-16 sm:py-20 border-b border-[#333330]">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-3">
          <span className="text-[10px] sm:text-xs uppercase tracking-[0.35em] text-[#9A7955] font-semibold block">
            Client Concierge
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-light text-[#F8F5EF]">
            Atelier Inquiries & Consultations
          </h1>
          <p className="text-xs sm:text-sm text-[#A59A8A] max-w-xl mx-auto font-light leading-relaxed">
            Whether inquiring about bespoke bridal couture, sizing guidance, or an active dispatch across Pakistan, our concierge is at your service.
          </p>
        </div>
      </section>

      {/* Main Grid */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Contact Details Column */}
          <div className="lg:col-span-5 space-y-8">
            <div>
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#9A7955] font-semibold block">
                Flagship Studio
              </span>
              <h2 className="font-serif text-2xl text-[#1C1C1A] mt-1">ZASAS Karachi</h2>
              <p className="text-xs text-[#4A4843] mt-2 leading-relaxed">
                Our primary atelier houses our seasonal ready-to-wear showroom, bridal fitting suites, and private styling salons.
              </p>
            </div>

            <div className="space-y-6 text-xs text-[#1C1C1A]">
              <div className="flex items-start gap-3.5">
                <MapPin size={18} className="text-[#9A7955] shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold uppercase tracking-wider text-[11px] text-[#1C1C1A]">Address</h4>
                  <p className="text-[#4A4843] mt-0.5 leading-relaxed">{BRAND_INFO.address}</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <Phone size={18} className="text-[#9A7955] shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold uppercase tracking-wider text-[11px] text-[#1C1C1A]">Telephone</h4>
                  <p className="text-[#4A4843] mt-0.5">
                    <a href={`tel:${BRAND_INFO.phone}`} className="hover:text-[#9A7955] transition-colors">
                      {BRAND_INFO.phone}
                    </a>
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <MessageSquare size={18} className="text-[#9A7955] shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold uppercase tracking-wider text-[11px] text-[#1C1C1A]">WhatsApp VIP Concierge</h4>
                  <p className="text-[#4A4843] mt-0.5">
                    <a
                      href={`https://wa.me/923008272727?text=Hello%20ZASAS%20Atelier,%20I%20would%20like%20to%20inquire%20about...`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#9A7955] hover:underline font-medium"
                    >
                      {BRAND_INFO.whatsapp} (Direct Chat)
                    </a>
                  </p>
                  <p className="text-[10px] text-[#A59A8A] mt-0.5">Available Monday–Saturday, 10:00 AM – 8:00 PM PKT</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <Mail size={18} className="text-[#9A7955] shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold uppercase tracking-wider text-[11px] text-[#1C1C1A]">Electronic Mail</h4>
                  <p className="text-[#4A4843] mt-0.5">
                    <a href={`mailto:${BRAND_INFO.email}`} className="hover:text-[#9A7955] transition-colors">
                      {BRAND_INFO.email}
                    </a>
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <Clock size={18} className="text-[#9A7955] shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold uppercase tracking-wider text-[11px] text-[#1C1C1A]">Showroom Hours</h4>
                  <p className="text-[#4A4843] mt-0.5">Monday – Saturday: 11:00 AM – 8:00 PM PKT</p>
                  <p className="text-[#A59A8A] text-[11px]">Sunday: By advance bridal appointment only</p>
                </div>
              </div>
            </div>

            {/* Nationwide Assistance Notice */}
            <div className="p-5 bg-white border border-[#E7E3DC]">
              <h4 className="font-serif text-sm text-[#1C1C1A]">Nationwide Order Assistance</h4>
              <p className="text-xs text-[#A59A8A] mt-1 leading-relaxed">
                For order tracking, Cash on Delivery address confirmations, or size exchanges across Lahore, Islamabad, Karachi, or other cities, our dedicated dispatch desk is ready to help.
              </p>
            </div>
          </div>

          {/* Inquiry Form Column */}
          <div className="lg:col-span-7">
            <div className="bg-white border border-[#E7E3DC] p-8 sm:p-10 shadow-xs">
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#9A7955] font-semibold block">
                Send a Correspondence
              </span>
              <h3 className="font-serif text-2xl text-[#1C1C1A] mt-1 mb-6">
                Direct Atelier Inquiry
              </h3>

              {submitted ? (
                <div className="p-8 bg-[#F8F5EF] border border-[#9A7955]/30 text-center space-y-3">
                  <CheckCircle2 size={36} className="text-[#9A7955] mx-auto" />
                  <h4 className="font-serif text-xl text-[#1C1C1A]">Inquiry Received</h4>
                  <p className="text-xs text-[#4A4843] max-w-md mx-auto leading-relaxed">
                    Thank you for reaching out to the ZASAS Atelier. A senior concierge consultant will review your note and respond within 24 business hours.
                  </p>
                  <button
                    type="button"
                    onClick={() => setSubmitted(false)}
                    className="mt-4 px-6 py-2.5 bg-[#1C1C1A] text-white text-xs uppercase tracking-widest hover:bg-[#9A7955] transition-colors"
                  >
                    Send Another Note
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-[#1C1C1A] font-medium mb-1.5">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Ayla Mansoor"
                        className="w-full px-3.5 py-2.5 text-xs bg-[#F8F5EF] border border-[#E7E3DC] focus:outline-none focus:border-[#9A7955]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-[#1C1C1A] font-medium mb-1.5">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="e.g. ayla@example.com"
                        className="w-full px-3.5 py-2.5 text-xs bg-[#F8F5EF] border border-[#E7E3DC] focus:outline-none focus:border-[#9A7955]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-[#1C1C1A] font-medium mb-1.5">
                        Phone / WhatsApp (Optional)
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+92 300 1234567"
                        className="w-full px-3.5 py-2.5 text-xs bg-[#F8F5EF] border border-[#E7E3DC] focus:outline-none focus:border-[#9A7955]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-[#1C1C1A] font-medium mb-1.5">
                        Inquiry Nature *
                      </label>
                      <select
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-xs bg-[#F8F5EF] border border-[#E7E3DC] focus:outline-none focus:border-[#9A7955]"
                      >
                        <option value="pret">Ready-to-Wear Pret Inquiry</option>
                        <option value="couture">Bespoke Bridal / Haute Couture Appointment</option>
                        <option value="order">Order Status / Delivery Inquiry</option>
                        <option value="exchange">Exchange or Sizing Request</option>
                        <option value="press">Press, Collaborations & Styling</option>
                        <option value="other">General Inquiries</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#1C1C1A] font-medium mb-1.5">
                      Your Message *
                    </label>
                    <textarea
                      required
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Please share your inquiry details, preferred appointment dates, or reference order numbers..."
                      className="w-full px-3.5 py-2.5 text-xs bg-[#F8F5EF] border border-[#E7E3DC] focus:outline-none focus:border-[#9A7955]"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full sm:w-auto px-8 py-3 bg-[#1C1C1A] text-white text-xs uppercase tracking-widest hover:bg-[#9A7955] transition-colors flex items-center justify-center gap-2"
                  >
                    <span>{loading ? 'Submitting...' : 'Dispatch Inquiry'}</span>
                    <ArrowRight size={14} />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

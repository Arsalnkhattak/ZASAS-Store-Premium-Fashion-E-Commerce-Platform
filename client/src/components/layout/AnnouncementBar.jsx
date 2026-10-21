import React from 'react';

export default function AnnouncementBar() {
  return (
    <aside aria-label="Announcement" className="bg-[#1C1C1A] text-[#F8F5EF] text-[11px] tracking-[0.2em] uppercase py-2 px-4 text-center font-medium border-b border-[#333330]">
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-4 flex-wrap">
        <span>Complimentary Express Shipping Across Pakistan on Orders Over Rs. 10,000</span>
        <span className="hidden md:inline text-[#9A7955]">•</span>
        <span className="hidden md:inline">Cash On Delivery Available Nationwide</span>
      </div>
    </aside>
  );
}

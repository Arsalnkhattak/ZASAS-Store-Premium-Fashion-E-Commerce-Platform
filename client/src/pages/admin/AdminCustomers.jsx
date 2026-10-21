import React, { useEffect, useState } from 'react';
import { Users, Search, Mail, Phone, MapPin, Calendar } from 'lucide-react';
import api from '../../services/api';

export default function AdminCustomers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    api.get('/admin/customers')
      .then((res) => setCustomers(res.data.customers || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = customers.filter((c) => {
    const q = search.toLowerCase();
    return (
      c.name?.toLowerCase().includes(q) ||
      c.email?.toLowerCase().includes(q) ||
      c.phone?.includes(q)
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E7E3DC]">
        <div>
          <span className="text-[10px] uppercase tracking-[0.25em] text-[#9A7955] font-semibold block">
            Patronage Registry
          </span>
          <h1 className="font-serif text-3xl text-[#1C1C1A] mt-0.5">
            Registered Patrons ({customers.length})
          </h1>
        </div>

        <div className="relative min-w-[260px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A59A8A]" />
          <input
            type="text"
            placeholder="Search patrons by name, email, phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs border border-[#E7E3DC] bg-white focus:outline-none focus:border-[#9A7955]"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-[#E7E3DC] overflow-x-auto shadow-2xs">
        {loading ? (
          <div className="p-6 space-y-3 animate-pulse">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="h-12 bg-[#E7E3DC]" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-[#A59A8A]">
            <Users size={28} className="mx-auto mb-2 text-[#9A7955]" />
            <p className="text-xs">No registered customer records found.</p>
          </div>
        ) : (
          <table className="w-full text-xs">
            <thead className="bg-[#F8F5EF] border-b border-[#E7E3DC]">
              <tr>
                {['Patron Name', 'Email Address', 'Telephone', 'Registered Date', 'Saved Addresses', 'Status'].map((h) => (
                  <th key={h} className="py-3 px-4 text-left text-[10px] uppercase tracking-wider text-[#A59A8A] font-semibold">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E7E3DC]/60">
              {filtered.map((c) => (
                <tr key={c._id} className="hover:bg-[#F8F5EF] transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#1C1C1A] text-white flex items-center justify-center font-serif text-xs uppercase">
                        {c.name?.charAt(0) || 'P'}
                      </div>
                      <span className="font-semibold text-[#1C1C1A]">{c.name}</span>
                    </div>
                  </td>

                  <td className="py-3 px-4 text-[#4A4843]">
                    <div className="flex items-center gap-1.5">
                      <Mail size={13} className="text-[#A59A8A]" />
                      <span>{c.email}</span>
                    </div>
                  </td>

                  <td className="py-3 px-4 font-mono text-[#4A4843]">
                    {c.phone ? (
                      <div className="flex items-center gap-1.5">
                        <Phone size={13} className="text-[#A59A8A]" />
                        <span>{c.phone}</span>
                      </div>
                    ) : (
                      <span className="text-[#A59A8A]">—</span>
                    )}
                  </td>

                  <td className="py-3 px-4 text-[#A59A8A]">
                    <div className="flex items-center gap-1.5">
                      <Calendar size={13} />
                      <span>
                        {new Date(c.createdAt).toLocaleDateString('en-PK', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </span>
                    </div>
                  </td>

                  <td className="py-3 px-4">
                    <span className="inline-flex items-center gap-1 text-[#4A4843]">
                      <MapPin size={13} className="text-[#9A7955]" />
                      <span>{c.addresses?.length || 0} Saved</span>
                    </span>
                  </td>

                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 text-[9px] uppercase tracking-wider bg-emerald-50 text-emerald-700 font-medium">
                      Active
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

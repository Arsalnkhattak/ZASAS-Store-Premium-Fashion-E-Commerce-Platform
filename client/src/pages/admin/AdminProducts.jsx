import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2, Search, Eye, EyeOff } from 'lucide-react';
import api from '../../services/api';
import { formatPKR } from '../../utils/currency';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({ page, limit: 20 });
      if (search) params.set('search', search);
      const res = await api.get(`/admin/products?${params}`);
      setProducts(res.data.products || []);
      setTotalPages(res.data.totalPages || 1);
      setTotalCount(res.data.totalCount || 0);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, [page, search]);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return;
    try {
      await api.delete(`/admin/products/${id}`);
      fetchProducts();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] uppercase tracking-[0.25em] text-[#9A7955] font-semibold block">Catalog Management</span>
          <h1 className="font-serif text-3xl text-[#1C1C1A] mt-0.5">Products ({totalCount})</h1>
        </div>
        <Link
          to="/admin/products/new"
          className="flex items-center gap-2 px-5 py-2.5 bg-[#1C1C1A] text-white text-xs uppercase tracking-widest hover:bg-[#9A7955] transition-colors"
        >
          <Plus size={15} /><span>New Product</span>
        </Link>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A59A8A]" />
        <input
          type="text"
          placeholder="Search by name or SKU..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="w-full pl-9 pr-4 py-2.5 text-sm border border-[#E7E3DC] bg-white focus:outline-none focus:border-[#9A7955]"
        />
      </div>

      {/* Table */}
      <div className="bg-white border border-[#E7E3DC] overflow-x-auto">
        {loading ? (
          <div className="animate-pulse p-6 space-y-3">
            {[1,2,3,4,5].map((n) => <div key={n} className="h-14 bg-[#E7E3DC]" />)}
          </div>
        ) : (
          <table className="w-full text-xs">
            <thead className="bg-[#F8F5EF] border-b border-[#E7E3DC]">
              <tr>
                {['Image', 'Name', 'SKU', 'Category', 'Price (PKR)', 'Stock', 'Status', 'Actions'].map((h) => (
                  <th key={h} className="py-3 px-4 text-left text-[10px] uppercase tracking-wider text-[#A59A8A] font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E7E3DC]/60">
              {products.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-[#A59A8A]">No products found.</td>
                </tr>
              ) : products.map((product) => (
                <tr key={product._id} className="hover:bg-[#F8F5EF] transition-colors">
                  <td className="py-3 px-4">
                    <div className="w-10 h-14 bg-[#E7E3DC] overflow-hidden">
                      {product.images?.[0] && (
                        <img src={product.images[0]} alt="" className="w-full h-full object-cover" />
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4 font-medium text-[#1C1C1A] max-w-[200px]">
                    <span className="line-clamp-2">{product.name}</span>
                  </td>
                  <td className="py-3 px-4 font-mono text-[#A59A8A]">{product.sku}</td>
                  <td className="py-3 px-4 text-[#A59A8A]">{product.category?.name || '-'}</td>
                  <td className="py-3 px-4 font-semibold text-[#1C1C1A]">{formatPKR(product.price)}</td>
                  <td className="py-3 px-4">
                    <span className={`font-medium ${product.totalStock <= 0 ? 'text-red-600' : product.totalStock <= 5 ? 'text-yellow-600' : 'text-emerald-600'}`}>
                      {product.totalStock}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 text-[10px] uppercase tracking-wider font-medium ${product.isPublished ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-600'}`}>
                      {product.isPublished ? 'Live' : 'Draft'}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <Link to={`/product/${product.slug}`} target="_blank"
                        className="p-1.5 text-[#A59A8A] hover:text-[#1C1C1A]" title="Preview">
                        <Eye size={14} />
                      </Link>
                      <Link to={`/admin/products/${product._id}/edit`}
                        className="p-1.5 text-[#A59A8A] hover:text-[#9A7955]" title="Edit">
                        <Edit size={14} />
                      </Link>
                      <button type="button"
                        onClick={() => handleDelete(product._id, product.name)}
                        className="p-1.5 text-[#A59A8A] hover:text-red-600" title="Delete">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button key={p} type="button" onClick={() => setPage(p)}
              className={`w-8 h-8 text-xs font-medium ${page === p ? 'bg-[#1C1C1A] text-white' : 'bg-white border border-[#E7E3DC] text-[#1C1C1A] hover:border-[#9A7955]'}`}>
              {p}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

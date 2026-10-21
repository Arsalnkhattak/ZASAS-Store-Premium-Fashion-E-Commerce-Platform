import React, { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, Tag, Layers, CheckCircle, AlertCircle, X } from 'lucide-react';
import api from '../../services/api';

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    tagline: '',
    description: '',
    image: '',
    featured: false,
    order: 0,
  });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await api.get('/categories');
      setCategories(res.data.categories || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const openCreateModal = () => {
    setEditingCategory(null);
    setFormData({
      name: '',
      tagline: '',
      description: '',
      image: '',
      featured: false,
      order: categories.length + 1,
    });
    setError('');
    setMessage('');
    setModalOpen(true);
  };

  const openEditModal = (cat) => {
    setEditingCategory(cat);
    setFormData({
      name: cat.name || '',
      tagline: cat.tagline || '',
      description: cat.description || '',
      image: cat.image || '',
      featured: Boolean(cat.featured),
      order: cat.order || 0,
    });
    setError('');
    setMessage('');
    setModalOpen(true);
  };

  const handleDelete = async (cat) => {
    if (!window.confirm(`Delete category "${cat.name}"?`)) return;
    try {
      await api.delete(`/admin/categories/${cat._id}`);
      fetchCategories();
      setMessage(`Category "${cat.name}" removed successfully.`);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      if (editingCategory) {
        await api.put(`/admin/categories/${editingCategory._id}`, formData);
        setMessage(`Category "${formData.name}" updated successfully.`);
      } else {
        await api.post('/admin/categories', formData);
        setMessage(`Category "${formData.name}" created successfully.`);
      }
      setModalOpen(false);
      fetchCategories();
    } catch (err) {
      setError(err.message || 'Operation failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E7E3DC]">
        <div>
          <span className="text-[10px] uppercase tracking-[0.25em] text-[#9A7955] font-semibold block">
            Taxonomy & Catalog Architecture
          </span>
          <h1 className="font-serif text-3xl text-[#1C1C1A] mt-0.5">Categories & Lines</h1>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#1C1C1A] text-white text-xs uppercase tracking-widest hover:bg-[#9A7955] transition-colors"
        >
          <Plus size={15} />
          <span>New Category</span>
        </button>
      </div>

      {message && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center justify-between">
          <span>{message}</span>
          <button onClick={() => setMessage('')}><X size={14} /></button>
        </div>
      )}

      {/* Grid of Categories */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-64 bg-[#E7E3DC]" />
          ))}
        </div>
      ) : categories.length === 0 ? (
        <div className="bg-white border border-[#E7E3DC] p-12 text-center text-[#A59A8A]">
          <Tag size={32} className="mx-auto mb-2 text-[#9A7955]" />
          <p className="text-sm">No categories registered yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <div
              key={cat._id}
              className="bg-white border border-[#E7E3DC] flex flex-col justify-between overflow-hidden group hover:border-[#9A7955] transition-colors"
            >
              <div>
                <div className="h-44 bg-[#F8F5EF] relative overflow-hidden">
                  {cat.image ? (
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[#A59A8A]">
                      <Tag size={28} />
                    </div>
                  )}
                  {cat.featured && (
                    <span className="absolute top-3 left-3 bg-[#1C1C1A] text-white text-[9px] uppercase tracking-widest px-2.5 py-1">
                      Featured
                    </span>
                  )}
                  <span className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-xs text-white text-[10px] font-mono px-2 py-0.5">
                    Order: {cat.order ?? 0}
                  </span>
                </div>

                <div className="p-5 space-y-2">
                  <div className="flex items-baseline justify-between">
                    <h3 className="font-serif text-lg text-[#1C1C1A]">{cat.name}</h3>
                    <span className="text-[10px] font-mono text-[#A59A8A]">/{cat.slug}</span>
                  </div>
                  {cat.tagline && (
                    <p className="text-xs text-[#9A7955] font-serif italic">{cat.tagline}</p>
                  )}
                  {cat.description && (
                    <p className="text-xs text-[#4A4843] line-clamp-2 leading-relaxed">
                      {cat.description}
                    </p>
                  )}
                </div>
              </div>

              <div className="p-4 border-t border-[#E7E3DC] bg-[#F8F5EF] flex items-center justify-between text-xs">
                <span className="text-[10px] uppercase tracking-wider text-[#A59A8A]">
                  Active Archive
                </span>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => openEditModal(cat)}
                    className="p-1.5 text-[#1C1C1A] hover:text-[#9A7955] transition-colors"
                    title="Edit Category"
                  >
                    <Edit size={15} />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(cat)}
                    className="p-1.5 text-red-600 hover:text-red-800 transition-colors"
                    title="Delete Category"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal for Create/Edit */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#E7E3DC] max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 border-b border-[#E7E3DC]">
              <h3 className="font-serif text-xl text-[#1C1C1A]">
                {editingCategory ? `Edit Category: ${editingCategory.name}` : 'New Atelier Category'}
              </h3>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="text-[#A59A8A] hover:text-[#1C1C1A]"
              >
                <X size={18} />
              </button>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#1C1C1A] font-medium mb-1">
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Unstitched Luxury Lawn"
                  className="w-full px-3 py-2 border border-[#E7E3DC] bg-white focus:outline-none focus:border-[#9A7955]"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#1C1C1A] font-medium mb-1">
                  Tagline
                </label>
                <input
                  type="text"
                  value={formData.tagline}
                  onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                  placeholder="Intricate schiffli embroideries & pure Swiss voiles"
                  className="w-full px-3 py-2 border border-[#E7E3DC] bg-white focus:outline-none focus:border-[#9A7955]"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#1C1C1A] font-medium mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Overview of this collection line..."
                  className="w-full px-3 py-2 border border-[#E7E3DC] bg-white focus:outline-none focus:border-[#9A7955]"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#1C1C1A] font-medium mb-1">
                  Cover Image URL
                </label>
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-2 border border-[#E7E3DC] bg-white focus:outline-none focus:border-[#9A7955]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#1C1C1A] font-medium mb-1">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value, 10) || 0 })}
                    className="w-full px-3 py-2 border border-[#E7E3DC] bg-white focus:outline-none focus:border-[#9A7955]"
                  />
                </div>

                <div className="flex items-center pt-5">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.featured}
                      onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                      className="w-4 h-4 text-[#9A7955]"
                    />
                    <span className="text-xs text-[#1C1C1A] font-medium">Feature on Homepage</span>
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E7E3DC]">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 border border-[#E7E3DC] text-xs uppercase tracking-wider text-[#1C1C1A]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2 bg-[#1C1C1A] text-white text-xs uppercase tracking-widest hover:bg-[#9A7955] transition-colors"
                >
                  {submitting ? 'Saving...' : editingCategory ? 'Update Category' : 'Create Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

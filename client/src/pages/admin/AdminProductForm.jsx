import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save, Plus, Trash2, Image, Layers, Sparkles } from 'lucide-react';
import api from '../../services/api';

const AVAILABLE_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'Free Size'];

export default function AdminProductForm() {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(isEditing);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Form State
  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [category, setCategory] = useState('');
  const [subCategory, setSubCategory] = useState('');
  const [description, setDescription] = useState('');
  const [editorialStory, setEditorialStory] = useState('');
  const [price, setPrice] = useState('');
  const [compareAtPrice, setCompareAtPrice] = useState('');
  const [images, setImages] = useState(['']);
  const [selectedSizes, setSelectedSizes] = useState(['S', 'M', 'L']);
  const [colors, setColors] = useState([{ name: 'Ivory', hex: '#FDFBF7' }]);
  const [details, setDetails] = useState(['Pure Silk Fabric', 'Handcrafted Embroidery']);
  const [fabricCare, setFabricCare] = useState(['Dry Clean Only', 'Steam Iron Low']);
  const [tags, setTags] = useState('pret, luxury, festive');
  const [isFeatured, setIsFeatured] = useState(false);
  const [isNewArrival, setIsNewArrival] = useState(true);
  const [isBestSeller, setIsBestSeller] = useState(false);
  const [isPublished, setIsPublished] = useState(true);

  // Variants state: { sku, size, color, stock, priceOverride }
  const [variants, setVariants] = useState([
    { sku: '', size: 'S', color: 'Ivory', stock: 10, priceOverride: '' },
    { sku: '', size: 'M', color: 'Ivory', stock: 10, priceOverride: '' },
    { sku: '', size: 'L', color: 'Ivory', stock: 5, priceOverride: '' },
  ]);

  // Fetch categories and existing product data
  useEffect(() => {
    api.get('/categories')
      .then((res) => {
        setCategories(res.data.categories || []);
        if (!category && res.data.categories?.length > 0) {
          setCategory(res.data.categories[0]._id);
        }
      })
      .catch(console.error);

    if (isEditing) {
      api.get(`/admin/products?limit=100`)
        .then((res) => {
          const found = res.data.products?.find((p) => p._id === id);
          if (found) {
            setName(found.name || '');
            setSku(found.sku || '');
            setCategory(found.category?._id || found.category || '');
            setSubCategory(found.subCategory || '');
            setDescription(found.description || '');
            setEditorialStory(found.editorialStory || '');
            setPrice(found.price || '');
            setCompareAtPrice(found.compareAtPrice || '');
            setImages(found.images?.length ? found.images : ['']);
            setSelectedSizes(found.sizes || []);
            setColors(found.colors?.length ? found.colors : [{ name: 'Ivory', hex: '#FDFBF7' }]);
            setDetails(found.details?.length ? found.details : []);
            setFabricCare(found.fabricCare?.length ? found.fabricCare : []);
            setTags(found.tags?.join(', ') || '');
            setIsFeatured(Boolean(found.isFeatured));
            setIsNewArrival(Boolean(found.isNewArrival));
            setIsBestSeller(Boolean(found.isBestSeller));
            setIsPublished(Boolean(found.isPublished));
            if (found.variants?.length) {
              setVariants(found.variants);
            }
          }
        })
        .catch((err) => setError(err.message))
        .finally(() => setLoading(false));
    }
  }, [id, isEditing]);

  const handleAddImage = () => setImages([...images, '']);
  const handleRemoveImage = (index) => setImages(images.filter((_, i) => i !== index));
  const handleImageChange = (index, val) => {
    const updated = [...images];
    updated[index] = val;
    setImages(updated);
  };

  const handleAddColor = () => setColors([...colors, { name: '', hex: '#000000' }]);
  const handleRemoveColor = (index) => setColors(colors.filter((_, i) => i !== index));
  const handleColorChange = (index, field, val) => {
    const updated = [...colors];
    updated[index][field] = val;
    setColors(updated);
  };

  const toggleSize = (s) => {
    if (selectedSizes.includes(s)) {
      setSelectedSizes(selectedSizes.filter((x) => x !== s));
    } else {
      setSelectedSizes([...selectedSizes, s]);
    }
  };

  const handleAddVariant = () => {
    setVariants([
      ...variants,
      {
        sku: `${sku || 'SKU'}-${selectedSizes[0] || 'S'}-${variants.length + 1}`,
        size: selectedSizes[0] || 'S',
        color: colors[0]?.name || 'Standard',
        stock: 5,
        priceOverride: '',
      },
    ]);
  };

  const handleRemoveVariant = (index) => {
    setVariants(variants.filter((_, i) => i !== index));
  };

  const handleVariantChange = (index, field, val) => {
    const updated = [...variants];
    updated[index][field] = val;
    setVariants(updated);
  };

  const handleListChange = (setter, list, index, val) => {
    const updated = [...list];
    updated[index] = val;
    setter(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const cleanImages = images.filter((img) => img.trim().length > 0);
      if (cleanImages.length === 0) {
        throw new Error('At least one product image URL is required.');
      }

      const formattedVariants = variants.map((v, i) => ({
        sku: v.sku?.trim() || `${sku.toUpperCase()}-${v.size}-${i + 1}`,
        size: v.size,
        color: v.color || 'Standard',
        stock: parseInt(v.stock, 10) || 0,
        priceOverride: v.priceOverride ? parseFloat(v.priceOverride) : null,
      }));

      const payload = {
        name,
        sku: sku.toUpperCase().trim(),
        category,
        subCategory: subCategory.trim() || undefined,
        description,
        editorialStory: editorialStory.trim() || undefined,
        price: parseFloat(price),
        compareAtPrice: compareAtPrice ? parseFloat(compareAtPrice) : null,
        images: cleanImages,
        sizes: selectedSizes,
        colors: colors.filter((c) => c.name.trim().length > 0),
        variants: formattedVariants,
        details: details.filter((d) => d.trim().length > 0),
        fabricCare: fabricCare.filter((f) => f.trim().length > 0),
        tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
        isFeatured,
        isNewArrival,
        isBestSeller,
        isPublished,
      };

      if (isEditing) {
        await api.put(`/admin/products/${id}`, payload);
      } else {
        await api.post('/admin/products', payload);
      }

      navigate('/admin/products');
    } catch (err) {
      setError(err.message || 'Failed to save product');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-8 bg-[#E7E3DC] w-48" />
        <div className="h-96 bg-[#E7E3DC]" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20">
      <div className="flex items-center justify-between pb-4 border-b border-[#E7E3DC]">
        <div className="flex items-center gap-3">
          <Link
            to="/admin/products"
            className="p-2 border border-[#E7E3DC] bg-white text-[#1C1C1A] hover:bg-[#F8F5EF] transition-colors"
          >
            <ArrowLeft size={16} />
          </Link>
          <div>
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#9A7955] font-semibold block">
              Catalog Management
            </span>
            <h1 className="font-serif text-2xl text-[#1C1C1A]">
              {isEditing ? `Edit Silhouette: ${name || 'Product'}` : 'Register New Silhouette'}
            </h1>
          </div>
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={submitting}
          className="flex items-center gap-2 px-6 py-2.5 bg-[#1C1C1A] text-white text-xs uppercase tracking-widest hover:bg-[#9A7955] transition-colors"
        >
          <Save size={15} />
          <span>{submitting ? 'Archiving...' : isEditing ? 'Save Updates' : 'Publish Silhouette'}</span>
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-xs">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Core Details */}
        <div className="bg-white border border-[#E7E3DC] p-6 space-y-5">
          <h2 className="font-serif text-lg text-[#1C1C1A]">Primary Attributes</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-[11px] uppercase tracking-wider text-[#1C1C1A] font-medium mb-1.5">
                Product Title *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Nilofer Raw Silk Kurta Set"
                className="w-full px-3 py-2 text-xs border border-[#E7E3DC] bg-white focus:outline-none focus:border-[#9A7955]"
              />
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider text-[#1C1C1A] font-medium mb-1.5">
                Base SKU *
              </label>
              <input
                type="text"
                required
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                placeholder="e.g. ZAS-PRT-009"
                className="w-full px-3 py-2 text-xs border border-[#E7E3DC] bg-white focus:outline-none focus:border-[#9A7955] uppercase"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-[11px] uppercase tracking-wider text-[#1C1C1A] font-medium mb-1.5">
                Category *
              </label>
              <select
                required
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-[#E7E3DC] bg-white focus:outline-none focus:border-[#9A7955]"
              >
                <option value="">Select Category</option>
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider text-[#1C1C1A] font-medium mb-1.5">
                Sub-Category / Fabric Line
              </label>
              <input
                type="text"
                value={subCategory}
                onChange={(e) => setSubCategory(e.target.value)}
                placeholder="e.g. Pure Rawaan Silk, Chiffon Dupatta"
                className="w-full px-3 py-2 text-xs border border-[#E7E3DC] bg-white focus:outline-none focus:border-[#9A7955]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-[11px] uppercase tracking-wider text-[#1C1C1A] font-medium mb-1.5">
                Retail Price (PKR ₨) *
              </label>
              <input
                type="number"
                required
                min="0"
                step="100"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="28500"
                className="w-full px-3 py-2 text-xs border border-[#E7E3DC] bg-white focus:outline-none focus:border-[#9A7955]"
              />
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider text-[#1C1C1A] font-medium mb-1.5">
                Original Compare-At Price (PKR ₨)
              </label>
              <input
                type="number"
                min="0"
                step="100"
                value={compareAtPrice}
                onChange={(e) => setCompareAtPrice(e.target.value)}
                placeholder="Leave blank if not on promotion"
                className="w-full px-3 py-2 text-xs border border-[#E7E3DC] bg-white focus:outline-none focus:border-[#9A7955]"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] uppercase tracking-wider text-[#1C1C1A] font-medium mb-1.5">
              Description * (Minimum 10 characters)
            </label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Refined description detailing silhouette cut, neckline embellishments, and artisanal styling..."
              className="w-full px-3 py-2 text-xs border border-[#E7E3DC] bg-white focus:outline-none focus:border-[#9A7955]"
            />
          </div>

          <div>
            <label className="block text-[11px] uppercase tracking-wider text-[#1C1C1A] font-medium mb-1.5">
              Editorial Romance Story
            </label>
            <textarea
              rows={2}
              value={editorialStory}
              onChange={(e) => setEditorialStory(e.target.value)}
              placeholder="Poetic vignette for the collection campaign showcase..."
              className="w-full px-3 py-2 text-xs border border-[#E7E3DC] bg-white focus:outline-none focus:border-[#9A7955]"
            />
          </div>
        </div>

        {/* Imagery */}
        <div className="bg-white border border-[#E7E3DC] p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-serif text-lg text-[#1C1C1A]">Imagery & Visual Campaign</h2>
              <p className="text-xs text-[#A59A8A]">Provide high-resolution image URLs (Unsplash or CDN hosted).</p>
            </div>
            <button
              type="button"
              onClick={handleAddImage}
              className="flex items-center gap-1.5 text-xs text-[#9A7955] uppercase tracking-wider hover:underline"
            >
              <Plus size={14} /><span>Add Photo URL</span>
            </button>
          </div>

          <div className="space-y-3">
            {images.map((img, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <div className="w-10 h-12 bg-[#F8F5EF] border border-[#E7E3DC] overflow-hidden shrink-0 flex items-center justify-center">
                  {img ? (
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <Image size={16} className="text-[#A59A8A]" />
                  )}
                </div>
                <input
                  type="url"
                  required={idx === 0}
                  value={img}
                  onChange={(e) => handleImageChange(idx, e.target.value)}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="flex-1 px-3 py-2 text-xs border border-[#E7E3DC] bg-white focus:outline-none focus:border-[#9A7955]"
                />
                {images.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(idx)}
                    className="p-2 text-red-500 hover:text-red-700"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Sizes and Colors */}
        <div className="bg-white border border-[#E7E3DC] p-6 space-y-6">
          <h2 className="font-serif text-lg text-[#1C1C1A]">Sizes & Colorways</h2>

          <div>
            <label className="block text-[11px] uppercase tracking-wider text-[#1C1C1A] font-medium mb-2">
              Offered Sizes
            </label>
            <div className="flex flex-wrap gap-2">
              {AVAILABLE_SIZES.map((sz) => {
                const active = selectedSizes.includes(sz);
                return (
                  <button
                    key={sz}
                    type="button"
                    onClick={() => toggleSize(sz)}
                    className={`px-4 py-2 text-xs font-mono uppercase tracking-wider border transition-colors ${
                      active
                        ? 'bg-[#1C1C1A] text-white border-[#1C1C1A]'
                        : 'bg-white text-[#1C1C1A] border-[#E7E3DC] hover:border-[#9A7955]'
                    }`}
                  >
                    {sz}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-[11px] uppercase tracking-wider text-[#1C1C1A] font-medium">
                Colorways
              </label>
              <button
                type="button"
                onClick={handleAddColor}
                className="text-xs text-[#9A7955] uppercase tracking-wider hover:underline flex items-center gap-1"
              >
                <Plus size={14} /><span>Add Color</span>
              </button>
            </div>
            <div className="space-y-3">
              {colors.map((c, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <input
                    type="color"
                    value={c.hex || '#000000'}
                    onChange={(e) => handleColorChange(idx, 'hex', e.target.value)}
                    className="w-9 h-9 p-0.5 border border-[#E7E3DC] cursor-pointer"
                  />
                  <input
                    type="text"
                    value={c.name}
                    onChange={(e) => handleColorChange(idx, 'name', e.target.value)}
                    placeholder="Color Name (e.g. Ivory Gold)"
                    className="flex-1 px-3 py-2 text-xs border border-[#E7E3DC] bg-white focus:outline-none focus:border-[#9A7955]"
                  />
                  <input
                    type="text"
                    value={c.hex}
                    onChange={(e) => handleColorChange(idx, 'hex', e.target.value)}
                    placeholder="#FDFBF7"
                    className="w-28 px-3 py-2 text-xs font-mono border border-[#E7E3DC] bg-white focus:outline-none focus:border-[#9A7955]"
                  />
                  {colors.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveColor(idx)}
                      className="p-2 text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Variants Inventory Matrix */}
        <div className="bg-white border border-[#E7E3DC] p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-serif text-lg text-[#1C1C1A]">Inventory Variants Matrix</h2>
              <p className="text-xs text-[#A59A8A]">Specify stock units for each size and color combination.</p>
            </div>
            <button
              type="button"
              onClick={handleAddVariant}
              className="flex items-center gap-1.5 text-xs text-[#9A7955] uppercase tracking-wider hover:underline"
            >
              <Plus size={14} /><span>Add Variant Row</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="bg-[#F8F5EF] border-b border-[#E7E3DC]">
                <tr>
                  <th className="py-2.5 px-3 text-left font-medium text-[#A59A8A]">Variant SKU</th>
                  <th className="py-2.5 px-3 text-left font-medium text-[#A59A8A]">Size</th>
                  <th className="py-2.5 px-3 text-left font-medium text-[#A59A8A]">Color</th>
                  <th className="py-2.5 px-3 text-left font-medium text-[#A59A8A]">Stock Units</th>
                  <th className="py-2.5 px-3 text-left font-medium text-[#A59A8A]">Price Override</th>
                  <th className="py-2.5 px-3 text-right font-medium text-[#A59A8A]">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E7E3DC]/60">
                {variants.map((v, idx) => (
                  <tr key={idx}>
                    <td className="py-2 px-3">
                      <input
                        type="text"
                        value={v.sku}
                        onChange={(e) => handleVariantChange(idx, 'sku', e.target.value)}
                        placeholder={`${sku}-${v.size}`}
                        className="w-full px-2 py-1 text-xs border border-[#E7E3DC] font-mono"
                      />
                    </td>
                    <td className="py-2 px-3">
                      <select
                        value={v.size}
                        onChange={(e) => handleVariantChange(idx, 'size', e.target.value)}
                        className="w-full px-2 py-1 text-xs border border-[#E7E3DC]"
                      >
                        {selectedSizes.map((sz) => (
                          <option key={sz} value={sz}>{sz}</option>
                        ))}
                      </select>
                    </td>
                    <td className="py-2 px-3">
                      <input
                        type="text"
                        value={v.color}
                        onChange={(e) => handleVariantChange(idx, 'color', e.target.value)}
                        className="w-full px-2 py-1 text-xs border border-[#E7E3DC]"
                      />
                    </td>
                    <td className="py-2 px-3">
                      <input
                        type="number"
                        min="0"
                        value={v.stock}
                        onChange={(e) => handleVariantChange(idx, 'stock', e.target.value)}
                        className="w-24 px-2 py-1 text-xs border border-[#E7E3DC]"
                      />
                    </td>
                    <td className="py-2 px-3">
                      <input
                        type="number"
                        min="0"
                        value={v.priceOverride || ''}
                        onChange={(e) => handleVariantChange(idx, 'priceOverride', e.target.value)}
                        placeholder="Inherit"
                        className="w-28 px-2 py-1 text-xs border border-[#E7E3DC]"
                      />
                    </td>
                    <td className="py-2 px-3 text-right">
                      {variants.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveVariant(idx)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 size={15} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Details & Fabric Care */}
        <div className="bg-white border border-[#E7E3DC] p-6 space-y-6">
          <h2 className="font-serif text-lg text-[#1C1C1A]">Product Specifications & Care</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Highlights */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-[11px] uppercase tracking-wider text-[#1C1C1A] font-medium">
                  Artisanal Details
                </label>
                <button
                  type="button"
                  onClick={() => setDetails([...details, ''])}
                  className="text-xs text-[#9A7955] hover:underline"
                >
                  + Add Point
                </button>
              </div>
              {details.map((d, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={d}
                    onChange={(e) => handleListChange(setDetails, details, idx, e.target.value)}
                    placeholder="e.g. Zardozi neckline with gold dabka"
                    className="flex-1 px-3 py-1.5 text-xs border border-[#E7E3DC]"
                  />
                  {details.length > 1 && (
                    <button
                      type="button"
                      onClick={() => setDetails(details.filter((_, i) => i !== idx))}
                      className="text-red-500 hover:text-red-700 p-1"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Fabric Care */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-[11px] uppercase tracking-wider text-[#1C1C1A] font-medium">
                  Fabric & Care
                </label>
                <button
                  type="button"
                  onClick={() => setFabricCare([...fabricCare, ''])}
                  className="text-xs text-[#9A7955] hover:underline"
                >
                  + Add Instruction
                </button>
              </div>
              {fabricCare.map((f, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={f}
                    onChange={(e) => handleListChange(setFabricCare, fabricCare, idx, e.target.value)}
                    placeholder="e.g. Dry Clean Only"
                    className="flex-1 px-3 py-1.5 text-xs border border-[#E7E3DC]"
                  />
                  {fabricCare.length > 1 && (
                    <button
                      type="button"
                      onClick={() => setFabricCare(fabricCare.filter((_, i) => i !== idx))}
                      className="text-red-500 hover:text-red-700 p-1"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-[11px] uppercase tracking-wider text-[#1C1C1A] font-medium mb-1.5">
              Search Tags (comma separated)
            </label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="pret, raw silk, eid, couture, luxury"
              className="w-full px-3 py-2 text-xs border border-[#E7E3DC] bg-white focus:outline-none focus:border-[#9A7955]"
            />
          </div>
        </div>

        {/* Display Toggles */}
        <div className="bg-white border border-[#E7E3DC] p-6 space-y-4">
          <h2 className="font-serif text-lg text-[#1C1C1A]">Atelier Merchandising Toggles</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={isPublished}
                onChange={(e) => setIsPublished(e.target.checked)}
                className="w-4 h-4 text-[#9A7955] rounded border-[#E7E3DC]"
              />
              <span className="text-xs font-medium text-[#1C1C1A]">Live on Boutique</span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="w-4 h-4 text-[#9A7955] rounded border-[#E7E3DC]"
              />
              <span className="text-xs font-medium text-[#1C1C1A]">Curated Feature</span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={isNewArrival}
                onChange={(e) => setIsNewArrival(e.target.checked)}
                className="w-4 h-4 text-[#9A7955] rounded border-[#E7E3DC]"
              />
              <span className="text-xs font-medium text-[#1C1C1A]">New Arrival Flag</span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={isBestSeller}
                onChange={(e) => setIsBestSeller(e.target.checked)}
                className="w-4 h-4 text-[#9A7955] rounded border-[#E7E3DC]"
              />
              <span className="text-xs font-medium text-[#1C1C1A]">Bestseller Flag</span>
            </label>
          </div>
        </div>

        {/* Form Submission */}
        <div className="flex items-center justify-end gap-4 pt-4">
          <Link
            to="/admin/products"
            className="px-6 py-2.5 border border-[#E7E3DC] text-xs uppercase tracking-wider text-[#1C1C1A] hover:bg-[#F8F5EF]"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={submitting}
            className="px-8 py-2.5 bg-[#1C1C1A] text-white text-xs uppercase tracking-widest hover:bg-[#9A7955] transition-colors"
          >
            {submitting ? 'Archiving...' : isEditing ? 'Save Updates' : 'Publish Silhouette'}
          </button>
        </div>
      </form>
    </div>
  );
}

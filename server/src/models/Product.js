import mongoose from 'mongoose';

const colorVariantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  hex: { type: String, required: true },
}, { _id: false });

const variantSchema = new mongoose.Schema({
  sku: { type: String, required: true },
  size: { type: String, required: true }, // e.g. XS, S, M, L, XL, Standard, 38, 39
  color: { type: String, required: true }, // e.g. Ivory White, Dusky Rose, Noir
  stock: { type: Number, required: true, default: 0, min: 0 },
  priceOverride: { type: Number, default: null },
}, { _id: true });

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    index: true,
  },
  sku: {
    type: String,
    required: [true, 'Base SKU is required'],
    unique: true,
    uppercase: true,
    trim: true,
    index: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
    index: true,
  },
  subCategory: {
    type: String,
    default: 'Pret',
    index: true,
  },
  description: {
    type: String,
    required: [true, 'Product description is required'],
  },
  editorialStory: {
    type: String,
    default: '',
  },
  details: [{
    type: String,
  }],
  fabricCare: [{
    type: String,
  }],
  price: {
    type: Number,
    required: [true, 'Price in PKR is required'],
    min: 0,
    index: true,
  },
  compareAtPrice: {
    type: Number,
    default: null,
  },
  currency: {
    type: String,
    default: 'PKR',
  },
  images: [{
    type: String,
    required: true,
  }],
  sizes: [{
    type: String,
  }],
  colors: [colorVariantSchema],
  variants: [variantSchema],
  tags: [{
    type: String,
    index: true,
  }],
  totalStock: {
    type: Number,
    default: 0,
    min: 0,
  },
  isFeatured: {
    type: Boolean,
    default: false,
    index: true,
  },
  isNewArrival: {
    type: Boolean,
    default: true,
    index: true,
  },
  isBestSeller: {
    type: Boolean,
    default: false,
    index: true,
  },
  isPublished: {
    type: Boolean,
    default: true,
    index: true,
  },
}, {
  timestamps: true,
});

// Recalculate total stock before saving
productSchema.pre('save', function (next) {
  if (this.variants && this.variants.length > 0) {
    this.totalStock = this.variants.reduce((sum, v) => sum + (v.stock || 0), 0);
  }
  next();
});

productSchema.index({ name: 'text', description: 'text', editorialStory: 'text', tags: 'text' });

export const Product = mongoose.model('Product', productSchema);

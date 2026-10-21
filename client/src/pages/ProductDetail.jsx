import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Heart,
  ShoppingBag,
  Truck,
  ShieldCheck,
  RefreshCw,
  Ruler,
  ChevronRight,
  ArrowRight,
  Plus,
  Minus,
} from 'lucide-react';
import { motion } from 'motion/react';
import api from '../services/api';
import { addItemToCart } from '../store/cartSlice';
import { toggleProductWishlist } from '../store/authSlice';
import { setToast } from '../store/uiSlice';
import { formatPKR, calculateDiscount } from '../utils/currency';
import ProductCard from '../components/products/ProductCard';

export default function ProductDetail() {
  const { slug } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Selected variant state
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('details'); // details, fabric, shipping

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/products/${slug}`);
        const prod = res.data.product;
        setProduct(prod);

        // Set default variant selections
        if (prod.sizes && prod.sizes.length > 0) {
          setSelectedSize(prod.sizes[0]);
        }
        if (prod.colors && prod.colors.length > 0) {
          setSelectedColor(prod.colors[0].name);
        }

        // Fetch related products
        const relRes = await api.get(`/products/related/${prod._id}`);
        setRelatedProducts(relRes.data.products || []);
      } catch (error) {
        console.error('Failed to load product:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <p className="text-xs uppercase tracking-widest text-[#A59A8A]">Unveiling Atelier Ensemble...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <h2 className="font-serif text-3xl text-[#1C1C1A]">Piece Not Found</h2>
        <p className="text-xs text-[#A59A8A] mt-2">This design may have been archived or discontinued.</p>
        <Link to="/shop" className="mt-6 inline-block px-6 py-2.5 bg-[#1C1C1A] text-white text-xs uppercase tracking-widest">
          Explore Current Catalog
        </Link>
      </div>
    );
  }

  // Find currently active variant
  const activeVariant = product.variants?.find(
    (v) => (v.size === selectedSize && v.color === selectedColor) || v.size === selectedSize
  );

  const availableStock = activeVariant ? activeVariant.stock : product.totalStock;
  const isOutOfStock = availableStock <= 0;
  const displayPrice = activeVariant?.priceOverride || product.price;
  const discount = calculateDiscount(product.compareAtPrice, displayPrice);

  const isWishlisted = user?.wishlist?.some(
    (item) => (typeof item === 'string' ? item : item._id) === product._id
  );

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    dispatch(
      addItemToCart({
        productId: product._id,
        variantSku: activeVariant?.sku || product.sku,
        size: selectedSize || 'Standard',
        color: selectedColor || product.colors?.[0]?.name || 'Natural',
        quantity,
      })
    );
    dispatch(setToast({ message: `Added ${product.name} to your shopping bag.`, type: 'success' }));
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate('/checkout');
  };

  const handleWishlistToggle = () => {
    if (!isAuthenticated) {
      dispatch(setToast({ message: 'Please sign in to save pieces to your wishlist.', type: 'info' }));
      navigate('/login');
      return;
    }
    dispatch(toggleProductWishlist(product._id));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16 space-y-20">
      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs uppercase tracking-wider text-[#A59A8A]">
        <Link to="/" className="hover:text-[#1C1C1A]">Home</Link>
        <ChevronRight size={12} />
        <Link to="/shop" className="hover:text-[#1C1C1A]">Catalog</Link>
        <ChevronRight size={12} />
        {product.category && (
          <>
            <Link to={`/category/${product.category.slug}`} className="hover:text-[#1C1C1A]">
              {product.category.name}
            </Link>
            <ChevronRight size={12} />
          </>
        )}
        <span className="text-[#1C1C1A] truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Main Product Section: Gallery + Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
        {/* Left: Multi-Image Gallery */}
        <div className="lg:col-span-7 flex flex-col-reverse md:flex-row gap-4">
          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto shrink-0 pb-2 md:pb-0">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveImageIndex(idx)}
                  className={`w-16 h-20 sm:w-20 sm:h-26 overflow-hidden border transition-all ${
                    activeImageIndex === idx ? 'border-[#1C1C1A] ring-1 ring-[#1C1C1A]' : 'border-[#E7E3DC] opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Main Selected Image */}
          <div className="flex-1 aspect-3/4 overflow-hidden bg-[#E7E3DC] relative shadow-xs">
            <motion.img
              key={activeImageIndex}
              initial={{ opacity: 0.5 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              src={product.images[activeImageIndex] || product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {discount > 0 && (
              <span className="absolute top-4 left-4 bg-[#9A7955] text-white text-[10px] uppercase tracking-widest px-3 py-1 font-semibold">
                Special Offer • {discount}% Off
              </span>
            )}
          </div>
        </div>

        {/* Right: Product Purchase Options */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs uppercase tracking-[0.2em] text-[#A59A8A]">
              <span>{product.category?.name || product.subCategory}</span>
              <span>SKU: {activeVariant?.sku || product.sku}</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl text-[#1C1C1A] leading-tight font-light">
              {product.name}
            </h1>

            {/* Pricing in PKR */}
            <div className="flex items-baseline gap-3 pt-1">
              <span className="text-2xl font-serif font-semibold text-[#1C1C1A]">
                {formatPKR(displayPrice)}
              </span>
              {product.compareAtPrice && product.compareAtPrice > displayPrice && (
                <span className="text-base text-[#A59A8A] line-through">
                  {formatPKR(product.compareAtPrice)}
                </span>
              )}
              <span className="text-[11px] uppercase tracking-wider text-[#9A7955]">PKR • Taxes Included</span>
            </div>

            {/* Editorial Short Description */}
            <p className="text-xs sm:text-sm text-[#1C1C1A]/80 leading-relaxed font-light border-y border-[#E7E3DC] py-4">
              {product.description}
            </p>

            {/* Color Selection */}
            {product.colors && product.colors.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="uppercase tracking-wider text-[#A59A8A]">Color Palette:</span>
                  <span className="font-medium text-[#1C1C1A]">{selectedColor}</span>
                </div>
                <div className="flex items-center gap-3">
                  {product.colors.map((c) => (
                    <button
                      key={c.name}
                      type="button"
                      onClick={() => setSelectedColor(c.name)}
                      className={`group relative p-1 rounded-full border transition-all ${
                        selectedColor === c.name ? 'border-[#1C1C1A] scale-110' : 'border-transparent hover:border-[#A59A8A]'
                      }`}
                      title={c.name}
                    >
                      <span
                        className="block w-6 h-6 rounded-full border border-black/10"
                        style={{ backgroundColor: c.hex }}
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size Selection */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="uppercase tracking-wider text-[#A59A8A]">Available Sizes:</span>
                  <button type="button" className="text-[11px] uppercase tracking-wider text-[#9A7955] flex items-center gap-1">
                    <Ruler size={13} />
                    <span>Size Guide</span>
                  </button>
                </div>
                <div className="grid grid-cols-5 gap-2">
                  {product.sizes.map((sz) => (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => setSelectedSize(sz)}
                      className={`py-2 text-xs uppercase tracking-wider font-medium border transition-colors ${
                        selectedSize === sz
                          ? 'bg-[#1C1C1A] text-white border-[#1C1C1A]'
                          : 'bg-white text-[#1C1C1A] border-[#E7E3DC] hover:border-[#9A7955]'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Stock Availability Indicator */}
            <div className="pt-2 text-xs">
              {isOutOfStock ? (
                <span className="text-red-600 font-medium">Currently Sold Out in this variant</span>
              ) : availableStock <= 5 ? (
                <span className="text-[#9A7955] font-medium">
                  Rare availability: Only {availableStock} handcrafted piece(s) remaining in stock
                </span>
              ) : (
                <span className="text-emerald-700 font-medium flex items-center gap-1.5">
                  <ShieldCheck size={14} />
                  <span>In Stock at Karachi Flagship Atelier</span>
                </span>
              )}
            </div>

            {/* Quantity Selector */}
            <div className="pt-2 flex items-center gap-4">
              <span className="text-xs uppercase tracking-wider text-[#A59A8A]">Quantity:</span>
              <div className="flex items-center border border-[#E7E3DC] bg-white">
                <button
                  type="button"
                  disabled={quantity <= 1}
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="p-2 text-[#1C1C1A] hover:text-[#9A7955] disabled:opacity-40"
                  aria-label="Decrease quantity"
                >
                  <Minus size={14} />
                </button>
                <span className="w-10 text-center text-xs font-semibold text-[#1C1C1A]">{quantity}</span>
                <button
                  type="button"
                  disabled={quantity >= availableStock}
                  onClick={() => setQuantity((q) => Math.min(availableStock, q + 1))}
                  className="p-2 text-[#1C1C1A] hover:text-[#9A7955] disabled:opacity-40"
                  aria-label="Increase quantity"
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>

            {/* CTAs */}
            <div className="pt-4 space-y-3">
              <div className="flex gap-3">
                <button
                  type="button"
                  disabled={isOutOfStock}
                  onClick={handleAddToCart}
                  className="flex-1 py-4 bg-[#1C1C1A] text-[#F8F5EF] text-xs uppercase tracking-[0.25em] font-medium hover:bg-[#9A7955] transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ShoppingBag size={16} />
                  <span>{isOutOfStock ? 'Sold Out' : 'Add To Shopping Bag'}</span>
                </button>
                <button
                  type="button"
                  onClick={handleWishlistToggle}
                  className="p-4 border border-[#E7E3DC] bg-white text-[#1C1C1A] hover:border-[#9A7955] transition-colors"
                  aria-label="Wishlist"
                >
                  <Heart
                    size={20}
                    fill={isWishlisted ? '#9A7955' : 'none'}
                    color={isWishlisted ? '#9A7955' : 'currentColor'}
                  />
                </button>
              </div>

              {!isOutOfStock && (
                <button
                  type="button"
                  onClick={handleBuyNow}
                  className="w-full py-3.5 border border-[#1C1C1A] text-[#1C1C1A] text-xs uppercase tracking-[0.2em] font-medium hover:bg-[#1C1C1A] hover:text-white transition-colors"
                >
                  Express Checkout with COD
                </button>
              )}
            </div>

            {/* Delivery & Security Badges */}
            <div className="pt-4 border-t border-[#E7E3DC] space-y-2.5 text-[11px] text-[#A59A8A]">
              <div className="flex items-center gap-2 text-[#1C1C1A]">
                <Truck size={15} className="text-[#9A7955]" />
                <span>Complimentary express delivery in 2-4 business days nationwide</span>
              </div>
              <div className="flex items-center gap-2 text-[#1C1C1A]">
                <ShieldCheck size={15} className="text-[#9A7955]" />
                <span>Cash on Delivery (COD) available across all major cities of Pakistan</span>
              </div>
              <div className="flex items-center gap-2 text-[#1C1C1A]">
                <RefreshCw size={15} className="text-[#9A7955]" />
                <span>7-Day size exchange concierge at our flagship Karachi atelier</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Accordion / Tabs: Editorial Story, Details, Fabric Care, Shipping */}
      <div className="border-t border-[#E7E3DC] pt-12">
        <div className="flex border-b border-[#E7E3DC] gap-8">
          <button
            type="button"
            onClick={() => setActiveTab('details')}
            className={`pb-4 text-xs uppercase tracking-[0.2em] font-medium border-b-2 transition-colors ${
              activeTab === 'details' ? 'border-[#1C1C1A] text-[#1C1C1A]' : 'border-transparent text-[#A59A8A] hover:text-[#1C1C1A]'
            }`}
          >
            Atelier Specifications
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('story')}
            className={`pb-4 text-xs uppercase tracking-[0.2em] font-medium border-b-2 transition-colors ${
              activeTab === 'story' ? 'border-[#1C1C1A] text-[#1C1C1A]' : 'border-transparent text-[#A59A8A] hover:text-[#1C1C1A]'
            }`}
          >
            Editorial Chronicle
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('care')}
            className={`pb-4 text-xs uppercase tracking-[0.2em] font-medium border-b-2 transition-colors ${
              activeTab === 'care' ? 'border-[#1C1C1A] text-[#1C1C1A]' : 'border-transparent text-[#A59A8A] hover:text-[#1C1C1A]'
            }`}
          >
            Fabric & Preservation
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('shipping')}
            className={`pb-4 text-xs uppercase tracking-[0.2em] font-medium border-b-2 transition-colors ${
              activeTab === 'shipping' ? 'border-[#1C1C1A] text-[#1C1C1A]' : 'border-transparent text-[#A59A8A] hover:text-[#1C1C1A]'
            }`}
          >
            Pakistan Delivery & COD
          </button>
        </div>

        <div className="py-8 max-w-3xl">
          {activeTab === 'details' && (
            <ul className="space-y-3 text-xs sm:text-sm text-[#1C1C1A]/80 font-light">
              {product.details?.map((detail, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-[#9A7955]">•</span>
                  <span>{detail}</span>
                </li>
              ))}
              <li className="flex items-start gap-2">
                <span className="text-[#9A7955]">•</span>
                <span>Crafted in Karachi, Pakistan by authorized master karigars.</span>
              </li>
            </ul>
          )}

          {activeTab === 'story' && (
            <p className="text-xs sm:text-sm text-[#1C1C1A]/80 leading-relaxed font-light">
              {product.editorialStory || 'Every silhouette is developed at our Karachi atelier through rigorous proportional studies, celebrating the graceful drape of traditional subcontinental silhouettes with contemporary minimalism.'}
            </p>
          )}

          {activeTab === 'care' && (
            <ul className="space-y-3 text-xs sm:text-sm text-[#1C1C1A]/80 font-light">
              {product.fabricCare?.map((care, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-[#9A7955]">•</span>
                  <span>{care}</span>
                </li>
              ))}
              <li className="flex items-start gap-2">
                <span className="text-[#9A7955]">•</span>
                <span>Store inside the complimentary breathable cotton garment bag provided with your order.</span>
              </li>
            </ul>
          )}

          {activeTab === 'shipping' && (
            <div className="space-y-3 text-xs sm:text-sm text-[#1C1C1A]/80 font-light leading-relaxed">
              <p>
                <strong>Express Delivery:</strong> Karachi orders delivered within 24-48 hours. Lahore, Islamabad, Rawalpindi, Faisalabad, and other major cities within 2-4 business days.
              </p>
              <p>
                <strong>Cash on Delivery:</strong> Pay in Pakistani Rupees directly to the courier representative upon delivery. Please ensure exact change where possible.
              </p>
              <p>
                <strong>Complimentary Threshold:</strong> Orders totaling Rs. 10,000 or greater qualify for complimentary standard shipping.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <div className="border-t border-[#E7E3DC] pt-16">
          <div className="flex items-end justify-between mb-8">
            <div>
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#9A7955] font-semibold">
                Curated Coordinates
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl text-[#1C1C1A] mt-1">
                You May Also Admire
              </h2>
            </div>
            <Link to="/shop" className="text-xs uppercase tracking-widest text-[#1C1C1A] hover:text-[#9A7955] flex items-center gap-1.5 font-medium">
              <span>View All</span>
              <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {relatedProducts.map((p, idx) => (
              <ProductCard key={p._id} product={p} index={idx} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Heart } from 'lucide-react';
import { motion } from 'motion/react';
import { toggleProductWishlist } from '../../store/authSlice';
import { setToast } from '../../store/uiSlice';
import { formatPKR, calculateDiscount } from '../../utils/currency';

export default function ProductCard({ product, index = 0 }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  const isWishlisted = user?.wishlist?.some(
    (item) => (typeof item === 'string' ? item : item._id) === product._id
  );

  const discount = calculateDiscount(product.compareAtPrice, product.price);

  const handleWishlistToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      dispatch(setToast({ message: 'Please sign in to save pieces to your wishlist.', type: 'info' }));
      navigate('/login');
      return;
    }
    dispatch(toggleProductWishlist(product._id));
    dispatch(
      setToast({
        message: isWishlisted ? 'Removed from wishlist' : 'Added to your curated wishlist',
        type: 'success',
      })
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="group relative flex flex-col h-full"
    >
      {/* Image Container */}
      <div className="relative aspect-3/4 overflow-hidden bg-[#E7E3DC] mb-3">
        <Link to={`/product/${product.slug}`} className="block w-full h-full">
          <img
            src={product.images[0]}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
          />
          {product.images[1] && (
            <img
              src={product.images[1]}
              alt={`${product.name} alternate view`}
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover object-center opacity-0 transition-opacity duration-700 ease-out group-hover:opacity-100"
            />
          )}
        </Link>

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1 pointer-events-none">
          {product.isNewArrival && (
            <span className="bg-[#1C1C1A] text-[#F8F5EF] text-[9px] uppercase tracking-[0.2em] px-2 py-0.5 font-medium">
              New
            </span>
          )}
          {discount > 0 && (
            <span className="bg-[#9A7955] text-white text-[9px] uppercase tracking-[0.15em] px-2 py-0.5 font-medium">
              Save {discount}%
            </span>
          )}
          {product.isBestSeller && !product.isNewArrival && (
            <span className="bg-[#A59A8A] text-white text-[9px] uppercase tracking-[0.15em] px-2 py-0.5 font-medium">
              Best Seller
            </span>
          )}
        </div>

        {/* Wishlist Heart Button */}
        <button
          type="button"
          onClick={handleWishlistToggle}
          className="absolute top-2 right-2 p-2 bg-white/80 backdrop-blur-xs rounded-full text-[#1C1C1A] hover:text-[#9A7955] transition-transform hover:scale-110 shadow-xs"
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart
            size={16}
            fill={isWishlisted ? '#9A7955' : 'none'}
            color={isWishlisted ? '#9A7955' : 'currentColor'}
          />
        </button>

        {/* Size pills reveal on hover */}
        {product.sizes && product.sizes.length > 0 && (
          <div className="absolute bottom-0 inset-x-0 bg-white/90 backdrop-blur-xs py-1.5 px-2 flex items-center justify-center gap-1.5 translate-y-full group-hover:translate-y-0 transition-transform duration-300 pointer-events-none">
            <span className="text-[10px] uppercase tracking-wider text-[#A59A8A] mr-1">Sizes:</span>
            {product.sizes.slice(0, 5).map((size) => (
              <span key={size} className="text-[10px] font-semibold text-[#1C1C1A]">
                {size}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Product Information */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-[0.2em] text-[#A59A8A] mb-1">
            {product.category?.name || product.subCategory}
          </p>
          <h3 className="font-serif text-base text-[#1C1C1A] group-hover:text-[#9A7955] transition-colors leading-snug line-clamp-2">
            <Link to={`/product/${product.slug}`}>
              {product.name}
            </Link>
          </h3>
        </div>

        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-sm font-semibold text-[#1C1C1A]">
            {formatPKR(product.price)}
          </span>
          {product.compareAtPrice && product.compareAtPrice > product.price && (
            <span className="text-xs text-[#A59A8A] line-through">
              {formatPKR(product.compareAtPrice)}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}

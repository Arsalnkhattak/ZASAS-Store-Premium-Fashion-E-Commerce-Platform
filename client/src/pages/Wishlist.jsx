import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Heart, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { toggleProductWishlist } from '../store/authSlice';
import { addItemToCart } from '../store/cartSlice';
import { setToast } from '../store/uiSlice';
import { formatPKR } from '../utils/currency';

export default function Wishlist() {
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const wishlist = user?.wishlist || [];

  if (!isAuthenticated) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center">
        <Heart size={36} className="mx-auto text-[#A59A8A] mb-4" strokeWidth={1.5} />
        <h1 className="font-serif text-3xl text-[#1C1C1A]">Curated Wishlist</h1>
        <p className="text-xs text-[#A59A8A] mt-2 mb-6">
          Sign in to view and save your coveted Pakistani luxury ensembles across all your devices.
        </p>
        <Link
          to="/login"
          className="inline-block px-8 py-3 bg-[#1C1C1A] text-white text-xs uppercase tracking-widest hover:bg-[#9A7955] transition-colors"
        >
          Sign In
        </Link>
      </div>
    );
  }

  const handleMoveToCart = (product) => {
    dispatch(
      addItemToCart({
        productId: product._id,
        variantSku: product.sku,
        size: product.sizes?.[0] || 'Standard',
        color: product.colors?.[0]?.name || 'Natural',
        quantity: 1,
      })
    );
    dispatch(setToast({ message: `Moved ${product.name} to your shopping bag.`, type: 'success' }));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      <div className="mb-10 text-center max-w-xl mx-auto">
        <span className="text-[10px] uppercase tracking-[0.25em] text-[#9A7955] font-semibold block mb-1">
          Private Sanctuary
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl text-[#1C1C1A]">Your Curated Wishlist</h1>
        <p className="text-xs text-[#A59A8A] mt-2">
          {wishlist.length} saved design{wishlist.length === 1 ? '' : 's'} awaiting your order.
        </p>
      </div>

      {wishlist.length === 0 ? (
        <div className="text-center py-20 bg-white border border-[#E7E3DC] p-8 max-w-lg mx-auto">
          <Heart size={32} className="mx-auto text-[#A59A8A] mb-3" strokeWidth={1.5} />
          <p className="font-serif text-xl text-[#1C1C1A]">Your Wishlist is Empty</p>
          <p className="text-xs text-[#A59A8A] mt-2">
            Explore our collections and tap the heart icon on any piece to save it to your private atelier edit.
          </p>
          <Link
            to="/shop"
            className="mt-6 inline-block px-6 py-2.5 bg-[#1C1C1A] text-white text-xs uppercase tracking-widest hover:bg-[#9A7955] transition-colors"
          >
            Explore Catalog
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {wishlist.map((item) => {
            const product = typeof item === 'string' ? null : item;
            if (!product) return null;

            return (
              <div
                key={product._id}
                className="bg-white border border-[#E7E3DC] flex flex-col justify-between group"
              >
                <div className="relative aspect-3/4 overflow-hidden bg-[#E7E3DC]">
                  <Link to={`/product/${product.slug}`}>
                    <img
                      src={product.images?.[0] || ''}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </Link>
                  <button
                    type="button"
                    onClick={() => dispatch(toggleProductWishlist(product._id))}
                    className="absolute top-3 right-3 p-2 bg-white/90 rounded-full text-red-600 hover:scale-110 transition-transform shadow-xs"
                    title="Remove from wishlist"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-serif text-base text-[#1C1C1A] hover:text-[#9A7955] line-clamp-1">
                      <Link to={`/product/${product.slug}`}>{product.name}</Link>
                    </h3>
                    <p className="text-xs font-semibold text-[#1C1C1A] mt-1.5">
                      {formatPKR(product.price)}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleMoveToCart(product)}
                    className="mt-4 w-full py-2.5 bg-[#1C1C1A] text-white text-xs uppercase tracking-widest hover:bg-[#9A7955] transition-colors flex items-center justify-center gap-2"
                  >
                    <ShoppingBag size={14} />
                    <span>Move to Bag</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

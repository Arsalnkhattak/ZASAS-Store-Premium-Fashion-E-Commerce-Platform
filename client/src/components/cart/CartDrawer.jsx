import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { closeCartDrawer, updateCartQuantity, removeCartItem } from '../../store/cartSlice';
import { formatPKR } from '../../utils/currency';
import { BRAND_INFO } from '../../utils/constants';

export default function CartDrawer() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, subtotal, itemCount, isDrawerOpen, loading } = useSelector((state) => state.cart);

  const freeShippingDistance = Math.max(0, BRAND_INFO.freeShippingThreshold - subtotal);
  const freeShippingPercent = Math.min(100, Math.round((subtotal / BRAND_INFO.freeShippingThreshold) * 100));

  const handleCheckout = () => {
    dispatch(closeCartDrawer());
    navigate('/checkout');
  };

  const handleViewCart = () => {
    dispatch(closeCartDrawer());
    navigate('/cart');
  };

  return (
    <AnimatePresence>
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => dispatch(closeCartDrawer())}
            className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 240 }}
              className="w-screen max-w-md bg-[#F8F5EF] shadow-2xl flex flex-col justify-between border-l border-[#E7E3DC]"
            >
              {/* Header */}
              <div className="p-6 border-b border-[#E7E3DC] flex items-center justify-between bg-white">
                <div className="flex items-center gap-2">
                  <ShoppingBag size={20} className="text-[#9A7955]" />
                  <h3 className="font-serif text-xl tracking-wider text-[#1C1C1A]">
                    Shopping Bag ({itemCount})
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => dispatch(closeCartDrawer())}
                  className="p-1 text-[#1C1C1A] hover:text-[#9A7955] transition-colors"
                  aria-label="Close cart drawer"
                >
                  <X size={22} strokeWidth={1.5} />
                </button>
              </div>

              {/* Free Shipping Progress */}
              <div className="bg-[#E7E3DC]/40 px-6 py-3 border-b border-[#E7E3DC]">
                {freeShippingDistance === 0 ? (
                  <p className="text-xs font-medium text-[#1C1C1A] flex items-center gap-1.5">
                    <ShieldCheck size={16} className="text-[#9A7955]" />
                    <span>Complimentary express nationwide shipping unlocked!</span>
                  </p>
                ) : (
                  <p className="text-xs text-[#1C1C1A]">
                    Add <span className="font-semibold text-[#9A7955]">{formatPKR(freeShippingDistance)}</span> more for complimentary shipping.
                  </p>
                )}
                <div className="w-full bg-[#E7E3DC] h-1.5 mt-2 rounded-full overflow-hidden">
                  <div
                    className="bg-[#9A7955] h-full transition-all duration-500 rounded-full"
                    style={{ width: `${freeShippingPercent}%` }}
                  />
                </div>
              </div>

              {/* Items List */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {items.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center py-12">
                    <div className="w-16 h-16 rounded-full bg-[#E7E3DC] flex items-center justify-center text-[#A59A8A] mb-4">
                      <ShoppingBag size={28} strokeWidth={1.5} />
                    </div>
                    <h4 className="font-serif text-xl text-[#1C1C1A]">Your shopping bag is empty</h4>
                    <p className="text-xs text-[#A59A8A] mt-2 max-w-xs">
                      Explore our Pret, Haute Couture, and Luxury Lawn collections to curate your bespoke wardrobe.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        dispatch(closeCartDrawer());
                        navigate('/shop');
                      }}
                      className="mt-6 px-6 py-2.5 bg-[#1C1C1A] text-[#F8F5EF] text-xs uppercase tracking-widest hover:bg-[#9A7955] transition-colors"
                    >
                      Explore Collections
                    </button>
                  </div>
                ) : (
                  items.map((item) => (
                    <div
                      key={item._id}
                      className="flex gap-4 pb-6 border-b border-[#E7E3DC] last:border-0"
                    >
                      <Link
                        to={`/product/${item.slug}`}
                        onClick={() => dispatch(closeCartDrawer())}
                        className="shrink-0"
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-20 h-28 object-cover bg-[#E7E3DC] border border-[#E7E3DC]"
                        />
                      </Link>
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start gap-2">
                            <Link
                              to={`/product/${item.slug}`}
                              onClick={() => dispatch(closeCartDrawer())}
                              className="font-serif text-sm font-medium text-[#1C1C1A] hover:text-[#9A7955] line-clamp-1"
                            >
                              {item.name}
                            </Link>
                            <button
                              type="button"
                              onClick={() => dispatch(removeCartItem(item._id))}
                              className="text-[#A59A8A] hover:text-[#1C1C1A] p-1"
                              aria-label="Remove item"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                          <p className="text-[11px] text-[#A59A8A] mt-0.5">
                            Size: <span className="text-[#1C1C1A] font-medium">{item.size}</span> | Color: <span className="text-[#1C1C1A] font-medium">{item.color}</span>
                          </p>
                          <p className="text-xs font-semibold text-[#1C1C1A] mt-1.5">
                            {formatPKR(item.price)}
                          </p>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center border border-[#E7E3DC] bg-white">
                            <button
                              type="button"
                              onClick={() => {
                                if (item.quantity > 1) {
                                  dispatch(updateCartQuantity({ itemId: item._id, quantity: item.quantity - 1 }));
                                } else {
                                  dispatch(removeCartItem(item._id));
                                }
                              }}
                              className="p-1.5 text-[#1C1C1A] hover:text-[#9A7955]"
                              aria-label="Decrease quantity"
                            >
                              <Minus size={13} />
                            </button>
                            <span className="w-8 text-center text-xs font-medium text-[#1C1C1A]">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                dispatch(updateCartQuantity({ itemId: item._id, quantity: item.quantity + 1 }));
                              }}
                              className="p-1.5 text-[#1C1C1A] hover:text-[#9A7955]"
                              aria-label="Increase quantity"
                            >
                              <Plus size={13} />
                            </button>
                          </div>

                          <span className="text-xs font-medium text-[#1C1C1A]">
                            {formatPKR(item.itemTotal)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Footer / Checkout */}
              {items.length > 0 && (
                <div className="p-6 border-t border-[#E7E3DC] bg-white space-y-4">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-[#A59A8A] uppercase tracking-wider text-xs">Subtotal</span>
                    <span className="font-serif text-lg font-medium text-[#1C1C1A]">
                      {formatPKR(subtotal)}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#A59A8A]">
                    Taxes calculated at checkout. Cash on Delivery and local debit/credit accepted.
                  </p>
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <button
                      type="button"
                      onClick={handleViewCart}
                      className="w-full py-3 border border-[#1C1C1A] text-[#1C1C1A] text-xs uppercase tracking-widest hover:bg-[#1C1C1A] hover:text-white transition-colors text-center"
                    >
                      View Bag
                    </button>
                    <button
                      type="button"
                      onClick={handleCheckout}
                      className="w-full py-3 bg-[#1C1C1A] text-[#F8F5EF] text-xs uppercase tracking-widest hover:bg-[#9A7955] transition-colors flex items-center justify-center gap-2"
                    >
                      <span>Checkout</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}

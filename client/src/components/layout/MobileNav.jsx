import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { X, ChevronRight, Shield, User, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { closeMobileNav } from '../../store/uiSlice';

export default function MobileNav() {
  const dispatch = useDispatch();
  const isOpen = useSelector((state) => state.ui.isMobileNavOpen);
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  const close = () => dispatch(closeMobileNav());

  const navItems = [
    { name: "Women's Collection", path: '/category/women' },
    { name: "Men's Eastern Wear", path: '/category/men' },
    { name: "Kids' Festive Wear", path: '/category/kids' },
    { name: 'Horology & Watches', path: '/category/watches' },
    { name: 'Artisanal Shoes & Footwear', path: '/category/footwear' },
    { name: 'Haute Parfumerie & Oud', path: '/category/fragrances' },
    { name: 'Shop All Catalog', path: '/shop' },
    { name: 'Our Heritage & Atelier', path: '/about' },
    { name: 'VIP Concierge & Appointments', path: '/contact' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden lg:hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={close}
            className="absolute inset-0 bg-black/40 backdrop-blur-xs"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 240 }}
            className="absolute inset-y-0 left-0 max-w-xs w-full bg-[#F8F5EF] shadow-2xl flex flex-col justify-between"
          >
            <div>
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-[#E7E3DC]">
                <span className="font-serif text-2xl tracking-[0.2em] font-light text-[#1C1C1A]">
                  ZASAS
                </span>
                <button
                  type="button"
                  onClick={close}
                  className="p-1 text-[#1C1C1A] hover:text-[#9A7955]"
                  aria-label="Close menu"
                >
                  <X size={24} strokeWidth={1.5} />
                </button>
              </div>

              {/* Navigation Links */}
              <nav className="p-6 space-y-4">
                {navItems.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={close}
                    className={({ isActive }) =>
                      `flex items-center justify-between text-[13px] uppercase tracking-[0.18em] py-2 border-b border-[#E7E3DC]/60 ${
                        isActive ? 'text-[#9A7955] font-semibold' : 'text-[#1C1C1A]'
                      }`
                    }
                  >
                    <span>{item.name}</span>
                    <ChevronRight size={14} className="text-[#A59A8A]" />
                  </NavLink>
                ))}
              </nav>
            </div>

            {/* Footer Quick Links */}
            <div className="p-6 border-t border-[#E7E3DC] bg-[#E7E3DC]/30 space-y-3">
              {user?.role === 'admin' && (
                <Link
                  to="/admin"
                  onClick={close}
                  className="flex items-center gap-2 text-[12px] uppercase tracking-wider text-[#9A7955] font-semibold"
                >
                  <Shield size={16} />
                  <span>Admin Atelier Dashboard</span>
                </Link>
              )}

              <Link
                to={isAuthenticated ? '/account' : '/login'}
                onClick={close}
                className="flex items-center gap-2 text-[12px] uppercase tracking-wider text-[#1C1C1A]"
              >
                <User size={16} />
                <span>{isAuthenticated ? 'My Atelier Account' : 'Sign In / Register'}</span>
              </Link>

              <Link
                to="/wishlist"
                onClick={close}
                className="flex items-center gap-2 text-[12px] uppercase tracking-wider text-[#1C1C1A]"
              >
                <Heart size={16} />
                <span>Wishlist</span>
              </Link>

              <div className="pt-2 text-[10px] uppercase tracking-widest text-[#A59A8A]">
                Pakistan • PKR (Rs.) • Nationwide COD
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

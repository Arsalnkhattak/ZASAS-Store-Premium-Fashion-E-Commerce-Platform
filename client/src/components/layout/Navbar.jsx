import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Search, User, Heart, ShoppingBag, Menu, Shield } from 'lucide-react';
import { openSearch, openMobileNav } from '../../store/uiSlice';
import { openCartDrawer } from '../../store/cartSlice';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { itemCount } = useSelector((state) => state.cart);
  const wishlistCount = user?.wishlist?.length || 0;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinkClass = ({ isActive }) =>
    `text-[12px] uppercase tracking-[0.2em] font-medium transition-colors hover:text-[#9A7955] ${
      isActive ? 'text-[#9A7955]' : 'text-[#1C1C1A]'
    }`;

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#F8F5EF]/95 backdrop-blur-md shadow-xs border-b border-[#E7E3DC]'
          : 'bg-[#F8F5EF] border-b border-[#E7E3DC]'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Mobile menu trigger */}
          <div className="flex items-center lg:hidden">
            <button
              type="button"
              onClick={() => dispatch(openMobileNav())}
              className="p-2 text-[#1C1C1A] hover:text-[#9A7955] transition-colors"
              aria-label="Open Navigation Menu"
            >
              <Menu size={22} strokeWidth={1.5} />
            </button>
            <button
              type="button"
              onClick={() => dispatch(openSearch())}
              className="p-2 text-[#1C1C1A] hover:text-[#9A7955] transition-colors ml-1"
              aria-label="Search Catalog"
            >
              <Search size={20} strokeWidth={1.5} />
            </button>
          </div>

          {/* Brand Editorial Logo */}
          <div className="flex-1 lg:flex-none text-center lg:text-left">
            <Link to="/" className="inline-block group">
              <span className="font-serif text-2xl sm:text-3xl tracking-[0.25em] font-light uppercase text-[#1C1C1A] group-hover:text-[#9A7955] transition-colors">
                ZASAS
              </span>
              <span className="block text-[7px] tracking-[0.35em] text-[#A59A8A] uppercase -mt-0.5 font-sans">
                Haute Couture & Pret
              </span>
            </Link>
          </div>

          {/* Desktop Center Navigation */}
          <nav className="hidden lg:flex items-center gap-5 xl:gap-7" aria-label="Main Navigation">
            <NavLink to="/category/women" className={navLinkClass}>
              Women
            </NavLink>
            <NavLink to="/category/men" className={navLinkClass}>
              Men
            </NavLink>
            <NavLink to="/category/kids" className={navLinkClass}>
              Kids
            </NavLink>
            <NavLink to="/category/watches" className={navLinkClass}>
              Watches
            </NavLink>
            <NavLink to="/category/footwear" className={navLinkClass}>
              Shoes
            </NavLink>
            <NavLink to="/category/fragrances" className={navLinkClass}>
              Perfumes
            </NavLink>
            <NavLink to="/shop" className={navLinkClass}>
              Shop All
            </NavLink>
          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center gap-3 sm:gap-5">
            <button
              type="button"
              onClick={() => dispatch(openSearch())}
              className="hidden lg:flex items-center gap-2 p-2 text-[#1C1C1A] hover:text-[#9A7955] transition-colors text-[12px] tracking-[0.1em] uppercase"
              aria-label="Search Catalog"
            >
              <Search size={19} strokeWidth={1.5} />
              <span className="hidden xl:inline text-[#A59A8A]">Search</span>
            </button>

            {/* Admin Badge shortcut if logged in as admin */}
            {user?.role === 'admin' && (
              <Link
                to="/admin"
                className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 text-[11px] uppercase tracking-wider bg-[#1C1C1A] text-[#F8F5EF] rounded hover:bg-[#9A7955] transition-colors"
                title="Admin Control Center"
              >
                <Shield size={13} />
                <span>Atelier Admin</span>
              </Link>
            )}

            {/* Account Link */}
            <Link
              to={isAuthenticated ? '/account' : '/login'}
              className="p-2 text-[#1C1C1A] hover:text-[#9A7955] transition-colors"
              aria-label="Customer Account"
            >
              <User size={20} strokeWidth={1.5} />
            </Link>

            {/* Wishlist Link */}
            <Link
              to="/wishlist"
              className="relative p-2 text-[#1C1C1A] hover:text-[#9A7955] transition-colors"
              aria-label="Wishlist"
            >
              <Heart size={20} strokeWidth={1.5} />
              {wishlistCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-[#9A7955] text-white text-[10px] font-semibold flex items-center justify-center rounded-full">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Shopping Bag Trigger */}
            <button
              type="button"
              onClick={() => dispatch(openCartDrawer())}
              className="relative p-2 text-[#1C1C1A] hover:text-[#9A7955] transition-colors"
              aria-label="Shopping Bag"
            >
              <ShoppingBag size={20} strokeWidth={1.5} />
              {itemCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-[#1C1C1A] text-white text-[10px] font-semibold flex items-center justify-center rounded-full">
                  {itemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

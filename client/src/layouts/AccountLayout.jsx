import React from 'react';
import { NavLink, Outlet, Navigate, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { User, Package, MapPin, Heart, LogOut, LayoutDashboard } from 'lucide-react';
import { logoutUser } from '../store/authSlice';

export default function AccountLayout() {
  const { user, isAuthenticated, initialized } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  if (!initialized) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-xs uppercase tracking-widest text-[#A59A8A]">Accessing Atelier Sanctuary...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate('/');
  };

  const navItemClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 text-xs uppercase tracking-widest font-medium transition-colors ${
      isActive
        ? 'bg-[#1C1C1A] text-[#F8F5EF]'
        : 'text-[#1C1C1A] hover:bg-[#E7E3DC]/60'
    }`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      <div className="mb-8 border-b border-[#E7E3DC] pb-6">
        <span className="text-[10px] uppercase tracking-[0.25em] text-[#9A7955] block">
          Patron Registry
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl text-[#1C1C1A] mt-1">
          Welcome, {user?.name}
        </h1>
        <p className="text-xs text-[#A59A8A] mt-1">{user?.email}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sidebar */}
        <aside className="lg:col-span-3">
          <nav className="bg-white border border-[#E7E3DC] divide-y divide-[#E7E3DC]/60">
            <NavLink to="/account" end className={navItemClass}>
              <LayoutDashboard size={16} />
              <span>Patron Dashboard</span>
            </NavLink>
            <NavLink to="/account/orders" className={navItemClass}>
              <Package size={16} />
              <span>Order Archive</span>
            </NavLink>
            <NavLink to="/account/addresses" className={navItemClass}>
              <MapPin size={16} />
              <span>Saved Addresses</span>
            </NavLink>
            <NavLink to="/account/profile" className={navItemClass}>
              <User size={16} />
              <span>Profile & Security</span>
            </NavLink>
            <NavLink to="/wishlist" className={navItemClass}>
              <Heart size={16} />
              <span>Curated Wishlist</span>
            </NavLink>
            <button
              type="button"
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 text-xs uppercase tracking-widest font-medium text-red-600 hover:bg-red-50 transition-colors text-left"
            >
              <LogOut size={16} />
              <span>Sign Out</span>
            </button>
          </nav>
        </aside>

        {/* Content Outlet */}
        <main className="lg:col-span-9">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

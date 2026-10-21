import React from 'react';
import { NavLink, Outlet, Navigate, Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  LayoutDashboard,
  Layers,
  Tag,
  ShoppingBag,
  Users,
  Ticket,
  Settings,
  ArrowLeft,
  LogOut,
  Shield,
} from 'lucide-react';
import { logoutUser } from '../store/authSlice';

export default function AdminLayout() {
  const { user, isAuthenticated, initialized } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  if (!initialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#1C1C1A] text-[#F8F5EF]">
        <p className="text-xs uppercase tracking-widest text-[#9A7955]">Verifying Atelier Credentials...</p>
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== 'admin') {
    return <Navigate to="/login?redirect=/admin" replace />;
  }

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate('/');
  };

  const navClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 text-xs uppercase tracking-widest font-medium transition-colors ${
      isActive
        ? 'bg-[#9A7955] text-white'
        : 'text-[#A59A8A] hover:bg-[#2A2A28] hover:text-white'
    }`;

  return (
    <div className="min-h-screen flex bg-[#F0EDE6] text-[#1C1C1A]">
      {/* Sidebar */}
      <aside className="w-64 bg-[#1C1C1A] text-[#F8F5EF] flex flex-col justify-between shrink-0 shadow-xl border-r border-[#333330]">
        <div>
          {/* Logo & Header */}
          <div className="p-6 border-b border-[#333330]">
            <Link to="/" className="inline-block group">
              <span className="font-serif text-2xl tracking-[0.25em] font-light text-white group-hover:text-[#9A7955] transition-colors">
                ZASAS
              </span>
              <div className="flex items-center gap-1.5 mt-1 text-[9px] uppercase tracking-[0.2em] text-[#9A7955]">
                <Shield size={10} />
                <span>Atelier Administration</span>
              </div>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1">
            <NavLink to="/admin" end className={navClass}>
              <LayoutDashboard size={17} />
              <span>Dashboard</span>
            </NavLink>
            <NavLink to="/admin/products" className={navClass}>
              <Layers size={17} />
              <span>Catalog & Stock</span>
            </NavLink>
            <NavLink to="/admin/categories" className={navClass}>
              <Tag size={17} />
              <span>Categories</span>
            </NavLink>
            <NavLink to="/admin/orders" className={navClass}>
              <ShoppingBag size={17} />
              <span>Orders & Fulfillment</span>
            </NavLink>
            <NavLink to="/admin/customers" className={navClass}>
              <Users size={17} />
              <span>Customer Registry</span>
            </NavLink>
            <NavLink to="/admin/coupons" className={navClass}>
              <Ticket size={17} />
              <span>Promotions & Codes</span>
            </NavLink>
            <NavLink to="/admin/settings" className={navClass}>
              <Settings size={17} />
              <span>Store Settings</span>
            </NavLink>
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-[#333330] space-y-2">
          <Link
            to="/"
            className="flex items-center gap-2 px-4 py-2 text-xs uppercase tracking-widest text-[#A59A8A] hover:text-white transition-colors"
          >
            <ArrowLeft size={14} />
            <span>View Storefront</span>
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-4 py-2 text-xs uppercase tracking-widest text-red-400 hover:text-red-300 transition-colors text-left"
          >
            <LogOut size={14} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <header className="h-16 bg-white border-b border-[#E7E3DC] px-8 flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-3">
            <span className="text-xs uppercase tracking-widest text-[#A59A8A]">Atelier Control Hub</span>
            <span className="text-[#A59A8A]">•</span>
            <span className="text-xs font-semibold text-[#1C1C1A]">Pakistan Operations (PKR)</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <span className="text-xs font-medium text-[#1C1C1A] block">{user?.name}</span>
              <span className="text-[10px] text-[#9A7955] uppercase tracking-wider block">Authorized Director</span>
            </div>
            <div className="w-8 h-8 rounded-full bg-[#1C1C1A] text-[#F8F5EF] flex items-center justify-center font-serif text-sm">
              {user?.name?.charAt(0) || 'A'}
            </div>
          </div>
        </header>

        <main className="p-8 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

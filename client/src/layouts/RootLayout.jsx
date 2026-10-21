import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import AnnouncementBar from '../components/layout/AnnouncementBar';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import CartDrawer from '../components/cart/CartDrawer';
import SearchModal from '../components/layout/SearchModal';
import MobileNav from '../components/layout/MobileNav';
import Toast from '../components/ui/Toast';
import { fetchCurrentUser } from '../store/authSlice';
import { fetchCart } from '../store/cartSlice';

export default function RootLayout() {
  const dispatch = useDispatch();

  useEffect(() => {
    // Restore session and cart asynchronously on boot
    dispatch(fetchCurrentUser());
    dispatch(fetchCart());
  }, [dispatch]);

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F5EF] text-[#1C1C1A]">
      <AnnouncementBar />
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <CartDrawer />
      <SearchModal />
      <MobileNav />
      <Toast />
    </div>
  );
}

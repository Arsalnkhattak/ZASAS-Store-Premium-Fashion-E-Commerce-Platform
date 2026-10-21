import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from '../store/store';
import { formatPKR, calculateDiscount } from '../utils/currency';
import NotFound from '../pages/NotFound';
import AnnouncementBar from '../components/layout/AnnouncementBar';
import { setToast, clearToast, openSearch, closeSearch } from '../store/uiSlice';
import { openCartDrawer, closeCartDrawer } from '../store/cartSlice';

describe('ZASAS Utility Functions', () => {
  it('formats currency correctly in Pakistani Rupees (PKR)', () => {
    expect(formatPKR(25000)).toBe('Rs. 25,000');
    expect(formatPKR(0)).toBe('Rs. 0');
    expect(formatPKR(null)).toBe('Rs. 0');
  });

  it('calculates discount percentage accurately', () => {
    expect(calculateDiscount(20000, 15000)).toBe(25);
    expect(calculateDiscount(10000, 10000)).toBe(0);
    expect(calculateDiscount(0, 100)).toBe(0);
  });
});

describe('ZASAS Redux Store Slices', () => {
  it('manages cart drawer toggle state correctly', () => {
    store.dispatch(openCartDrawer());
    expect(store.getState().cart.isDrawerOpen).toBe(true);

    store.dispatch(closeCartDrawer());
    expect(store.getState().cart.isDrawerOpen).toBe(false);
  });

  it('handles search modal state correctly', () => {
    store.dispatch(openSearch());
    expect(store.getState().ui.isSearchOpen).toBe(true);

    store.dispatch(closeSearch());
    expect(store.getState().ui.isSearchOpen).toBe(false);
  });

  it('handles UI notification toasts correctly', () => {
    store.dispatch(setToast({ message: 'Added to Bridal Registry', type: 'success' }));
    expect(store.getState().ui.toast).toEqual({
      message: 'Added to Bridal Registry',
      type: 'success',
    });

    store.dispatch(clearToast());
    expect(store.getState().ui.toast).toBeNull();
  });
});

describe('ZASAS Core Visual Components', () => {
  it('renders NotFound (404) page with luxury editorial typography', () => {
    render(
      <BrowserRouter>
        <NotFound />
      </BrowserRouter>
    );

    expect(screen.getByText(/Silhouette Not Found/i)).toBeInTheDocument();
    expect(screen.getByText(/Return to Storefront/i)).toBeInTheDocument();
  });

  it('renders AnnouncementBar with Pakistani delivery information', () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <AnnouncementBar />
        </BrowserRouter>
      </Provider>
    );

    expect(screen.getByText(/Complimentary Express Shipping Across Pakistan/i)).toBeInTheDocument();
  });
});

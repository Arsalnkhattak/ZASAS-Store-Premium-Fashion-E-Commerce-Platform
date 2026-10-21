import { createSlice } from '@reduxjs/toolkit';

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    isSearchOpen: false,
    isMobileNavOpen: false,
    toast: null, // { message: string, type: 'success' | 'error' | 'info' }
  },
  reducers: {
    openSearch: (state) => {
      state.isSearchOpen = true;
    },
    closeSearch: (state) => {
      state.isSearchOpen = false;
    },
    toggleSearch: (state) => {
      state.isSearchOpen = !state.isSearchOpen;
    },
    openMobileNav: (state) => {
      state.isMobileNavOpen = true;
    },
    closeMobileNav: (state) => {
      state.isMobileNavOpen = false;
    },
    setToast: (state, action) => {
      state.toast = action.payload;
    },
    clearToast: (state) => {
      state.toast = null;
    },
  },
});

export const {
  openSearch,
  closeSearch,
  toggleSearch,
  openMobileNav,
  closeMobileNav,
  setToast,
  clearToast,
} = uiSlice.actions;

export default uiSlice.reducer;

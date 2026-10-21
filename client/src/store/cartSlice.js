import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api';

export const fetchCart = createAsyncThunk('cart/fetchCart', async (_, { rejectWithValue }) => {
  try {
    const res = await api.get('/cart');
    return res.data.cart;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

export const addItemToCart = createAsyncThunk('cart/addItem', async (itemData, { rejectWithValue }) => {
  try {
    const res = await api.post('/cart/add', itemData);
    return res.data.cart;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

export const updateCartQuantity = createAsyncThunk('cart/updateQuantity', async ({ itemId, quantity }, { rejectWithValue }) => {
  try {
    const res = await api.put(`/cart/item/${itemId}`, { quantity });
    return res.data.cart;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

export const removeCartItem = createAsyncThunk('cart/removeItem', async (itemId, { rejectWithValue }) => {
  try {
    const res = await api.delete(`/cart/item/${itemId}`);
    return res.data.cart;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

export const mergeGuestCartThunk = createAsyncThunk('cart/mergeGuest', async (guestId, { rejectWithValue }) => {
  try {
    const res = await api.post('/cart/merge', { guestId });
    return res.data.cart;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
    subtotal: 0,
    itemCount: 0,
    isDrawerOpen: false,
    loading: false,
    error: null,
  },
  reducers: {
    openCartDrawer: (state) => {
      state.isDrawerOpen = true;
    },
    closeCartDrawer: (state) => {
      state.isDrawerOpen = false;
    },
    toggleCartDrawer: (state) => {
      state.isDrawerOpen = !state.isDrawerOpen;
    },
    clearCartState: (state) => {
      state.items = [];
      state.subtotal = 0;
      state.itemCount = 0;
    },
  },
  extraReducers: (builder) => {
    // Fetch
    builder.addCase(fetchCart.fulfilled, (state, action) => {
      state.items = action.payload?.items || [];
      state.subtotal = action.payload?.subtotal || 0;
      state.itemCount = action.payload?.itemCount || 0;
      state.loading = false;
    });

    // Add item
    builder.addCase(addItemToCart.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(addItemToCart.fulfilled, (state, action) => {
      state.items = action.payload?.items || [];
      state.subtotal = action.payload?.subtotal || 0;
      state.itemCount = action.payload?.itemCount || 0;
      state.isDrawerOpen = true; // Auto reveal drawer on add
      state.loading = false;
    });
    builder.addCase(addItemToCart.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Update
    builder.addCase(updateCartQuantity.fulfilled, (state, action) => {
      state.items = action.payload?.items || [];
      state.subtotal = action.payload?.subtotal || 0;
      state.itemCount = action.payload?.itemCount || 0;
    });

    // Remove
    builder.addCase(removeCartItem.fulfilled, (state, action) => {
      state.items = action.payload?.items || [];
      state.subtotal = action.payload?.subtotal || 0;
      state.itemCount = action.payload?.itemCount || 0;
    });

    // Merge
    builder.addCase(mergeGuestCartThunk.fulfilled, (state, action) => {
      state.items = action.payload?.items || [];
      state.subtotal = action.payload?.subtotal || 0;
      state.itemCount = action.payload?.itemCount || 0;
    });
  },
});

export const { openCartDrawer, closeCartDrawer, toggleCartDrawer, clearCartState } = cartSlice.actions;
export default cartSlice.reducer;

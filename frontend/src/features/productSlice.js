import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { api } from '../services/api';

export const fetchProducts = createAsyncThunk('products/fetchProducts', async (category) => {
  const { data } = await api.get('/products', {
    params: category ? { category } : {}
  });
  return data;
});

export const fetchProductBySlug = createAsyncThunk('products/fetchProductBySlug', async (slug) => {
  const { data } = await api.get(`/products/slug/${slug}`);
  return data;
});

const productSlice = createSlice({
  name: 'products',
  initialState: {
    items: [],
    selected: null,
    loading: false,
    error: null
  },
  reducers: {
    clearSelectedProduct(state) {
      state.selected = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchProductBySlug.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductBySlug.fulfilled, (state, action) => {
        state.loading = false;
        state.selected = action.payload;
      })
      .addCase(fetchProductBySlug.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  }
});

export const { clearSelectedProduct } = productSlice.actions;
export default productSlice.reducer;

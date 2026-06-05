import { createSlice } from '@reduxjs/toolkit';

const cartFromStorage = JSON.parse(localStorage.getItem('threadgridCart') || '[]');

const persistCart = (items) => {
  localStorage.setItem('threadgridCart', JSON.stringify(items));
};

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: cartFromStorage
  },
  reducers: {
    addToCart(state, action) {
      const item = action.payload;
      const existing = state.items.find(
        (entry) => entry.productId === item.productId && entry.size === item.size
      );

      if (existing) {
        existing.quantity = Math.min(existing.quantity + item.quantity, item.inventory);
      } else {
        state.items.push(item);
      }

      persistCart(state.items);
    },
    updateQuantity(state, action) {
      const { productId, size, quantity } = action.payload;
      const existing = state.items.find(
        (entry) => entry.productId === productId && entry.size === size
      );

      if (existing) {
        existing.quantity = Math.max(1, Math.min(quantity, existing.inventory));
      }

      persistCart(state.items);
    },
    removeFromCart(state, action) {
      const { productId, size } = action.payload;
      state.items = state.items.filter(
        (entry) => !(entry.productId === productId && entry.size === size)
      );
      persistCart(state.items);
    },
    clearCart(state) {
      state.items = [];
      persistCart([]);
    }
  }
});

export const { addToCart, clearCart, removeFromCart, updateQuantity } = cartSlice.actions;
export default cartSlice.reducer;

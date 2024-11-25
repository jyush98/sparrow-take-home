import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CartItem {
  id: string;
  name: string;
  size: string;
  type: string;
  defaultToppings: { [key: string]: string }; // Default toppings
  extraToppings: { [key: string]: string };   // Extra toppings
  removedToppings: string[];                  // Removed toppings
  quantity: number;
  pricePerUnit: number;
}

interface CartState {
  items: CartItem[];
}

const initialState: CartState = {
  items: [],
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItemToCart: (state, action: PayloadAction<CartItem>) => {
      const newItem = {
        ...action.payload,
        defaultToppings: action.payload.defaultToppings || {}, // Initialize as empty object if not provided
        extraToppings: action.payload.extraToppings || {},     // Initialize as empty object if not provided
        removedToppings: action.payload.removedToppings || [], // Initialize as empty array if not provided
      };
      state.items.push(newItem);
    },
    removeItemFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
    updateQuantity: (state, action: PayloadAction<{ id: string; quantity: number }>) => {
      const item = state.items.find((item) => item.id === action.payload.id);
      if (item) {
        item.quantity = action.payload.quantity;
      }
    },
    clearCart: (state) => {
      state.items = [];
    },
  },
});

export const { addItemToCart, removeItemFromCart, updateQuantity, clearCart } = cartSlice.actions;

export default cartSlice.reducer;

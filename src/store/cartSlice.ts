import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CartItem {
  id: string;
  name: string;
  size: string;
  defaultToppings: { [key: string]: string }; // Default toppings
  extraToppings: { [key: string]: string };   // Extra toppings
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
  },
});

export const { addItemToCart, removeItemFromCart, updateQuantity } = cartSlice.actions;

export default cartSlice.reducer;

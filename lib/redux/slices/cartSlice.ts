import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { StudentCourse } from "@/lib/app-types";

interface CartState {
  items: StudentCourse[];
}

const initialState: CartState = {
  items: [],
};

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<StudentCourse>) => {
      const exists = state.items.some((c) => c.code === action.payload.code);
      if (exists) {
        state.items = state.items.filter((c) => c.code !== action.payload.code);
      } else {
        state.items.push(action.payload);
      }
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((c) => c.code !== action.payload);
    },
    clearCart: (state) => {
      state.items = [];
    },
  },
});

export const { addToCart, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;

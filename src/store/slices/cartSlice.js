import { createSlice } from '@reduxjs/toolkit';

// ─── Helper: Load cart from localStorage ──────────────────────────────────────
function loadCartFromStorage() {
    try {
        const saved = localStorage.getItem('cart');
        return saved ? JSON.parse(saved) : [];
    } catch {
        return [];
    }
}

// ─── Initial State ─────────────────────────────────────────────────────────────
const initialState = {
    items: loadCartFromStorage(),
};

// ─── Slice ─────────────────────────────────────────────────────────────────────
const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart: (state, action) => {
            const product = action.payload;
            const existing = state.items.find((item) => item.id === product.id);

            if (existing) {
                existing.quantity += 1;
            } else {
                state.items.push({ ...product, quantity: 1 });
            }

            localStorage.setItem('cart', JSON.stringify(state.items));
        },

        removeFromCart: (state, action) => {
            state.items = state.items.filter((item) => item.id !== action.payload);
            localStorage.setItem('cart', JSON.stringify(state.items));
        },

        increaseQuantity: (state, action) => {
            const item = state.items.find((i) => i.id === action.payload);
            if (item) item.quantity += 1;
            localStorage.setItem('cart', JSON.stringify(state.items));
        },

        decreaseQuantity: (state, action) => {
            const item = state.items.find((i) => i.id === action.payload);
            if (item) {
                if (item.quantity === 1) {
                    state.items = state.items.filter((i) => i.id !== action.payload);
                } else {
                    item.quantity -= 1;
                }
            }
            localStorage.setItem('cart', JSON.stringify(state.items));
        },

        clearCart: (state) => {
            state.items = [];
            localStorage.removeItem('cart');
        },
    },
});

export const { addToCart, removeFromCart, increaseQuantity, decreaseQuantity, clearCart } =
    cartSlice.actions;

// ─── Selectors ─────────────────────────────────────────────────────────────────
export const selectCartItems = (state) => state.cart.items;

export const selectCartTotal = (state) =>
    state.cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

export const selectCartCount = (state) =>
    state.cart.items.reduce((sum, item) => sum + item.quantity, 0);

export const selectIsInCart = (id) => (state) =>
    state.cart.items.some((item) => item.id === id);

export default cartSlice.reducer;

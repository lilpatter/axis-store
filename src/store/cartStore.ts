import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem } from "@/types";

interface CartState {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  addItem: (item: Omit<CartItem, "id">) => void;
  removeItem: (productId: string, variant?: string) => void;
  updateQuantity: (productId: string, quantity: number, variant?: string) => void;
  clearCart: () => void;
}

function computeTotals(items: CartItem[]) {
  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  return { totalItems, totalPrice };
}

function cartItemId(productId: string, variant?: string): string {
  return variant ? `${productId}::${variant}` : productId;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      totalItems: 0,
      totalPrice: 0,

      addItem: (item) =>
        set((state) => {
          const key = cartItemId(item.productId, item.variant);
          const existing = state.items.find(
            (i) => cartItemId(i.productId, i.variant) === key
          );
          let next: CartItem[];
          if (existing) {
            next = state.items.map((i) =>
              cartItemId(i.productId, i.variant) === key
                ? { ...i, quantity: i.quantity + item.quantity }
                : i
            );
          } else {
            next = [
              ...state.items,
              {
                ...item,
                id: `${item.productId}-${Date.now()}`,
                quantity: item.quantity,
              },
            ];
          }
          const { totalItems, totalPrice } = computeTotals(next);
          return { items: next, totalItems, totalPrice };
        }),

      removeItem: (productId, variant) =>
        set((state) => {
          const key = cartItemId(productId, variant);
          const next = state.items.filter(
            (i) => cartItemId(i.productId, i.variant) !== key
          );
          const { totalItems, totalPrice } = computeTotals(next);
          return { items: next, totalItems, totalPrice };
        }),

      updateQuantity: (productId, quantity, variant) =>
        set((state) => {
          const key = cartItemId(productId, variant);
          if (quantity <= 0) {
            const next = state.items.filter(
              (i) => cartItemId(i.productId, i.variant) !== key
            );
            const { totalItems, totalPrice } = computeTotals(next);
            return { items: next, totalItems, totalPrice };
          }
          const next = state.items.map((i) =>
            cartItemId(i.productId, i.variant) === key
              ? { ...i, quantity }
              : i
          );
          const { totalItems, totalPrice } = computeTotals(next);
          return { items: next, totalItems, totalPrice };
        }),

      clearCart: () =>
        set({ items: [], totalItems: 0, totalPrice: 0 }),
    }),
    { name: "axis-cart" }
  )
);

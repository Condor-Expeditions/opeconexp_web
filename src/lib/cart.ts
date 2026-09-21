// src/lib/cart.ts
// Cart logic — cliente-side, no SSR data layer (moved from helpers.ts)

export interface CartItem {
  tourId: string;
  tourSlug: string;
  tourTitle: Record<string, string>;
  date: string;
  time: string;
  adults: number;
  children: number;
  unitPrice: number;
  total: number;
}

const CART_KEY = "coexp_cart";

function loadCart(): CartItem[] {
  try {
    const stored = localStorage.getItem(CART_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveCart(items: CartItem[]): void {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
}

export function getCart(): CartItem[] {
  return loadCart();
}

export function addToCart(item: CartItem): void {
  const items = loadCart();
  items.push(item);
  saveCart(items);
}

export function removeFromCart(tourId: string, date: string, time: string): void {
  const items = loadCart().filter(
    (i: CartItem) => !(i.tourId === tourId && i.date === date && i.time === time)
  );
  saveCart(items);
}

export function getCartTotal(): number {
  return loadCart().reduce((sum: number, i: CartItem) => sum + i.total, 0);
}

export function clearCart(): void {
  saveCart([]);
}
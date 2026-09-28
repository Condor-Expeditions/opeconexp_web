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

export function removeFromCart(
	tourId: string,
	date: string,
	time: string,
): void {
	const items = loadCart().filter(
		(i: CartItem) =>
			!(i.tourId === tourId && i.date === date && i.time === time),
	);
	saveCart(items);
}

export function getCartTotal(): number {
	return loadCart().reduce((sum: number, i: CartItem) => sum + i.total, 0);
}

export function clearCart(): void {
	saveCart([]);
}

// ─── Destinos (/destinos/[slug]) ─────────────────────────────
// Reserva de destino con categorías de viajeros, datos de viajeros
// y datos del comprador. Clave separada para no romper el carrito de tours.

export type TravelerCategory =
	| "adults"
	| "seniors"
	| "disabled"
	| "children"
	| "babies";

export interface DestinationTraveler {
	name: string;
	doc: string;
	birth: string;
	role: "buyer" | "companion";
}

export interface DestinationBuyer {
	email: string;
	phone: string;
	whatsapp: boolean;
}

export interface DestinationCartItem {
	kind: "destination";
	slug: string;
	name: string;
	lang: "es" | "en";
	date: string;
	time: string;
	qty: Record<TravelerCategory, number>;
	childRange?: string;
	travelers: DestinationTraveler[];
	buyer: DestinationBuyer;
	subtotal: number;
	total: number;
	currency: "USD";
	createdAt: string;
}

const DEST_CART_KEY = "coexp_cart_destinations";

function loadDestinationCart(): DestinationCartItem[] {
	try {
		const stored = localStorage.getItem(DEST_CART_KEY);
		return stored ? JSON.parse(stored) : [];
	} catch {
		return [];
	}
}

function saveDestinationCart(items: DestinationCartItem[]): void {
	localStorage.setItem(DEST_CART_KEY, JSON.stringify(items));
}

export function getDestinationCart(): DestinationCartItem[] {
	return loadDestinationCart();
}

export function addDestinationToCart(item: DestinationCartItem): void {
	const items = loadDestinationCart();
	items.push(item);
	saveDestinationCart(items);
}

export function removeDestinationFromCart(
	slug: string,
	date: string,
	time: string,
): void {
	const items = loadDestinationCart().filter(
		(i) => !(i.slug === slug && i.date === date && i.time === time),
	);
	saveDestinationCart(items);
}

export function getDestinationCartTotal(): number {
	return loadDestinationCart().reduce((sum, i) => sum + i.total, 0);
}

export function clearDestinationCart(): void {
	saveDestinationCart([]);
}

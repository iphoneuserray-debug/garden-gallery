import type { Product } from "./fetchProductData";

export interface Cart {
    items: Array<{ item: Product, qty: number }>;
}

// Add flower to cart
export function addToCart() { }

export function getCart() { }

export function editCart() { }

export function removeFromCart() { }

export function checkOut() { }
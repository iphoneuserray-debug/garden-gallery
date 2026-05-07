import { createContext, useContext, useEffect, useMemo, useState } from 'react'

export interface CartProduct {
    id: string
    title: string
    handle: string
    imgSrc: string
    price: number   // numeric AUD
    badge?: string
}

interface CartEntry {
    item: CartProduct
    qty: number
}

interface CartState {
    items: CartEntry[]
}

interface CartContextValue {
    cart: CartState
    cartCount: number
    subtotal: number
    addItem: (item: CartProduct, qty?: number) => void
    updateItemQty: (id: string, qty: number) => void
    removeItem: (id: string) => void
    clearCart: () => void
}

const STORAGE_KEY = 'garden-gallery-cart'

function loadCart(): CartState {
    if (typeof window === 'undefined') return { items: [] }
    try {
        const raw = window.localStorage.getItem(STORAGE_KEY)
        if (!raw) return { items: [] }
        const parsed = JSON.parse(raw)
        return {
            items: Array.isArray(parsed.items)
                ? parsed.items.filter((e: CartEntry) => !!e?.item?.id && typeof e?.qty === 'number')
                : [],
        }
    } catch {
        return { items: [] }
    }
}

function saveCart(cart: CartState) {
    if (typeof window === 'undefined') return
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cart))
}

function addItemToCart(cart: CartState, item: CartProduct, qty = 1): CartState {
    const safeQty = Math.max(1, qty)
    const exists = cart.items.find(e => e.item.id === item.id)
    if (exists) {
        return { items: cart.items.map(e => e.item.id === item.id ? { ...e, qty: e.qty + safeQty } : e) }
    }
    return { items: [...cart.items, { item, qty: safeQty }] }
}

function updateQty(cart: CartState, id: string, qty: number): CartState {
    if (qty <= 0) return removeFromCart(cart, id)
    return { items: cart.items.map(e => e.item.id === id ? { ...e, qty } : e) }
}

function removeFromCart(cart: CartState, id: string): CartState {
    return { items: cart.items.filter(e => e.item.id !== id) }
}

const CartCtx = createContext<CartContextValue | null>(null)

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [cart, setCart] = useState<CartState>({ items: [] })

    useEffect(() => { setCart(loadCart()) }, [])
    useEffect(() => { saveCart(cart) }, [cart])

    const value = useMemo<CartContextValue>(() => ({
        cart,
        cartCount: cart.items.reduce((sum, e) => sum + e.qty, 0),
        subtotal: cart.items.reduce((sum, e) => sum + e.item.price * e.qty, 0),
        addItem: (item, qty) => setCart(c => addItemToCart(c, item, qty)),
        updateItemQty: (id, qty) => setCart(c => updateQty(c, id, qty)),
        removeItem: id => setCart(c => removeFromCart(c, id)),
        clearCart: () => { localStorage.removeItem(STORAGE_KEY); setCart({ items: [] }) },
    }), [cart])

    return <CartCtx.Provider value={value}>{children}</CartCtx.Provider>
}

export function useCart(): CartContextValue {
    const ctx = useContext(CartCtx)
    if (!ctx) throw new Error('useCart must be used within a CartProvider')
    return ctx
}

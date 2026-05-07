const API_BASE = (import.meta.env.VITE_API_BASE as string | undefined) ?? 'http://localhost:3000'

export interface BackendProduct {
    id: string
    name: string
    description: string
    priceAud: number
    tags: string[]
    availability: boolean
    images: { id: string; url: string; sortOrder: number }[]
}

export interface Product {
    id: string
    title: string
    handle: string          // slugified name, used for URL
    price: string           // display string: "12.00 AUD"
    priceNum: number        // numeric for cart
    imgSrc: string
    badge: string
    images: { src: string; alt: string }[]
    description: string
    tags: string[]
}

function mapProduct(p: BackendProduct): Product {
    const images = p.images?.length
        ? p.images.map(img => ({ src: img.url, alt: p.name }))
        : [{ src: `https://picsum.photos/seed/${p.id}/400/500`, alt: p.name }]
    return {
        id: p.id,
        title: p.name,
        handle: p.name.toLowerCase().replace(/\s+/g, '-'),
        price: `${Number(p.priceAud).toFixed(2)} AUD`,
        priceNum: Number(p.priceAud),
        imgSrc: images[0].src,
        badge: p.tags?.[0] ?? '',
        images,
        description: p.description,
        tags: p.tags ?? [],
    }
}

export async function fetchProducts(): Promise<Product[]> {
    const res = await fetch(`${API_BASE}/products`)
    if (!res.ok) throw new Error(`Failed to fetch products: ${res.status}`)
    const data: BackendProduct[] = await res.json()
    return data.map(mapProduct)
}

export async function fetchProductByHandle(handle: string): Promise<Product | undefined> {
    const all = await fetchProducts()
    return all.find(p => p.handle === handle)
}

export async function fetchProductsByFilter(params: {
    tags?: string[]
    minPrice?: number
    maxPrice?: number
    availability?: boolean
}): Promise<Product[]> {
    const qs = new URLSearchParams()
    params.tags?.forEach(t => qs.append('tags', t))
    if (params.minPrice !== undefined) qs.set('minPrice', String(params.minPrice))
    if (params.maxPrice !== undefined) qs.set('maxPrice', String(params.maxPrice))
    if (params.availability !== undefined) qs.set('availability', String(params.availability))
    const query = qs.toString()
    const res = await fetch(`${API_BASE}/products${query ? `?${query}` : ''}`)
    if (!res.ok) throw new Error(`Failed to fetch products: ${res.status}`)
    const data: BackendProduct[] = await res.json()
    return data.map(mapProduct)
}

// Legacy compat export
export const api = {
    getProducts: fetchProducts,
    getProductsByFilter: fetchProductsByFilter,
}
export type { Product as LegacyProduct }
export function coverUrl(p: BackendProduct): string {
    if (!p.images?.length) return `https://picsum.photos/seed/${p.id}/400/500`
    const sorted = [...p.images].sort((a, b) => a.sortOrder - b.sortOrder)
    return sorted[0].url
}

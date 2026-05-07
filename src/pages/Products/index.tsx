import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Crumb } from '@/components/Crumb'
import FilterBar from './FilterBar'
import { fetchProducts } from '@/lib/api'
import type { Product } from '@/lib/api'

function ProductCard({ title, price, imgSrc, to }: { title: string; price: string; imgSrc: string; to: string }) {
    return (
        <Link to={to} className="group block">
            <div className="overflow-hidden aspect-[4/5]">
                <img
                    src={imgSrc}
                    alt={`${title}-Image`}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
            </div>
            <div className="mt-2">
                <p className="font-light text-base tracking-wide">{title}</p>
                <p className="text-sm text-black/50 tracking-widest">{price}</p>
            </div>
        </Link>
    )
}

export default function Products() {
    const { text } = useParams()
    const [allProducts, setAllProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        fetchProducts()
            .then(setAllProducts)
            .catch(err => setError(err.message))
            .finally(() => setLoading(false))
    }, [])

    const filtered = text
        ? allProducts.filter(p =>
            p.badge.toLowerCase() === text.toLowerCase() ||
            p.title.toLowerCase().includes(text.toLowerCase()) ||
            p.tags.some(t => t.toLowerCase() === text.toLowerCase())
          )
        : allProducts

    return (
        <>
            <h1
                className="font-light leading-none mb-5"
                style={{ fontSize: 'clamp(36px, 6vw, 90px)', letterSpacing: '-0.02em' }}
            >
                {text ?? 'All'}
            </h1>
            <Crumb />
            <FilterBar />

            {loading && <p className="text-sm text-black/40 mt-4">Loading products…</p>}
            {error && <p className="text-sm text-red-500 mt-4">{error}</p>}

            <div className="grid grid-cols-2 lg:grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-x-3 gap-y-8">
                {filtered.map(p => (
                    <ProductCard
                        key={p.id}
                        title={p.title}
                        price={p.price}
                        imgSrc={p.imgSrc}
                        to={`/detail/${p.handle}`}
                    />
                ))}
            </div>
        </>
    )
}

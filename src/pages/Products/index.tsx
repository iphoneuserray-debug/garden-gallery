import { useEffect, useMemo, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { SlidersHorizontal, ChevronLeft, X } from 'lucide-react'
import { Crumb } from '@/components/Crumb'
import FilterPanel, { type Filters } from './FilterPanel'
import { Skeleton } from '@/components/ui/skeleton'
import { fetchProducts } from '@/lib/api'
import type { Product } from '@/lib/api'

function ProductCardSkeleton() {
    return (
        <div>
            <Skeleton className="aspect-[4/5] w-full" />
            <Skeleton className="mt-2 h-4 w-3/4" />
            <Skeleton className="mt-2 h-3 w-1/3" />
        </div>
    )
}

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
    const [searchParams, setSearchParams] = useSearchParams()
    const tagParam = searchParams.get('tag')
    const queryParam = searchParams.get('q')

    const clearQuery = () => {
        const next = new URLSearchParams(searchParams)
        next.delete('q')
        setSearchParams(next, { replace: true })
    }


    const [allProducts, setAllProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [open, setOpen] = useState(true)

    const maxPrice = useMemo(() => Math.ceil(Math.max(0, ...allProducts.map(p => p.priceNum)) / 10) * 10, [allProducts])
    const allTags = useMemo(() => [...new Set(allProducts.flatMap(p => p.tags))].sort(), [allProducts])

    const [filters, setFilters] = useState<Filters>({ priceRange: [0, 0], inStock: 'all', tags: [] })

    useEffect(() => {
        fetchProducts()
            .then(prods => {
                setAllProducts(prods)
                const max = Math.ceil(Math.max(0, ...prods.map(p => p.priceNum)) / 10) * 10
                const tags = prods.flatMap(p => p.tags)
                // Use the tag exactly as given, even if it matches no product — that way an
                // unrecognized/typo'd tag (e.g. a nav link for a category with no products yet)
                // correctly filters down to zero results instead of silently showing everything.
                const preTag = tagParam
                    ? (tags.find(t => t.toLowerCase() === tagParam.toLowerCase()) ?? tagParam.toLowerCase())
                    : null
                setFilters(f => ({
                    ...f,
                    priceRange: f.priceRange[1] === 0 ? [0, max] : f.priceRange,
                    tags: preTag && !f.tags.includes(preTag) ? [...f.tags, preTag] : f.tags,
                }))
            })
            .catch(err => setError(err.message))
            .finally(() => setLoading(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    // When the URL tag param changes (e.g. navigating between categories, or to a
    // tag-less link like "Shop All"), sync the filters to match — clearing everything
    // when there's no tag so a fresh nav link always starts from an unfiltered view.
    useEffect(() => {
        if (allProducts.length === 0) return
        if (!tagParam) {
            setFilters({ priceRange: [0, maxPrice], inStock: 'all', tags: [] })
            return
        }
        const canonical = allTags.find(t => t.toLowerCase() === tagParam.toLowerCase()) ?? tagParam.toLowerCase()
        setFilters(f => f.tags.length === 1 && f.tags[0] === canonical ? f : { priceRange: f.priceRange, inStock: f.inStock, tags: [canonical] })
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tagParam, allTags, allProducts.length])

    const filtered = useMemo(() => {
        let list = allProducts
        if (queryParam) {
            const q = queryParam.toLowerCase()
            list = list.filter(p =>
                p.title.toLowerCase().includes(q) ||
                p.tags.some(t => t.toLowerCase().includes(q)) ||
                (p.description ?? '').toLowerCase().includes(q)
            )
        }
        list = list.filter(p => p.priceNum >= filters.priceRange[0] && p.priceNum <= filters.priceRange[1])
        if (filters.inStock === 'in') list = list.filter(p => p.inStock)
        if (filters.inStock === 'out') list = list.filter(p => !p.inStock)
        if (filters.tags.length > 0) list = list.filter(p => filters.tags.every(t => p.tags.includes(t)))
        return list
    }, [allProducts, filters, queryParam])

    const removeTag = (tag: string) => setFilters(f => ({ ...f, tags: f.tags.filter(t => t !== tag) }))
    const clearInStock = () => setFilters(f => ({ ...f, inStock: 'all' }))

    const hasActiveFilters = filters.tags.length > 0 || filters.inStock !== 'all'
        || filters.priceRange[0] > 0 || filters.priceRange[1] < maxPrice

    return (
        <>
            <Crumb items={[{ label: 'Products' }]} />

            {/* Toggle + active filter pills row */}
            <div className="flex items-center gap-2 flex-wrap mb-4">
                <button
                    onClick={() => setOpen(o => !o)}
                    className="flex items-center gap-1.5 text-xs uppercase tracking-widest text-black/50 hover:text-black transition-colors shrink-0"
                >
                    {open
                        ? <><ChevronLeft size={14} /><span>Filters</span></>
                        : <SlidersHorizontal size={14} />
                    }
                </button>

                {queryParam && (
                    <span className="flex items-center gap-1 text-xs uppercase tracking-widest border border-black/30 px-2 py-0.5">
                        "{queryParam}"
                        <button onClick={clearQuery} className="hover:text-black/50 transition-colors"><X size={10} /></button>
                    </span>
                )}
                {!open && filters.tags.map(tag => (
                    <span key={tag} className="flex items-center gap-1 text-xs uppercase tracking-widest border border-black/30 px-2 py-0.5">
                        {tag}
                        <button onClick={() => removeTag(tag)} className="hover:text-black/50 transition-colors"><X size={10} /></button>
                    </span>
                ))}
                {!open && filters.inStock !== 'all' && (
                    <span className="flex items-center gap-1 text-xs uppercase tracking-widest border border-black/30 px-2 py-0.5">
                        {filters.inStock === 'in' ? 'In Stock' : 'Out of Stock'}
                        <button onClick={clearInStock} className="hover:text-black/50 transition-colors"><X size={10} /></button>
                    </span>
                )}
                {!open && hasActiveFilters && (
                    <button
                        onClick={() => setFilters({ priceRange: [0, maxPrice], inStock: 'all', tags: [] })}
                        className="text-xs uppercase tracking-widest text-black/40 hover:text-black transition-colors ml-1"
                    >
                        Clear all
                    </button>
                )}
            </div>

            <div className="flex flex-col lg:flex-row gap-8 items-start">
                {open && (
                    <FilterPanel
                        maxPrice={maxPrice}
                        allTags={allTags}
                        filters={filters}
                        onChange={setFilters}
                    />
                )}

                <div className="flex-1 min-w-0">
                    {error && <p className="text-sm text-red-500">{error}</p>}
                    {!loading && !error && filtered.length === 0 && (
                        <p className="text-sm text-black/40 uppercase tracking-widest">No products match your filters.</p>
                    )}
                    <div className="grid grid-cols-2 lg:grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-x-3 gap-y-8">
                        {loading && Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)}
                        {!loading && filtered.map(p => (
                            <ProductCard
                                key={p.id}
                                title={p.title}
                                price={p.price}
                                imgSrc={p.imgSrc}
                                to={`/detail/${p.handle}`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </>
    )
}

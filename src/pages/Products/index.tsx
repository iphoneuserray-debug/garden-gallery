import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { SlidersHorizontal, ChevronLeft, X } from 'lucide-react'
import { Crumb } from '@/components/Crumb'
import FilterPanel, { type Filters } from './FilterPanel'
import { fetchProducts } from '@/lib/api'
import type { Product } from '@/lib/api'
import styles from './Products.module.css'
import ProductCard from '@/components/ProductCard'
import ProductCardSkeleton from '@/components/ProductCardSkeleton'

export default function Products() {
    const [searchParams, setSearchParams] = useSearchParams()
    const tagParam = searchParams.get('tag')
    const queryParam = searchParams.get('q')

    const tagList = useMemo(
        () => (tagParam ? tagParam.split(',').map(t => t.trim().toLowerCase()).filter(Boolean) : []),
        [tagParam]
    )

    const clearQuery = () => {
        const next = new URLSearchParams(searchParams)
        next.delete('q')
        setSearchParams(next, { replace: true })
    }


    const [allProducts, setAllProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [open, setOpen] = useState(() => window.innerWidth >= 1024)

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
                // Multi-tag URLs (OR semantics) are handled separately in `filtered` below.
                const preTag = tagList.length === 1
                    ? (tags.find(t => t.toLowerCase() === tagList[0]) ?? tagList[0])
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

    useEffect(() => {
        if (allProducts.length === 0) return
        if (tagList.length !== 1) {
            setFilters({ priceRange: [0, maxPrice], inStock: 'all', tags: [] })
            return
        }
        const canonical = allTags.find(t => t.toLowerCase() === tagList[0]) ?? tagList[0]
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
        if (tagList.length > 1) {
            list = list.filter(p => p.tags.some(t => tagList.includes(t.toLowerCase())))
        }
        list = list.filter(p => p.priceNum >= filters.priceRange[0] && p.priceNum <= filters.priceRange[1])
        if (filters.inStock === 'in') list = list.filter(p => p.inStock)
        if (filters.inStock === 'out') list = list.filter(p => !p.inStock)
        if (filters.tags.length > 0) list = list.filter(p => filters.tags.every(t => p.tags.includes(t)))
        return list
    }, [allProducts, filters, queryParam, tagList])

    const removeTag = (tag: string) => setFilters(f => ({ ...f, tags: f.tags.filter(t => t !== tag) }))
    const clearInStock = () => setFilters(f => ({ ...f, inStock: 'all' }))

    const hasActiveFilters = filters.tags.length > 0 || filters.inStock !== 'all'
        || filters.priceRange[0] > 0 || filters.priceRange[1] < maxPrice

    return (
        <>
            <Crumb items={[{ label: 'Products' }]} />

            <div className={styles.toolbarRow}>
                <button
                    onClick={() => setOpen(o => !o)}
                    className={styles.toggleButton}
                >
                    {open
                        ? <><ChevronLeft size={14} /><span>Filters</span></>
                        : <SlidersHorizontal size={14} />
                    }
                </button>

                {queryParam && (
                    <span className={styles.pill}>
                        "{queryParam}"
                        <button onClick={clearQuery} className={styles.pillCloseButton}><X size={10} /></button>
                    </span>
                )}
                {!open && filters.tags.map(tag => (
                    <span key={tag} className={styles.pill}>
                        {tag}
                        <button onClick={() => removeTag(tag)} className={styles.pillCloseButton}><X size={10} /></button>
                    </span>
                ))}
                {!open && filters.inStock !== 'all' && (
                    <span className={styles.pill}>
                        {filters.inStock === 'in' ? 'In Stock' : 'Out of Stock'}
                        <button onClick={clearInStock} className={styles.pillCloseButton}><X size={10} /></button>
                    </span>
                )}
                {!open && hasActiveFilters && (
                    <button
                        onClick={() => setFilters({ priceRange: [0, maxPrice], inStock: 'all', tags: [] })}
                        className={styles.clearAllButton}
                    >
                        Clear all
                    </button>
                )}
            </div>

            <div className={styles.layoutRow}>
                {open && (
                    <FilterPanel
                        maxPrice={maxPrice}
                        allTags={allTags}
                        filters={filters}
                        onChange={setFilters}
                    />
                )}

                <div className={styles.resultsCol}>
                    {error && <p className={styles.errorText}>{error}</p>}
                    {!loading && !error && filtered.length === 0 && (
                        <p className={styles.emptyText}>No products match your filters.</p>
                    )}
                    <div className={styles.grid}>
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

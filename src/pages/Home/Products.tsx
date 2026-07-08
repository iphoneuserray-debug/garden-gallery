import ProductCard from "@/components/ProductCard"
import ProductCardSkeleton from "@/components/ProductCardSkeleton"
import { fetchProducts, type Product } from "@/lib/api"
import { useEffect, useState } from "react"
import styles from "./Products.module.css"

const MAX_PRODUCTS = 15 // 3 per row x 5 rows

export default function Products() {
    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        fetchProducts()
            .then(prods => {
                setProducts(prods.slice(0, MAX_PRODUCTS))
            })
            .catch(err => setError(err.message))
            .finally(() => setLoading(false))
    }, [])
    return (<div className={styles.wrap}>
        {error && <p className={styles.errorText}>{error}</p>}
        <div className={styles.grid}>
            {loading && Array.from({ length: MAX_PRODUCTS }).map((_, i) => <ProductCardSkeleton key={i} />)}
            {!loading && products.map(p => (
                <ProductCard
                    key={p.id}
                    title={p.title}
                    price={p.price}
                    imgSrc={p.imgSrc}
                    to={`/detail/${p.handle}`}
                />
            ))}
        </div>
    </div>)
}
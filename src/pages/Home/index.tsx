import { useEffect, useState } from 'react'
import HeroSection from './HeroSection'
import CategoriesSection from './CategoriesSection'
import { fetchProducts } from '@/lib/api'
import type { Product } from '@/lib/api'
import Products from './Products'

interface FilmstripProduct {
    handle: string
    src: string
    name: string
    price: string
}

export default function Home() {
    const [filmProducts, setFilmProducts] = useState<FilmstripProduct[]>([])

    useEffect(() => {
        fetchProducts()
            .then((products: Product[]) => {
                setFilmProducts(products.map(p => ({ name: p.title, price: p.price, handle: p.handle, src: p.imgSrc })))
                const imgs: Record<string, string> = {}
                products.forEach(p => {
                    p.tags.forEach(tag => {
                        const key = tag.toLowerCase()
                        if (!imgs[key]) imgs[key] = p.imgSrc
                    })
                })
            })
            .catch(() => { })
    }, [])

    return (
        <div className="home-wrap">
            <HeroSection products={filmProducts} />
            <CategoriesSection />
            <Products />
        </div>
    )
}

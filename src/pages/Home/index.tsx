import { useEffect, useState } from 'react'
import HeroSection from './HeroCarousel'
import CategoriesSection from './CategoriesSection'
import BestSellerSection from './BestSellerSection'
import TagSection from './TagSection'
import { fetchProducts } from '@/lib/api'
import type { Product } from '@/lib/api'

interface FilmstripProduct {
    handle: string
    src: string
    name: string
    price: string
}

export default function Home() {
    const [filmProducts, setFilmProducts] = useState<FilmstripProduct[]>([])
    const [tagImages, setTagImages] = useState<Record<string, string>>({})

    useEffect(() => {
        // Add scroll-snap to html element
        document.documentElement.classList.add('home-snap')
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
                setTagImages(imgs)
            })
            .catch(() => {})
        return () => { document.documentElement.classList.remove('home-snap') }
    }, [])

    return (
        <div className="home-wrap">
            <HeroSection products={filmProducts} />
            <CategoriesSection />
            <BestSellerSection title="Best Seller" products={filmProducts} />
            <TagSection
                title="Event"
                showContact
                tagImages={tagImages}
                subCategories={['Wedding', 'Birthday', 'Anniversary', 'Corporate']}
            />
            <TagSection
                title="Type"
                reverse
                tagImages={tagImages}
                subCategories={['Rose', 'Tulip', 'Lily', 'Sunflower']}
            />
        </div>
    )
}

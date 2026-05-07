import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import Filmstrip from './Filmstrip'

interface FilmstripProduct {
    handle: string
    src: string
    name: string
    price: string
}

interface BestSellerSectionProps {
    title: string
    products: FilmstripProduct[]
}

export default function BestSellerSection({ title, products }: BestSellerSectionProps) {
    return (
        <section
            className="w-full flex flex-col justify-center"
            style={{ height: '100vh', scrollSnapAlign: 'start' }}
        >
            <h2 className="title-page">{title}</h2>
            {products.length > 0 && <Filmstrip products={products} />}
            <div className="flex justify-end m-5">
                <Link to="/products" className="group self-start">
                    <span className="flex items-center gap-1 font-bold tracking-widest uppercase transition-all duration-200 group-hover:opacity-60 text-nav">
                        Shop All
                        <ArrowUpRight size={16} strokeWidth={2.5} />
                    </span>
                </Link>
            </div>
        </section>
    )
}

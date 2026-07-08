import Filmstrip from './Filmstrip'
import styles from './BestSellerSection.module.css'

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
            className={styles.section}
            style={{ height: '100vh', scrollSnapAlign: 'start' }}
        >
            <h2 className="title-page">{title}</h2>
            {products.length > 0 && <Filmstrip products={products} />}
        </section>
    )
}

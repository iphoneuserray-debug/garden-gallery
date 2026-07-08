import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import Filmstrip from './Filmstrip'
import styles from './HeroSection.module.css'

interface FilmstripProduct {
    handle: string
    src: string
    name: string
    price: string
}

interface HeroSectionProps {
    products: FilmstripProduct[]
}

export default function HeroSection({ products }: HeroSectionProps) {
    return (
        <section
            className={styles.hero}
            style={{ height: '100vh', scrollSnapAlign: 'start' }}
        >
            <div className={styles.titleWrap}>
                <div className={`title-hero ${styles.titleBlack}`}>
                    <div style={{ paddingLeft: '2%', paddingTop: 'clamp(20px, 8%, 0.3em)' }}>GARDEN</div>
                    <div style={{ paddingLeft: '18%' }}>GALLERY</div>
                </div>
            </div>

            <div className={styles.carouselGroup}>
                <Link to="/products" className={styles.shopAllLink}>
                    <span className={`${styles.linkLabel} text-nav`}>
                        Shop All
                        <ArrowUpRight size={16} strokeWidth={2.5} />
                    </span>
                </Link>

                {products.length > 0 && <Filmstrip products={products} />}
            </div>

            <div className={styles.sloganRow}>
                <p className={`text-slogan ${styles.sloganText}`}>
                    Every flower blooms upon your arrival
                </p>
            </div>
        </section>
    )
}

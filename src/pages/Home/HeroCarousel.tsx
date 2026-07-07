import Filmstrip from './Filmstrip'
import styles from './HeroCarousel.module.css'

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
                    <div style={{ paddingLeft: '2%', paddingTop: 'clamp(60px, 8%, 0.3em)' }}>GARDEN</div>
                    <div style={{ paddingLeft: '18%' }}>GALLERY</div>
                </div>
            </div>

            {products.length > 0 && <Filmstrip products={products} />}

            <div className={styles.sloganRow}>
                <p className={`text-slogan ${styles.sloganText}`}>
                    Every flower blooms upon your arrival
                </p>
            </div>
        </section>
    )
}

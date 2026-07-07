import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import styles from './TagSection.module.css'

const FALLBACK_IMAGES: Record<string, string> = {
    Wedding: '/category/wedding.jpg',
    Birthday: '/category/birthday.jpg',
    Anniversary: '/example/43a5a17e515c008f24f43a2935dc74.JPG',
    Corporate: '/example/5467e37f7dda2d994c8758315267dc.JPG',
    Funeral: '/example/cc1859a0ad9e4b29ea6e26cb722570.JPG',
    Rose: '/category/rose.jpg',
    Tulip: '/category/tulip.jpg',
    Lily: '/category/lily.jpg',
    Sunflower: '/category/orchid.jpg',
}

function getImage(label: string, tagImages: Record<string, string>): string {
    const lower = label.toLowerCase()
    const key = Object.keys(tagImages).find(k => k.includes(lower) || lower.includes(k))
    if (key) return tagImages[key]
    return FALLBACK_IMAGES[label] ?? `https://picsum.photos/seed/${label}/400/600`
}

interface TagSectionProps {
    title: string
    subCategories: string[]
    tagImages: Record<string, string>
    reverse?: boolean
    showContact?: boolean
}

export default function TagSection({ title, subCategories, tagImages, reverse = false, showContact = false }: TagSectionProps) {
    const items = subCategories.map(label => ({
        label,
        href: `/products?tag=${label.toLowerCase()}`,
        image: getImage(label, tagImages),
    }))

    const [activeIdx, setActiveIdx] = useState(0)

    useEffect(() => {
        const id = setInterval(() => setActiveIdx(i => (i + 1) % items.length), 3000)
        return () => clearInterval(id)
    }, [items.length])

    return (
        <section
            className={styles.section}
            style={{ height: '100vh', scrollSnapAlign: 'start' }}
        >
            <div className={styles.headingWrap}>
                <h2 className="title-section">{title}</h2>
            </div>

            <div className={`${styles.body} ${reverse ? styles.bodyReverse : ''}`}>
                {/* Image */}
                <div className={styles.imageWrap}>
                    {items.map((item, i) => (
                        <img
                            key={item.label}
                            src={item.image}
                            alt={item.label}
                            className={styles.image}
                            style={{ opacity: activeIdx === i ? 1 : 0, objectPosition: 'center 30%' }}
                        />
                    ))}
                </div>

                {/* Links */}
                <div className={styles.linksWrap}>
                    <p className={styles.shopByLabel}>
                        Shop by {title}
                    </p>
                    {items.map(item => (
                        <div key={item.label}>
                            <div className={styles.divider} />
                            <Link
                                to={item.href}
                                className={styles.itemLink}
                            >
                                <h3 className="title-item">{item.label}</h3>
                            </Link>
                        </div>
                    ))}
                    <div className={styles.divider} />

                    {showContact && (
                        <div className={styles.contactWrap}>
                            <Link to="/contact" className={styles.contactLink}>
                                <span className={`${styles.linkLabel} text-nav`}>
                                    Custom Order
                                    <ArrowUpRight size={16} strokeWidth={2.5} />
                                </span>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </section>
    )
}

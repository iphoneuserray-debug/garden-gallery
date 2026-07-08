import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import styles from './CategoriesSection.module.css'

const CATEGORIES = [
    { label: 'Wedding', image: '/category/wedding.jpg', href: '/products?tag=wedding' },
    { label: 'Birthday', image: '/category/birthday.jpg', href: '/products?tag=birthday' },
    { label: 'Anniversary', image: 'https://picsum.photos/seed/cat-anniversary/300/700', href: '/products?tag=anniversary' },
    { label: 'Rose', image: '/category/rose.jpg', href: '/products?tag=rose' },
    { label: 'Tulip', image: '/category/tulip.jpg', href: '/products?tag=tulip' },
    { label: 'Lily', image: '/category/lily.jpg', href: '/products?tag=lily' },
]

const QUICK_LINKS: { label: string; href?: string }[] = [
    { label: 'Shop All', href: '/products' },
    { label: 'Subscription', href: '/products?tag=subscription' },
    { label: 'Custom Yours', href: '/products?tag=roses,tulips,lilies,sunflowers' },
    { label: 'Contact Us' },
]

export default function CategoriesSection() {
    const [hovered, setHovered] = useState<string | null>(null)

    const linkContent = (label: string) => (
        <>
            <span className={`${styles.linkLabel} text-nav`}>
                {label}
                <ArrowUpRight size={16} className={styles.arrow} strokeWidth={2.5} />
            </span>
            <span className={styles.underline} />
        </>
    )

    const links = (
        <div className={styles.linksList}>
            {QUICK_LINKS.map(l =>
                l.href ? (
                    <Link key={l.label} to={l.href} className={styles.quickLink}>
                        {linkContent(l.label)}
                    </Link>
                ) : (
                    <Dialog key={l.label}>
                        <DialogTrigger asChild>
                            <button type="button" className={styles.quickLink}>
                                {linkContent(l.label)}
                            </button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle className="text-[1.125rem] font-bold text-[#1d1d1f]">Contact Us</DialogTitle>
                                <DialogDescription className="text-[#6e6e73]">We'd love to hear from you.</DialogDescription>
                            </DialogHeader>
                            <div className="text-sm text-[#6e6e73]">
                                <p>Email: info@flowerstore.com</p>
                                <p>Phone: (555) 123-4567</p>
                            </div>
                        </DialogContent>
                    </Dialog>
                )
            )}
        </div>
    )

    return (
        <section
            className={styles.section}
            style={{ height: '100vh', scrollSnapAlign: 'start', paddingTop: 'clamp(16px, 4vh, 48px)' }}
        >
            <h2 className={`title-page ${styles.heading}`}>園藝廊</h2>

            {/* Mobile layout */}
            <div className={styles.mobileLayout}>
                <div
                    className={styles.mobileGrid}
                    style={{ gridTemplateRows: `repeat(${Math.ceil(CATEGORIES.length / 2)}, 1fr)` }}
                >
                    {CATEGORIES.map(cat => (
                        <Link key={cat.label} to={cat.href} className={styles.catLink}>
                            <img src={cat.image} alt={cat.label} className={styles.catImage} />
                            <div className={styles.captionMobile}>
                                <p className={styles.captionText}>{cat.label}</p>
                            </div>
                        </Link>
                    ))}
                </div>
                <div className={styles.mobileLinksWrap}>{links}</div>
            </div>

            {/* Desktop layout */}
            <div className={styles.desktopLayout}>
                <div className={styles.desktopLinksPos} style={{ left: '4%', top: '40vh' }}>
                    {links}
                </div>
                <div
                    className={styles.desktopRow}
                    style={{ left: '28%', right: 0, bottom: '6vh', height: '80vh', alignItems: 'stretch' }}
                >
                    {CATEGORIES.map((cat, i) => (
                        <Link
                            key={cat.label}
                            to={cat.href}
                            className={styles.catLink}
                            style={{
                                height: hovered === cat.label ? '95%' : '88%',
                                alignSelf: i % 2 === 0 ? 'flex-end' : 'flex-start',
                                flex: hovered === cat.label ? '2 0 0' : '1 0 0',
                                transition: 'flex 0.4s ease, height 0.4s ease',
                            }}
                            onMouseEnter={() => setHovered(cat.label)}
                            onMouseLeave={() => setHovered(null)}
                        >
                            <img
                                src={cat.image}
                                alt={cat.label}
                                className={styles.catImageDesktop}
                                style={{ transform: hovered === cat.label ? 'scale(1.05)' : 'scale(1)' }}
                            />
                            <div className={styles.captionDesktop}>
                                <p className={styles.captionText}>{cat.label}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    )
}

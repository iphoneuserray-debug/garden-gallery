import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ShoppingCart, Menu, ChevronDown } from 'lucide-react'
import NavDrawer from './NavDrawer'
import CartDrawer from './CartDrawer'
import { useCart } from '@/context/CartContext'
import Caution from './Caution'
import { EVENT_TYPES, FLOWER_TYPES } from '@/lib/navLinks'
import styles from './Header.module.css'

export default function Header() {
    const { pathname } = useLocation()
    const { cartCount } = useCart()
    const [cartOpen, setCartOpen] = useState(false)
    const [navOpen, setNavOpen] = useState(false)
    const [cautionVisible, setCautionVisible] = useState(true)
    const [badgeKey, setBadgeKey] = useState(0)
    const prevCount = useRef(cartCount)
    const lastScrollY = useRef(0)
    const isHome = pathname === '/'

    useEffect(() => {
        if (cartCount > prevCount.current) setBadgeKey(k => k + 1)
        prevCount.current = cartCount
    }, [cartCount])

    useEffect(() => {
        setCautionVisible(true)
        lastScrollY.current = window.scrollY
    }, [pathname])

    useEffect(() => {
        const onScroll = () => {
            const y = window.scrollY
            if (y > lastScrollY.current && y > 50) {
                setCautionVisible(false)
            } else if (y < lastScrollY.current) {
                setCautionVisible(true)
            }
            lastScrollY.current = y
        }
        window.addEventListener('scroll', onScroll, { passive: true })
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    const stackHidden = isHome && !cautionVisible

    const CartButton = ({ className = '' }: { className?: string }) => (
        <button
            onClick={() => setCartOpen(true)}
            className={`${styles.cartButton} ${className}`}
        >
            <ShoppingCart className={styles.cartIcon} strokeWidth={2} strokeLinecap="square" strokeLinejoin="miter" />
            {cartCount > 0 && (
                <span key={badgeKey} className={`cart-pop ${styles.badge}`}>
                    {cartCount}
                </span>
            )}
        </button>
    )

    return (
        <>
            <div
                className={styles.stack}
                style={{ transform: stackHidden ? 'translateY(-100%)' : 'translateY(0)' }}
            >
                <header className={styles.header}>
                    {/* Desktop nav */}
                    <div className={styles.desktopNav}>
                        <Link to="/" className={styles.logoLink}>
                            <img src="/logo.jpg" alt="Garden Gallery" className={styles.logoImg} />
                            <span className={styles.logoText}>Garden Gallery</span>
                        </Link>

                        <nav className={styles.navList}>
                            <Link to="/" className={styles.navLink}>Home</Link>
                            <Link to="/products" className={styles.navLink}>Shop All</Link>

                            <div className={styles.dropdown}>
                                <button className={styles.dropdownButton}>
                                    Occasion <ChevronDown size={14} />
                                </button>
                                <div className={styles.dropdownMenu}>
                                    {EVENT_TYPES.map(l => (
                                        <Link key={l.href} to={l.href} className={styles.dropdownItem}>
                                            {l.label}
                                        </Link>
                                    ))}
                                </div>
                            </div>

                            <div className={styles.dropdown}>
                                <button className={styles.dropdownButton}>
                                    Flower Type <ChevronDown size={14} />
                                </button>
                                <div className={styles.dropdownMenu}>
                                    {FLOWER_TYPES.map(l => (
                                        <Link key={l.href} to={l.href} className={styles.dropdownItem}>
                                            {l.label}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </nav>

                        <CartButton className={styles.cartButtonDesktop} />
                    </div>

                    {/* Mobile nav */}
                    <div className={styles.mobileNav}>
                        <button
                            onClick={() => setNavOpen(true)}
                            className={styles.menuButton}
                        >
                            <Menu className={styles.menuIcon} strokeWidth={2} />
                            <span className={styles.menuLabel}>Menu</span>
                        </button>

                        <Link to="/" className={styles.mobileLogoLink}>
                            <img src="/logo.jpg" alt="Garden Gallery" className={styles.logoImg} />
                        </Link>

                        <CartButton />
                    </div>
                </header>

                {isHome && <Caution>Pick Up Only at Melbourne Center Every Tuesday</Caution>}
            </div>

            {/* Spacer so page content doesn't start behind the fixed header (+ caution bar on home) */}
            <div className={styles.spacer} style={{ marginTop: isHome ? '36px' : '0px' }} />

            <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
            <NavDrawer open={navOpen} onClose={() => setNavOpen(false)} />
        </>
    )
}

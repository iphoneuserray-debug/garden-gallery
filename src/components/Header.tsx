import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { ShoppingCart, Menu, ChevronDown, Search } from 'lucide-react'
import NavDrawer from './NavDrawer'
import CartDrawer from './CartDrawer'
import { useCart } from '@/context/CartContext'
import Caution from './Caution'
import { EVENT_TYPES, FLOWER_TYPES } from '@/lib/navLinks'
import styles from './Header.module.css'

export default function Header() {
    const { pathname } = useLocation()
    const navigate = useNavigate()
    const { cartCount } = useCart()
    const [cartOpen, setCartOpen] = useState(false)
    const [navOpen, setNavOpen] = useState(false)
    const [searchOpen, setSearchOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const [badgeKey, setBadgeKey] = useState(0)
    const prevCount = useRef(cartCount)
    const searchRef = useRef<HTMLDivElement>(null)
    const isHome = pathname === '/'

    useEffect(() => {
        if (cartCount > prevCount.current) setBadgeKey(k => k + 1)
        prevCount.current = cartCount
    }, [cartCount])

    useEffect(() => {
        if (!searchOpen) return
        const onClickOutside = (e: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
                setSearchOpen(false)
            }
        }
        document.addEventListener('mousedown', onClickOutside)
        return () => document.removeEventListener('mousedown', onClickOutside)
    }, [searchOpen])

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        const q = searchQuery.trim()
        if (!q) return
        navigate(`/products?q=${encodeURIComponent(q)}`)
        setSearchQuery('')
        setSearchOpen(false)
    }

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
            <div className={styles.stack}>
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

                        <div className={styles.searchWrap} ref={searchRef}>
                            <button
                                onClick={() => setSearchOpen(v => !v)}
                                className={styles.searchToggle}
                                aria-label="Toggle search"
                            >
                                <Search className={styles.searchIcon} strokeWidth={2} strokeLinecap="square" strokeLinejoin="miter" />
                            </button>
                            <div className={`${styles.searchDropdown} ${searchOpen ? styles.searchDropdownOpen : ''}`}>
                                <form onSubmit={handleSearch} className={styles.searchDropdownForm}>
                                    <input
                                        type="search"
                                        value={searchQuery}
                                        onChange={e => setSearchQuery(e.target.value)}
                                        placeholder="Search..."
                                        autoFocus={searchOpen}
                                        className={styles.searchDropdownInput}
                                    />
                                    <button type="submit" className={styles.searchDropdownSubmit} aria-label="Submit search">
                                        <Search size={14} strokeWidth={2} />
                                    </button>
                                </form>
                            </div>
                        </div>

                        <CartButton className={styles.cartButtonDesktop} />
                    </div>

                    {/* Mobile nav */}
                    <div className={styles.mobileNav}>
                        <button
                            onClick={() => setNavOpen(true)}
                            className={styles.menuButton}
                        >
                            <Menu className={styles.menuIcon} strokeWidth={2} />
                        </button>

                        <Link to="/" className={styles.mobileLogoLink}>
                            <img src="/logo.jpg" alt="Garden Gallery" className={styles.logoImg} />
                        </Link>

                        <CartButton />
                    </div>
                </header>
            </div>

            {isHome && <Caution>Pick Up Only at Melbourne Center Every Tuesday</Caution>}

            <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
            <NavDrawer open={navOpen} onClose={() => setNavOpen(false)} />
        </>
    )
}

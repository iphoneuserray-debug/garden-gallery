import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ShoppingCart, Menu, ChevronDown } from 'lucide-react'
import NavDrawer from './NavDrawer'
import CartDrawer from './CartDrawer'
import { useCart } from '@/context/CartContext'
import Caution from './Caution'
import { EVENT_TYPES, FLOWER_TYPES } from '@/lib/navLinks'

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
            className={`relative flex items-center justify-center hover:opacity-50 transition-opacity ${className}`}
        >
            <ShoppingCart className="h-6 w-6" strokeWidth={2} strokeLinecap="square" strokeLinejoin="miter" />
            {cartCount > 0 && (
                <span key={badgeKey} className="cart-pop absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 flex items-center justify-center bg-black text-white text-xs font-bold shadow">
                    {cartCount}
                </span>
            )}
        </button>
    )

    return (
        <>
            <div
                className="fixed top-0 left-0 z-[100] w-full transition-transform duration-300"
                style={{ transform: stackHidden ? 'translateY(-100%)' : 'translateY(0)' }}
            >
                {isHome && <Caution>Pick Up Only at Melbourne Center Every Tuesday</Caution>}

                <header className="w-full bg-white border-b border-black/10">
                    {/* Desktop nav */}
                    <div className="hidden md:flex items-center justify-between px-6 h-20 max-w-[1440px] mx-auto">
                        <Link to="/" className="flex items-center gap-3 hover:opacity-70 transition-opacity shrink-0">
                            <img src="/logo.jpg" alt="Garden Gallery" className="h-10 w-10 object-cover rounded-full" />
                            <span className="font-black uppercase tracking-tight text-lg leading-none">Garden Gallery</span>
                        </Link>

                        <nav className="flex items-center gap-8">
                            <Link to="/" className="text-sm font-bold uppercase tracking-wide text-gray-900 hover:text-gray-500 transition-colors">Home</Link>
                            <Link to="/products" className="text-sm font-bold uppercase tracking-wide text-gray-900 hover:text-gray-500 transition-colors">Shop All</Link>

                            <div className="relative group">
                                <button className="flex items-center gap-1 text-sm font-bold uppercase tracking-wide text-gray-900 hover:text-gray-500 transition-colors py-6">
                                    Occasion <ChevronDown size={14} />
                                </button>
                                <div className="invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-opacity absolute left-0 top-full w-48 bg-white border border-black/10 shadow-lg py-2">
                                    {EVENT_TYPES.map(l => (
                                        <Link key={l.href} to={l.href} className="block px-4 py-2 text-sm text-gray-700 hover:bg-black/5 transition-colors">
                                            {l.label}
                                        </Link>
                                    ))}
                                </div>
                            </div>

                            <div className="relative group">
                                <button className="flex items-center gap-1 text-sm font-bold uppercase tracking-wide text-gray-900 hover:text-gray-500 transition-colors py-6">
                                    Flower Type <ChevronDown size={14} />
                                </button>
                                <div className="invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-opacity absolute left-0 top-full w-48 bg-white border border-black/10 shadow-lg py-2">
                                    {FLOWER_TYPES.map(l => (
                                        <Link key={l.href} to={l.href} className="block px-4 py-2 text-sm text-gray-700 hover:bg-black/5 transition-colors">
                                            {l.label}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </nav>

                        <CartButton className="w-10 h-10 shrink-0" />
                    </div>

                    {/* Mobile nav */}
                    <div className="flex md:hidden items-center justify-between px-4 h-16 relative">
                        <button
                            onClick={() => setNavOpen(true)}
                            className="flex flex-col items-center justify-center gap-0.5 hover:opacity-60 transition-opacity"
                        >
                            <Menu className="h-6 w-6 text-gray-900" strokeWidth={2} />
                            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-900">Menu</span>
                        </button>

                        <Link to="/" className="absolute left-1/2 -translate-x-1/2 hover:opacity-70 transition-opacity">
                            <img src="/logo.jpg" alt="Garden Gallery" className="h-10 w-10 object-cover rounded-full" />
                        </Link>

                        <CartButton />
                    </div>
                </header>
            </div>

            {/* Spacer so page content doesn't start behind the fixed header (+ caution bar on home) */}
            <div className="h-16 md:h-20" style={{ marginTop: isHome ? '36px' : '0px' }} />

            <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
            <NavDrawer open={navOpen} onClose={() => setNavOpen(false)} />
        </>
    )
}

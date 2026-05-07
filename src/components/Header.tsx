import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ShoppingCart, Menu } from 'lucide-react'
import NavDrawer from './NavDrawer'
import CartDrawer from './CartDrawer'
import { useCart } from '@/context/CartContext'
import Caution from './Caution'

export default function Header() {
    const { pathname } = useLocation()
    const { cartCount } = useCart()
    const [cartOpen, setCartOpen] = useState(false)
    const [navOpen, setNavOpen] = useState(false)
    const isHome = pathname === '/'

    return (
        <>
            {isHome && <Caution>Pick Up Only at Melbourne Center Every Tuesday</Caution>}

            {/* Logo — only on non-home pages */}
            {!isHome && (
                <Link
                    to="/"
                    className="fixed hover:opacity-70 transition-opacity z-[40]"
                    style={{ top: '8px', left: '16px' }}
                >
                    <img src="/logo.jpg" alt="Garden Gallery" className="h-16 w-16 object-cover rounded-full" />
                </Link>
            )}

            {/* Right-side icons */}
            <div
                className="fixed right-0 flex items-center px-4 py-2 z-[100] pointer-events-none"
                style={{ top: isHome ? '36px' : '8px' }}
            >
                <div className="flex items-center gap-1 pointer-events-auto">
                    {/* Cart */}
                    <button
                        onClick={() => setCartOpen(true)}
                        className="relative flex items-center justify-center w-10 h-10 hover:opacity-50 transition-opacity"
                    >
                        <ShoppingCart className="h-8 w-8" strokeWidth={2} strokeLinecap="square" strokeLinejoin="miter" />
                        {cartCount > 0 && (
                            <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 flex items-center justify-center bg-black text-white text-xs font-bold shadow">
                                {cartCount}
                            </span>
                        )}
                    </button>

                    {/* Hamburger */}
                    <button
                        onClick={() => setNavOpen(true)}
                        className="flex items-center justify-center w-10 h-10 hover:opacity-50 transition-opacity"
                    >
                        <Menu className="h-8 w-8 text-gray-900" strokeWidth={2} strokeLinecap="square" strokeLinejoin="miter" />
                    </button>
                </div>
            </div>

            {/* Spacer so content doesn't start behind header */}
            <div style={{ height: isHome ? '36px' : '52px' }} />

            <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
            <NavDrawer open={navOpen} onClose={() => setNavOpen(false)} />
        </>
    )
}

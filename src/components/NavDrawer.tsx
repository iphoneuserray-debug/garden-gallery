import { useState } from 'react'
import { createPortal } from 'react-dom'
import { Link } from 'react-router-dom'
import { X, User, Search, ChevronUp, ChevronDown } from 'lucide-react'

interface DrawerProps {
    open: boolean
    onClose: () => void
    children: React.ReactNode
}

export function Drawer({ open, onClose, children }: DrawerProps) {
    return createPortal(
        <>
            <div
                className="fixed inset-0 z-[105] bg-black/40 transition-opacity duration-300"
                style={{ opacity: open ? 1 : 0, pointerEvents: open ? 'auto' : 'none' }}
                onClick={onClose}
            />
            <div
                className="fixed top-0 right-0 z-[110] h-screen w-80 transition-transform duration-300 ease-in-out flex flex-col"
                style={{ transform: open ? 'translateX(0)' : 'translateX(100%)' }}
            >
                {children}
            </div>
        </>,
        document.body,
    )
}

const EVENT_TYPES = [
    { label: 'Wedding', href: '/products/wedding' },
    { label: 'Birthday', href: '/products/birthday' },
    { label: 'Anniversary', href: '/products/anniversary' },
    { label: 'Corporate', href: '/products/corporate' },
    { label: 'Funeral', href: '/products/funeral' },
]

const FLOWER_TYPES = [
    { label: 'Rose', href: '/products/rose' },
    { label: 'Tulip', href: '/products/tulip' },
    { label: 'Lily', href: '/products/lily' },
    { label: 'Sunflower', href: '/products/sunflower' },
    { label: 'Orchid', href: '/products/orchid' },
    { label: 'Daisy', href: '/products/daisy' },
    { label: 'Peony', href: '/products/peony' },
]

interface NavDrawerProps {
    open: boolean
    onClose: () => void
}

export default function NavDrawer({ open, onClose }: NavDrawerProps) {
    const [eventOpen, setEventOpen] = useState(false)
    const [flowerOpen, setFlowerOpen] = useState(false)

    return (
        <Drawer open={open} onClose={onClose}>
            <div className="bg-black flex flex-col h-full px-8 py-8 overflow-y-auto">
                <div className="mb-10 flex items-start justify-between">
                    <h1
                        className="font-black text-white uppercase leading-none"
                        style={{ fontSize: 'clamp(22px, 3vw, 28px)', letterSpacing: '-0.01em' }}
                    >
                        Garden<br />Gallery
                    </h1>
                    <button
                        onClick={onClose}
                        className="text-white/50 hover:text-white transition-colors mt-1"
                        aria-label="Close navigation menu"
                    >
                        <X size={20} strokeWidth={1.5} />
                    </button>
                </div>

                {/* Search */}
                <div className="mb-8">
                    <div className="flex items-center gap-2 border-b border-white/20 pb-2">
                        <Search size={14} className="text-white/40" strokeWidth={1.5} />
                        <input
                            type="search"
                            placeholder="Search..."
                            className="bg-transparent text-white placeholder-white/30 text-sm uppercase tracking-widest font-bold outline-none w-full"
                        />
                    </div>
                </div>

                {/* Nav links */}
                <nav className="flex flex-col gap-5 bg-black min-h-full">
                    {[
                        { label: 'Home', href: '/' },
                        { label: 'Shop All', href: '/products' },
                        { label: 'Events', href: '/events' },
                    ].map(l => (
                        <Link
                            key={l.href}
                            to={l.href}
                            onClick={onClose}
                            className="text-white hover:text-white/70 transition-colors uppercase tracking-widest font-black"
                            style={{ fontSize: 'clamp(18px, 2.5vw, 22px)' }}
                        >
                            {l.label}
                        </Link>
                    ))}

                    {/* Event Types collapsible */}
                    <div>
                        <button
                            onClick={() => setEventOpen(v => !v)}
                            className="flex items-center justify-between w-full text-white uppercase tracking-widest font-black hover:text-white/70 transition-colors"
                            style={{ fontSize: 'clamp(18px, 2.5vw, 22px)' }}
                        >
                            <span>Event Types</span>
                            {eventOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </button>
                        {eventOpen && (
                            <div className="mt-3 border-l border-white/20 pl-4 flex flex-col gap-2">
                                {EVENT_TYPES.map(l => (
                                    <Link
                                        key={l.href}
                                        to={l.href}
                                        onClick={onClose}
                                        className="block py-1 text-white/60 hover:text-white transition-colors uppercase tracking-widest text-sm font-bold"
                                    >
                                        {l.label}
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Flower Types collapsible */}
                    <div>
                        <button
                            onClick={() => setFlowerOpen(v => !v)}
                            className="flex items-center justify-between w-full text-white uppercase tracking-widest font-black hover:text-white/70 transition-colors"
                            style={{ fontSize: 'clamp(18px, 2.5vw, 22px)' }}
                        >
                            <span>Flower Types</span>
                            {flowerOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </button>
                        {flowerOpen && (
                            <div className="mt-3 border-l border-white/20 pl-4 flex flex-col gap-2">
                                {FLOWER_TYPES.map(l => (
                                    <Link
                                        key={l.href}
                                        to={l.href}
                                        onClick={onClose}
                                        className="block py-1 text-white/60 hover:text-white transition-colors uppercase tracking-widest text-sm font-bold"
                                    >
                                        {l.label}
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                </nav>

                <div className="mt-auto border-t border-white/10 pt-6">
                    <Link
                        to="/login"
                        onClick={onClose}
                        className="flex items-center gap-3 text-white/60 hover:text-white transition-colors uppercase tracking-widest text-sm font-bold"
                    >
                        <User size={16} />
                        <span>Account</span>
                    </Link>
                </div>
            </div>
        </Drawer>
    )
}

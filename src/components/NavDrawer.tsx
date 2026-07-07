import { useState } from 'react'
import { createPortal } from 'react-dom'
import { Link, useNavigate } from 'react-router-dom'
import { X, User, Search, ChevronUp, ChevronDown } from 'lucide-react'
import { EVENT_TYPES, FLOWER_TYPES } from '@/lib/navLinks'
import styles from './NavDrawer.module.css'

interface DrawerProps {
    open: boolean
    onClose: () => void
    children: React.ReactNode
    side?: 'left' | 'right'
}

export function Drawer({ open, onClose, children, side = 'right' }: DrawerProps) {
    const sideClass = side === 'left' ? styles.panelLeft : styles.panelRight
    const closedTransform = side === 'left' ? 'translateX(-100%)' : 'translateX(100%)'
    return createPortal(
        <>
            <div
                className={styles.overlay}
                style={{ opacity: open ? 1 : 0, pointerEvents: open ? 'auto' : 'none' }}
                onClick={onClose}
            />
            <div
                className={`${styles.panel} ${sideClass}`}
                style={{ transform: open ? 'translateX(0)' : closedTransform }}
            >
                {children}
            </div>
        </>,
        document.body,
    )
}

interface NavDrawerProps {
    open: boolean
    onClose: () => void
}

export default function NavDrawer({ open, onClose }: NavDrawerProps) {
    const [eventOpen, setEventOpen] = useState(false)
    const [flowerOpen, setFlowerOpen] = useState(false)
    const [query, setQuery] = useState('')
    const navigate = useNavigate()

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        const q = query.trim()
        if (!q) return
        navigate(`/products?q=${encodeURIComponent(q)}`)
        setQuery('')
        onClose()
    }

    return (
        <Drawer open={open} onClose={onClose} side="left">
            <div className={styles.content}>
                <div className={styles.headerRow}>
                    <h1 className={styles.title}>
                        Garden<br />Gallery
                    </h1>
                    <button
                        onClick={onClose}
                        className={styles.closeButton}
                        aria-label="Close navigation menu"
                    >
                        <X size={20} strokeWidth={1.5} />
                    </button>
                </div>

                {/* Search */}
                <form onSubmit={handleSearch} className={styles.searchForm}>
                    <div className={styles.searchRow}>
                        <button type="submit" className={styles.searchButton}>
                            <Search size={14} className={styles.searchIcon} strokeWidth={1.5} />
                        </button>
                        <input
                            type="search"
                            value={query}
                            onChange={e => setQuery(e.target.value)}
                            placeholder="Search..."
                            className={styles.searchInput}
                        />
                    </div>
                </form>

                {/* Nav links */}
                <nav className={styles.nav}>
                    {[
                        { label: 'Home', href: '/' },
                        { label: 'Shop All', href: '/products' },
                    ].map(l => (
                        <Link
                            key={l.href}
                            to={l.href}
                            onClick={onClose}
                            className={styles.navLink}
                        >
                            {l.label}
                        </Link>
                    ))}

                    {/* Event Types collapsible */}
                    <div>
                        <button
                            onClick={() => setEventOpen(v => !v)}
                            className={styles.collapsibleButton}
                        >
                            <span>Event Types</span>
                            {eventOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </button>
                        {eventOpen && (
                            <div className={styles.collapsibleList}>
                                {EVENT_TYPES.map(l => (
                                    <Link
                                        key={l.href}
                                        to={l.href}
                                        onClick={onClose}
                                        className={styles.collapsibleLink}
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
                            className={styles.collapsibleButton}
                        >
                            <span>Flower Types</span>
                            {flowerOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </button>
                        {flowerOpen && (
                            <div className={styles.collapsibleList}>
                                {FLOWER_TYPES.map(l => (
                                    <Link
                                        key={l.href}
                                        to={l.href}
                                        onClick={onClose}
                                        className={styles.collapsibleLink}
                                    >
                                        {l.label}
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                </nav>

                <div className={styles.footer}>
                    <Link
                        to="/login"
                        onClick={onClose}
                        className={styles.accountLink}
                    >
                        <User size={16} />
                        <span>Account</span>
                    </Link>
                </div>
            </div>
        </Drawer>
    )
}

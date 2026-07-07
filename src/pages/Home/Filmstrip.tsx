import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import styles from './Filmstrip.module.css'

interface FilmstripProduct {
    handle: string
    src: string
    name: string
    price: string
}

interface FilmstripProps {
    products: FilmstripProduct[]
    className?: string
}

export default function Filmstrip({ products, className = '' }: FilmstripProps) {
    const ref = useRef<HTMLDivElement>(null)
    const isDragging = useRef(false)
    const didDrag = useRef(false)
    const startX = useRef(0)
    const scrollLeft = useRef(0)

    // Triple the products for infinite loop
    const items = [...products, ...products, ...products]

    // Auto-scroll via rAF
    useEffect(() => {
        const el = ref.current
        if (!el) return
        let raf: number
        const tick = () => {
            if (!isDragging.current) {
                el.scrollLeft += 0.5
                const third = el.scrollWidth / 3
                if (el.scrollLeft >= third * 2) el.scrollLeft -= third
                if (el.scrollLeft <= 0) el.scrollLeft += third
            }
            raf = requestAnimationFrame(tick)
        }
        raf = requestAnimationFrame(tick)
        return () => cancelAnimationFrame(raf)
    }, [])

    const onMouseDown = (e: React.MouseEvent) => {
        isDragging.current = true
        didDrag.current = false
        startX.current = e.pageX - (ref.current?.offsetLeft ?? 0)
        scrollLeft.current = ref.current?.scrollLeft ?? 0
    }

    const onMouseMove = (e: React.MouseEvent) => {
        if (!isDragging.current) return
        const delta = e.pageX - (ref.current?.offsetLeft ?? 0) - startX.current
        if (Math.abs(delta) > 4) didDrag.current = true
        if (ref.current) ref.current.scrollLeft = scrollLeft.current - delta
    }

    const stopDrag = () => { isDragging.current = false }

    return (
        <div
            ref={ref}
            className={`filmstrip-height ${styles.track} ${className}`}
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' } as React.CSSProperties}
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={stopDrag}
            onMouseLeave={stopDrag}
        >
            {items.map((p, i) => (
                <Link
                    key={i}
                    to={`/detail/${p.handle}`}
                    className={`filmstrip-card group ${styles.card}`}
                    style={{ marginRight: '2px' }}
                    draggable={false}
                    onClick={e => { if (didDrag.current) e.preventDefault() }}
                >
                    <img
                        src={p.src}
                        alt={p.name}
                        draggable={false}
                        className={styles.image}
                    />
                    {/* Dark overlay on hover */}
                    <div className={styles.overlay} />
                    {/* Persistent gradient */}
                    <div
                        className={styles.gradient}
                        style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.35) 0%, transparent 40%, transparent 60%, rgba(0,0,0,0.45) 100%)' }}
                    />
                    {/* Name slides from top */}
                    <div className={`filmstrip-info-top ${styles.infoTop}`}>
                        <span className={styles.name}>{p.name}</span>
                    </div>
                    {/* Price slides from bottom */}
                    <div className={`filmstrip-info-bottom ${styles.infoBottom}`}>
                        <span className={styles.price}>{p.price}</span>
                    </div>
                </Link>
            ))}
        </div>
    )
}

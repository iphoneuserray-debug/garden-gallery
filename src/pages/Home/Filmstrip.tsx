import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'

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
            className={`filmstrip-height w-full flex overflow-x-auto cursor-grab active:cursor-grabbing select-none ${className}`}
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
                    className="filmstrip-card overflow-hidden group relative flex-shrink-0"
                    style={{ marginRight: '2px' }}
                    draggable={false}
                    onClick={e => { if (didDrag.current) e.preventDefault() }}
                >
                    <img
                        src={p.src}
                        alt={p.name}
                        draggable={false}
                        className="w-full h-full object-cover transition-transform duration-500 ease-out"
                    />
                    {/* Dark overlay on hover */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                    {/* Persistent gradient */}
                    <div
                        className="absolute inset-0"
                        style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.35) 0%, transparent 40%, transparent 60%, rgba(0,0,0,0.45) 100%)' }}
                    />
                    {/* Name slides from top */}
                    <div className="filmstrip-info-top absolute top-0 left-0 right-0 px-3 pt-3 transition-transform duration-300 ease-out">
                        <span className="text-white font-semibold text-base tracking-wide drop-shadow">{p.name}</span>
                    </div>
                    {/* Price slides from bottom */}
                    <div className="filmstrip-info-bottom absolute bottom-0 left-0 right-0 px-3 pb-3 transition-transform duration-300 ease-out">
                        <span className="text-white font-bold text-lg drop-shadow">{p.price}</span>
                    </div>
                </Link>
            ))}
        </div>
    )
}

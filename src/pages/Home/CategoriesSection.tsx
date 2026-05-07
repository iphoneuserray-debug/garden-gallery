import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'

const CATEGORIES = [
    { label: 'Wedding', image: '/category/wedding.jpg', href: '/products/Wedding' },
    { label: 'Birthday', image: '/category/birthday.jpg', href: '/products/Birthday' },
    { label: 'Anniversary', image: 'https://picsum.photos/seed/cat-anniversary/300/700', href: '/products/Anniversary' },
    { label: 'Rose', image: '/category/rose.jpg', href: '/products/Rose' },
    { label: 'Tulip', image: '/category/tulip.jpg', href: '/products/Tulip' },
    { label: 'Lily', image: '/category/lily.jpg', href: '/products/Lily' },
]

const QUICK_LINKS = [
    { label: 'Shop All', href: '/products' },
    { label: 'Subscription', href: '/products/subscription' },
    { label: 'Contact Us', href: '/contact' },
]

export default function CategoriesSection() {
    const [hovered, setHovered] = useState<string | null>(null)

    const links = (
        <div className="flex flex-col gap-3">
            {QUICK_LINKS.map(l => (
                <Link
                    key={l.href}
                    to={l.href}
                    className="group self-start"
                >
                    <span className="flex items-center gap-1 font-bold tracking-widest uppercase transition-all duration-200 group-hover:opacity-60 text-nav">
                        {l.label}
                        <ArrowUpRight size={16} className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" strokeWidth={2.5} />
                    </span>
                    <span className="block h-px bg-black/40 mt-0.5 transition-all duration-300 group-hover:bg-black" />
                </Link>
            ))}
        </div>
    )

    return (
        <section
            className="w-full flex flex-col overflow-hidden"
            style={{ height: '100vh', scrollSnapAlign: 'start', paddingTop: 'clamp(16px, 4vh, 48px)' }}
        >
            <h2 className="title-page shrink-0 px-4 lg:px-0">園藝廊</h2>

            {/* Mobile layout */}
            <div className="lg:hidden flex flex-col flex-1 min-h-0 px-4 pt-3 pb-8">
                <div
                    className="grid grid-cols-2 gap-1 flex-1 min-h-0"
                    style={{ gridTemplateRows: `repeat(${Math.ceil(CATEGORIES.length / 2)}, 1fr)` }}
                >
                    {CATEGORIES.map(cat => (
                        <Link key={cat.label} to={cat.href} className="relative overflow-hidden">
                            <img src={cat.image} alt={cat.label} className="absolute inset-0 w-full h-full object-cover" />
                            <div className="absolute bottom-0 left-0 right-0 px-2 pt-6 pb-2 bg-gradient-to-t from-black/70 to-transparent">
                                <p className="text-white font-normal tracking-widest uppercase text-xs">{cat.label}</p>
                            </div>
                        </Link>
                    ))}
                </div>
                <div className="shrink-0 pt-4">{links}</div>
            </div>

            {/* Desktop layout */}
            <div className="hidden lg:block relative w-full h-full">
                <div className="absolute z-30" style={{ left: '4%', top: '40vh' }}>
                    {links}
                </div>
                <div
                    className="absolute flex gap-1 overflow-hidden"
                    style={{ left: '28%', right: 0, bottom: '6vh', height: '80vh', alignItems: 'stretch' }}
                >
                    {CATEGORIES.map((cat, i) => (
                        <Link
                            key={cat.label}
                            to={cat.href}
                            className="relative overflow-hidden"
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
                                className="w-full h-full object-cover transition-transform duration-500"
                                style={{ transform: hovered === cat.label ? 'scale(1.05)' : 'scale(1)' }}
                            />
                            <div className="absolute bottom-0 left-0 right-0 px-3 pt-8 pb-3 bg-gradient-to-t from-black/70 to-transparent">
                                <p className="text-white font-normal tracking-widest uppercase text-xs">{cat.label}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    )
}

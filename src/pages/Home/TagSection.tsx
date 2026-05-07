import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'

const FALLBACK_IMAGES: Record<string, string> = {
    Wedding: '/category/wedding.jpg',
    Birthday: '/category/birthday.jpg',
    Anniversary: '/example/43a5a17e515c008f24f43a2935dc74.JPG',
    Corporate: '/example/5467e37f7dda2d994c8758315267dc.JPG',
    Funeral: '/example/cc1859a0ad9e4b29ea6e26cb722570.JPG',
    Rose: '/category/rose.jpg',
    Tulip: '/category/tulip.jpg',
    Lily: '/category/lily.jpg',
    Sunflower: '/category/orchid.jpg',
}

function getImage(label: string, tagImages: Record<string, string>): string {
    const lower = label.toLowerCase()
    const key = Object.keys(tagImages).find(k => k.includes(lower) || lower.includes(k))
    if (key) return tagImages[key]
    return FALLBACK_IMAGES[label] ?? `https://picsum.photos/seed/${label}/400/600`
}

interface TagSectionProps {
    title: string
    subCategories: string[]
    tagImages: Record<string, string>
    reverse?: boolean
    showContact?: boolean
}

export default function TagSection({ title, subCategories, tagImages, reverse = false, showContact = false }: TagSectionProps) {
    const items = subCategories.map(label => ({
        label,
        href: `/products/${label.toLowerCase()}`,
        image: getImage(label, tagImages),
    }))

    const [activeIdx, setActiveIdx] = useState(0)

    useEffect(() => {
        const id = setInterval(() => setActiveIdx(i => (i + 1) % items.length), 3000)
        return () => clearInterval(id)
    }, [items.length])

    return (
        <section
            className="w-full flex flex-col"
            style={{ height: '100vh', scrollSnapAlign: 'start' }}
        >
            <div className="shrink-0 px-6 lg:px-8 pt-16">
                <h2 className="title-section">{title}</h2>
            </div>

            <div className={`flex flex-1 min-h-0 flex-col m-3 lg:items-center lg:px-8 lg:pb-8 lg:gap-8 ${reverse ? 'lg:flex-row-reverse' : 'lg:flex-row'}`}>
                {/* Image */}
                <div className="relative overflow-hidden h-[40vh] lg:h-[65vh] lg:flex-1">
                    {items.map((item, i) => (
                        <img
                            key={item.label}
                            src={item.image}
                            alt={item.label}
                            className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700"
                            style={{ opacity: activeIdx === i ? 1 : 0, objectPosition: 'center 30%' }}
                        />
                    ))}
                </div>

                {/* Links */}
                <div className="m-3 lg:w-[36%] overflow-auto">
                    <p className="text-xs tracking-[0.25em] uppercase text-black/40 mb-2 lg:mb-4">
                        Shop by {title}
                    </p>
                    {items.map(item => (
                        <div key={item.label}>
                            <div className="w-full h-px bg-black/15" />
                            <Link
                                to={item.href}
                                className="block py-3 lg:py-4 hover:opacity-60 transition-opacity duration-200"
                            >
                                <h3 className="title-item">{item.label}</h3>
                            </Link>
                        </div>
                    ))}
                    <div className="w-full h-px bg-black/15" />

                    {showContact && (
                        <div className="mt-4">
                            <Link to="/contact" className="group self-start inline-flex">
                                <span className="flex items-center gap-1 font-bold tracking-widest uppercase transition-all duration-200 group-hover:opacity-60 text-nav">
                                    Custom Order
                                    <ArrowUpRight size={16} strokeWidth={2.5} />
                                </span>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </section>
    )
}

import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Minus, Plus, Heart, Share2 } from 'lucide-react'
import { toast } from 'sonner'
import { fetchProductByHandle } from '@/lib/api'
import type { Product } from '@/lib/api'
import { useCart } from '@/context/CartContext'
import { Crumb } from '@/components/Crumb'

function ImageGallery({ images }: { images: { src: string; alt: string }[] }) {
    const [selected, setSelected] = useState(0)

    return (
        <div className="flex flex-col-reverse lg:flex-row-reverse gap-2 h-full">
            {/* Thumbnail strip */}
            <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-x-visible lg:overflow-y-auto lg:w-20 lg:shrink-0">
                {images.map((img, i) => (
                    <button key={img.src} onClick={() => setSelected(i)} className="shrink-0 block">
                        <img
                            src={img.src}
                            alt={img.alt}
                            className={`object-cover transition-opacity w-16 h-16 lg:w-full lg:aspect-square ${
                                i === selected
                                    ? 'ring-1 ring-black ring-offset-1 opacity-100'
                                    : 'opacity-40 hover:opacity-80'
                            }`}
                        />
                    </button>
                ))}
            </div>
            {/* Main image */}
            <div className="flex-1 overflow-hidden aspect-[4/5] lg:aspect-auto">
                <img
                    src={images[selected]?.src}
                    alt={images[selected]?.alt}
                    className="w-full h-full object-cover cursor-zoom-in"
                />
            </div>
        </div>
    )
}

function NotFound() {
    return (
        <div className="flex min-h-[60vh] flex-col items-start justify-center gap-6">
            <div className="space-y-3">
                <p className="text-xs uppercase tracking-[0.3em] text-black/40">Product Not Found</p>
                <h1
                    className="font-light leading-none"
                    style={{ fontSize: 'clamp(40px, 7vw, 96px)', letterSpacing: '-0.03em' }}
                >
                    This arrangement is unavailable.
                </h1>
                <p className="max-w-xl text-sm leading-7 text-black/60">
                    The product you requested could not be found in the current catalogue. You can continue browsing our available flowers instead.
                </p>
            </div>
            <Link
                to="/products"
                className="inline-flex h-12 items-center justify-center bg-black px-6 text-xs font-bold uppercase tracking-widest text-white transition-colors hover:bg-black/80"
            >
                Browse Products
            </Link>
        </div>
    )
}

export default function Detail() {
    const { name } = useParams<{ name: string }>()
    const [qty, setQty] = useState(1)
    const [saved, setSaved] = useState(false)
    const [product, setProduct] = useState<Product | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const { addItem } = useCart()

    useEffect(() => {
        if (!name) { setLoading(false); return }
        fetchProductByHandle(name)
            .then(p => setProduct(p ?? null))
            .catch(e => setError(e.message))
            .finally(() => setLoading(false))
    }, [name])

    if (loading) return <p className="text-sm text-black/40 mt-8">Loading…</p>
    if (error) return <p className="text-sm text-red-500 mt-8">Error: {error}</p>
    if (!product) return <NotFound />

    const priceNum = product.priceNum ?? (Number(product.price.replace(/[^\d.]/g, '')) || 0)

    const handleAddToCart = () => {
        addItem({ id: product.id, title: product.title, handle: product.handle, price: priceNum, imgSrc: product.imgSrc, badge: product.badge }, qty)
        toast.success(`${product.title} added to cart`)
    }

    const handleShare = async () => {
        await navigator.clipboard.writeText(window.location.href)
        toast.success('Link copied')
    }

    const productInfo = (
        <div className="flex flex-col gap-5">
            <h1
                className="font-light leading-none"
                style={{ fontSize: 'clamp(36px, 5vw, 72px)', letterSpacing: '-0.02em' }}
            >
                {product.title}
            </h1>
            <p className="text-2xl font-light tracking-wide">${priceNum.toFixed(2)}</p>
            {product.badge && (
                <span className="self-start text-xs tracking-widest uppercase border border-black/20 px-2 py-1">
                    {product.badge}
                </span>
            )}
            <div className="w-full h-px bg-black/10" />
            <p className="font-light leading-relaxed text-black/60 text-sm">
                {product.description ?? 'A seasonal arrangement designed to feel generous, polished, and easy to gift.'}
            </p>
            <div className="w-full h-px bg-black/10" />
            <div className="flex items-center gap-4">
                <span className="text-xs tracking-widest uppercase text-black/40">Quantity</span>
                <div className="flex items-center border border-black/20">
                    <button
                        onClick={() => setQty(q => Math.max(1, q - 1))}
                        className="w-9 h-9 flex items-center justify-center hover:bg-black/5 transition-colors"
                    >
                        <Minus size={14} />
                    </button>
                    <input
                        type="text"
                        value={qty}
                        onChange={e => {
                            if (e.target.value === '') { setQty(1); return }
                            if (/^\d+$/.test(e.target.value)) setQty(Math.max(1, Number(e.target.value)))
                        }}
                        className="w-10 h-9 text-center text-sm bg-transparent border-x border-black/20 focus:outline-none"
                    />
                    <button
                        onClick={() => setQty(q => q + 1)}
                        className="w-9 h-9 flex items-center justify-center hover:bg-black/5 transition-colors"
                    >
                        <Plus size={14} />
                    </button>
                </div>
            </div>
            <div className="flex items-center gap-3 mt-2">
                <button
                    onClick={handleAddToCart}
                    className="flex-1 h-12 bg-black text-white text-xs font-bold tracking-widest uppercase hover:bg-black/80 transition-colors"
                >
                    Add to Cart
                </button>
                <button
                    onClick={() => setSaved(v => !v)}
                    className="w-12 h-12 border border-black/20 flex items-center justify-center hover:bg-black/5 transition-colors"
                >
                    <Heart size={18} fill={saved ? '#e00' : 'none'} color={saved ? '#e00' : 'currentColor'} />
                </button>
                <button
                    onClick={handleShare}
                    className="w-12 h-12 border border-black/20 flex items-center justify-center hover:bg-black/5 transition-colors"
                >
                    <Share2 size={18} />
                </button>
            </div>
        </div>
    )

    return (
        <div>
            {/* Mobile */}
            <div className="lg:hidden">
                <Crumb />
                <div className="flex flex-col gap-8 mt-4">
                    <div className="w-full">
                        <ImageGallery images={product.images} />
                    </div>
                    {productInfo}
                </div>
            </div>
            {/* Desktop */}
            <div className="hidden lg:flex items-start -mx-8">
                <div className="w-[55%] shrink-0 sticky top-0 h-screen overflow-hidden">
                    <ImageGallery images={product.images} />
                </div>
                <div className="flex-1 px-12 pt-2 flex flex-col gap-5">
                    <Crumb />
                    {productInfo}
                </div>
            </div>
        </div>
    )
}

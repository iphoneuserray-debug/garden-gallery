import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Minus, Plus, Share2 } from 'lucide-react'
import { toast } from 'sonner'
import { fetchProductByHandle } from '@/lib/api'
import type { Product } from '@/lib/api'
import { useCart } from '@/context/CartContext'
import { Crumb } from '@/components/Crumb'
import { Skeleton } from '@/components/ui/skeleton'
import styles from './Detail.module.css'

function ImageGallery({ images }: { images: { src: string; alt: string }[] }) {
    const [selected, setSelected] = useState(0)

    return (
        <div className={styles.gallery}>
            {/* Thumbnail strip */}
            <div className={styles.thumbStrip}>
                {images.map((img, i) => (
                    <button key={img.src} onClick={() => setSelected(i)} className={styles.thumbButton}>
                        <img
                            src={img.src}
                            alt={img.alt}
                            className={`${styles.thumbImage} ${i === selected ? styles.thumbImageActive : ''}`}
                        />
                    </button>
                ))}
            </div>
            {/* Main image */}
            <div className={styles.mainImageWrap}>
                <img
                    src={images[selected]?.src}
                    alt={images[selected]?.alt}
                    className={styles.mainImage}
                />
            </div>
        </div>
    )
}

function GallerySkeleton() {
    return (
        <div className={styles.gallery}>
            <div className={styles.thumbStrip}>
                {[0, 1].map(i => <Skeleton key={i} className={styles.skeletonThumb} />)}
            </div>
            <div className={styles.mainImageWrap}>
                <Skeleton className={styles.skeletonMainImage} />
            </div>
        </div>
    )
}

function InfoSkeleton() {
    return (
        <div className={styles.info}>
            <Skeleton className={styles.skeletonTitle} />
            <Skeleton className={styles.skeletonPrice} />
            <Skeleton className={styles.skeletonBadge} />
            <div className={styles.divider} />
            <Skeleton className={styles.skeletonDescLine} />
            <Skeleton className={styles.skeletonDescLineShort} />
            <div className={styles.divider} />
            <Skeleton className={styles.skeletonQty} />
            <div className={styles.skeletonActionsRow}>
                <Skeleton className={styles.skeletonAddToCart} />
                <Skeleton className={styles.skeletonShare} />
            </div>
        </div>
    )
}

function DetailSkeleton() {
    return (
        <div>
            {/* Mobile */}
            <div className={styles.mobileWrap}>
                <Skeleton className={styles.skeletonCrumb} />
                <div className={styles.mobileBody}>
                    <div className={styles.mobileGalleryWrap}>
                        <GallerySkeleton />
                    </div>
                    <InfoSkeleton />
                </div>
            </div>
            {/* Desktop */}
            <div className={styles.desktopWrap}>
                <div className={styles.desktopGalleryWrap}>
                    <GallerySkeleton />
                </div>
                <div className={styles.desktopInfoWrap}>
                    <Skeleton className={styles.skeletonCrumb} />
                    <InfoSkeleton />
                </div>
            </div>
        </div>
    )
}

function NotFound() {
    return (
        <div className={styles.notFound}>
            <div className={styles.notFoundText}>
                <p className={styles.notFoundLabel}>Product Not Found</p>
                <h1 className={styles.notFoundHeading}>
                    This arrangement is unavailable.
                </h1>
                <p className={styles.notFoundBody}>
                    The product you requested could not be found in the current catalogue. You can continue browsing our available flowers instead.
                </p>
            </div>
            <Link
                to="/products"
                className={styles.notFoundLink}
            >
                Browse Products
            </Link>
        </div>
    )
}

export default function Detail() {
    const { name } = useParams<{ name: string }>()
    const [qty, setQty] = useState(1)
    const [product, setProduct] = useState<Product | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const { addItem } = useCart()

    useEffect(() => {
        setLoading(true)
        setError(null)
        if (!name) { setLoading(false); return }
        fetchProductByHandle(name)
            .then(p => setProduct(p ?? null))
            .catch(e => setError(e.message))
            .finally(() => setLoading(false))
    }, [name])

    if (loading) return <DetailSkeleton />
    if (error) return <p className={styles.errorText}>Error: {error}</p>
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
        <div className={styles.info}>
            <h1 className={styles.title}>
                {product.title}
            </h1>
            <p className={styles.price}>${priceNum.toFixed(2)}</p>
            {product.badge && (
                <span className={styles.badge}>
                    {product.badge}
                </span>
            )}
            <div className={styles.divider} />
            <p className={styles.description}>
                {product.description ?? 'A seasonal arrangement designed to feel generous, polished, and easy to gift.'}
            </p>
            <div className={styles.divider} />
            <div className={styles.qtyRow}>
                <span className={styles.qtyLabel}>Quantity</span>
                <div className={styles.qtyControls}>
                    <button
                        onClick={() => setQty(q => Math.max(1, q - 1))}
                        className={styles.qtyButton}
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
                        className={styles.qtyInput}
                    />
                    <button
                        onClick={() => setQty(q => q + 1)}
                        className={styles.qtyButton}
                    >
                        <Plus size={14} />
                    </button>
                </div>
            </div>
            <div className={styles.actionsRow}>
                <button
                    onClick={handleAddToCart}
                    className={styles.addToCartButton}
                >
                    Add to Cart
                </button>
                <button
                    onClick={handleShare}
                    className={styles.shareButton}
                >
                    <Share2 size={18} />
                </button>
            </div>
        </div>
    )

    const crumbItems = [
        { label: 'Products', href: '/products' },
        { label: product.title },
    ]

    return (
        <div>
            {/* Mobile */}
            <div className={styles.mobileWrap}>
                <Crumb items={crumbItems} />
                <div className={styles.mobileBody}>
                    <div className={styles.mobileGalleryWrap}>
                        <ImageGallery images={product.images} />
                    </div>
                    {productInfo}
                </div>
            </div>
            {/* Desktop */}
            <div className={styles.desktopWrap}>
                <div className={styles.desktopGalleryWrap}>
                    <ImageGallery images={product.images} />
                </div>
                <div className={styles.desktopInfoWrap}>
                    <Crumb items={crumbItems} />
                    {productInfo}
                </div>
            </div>
        </div>
    )
}

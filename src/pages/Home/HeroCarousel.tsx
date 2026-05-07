import Filmstrip from './Filmstrip'

interface FilmstripProduct {
    handle: string
    src: string
    name: string
    price: string
}

interface HeroSectionProps {
    products: FilmstripProduct[]
}

export default function HeroSection({ products }: HeroSectionProps) {
    return (
        <section
            className="w-full flex flex-col justify-between"
            style={{ height: '100vh', scrollSnapAlign: 'start' }}
        >
            <div className="pointer-events-none">
                <div className="title-hero text-black">
                    <div style={{ paddingLeft: '2%', paddingTop: 'clamp(60px, 8%, 0.3em)' }}>GARDEN</div>
                    <div style={{ paddingLeft: '18%' }}>GALLERY</div>
                </div>
            </div>

            {products.length > 0 && <Filmstrip products={products} />}

            <div className="flex justify-end px-6 pb-6">
                <p className="text-slogan text-black font-light text-right">
                    Every flower blooms upon your arrival
                </p>
            </div>
        </section>
    )
}

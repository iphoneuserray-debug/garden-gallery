import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const carouselImages = [
    "https://picsum.photos/seed/portrait1/800/1000",
    "https://picsum.photos/seed/portrait2/800/1000",
    "https://picsum.photos/seed/portrait3/800/1000",
    "https://picsum.photos/seed/portrait4/800/1000",
];

const categories = [
    { label: "Event", image: "https://picsum.photos/seed/cat-event/300/400", href: "/products/Wedding" },
    { label: "Type", image: "https://picsum.photos/seed/cat-type/300/400", href: "/products/Rose" },
    { label: "Subscription", image: "https://picsum.photos/seed/cat-sub/300/400", href: "/products" },
];

export default function HeroCarousel() {
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrent((prev) => (prev + 1) % carouselImages.length);
        }, 4000);
        return () => clearInterval(timer);
    }, []);

    return (
        <section className="w-full flex" style={{ height: "calc(100vh - 88px)" }}>
            {/* Left: Title + Category tiles */}
            <div className="relative w-[48%] bg-white flex flex-col px-10 pt-10 pb-0 overflow-hidden">
                <h1
                    className="font-black leading-[0.88] text-black tracking-tight"
                    style={{ fontSize: "clamp(72px, 9vw, 150px)" }}
                >
                    Garden
                    <br />
                    Gallery
                </h1>

                {/* Category tiles — overlapping collage */}
                <div className="relative flex-1 mt-6">
                    {categories.map((cat, i) => (
                        <Link
                            key={cat.label}
                            to={cat.href}
                            className="absolute overflow-hidden shadow-lg"
                            style={{
                                left: `${i * 115}px`,
                                bottom: 0,
                                width: "170px",
                                height: `${260 - i * 15}px`,
                                zIndex: i + 1,
                            }}
                        >
                            <img
                                src={cat.image}
                                alt={cat.label}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 to-transparent">
                                <span className="text-white font-bold text-lg">{cat.label}</span>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Right: Carousel */}
            <div className="relative w-[52%] bg-black overflow-hidden">
                <div
                    className="flex h-full transition-transform duration-700 ease-in-out"
                    style={{ transform: `translateX(-${current * 100}%)` }}
                >
                    {carouselImages.map((src, index) => (
                        <div key={index} className="min-w-full h-full">
                            <img
                                src={src}
                                alt={`hero-${index}`}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    ))}
                </div>

                {/* Text overlay */}
                <div className="absolute bottom-12 right-10 text-right pointer-events-none">
                    <p className="text-white font-light leading-tight" style={{ fontSize: "clamp(32px, 4vw, 56px)" }}>
                        Every
                        <br />
                        flower
                        <br />
                        blooms
                        <br />
                        upon
                        <br />
                        your arrival
                    </p>
                </div>

                {/* Dot indicators */}
                <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2">
                    {carouselImages.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setCurrent(i)}
                            className={`h-2 w-2 rounded-full transition ${i === current ? "bg-white" : "bg-white/40"}`}
                            aria-label={`Go to slide ${i + 1}`}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const images = [
    "/banner1.jpg",
    "/banner2.jpg",
    "/banner3.jpg",
    "/banner4.jpg",
    "/banner5.jpg",
    "/banner6.jpg",
];

export default function HeroCarousel() {
    const [current, setCurrent] = useState(0);

    const prevSlide = () => {
        setCurrent((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    };

    const nextSlide = () => {
        setCurrent((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    };

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrent((prev) => (prev === images.length - 1 ? 0 : prev + 1));
        }, 4000);

        return () => clearInterval(timer);
    }, []);

    return (
        <section className="w-full px-6">
            <div className="relative mx-auto w-full overflow-hidden rounded-3xl shadow-lg">
                {/* 图片滑动区域 */}
                <div
                    className="flex transition-transform duration-500 ease-in-out"
                    style={{ transform: `translateX(-${current * 100}%)` }}
                >
                    {images.map((src, index) => (
                        <div
                            key={index}
                            className="min-w-full"
                        >
                            <img
                                src={src}
                                alt={`banner-${index + 1}`}
                                className="h-[420px] w-full object-cover"
                            />
                        </div>
                    ))}
                </div>

                {/* 左右按钮 */}
                <button
                    onClick={prevSlide}
                    className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 shadow hover:bg-white transition"
                    aria-label="Previous slide"
                >
                    <ChevronLeft size={24} />
                </button>

                <button
                    onClick={nextSlide}
                    className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 shadow hover:bg-white transition"
                    aria-label="Next slide"
                >
                    <ChevronRight size={24} />
                </button>

                {/* 底部圆点 */}
                <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
                    {images.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrent(index)}
                            className={`h-3 w-3 rounded-full transition ${
                                current === index ? "bg-white" : "bg-white/50"
                            }`}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
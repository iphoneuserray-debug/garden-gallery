import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import ItemCard from "../../components/ItemCard";
import Autoplay from "embla-carousel-autoplay"
import { Link } from "react-router-dom";

interface CarouselCardProps {
    title: string;
}

export default function CarouselCard({ title }: CarouselCardProps) {
    return (<div>
        <Link to={`/${title}`}>
            <h2 className="scroll-m-20 text-3xl font-semibold tracking-tight first:mt-0 m-5">
                <span className="border-b pb-2">{title}</span>
            </h2>
        </Link>
        <Carousel
            opts={{
                align: "start",
                loop: true,
            }}
            plugins={[
                Autoplay({
                    delay: 4000,
                }),
            ]}
            className="w-full max-w-5xl"
        >
            <CarouselContent>
                {Array.from({ length: 5 }).map((_, index) => (
                    <CarouselItem key={index} className="basis-1/2 lg:basis-1/3">
                        <div>
                            <ItemCard title="Rose" price="23.00$" imgSrc="https://picsum.photos/400/500" badge="Pet Friendly" />
                        </div>
                    </CarouselItem>
                ))}
            </CarouselContent>

        </Carousel>
    </div>)
}
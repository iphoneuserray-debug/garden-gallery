import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import ItemCard from "../../components/ItemCard";
import Autoplay from "embla-carousel-autoplay"

export default function CarouselCard() {
    return (<>
        <Carousel
            opts={{
                align: "start",
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
            <CarouselPrevious />
            <CarouselNext />
        </Carousel>
    </>)
}
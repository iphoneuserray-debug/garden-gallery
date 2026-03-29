import HeroCarousel from "./HeroCarousel";
import AvaPanel from "./AvatarPanel";
import flowerCategories from "@/MockData/flowerCategories";
import CarouselCard from "./Carousel";
export default function Home() {
    return (
        <div className="w-full">
            <div className="mt-4 flex flex-col items-center gap-y-10">
                <HeroCarousel />
                <AvaPanel Avatars={flowerCategories} />
                <CarouselCard title="Best Seller" />
                <CarouselCard title="Events" />
            </div>
        </div>
    );
}
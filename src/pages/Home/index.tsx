import HeroCarousel from "./HeroCarousel";
import AvaPanel from "./AvatarPanel";
import flowerCategories from "@/MockData/flowerCategories";
import CarouselCard from "./Carousel";
export default function Home() {
    return (
        <div className="w-full">
            {/* Full-bleed hero: compensate for main's p-8 */}
            <div className="-mx-8 -mt-8">
                <HeroCarousel />
            </div>

            <div className="mt-10 flex flex-col items-center gap-y-10">
                <AvaPanel Avatars={flowerCategories} />
                <CarouselCard title="Best Seller" />
                <CarouselCard title="Events" />
            </div>
        </div>
    );
}
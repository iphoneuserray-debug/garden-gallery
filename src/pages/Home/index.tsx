import AvaPanel from "./AvatarPanel";
import flowerCategories from "@/MockData/flowerCategories";
import CarouselCard from "./Carousel";

export default function Home() {
    return (
        <div className="flex flex-col items-center gap-y-10">
            <AvaPanel Avatars={flowerCategories} />
            <CarouselCard />
        </div>)
}
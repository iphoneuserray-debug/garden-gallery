import Header from "./Header";
import AvaPanel from "./AvatarPanel";
import flowerCategories from "@/MockData/flowerCategories";
import CarouselCard from "./Carousel";

export default function Home() {
    return (
        <div className="w-full">

            {/* 顶部 */}
            <Header />

            {/* 内容 */}
            <div className="flex flex-col items-center gap-y-10 mt-6">
                <AvaPanel Avatars={flowerCategories} />
                <CarouselCard title="Best Seller" />
                <CarouselCard title="Events" />
            </div>

        </div>
    );
}
import ItemCard from "@/components/ItemCard";
import { useParams } from "react-router-dom";
import FilterBar from "./FilterBar";
import { Crumb } from "@/components/Crumb";

type Product = {
    id: string;
    title: string;
    handle: string;
    price: string;
    imgSrc: string;
    badge: string;
};

const mockProducts: Product[] = [
    { id: "1", title: "Rose", handle: "rose", price: "23.00 USD", imgSrc: "https://picsum.photos/400/500", badge: "Pet Friendly" },
    { id: "2", title: "Tulip", handle: "tulip", price: "18.00 USD", imgSrc: "https://picsum.photos/400/501", badge: "Seasonal" },
    { id: "3", title: "Lily", handle: "lily", price: "25.00 USD", imgSrc: "https://picsum.photos/400/502", badge: "Popular" },
    { id: "4", title: "Sunflower", handle: "sunflower", price: "20.00 USD", imgSrc: "https://picsum.photos/400/503", badge: "Bright" },
    { id: "5", title: "Orchid", handle: "orchid", price: "35.00 USD", imgSrc: "https://picsum.photos/400/504", badge: "Exotic" },
    { id: "6", title: "Daisy", handle: "daisy", price: "15.00 USD", imgSrc: "https://picsum.photos/400/505", badge: "Classic" },
    { id: "7", title: "Carnation", handle: "carnation", price: "17.00 USD", imgSrc: "https://picsum.photos/400/506", badge: "Fragrant" },
    { id: "8", title: "Peony", handle: "peony", price: "30.00 USD", imgSrc: "https://picsum.photos/400/507", badge: "Luxury" },
    { id: "9", title: "Hydrangea", handle: "hydrangea", price: "28.00 USD", imgSrc: "https://picsum.photos/400/508", badge: "Colorful" },
    { id: "10", title: "Gardenia", handle: "gardenia", price: "22.00 USD", imgSrc: "https://picsum.photos/400/509", badge: "Aromatic" },
    { id: "11", title: "Lavender", handle: "lavender", price: "19.00 USD", imgSrc: "https://picsum.photos/400/510", badge: "Calming" },
    { id: "12", title: "Jasmine", handle: "jasmine", price: "21.00 USD", imgSrc: "https://picsum.photos/400/511", badge: "Fragrant" },
];

export default function Products() {
    const { text } = useParams();
    return (
        <>
            <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight text-balance mb-5">
                {text ?? "All"}
            </h1>
            <Crumb />
            <FilterBar></FilterBar>
            <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-4">
                {mockProducts.map((item) => (
                    <ItemCard
                        key={item.id}
                        title={item.title}
                        price={item.price}
                        imgSrc={item.imgSrc}
                        badge={item.badge}
                        to={`/product/${item.handle}`}
                    />
                ))}
            </div>
        </>)
}
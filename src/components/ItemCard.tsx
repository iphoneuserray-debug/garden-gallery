import { Link } from "react-router-dom";

interface Props {
    title: string;
    price: string;
    imgSrc: string;
    badge?: string;
    to?: string;
}


export default function ItemCard({ title, price, imgSrc }: Props) {
    return (
        <Link to={`/detail/${title}`} >
            <img src={imgSrc} alt={`${title}-Image`} className="relative z-20 aspect-[4/5] object-cover" />
            <div className="ml-1">
                <h4 className="scroll-m-20 text-2xl font-semibold tracking-tight">{title}</h4>
                <h5 className="scroll-m-20 text-xl font-semibold tracking-tight">{price}</h5>
            </div>
        </Link >
    )
}
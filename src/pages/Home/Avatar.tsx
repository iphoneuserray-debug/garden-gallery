import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Link } from "react-router-dom";

export interface AvaProps {
    img: string;
    text: string;
}

export default function Ava({ img, text }: AvaProps) {
    return (
        <Link to={`/products/${text}`} className="flex flex-col items-center gap-x-3">
            <Avatar className="size-30" >
                <AvatarImage src={img} />
                <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <p>{text}</p>
        </Link>
    );
}
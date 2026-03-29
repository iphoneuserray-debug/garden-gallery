import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "@/components/ui/input-group";
import { Heart, Minus, Plus, Share2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import Frame from "./Frame";
import { useParams } from "react-router-dom";

export default function Detail() {
    const { name } = useParams();
    const [quantity, setQuantity] = useState(1);
    const [saved, setSaved] = useState(false);

    const sampleImages = [
        { src: "https://picsum.photos/seed/1/400/500", alt: "Forest Path" },
        { src: "https://picsum.photos/seed/2/400/500", alt: "Mountain Lake" },
        { src: "https://picsum.photos/seed/3/400/500", alt: "Desert Dunes" },
        { src: "https://picsum.photos/seed/4/400/500", alt: "Sunset Beach" },
        { src: "https://picsum.photos/seed/5/400/500", alt: "City Skyline" },
    ];

    const handlePlusClick = () => {
        setQuantity((value) => value + 1)
    }

    const handleMinusClick = () => {
        setQuantity((value) => (value - 1) < 0 ? 0 : value - 1)
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;

        if (val === "") {
            setQuantity(0);
            return;
        }

        if (/^\d+$/.test(val)) {
            setQuantity(Number(val));
        }
    };

    const handleSubmit = () => { }

    const handleSave = () => {
        setSaved((prev) => !prev);
    }

    const handleShare = async () => {
        await navigator.clipboard.writeText(window.location.href);
        toast.success("Link copied");
    }
    return (<>
        <div className="flex gap-10 content-start mb-10">
            <Frame images={sampleImages} />
            <div className="space-y-2">
                <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
                    {name}
                </h3>
                <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
                    $89.00
                </h4>
                <div className="flex items-center gap-2 mt-5">
                    <Badge variant="secondary">Badge</Badge>
                </div>
                <p className="leading-7 [&:not(:first-child)]:mt-6">
                    The king, seeing how much happier his subjects were, realized the error of
                    his ways and repealed the joke tax.
                </p>
                <div className="flex items-center gap-4">
                    <p className="text-muted-foreground text-xl">
                        Quantity:
                    </p>

                    <InputGroup className="[--radius:9999px] max-w-30" onSubmit={handleSubmit}>
                        <InputGroupInput id="input-secure-19" value={quantity} className="text-center" onChange={handleInputChange} />
                        <InputGroupAddon align="inline-end">
                            <InputGroupButton
                                onClick={handlePlusClick}
                                size="icon-xs"
                            >
                                <Plus />
                            </InputGroupButton>
                        </InputGroupAddon>
                        <InputGroupAddon align="inline-start">
                            <InputGroupButton
                                onClick={handleMinusClick}
                                size="icon-xs"
                            >
                                <Minus />
                            </InputGroupButton>
                        </InputGroupAddon>
                    </InputGroup>
                </div>
                <div className="flex items-center gap-4 mt-10">
                    <Button type="submit">
                        Add to cart
                    </Button>
                    <Button onClick={handleSave}>
                        {saved ? <Heart fill="#ff0000" color="#ff0000" /> : <Heart color="#ff0000" />}
                    </Button>
                    <Button onClick={handleShare}>
                        <Share2 />
                    </Button>
                </div>
            </div>
        </div>
    </>)
}
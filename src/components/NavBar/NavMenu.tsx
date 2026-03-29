import { Link } from "react-router-dom";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "../ui/accordion";

interface NavMenuProps {
    setOpen: (open: boolean) => void;
}

const eventTypes = ["Wedding", "Birthday", "Anniversary", "Corporate", "Funeral"];
const flowerTypes = ["Rose", "Tulip", "Lily", "Sunflower", "Orchid", "Daisy", "Peony"];

const linkClass =
    "relative w-fit text-lg font-semibold text-gray-700 after:content-[''] after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 after:bg-gray-700 after:transition-all after:duration-300 hover:after:w-full";

const subLinkClass =
    "text-sm text-gray-600 hover:text-gray-900 transition-colors";

interface SubMenuProps {
    label: string;
    items: string[];
    setOpen: (open: boolean) => void;
}

function SubMenu({ label, items, setOpen }: SubMenuProps) {
    return (
        <Accordion type="single" collapsible>
            <AccordionItem value="item-1" className="border-none">
                <AccordionTrigger
                    className={`${linkClass} py-0 hover:no-underline`}
                >
                    {label}
                </AccordionTrigger>

                <AccordionContent>
                    <div className="flex flex-col gap-2 pl-3 border-l border-white/40 mt-2">
                        {items.map((value) => (
                            <Link
                                key={value}
                                to={`/products/${value.toLowerCase()}`}
                                onClick={() => setOpen(false)}
                                className={`${subLinkClass} hover:bg-white/30 px-2 py-1 rounded-md`}
                            >
                                {value}
                            </Link>
                        ))}
                    </div>
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    );
}

export default function NavMenu({ setOpen }: NavMenuProps) {
    return (
        <nav className="flex flex-col gap-4 bg-[#CCBEB1] p-4 min-h-full">
            <Link
                to="/"
                onClick={() => setOpen(false)}
                className={`${linkClass} hover:bg-white/20 px-2 py-1 rounded-md`}
            >
                Home
            </Link>

            <Link
                to="/products"
                onClick={() => setOpen(false)}
                className={`${linkClass} hover:bg-white/20 px-2 py-1 rounded-md`}
            >
                Shop All
            </Link>

            <SubMenu label="Events" items={eventTypes} setOpen={setOpen} />
            <SubMenu label="Flower Types" items={flowerTypes} setOpen={setOpen} />
        </nav>
    );
}
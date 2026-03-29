import { Link } from "react-router-dom";
import {
    NavigationMenu,
    NavigationMenuList,
    NavigationMenuItem,
    NavigationMenuTrigger,
    NavigationMenuContent,
    NavigationMenuLink,
} from "../ui/navigation-menu";

const linkClass = "relative text-lg font-semibold text-gray-700 bg-transparent hover:bg-transparent focus:bg-transparent after:content-[''] after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 after:bg-gray-700 after:transition-all after:duration-300 hover:after:w-full px-2 py-1";

const eventTypes = ["Wedding", "Birthday", "Anniversary", "Corporate", "Funeral"];
const flowerTypes = ["Rose", "Tulip", "Lily", "Sunflower", "Orchid", "Daisy", "Peony"];

export const LongNavBar = () => {
    return (
        <NavigationMenu viewport={false} className="z-50">
            <NavigationMenuList>

                <NavigationMenuItem>
                    <NavigationMenuLink asChild className={linkClass}>
                        <Link to="/">Home</Link>
                    </NavigationMenuLink>
                </NavigationMenuItem>

                <NavigationMenuItem>
                    <NavigationMenuLink asChild className={linkClass}>
                        <Link to="/products">Shop All</Link>
                    </NavigationMenuLink>
                </NavigationMenuItem>

                <NavigationMenuItem>
                    <NavigationMenuTrigger className={linkClass}>Events</NavigationMenuTrigger>
                    <NavigationMenuContent>
                        <ul className="flex flex-col w-40 p-1">
                            {eventTypes.map((item) => (
                                <li key={item}>
                                    <NavigationMenuLink asChild>
                                        <Link
                                            to={`/products/${item.toLowerCase()}`}
                                            className="block px-3 py-2 text-sm rounded-md hover:bg-accent transition-colors"
                                        >
                                            {item}
                                        </Link>
                                    </NavigationMenuLink>
                                </li>
                            ))}
                        </ul>
                    </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                    <NavigationMenuTrigger className={linkClass}>Flower Types</NavigationMenuTrigger>
                    <NavigationMenuContent>
                        <ul className="flex flex-col w-40 p-1">
                            {flowerTypes.map((item) => (
                                <li key={item}>
                                    <NavigationMenuLink asChild>
                                        <Link
                                            to={`/products/${item.toLowerCase()}`}
                                            className="block px-3 py-2 text-sm rounded-md hover:bg-accent transition-colors"
                                        >
                                            {item}
                                        </Link>
                                    </NavigationMenuLink>
                                </li>
                            ))}
                        </ul>
                    </NavigationMenuContent>
                </NavigationMenuItem>

            </NavigationMenuList>
        </NavigationMenu>
    );
};

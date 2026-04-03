import { useLocation } from "react-router-dom";
import { NavBar } from "./NavBar/Navbar";
import { Cart } from "./Cart";
import Caution from "./Caution";

export default function Header() {
    const { pathname } = useLocation();

    return (
        <>
            {pathname === "/" && (
                <Caution>Pick Up Only at Melbourne Center Every Tuesday</Caution>
            )}

            <div className="w-full flex items-center justify-end gap-2 px-6 py-3 bg-white mt-9">
                <NavBar />
                <Cart />
            </div>
        </>
    );
}
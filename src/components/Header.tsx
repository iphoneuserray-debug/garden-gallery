import { Link, useLocation } from "react-router-dom";
import { User } from "lucide-react";
import { NavBar } from "./NavBar/Navbar";
import { LongNavBar } from "./NavBar/LongNavBar";
import { Cart } from "./Cart";
import NavSearch from "./NavBar/NavSearch";
import Caution from "./Caution";

export default function Header() {
    const { pathname } = useLocation();

    return (
        <>
            {pathname === "/" && <Caution>Pick Up Only at Melbourne Center Every Tuseday</Caution>}

            <div className="w-full flex items-center gap-3 px-4 py-3 bg-[#CCBEB1]">

                {/* Narrow: hamburger (hidden on md+) */}
                <div className="md:hidden">
                    <NavBar />
                </div>

                {/* Logo — left on wide, centered on narrow */}
                <Link to="/" className="flex-shrink-0">
                    <img
                        src="logo.jpg"
                        alt="logo"
                        className="w-14 h-14 rounded-full object-cover border shadow"
                    />
                </Link>

                {/* Wide: nav links (hidden on narrow) */}
                <div className="hidden md:flex">
                    <LongNavBar />
                </div>

                {/* Spacer */}
                <div className="flex-1" />

                {/* Wide: search (hidden on narrow) */}
                <div className="hidden md:block">
                    <NavSearch />
                </div>

                {/* Cart (always visible) */}
                <Cart />

                {/* User icon (wide only — narrow uses sidebar) */}
                <Link
                    to="/login"
                    className="hidden md:flex items-center justify-center w-10 h-10 rounded-full border shadow-sm hover:bg-gray-100 transition"
                >
                    <User size={20} />
                </Link>

            </div>
        </>
    );
}

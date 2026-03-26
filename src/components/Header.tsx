import { Link, useLocation } from "react-router-dom";
import { User } from "lucide-react";
import { NavBar } from "./Navbar";
import Caution from "./Caution";

export default function Header() {
    const { pathname } = useLocation();

    return (
        <>
            {pathname === "/" && <Caution>Pick Up Only at Melbourne Center Every Tuseday</Caution>}
            <div className="w-full flex items-center py-4 relative bg-[#CCBEB1]">
                <NavBar />

                {/* 中间 Logo */}
                <div className="absolute left-1/2 -translate-x-1/2">
                    <img
                        src="src/Image/logo.jpg"
                        alt="logo"
                        className="w-16 h-16 rounded-full object-cover border shadow"
                    />
                </div>

                {/* 右边 用户图标 */}
                <Link
                    to="/login"
                    className="ml-auto mr-4 flex items-center justify-center w-10 h-10 rounded-full border shadow-sm hover:bg-gray-100 transition"
                >
                    <User size={20} />
                </Link>
            </div>
        </>
    );
}
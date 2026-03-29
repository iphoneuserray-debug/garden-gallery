import { Link, useLocation } from "react-router-dom";
import { User } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { NavBar } from "./NavBar/Navbar";
import { LongNavBar } from "./NavBar/LongNavBar";
import { Cart } from "./Cart";
import NavSearch from "./NavBar/NavSearch";
import Caution from "./Caution";

export default function Header() {
    const { pathname } = useLocation();

    const headerRef = useRef<HTMLDivElement | null>(null);
    const [showFloatingIcons, setShowFloatingIcons] = useState(false);

    useEffect(() => {
        const target = headerRef.current;
        if (!target) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                setShowFloatingIcons(!entry.isIntersecting);
            },
            {
                root: null,
                threshold: 0,
            }
        );

        observer.observe(target);

        return () => observer.disconnect();
    }, []);

    return (
        <>
            {pathname === "/" && (
                <Caution>Pick Up Only at Melbourne Center Every Tuseday</Caution>
            )}

            {/* 原来的 Header */}
            <div ref={headerRef}>
                <div className="w-full flex items-center gap-3 px-4 py-3 bg-[#CCBEB1] mt-8">
                    {/* Narrow NavBar */}
                    <div className="md:hidden">
                        <NavBar />
                    </div>

                    {/* Logo */}
                    <Link to="/" className="flex-shrink-0">
                        <img
                            src="logo.jpg"
                            alt="logo"
                            className="w-14 h-14 rounded-full object-cover border shadow"
                        />
                    </Link>

                    {/* Wide: nav links */}
                    <div className="hidden md:flex">
                        <LongNavBar />
                    </div>

                    {/* Spacer */}
                    <div className="flex-1" />

                    {/* Wide: search */}
                    <div className="hidden md:block">
                        <NavSearch />
                    </div>

                    {/* Cart */}
                    <Cart />

                    {/* User icon */}
                    <Link
                        to="/login"
                        className="hidden md:flex items-center justify-center w-10 h-10 rounded-full border shadow-sm hover:bg-gray-100 transition"
                    >
                        <User size={20} />
                    </Link>
                </div>
            </div>

            {/* 顶部导航被滚走后显示的小浮动图标 */}
            {showFloatingIcons && (
                <div className="fixed left-4 top-[52px] z-[60] flex items-center gap-2 rounded-full bg-white/85 px-3 py-2 shadow-lg backdrop-blur-md border border-white/60">
                    {/* 小导航按钮 */}
                    <div className="flex items-center justify-center">
                        <NavBar />
                    </div>

                    {/* 小购物车按钮：直接复用 Cart 组件 */}
                    <div className="flex items-center justify-center">
                        <Cart />
                    </div>
                </div>
            )}
        </>
    );
}
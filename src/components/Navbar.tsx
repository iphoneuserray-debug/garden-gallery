import { useState } from "react";
import { Link } from "react-router-dom";
import { Field } from "@/components/ui/field.tsx";
import { Cart } from "./Cart";
import { Menu, Search } from "lucide-react";
import { InputGroup, InputGroupAddon, InputGroupInput } from "./ui/input-group";

export const NavBar = () => {
    const [open, setOpen] = useState(false);

    return (
        <>
            {/* 左上角固定菜单按钮 */}
            {open ? null : <button
                onClick={() => setOpen(!open)}
                className="flex h-12 w-12 items-center justify-start z-[100] ml-3"
                aria-label="Toggle navigation menu"
            >
                <span className="text-2xl leading-none"><Menu /></span>
            </button>}

            {/* 遮罩层 */}
            {open && (
                <div
                    className="fixed inset-0 z-[90] bg-black/30"
                    onClick={() => setOpen(false)}
                />
            )}

            {/* 左侧折叠导航栏 */}
            <header
                className={`fixed top-0 left-0 z-[95] h-screen w-80 bg-white shadow-xl transition-transform duration-300 ${open ? "translate-x-0" : "-translate-x-full"
                    }`}
            >
                <div className="flex h-full flex-col px-6 py-6">
                    {/* 顶部标题和关闭按钮 */}
                    <div className="mb-8 flex items-center justify-between border-b pb-4">
                        <h1 className="scroll-m-20 text-3xl font-extrabold tracking-tight text-balance">
                            Garden Gallery
                        </h1>
                        <button
                            onClick={() => setOpen(false)}
                            className="text-3xl leading-none text-gray-500 hover:text-gray-700"
                            aria-label="Close navigation menu"
                        >
                            ×
                        </button>
                    </div>

                    {/* 搜索框 */}
                    <div className="mb-6">
                        <Field orientation="vertical" className="flex flex-col gap-3">
                            <InputGroup>
                                <InputGroupInput
                                    type="search"
                                    placeholder="Search..."
                                    className="w-full"
                                />
                                <InputGroupAddon align="inline-end">
                                    <Search />
                                </InputGroupAddon>
                            </InputGroup>
                        </Field>
                    </div>

                    {/* 导航链接 */}
                    <nav className="mb-6 flex flex-col gap-5">
                        <Link
                            to="/"
                            onClick={() => setOpen(false)}
                            className="relative text-lg font-semibold text-gray-700 after:content-[''] after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 after:bg-gray-700 after:transition-all after:duration-300 hover:after:w-full"
                        >
                            Home
                        </Link>

                        <Link
                            to="/products"
                            onClick={() => setOpen(false)}
                            className="relative text-lg font-semibold text-gray-700 after:content-[''] after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 after:bg-gray-700 after:transition-all after:duration-300 hover:after:w-full"
                        >
                            Subscription
                        </Link>
                    </nav>

                    {/* 购物车 */}
                    <div className="mt-auto">
                        <Cart />
                    </div>
                </div>
            </header>
        </>
    );
};
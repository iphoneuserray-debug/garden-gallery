import { useState } from "react";
import { Menu, User } from "lucide-react";
import { Link } from "react-router-dom";
import NavMenu from "./NavMenu";
import NavSearch from "./NavSearch";

export const NavBar = () => {
    const [open, setOpen] = useState(false);

    return (
        <>
            {/* 菜单按钮 */}
            {!open && (
                <button
                    onClick={() => setOpen(true)}
                    className="ml-3 flex h-12 w-12 items-center justify-center rounded-full bg-white/40 border border-white/40 shadow-md backdrop-blur-md transition hover:bg-white/60"
                    aria-label="Toggle navigation menu"
                >
                    <Menu className="h-6 w-6 text-gray-800" />
                </button>
            )}

            {/* 遮罩层 */}
            {open && (
                <div
                    className="fixed inset-0 z-[90] bg-black/25 backdrop-blur-[2px]"
                    onClick={() => setOpen(false)}
                />
            )}

            {/* 左侧折叠导航栏 */}
            <header
                className={`fixed top-0 left-0 z-[95] h-screen w-80 border-r border-white/30 bg-[#CCBEB1] shadow-2xl backdrop-blur-md transition-transform duration-300 ${
                    open ? "translate-x-0" : "-translate-x-full"
                }`}
            >
                <div className="flex h-full flex-col px-6 py-6">
                    {/* 顶部标题和关闭按钮 */}
                    <div className="mb-8 flex items-center justify-between border-b border-white/40 pb-4">
                        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
                            Garden Gallery
                        </h1>

                        <button
                            onClick={() => setOpen(false)}
                            className="flex h-10 w-10 items-center justify-center rounded-full text-2xl leading-none text-gray-600 transition hover:bg-white/30 hover:text-gray-900"
                            aria-label="Close navigation menu"
                        >
                            ×
                        </button>
                    </div>

                    {/* 搜索框 */}
                    <div className="mb-4 rounded-2xl bg-white/25 p-2 backdrop-blur-sm">
                        <NavSearch />
                    </div>

                    {/* 导航链接 */}
                    <NavMenu setOpen={setOpen} />

                    {/* 底部账号入口 */}
                    <div className="mt-auto border-t border-white/40 pt-4">
                        <Link
                            to="/login"
                            onClick={() => setOpen(false)}
                            className="flex items-center gap-3 rounded-xl px-3 py-3 text-lg font-semibold text-gray-800 transition hover:bg-white/25 hover:text-black"
                        >
                            <User size={20} />
                            <span>Account</span>
                        </Link>
                    </div>
                </div>
            </header>
        </>
    );
};
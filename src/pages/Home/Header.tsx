import { Link } from "react-router-dom";

export default function Header() {
    return (
        <div className="w-full flex items-center justify-between px-6 py-4">

            {/* 左边 Login */}
            <Link
                to="/login"
                className="text-sm font-medium text-gray-700 border px-4 py-2 rounded-full hover:bg-gray-100 transition"
            >
                Login
            </Link>

            {/* 中间 Logo */}
            <div className="absolute left-1/2 -translate-x-1/2">
                <img
                    src="src/Image/logo.jpg"
                    alt="logo"
                    className="w-16 h-16 rounded-full object-cover border shadow"
                />
            </div>

            {/* 右边占位（保持居中） */}
            <div className="w-[80px]" />
        </div>
    );
}
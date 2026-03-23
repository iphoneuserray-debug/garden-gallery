import { Link } from "react-router-dom";
import { User } from "lucide-react";

export default function Header() {
    return (
        <div className="w-full flex items-center justify-between pl-70 pr-70 py-4 relative bg-[#CCBEB1]">

            {/* 左边 用户图标 */}
            <Link
                to="/login"
                className="flex items-center justify-center w-10 h-10 rounded-full border shadow-sm hover:bg-gray-100 transition"
            >
                <User size={20} />
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
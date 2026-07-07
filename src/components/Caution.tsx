interface CautionProps {
    children: string;
}

export default function Caution({ children }: CautionProps) {
    return (
        <div className="w-full bg-[#EADBC8] text-[#3E3E3E] border-b border-white/40 backdrop-blur-sm">
            <p className="text-center text-sm font-semibold tracking-wide py-2">
                {children}
            </p>
        </div>
    );
}
interface CautionProps {
    children: string;
}

export default function Caution({ children }: CautionProps) {
    return (
        <div className="fixed top-0 left-0 z-50 w-full overflow-hidden bg-[#EADBC8] text-[#3E3E3E] border-b border-white/40 backdrop-blur-sm">
            <div className="whitespace-nowrap py-2 animate-marquee">
                {[0, 1].map((i) => (
                    <span key={i} className="inline-block text-sm font-semibold tracking-wide">
                        {Array(6)
                            .fill(children)
                            .map((text, j) => (
                                <span key={j}>
                                    {text}
                                    <span className="px-8">·</span>
                                </span>
                            ))}
                    </span>
                ))}
            </div>
        </div>
    );
}
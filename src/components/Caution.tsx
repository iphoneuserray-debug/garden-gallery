interface CautionProps {
    children: string;
}

export default function Caution({ children }: CautionProps) {
    return (
        <div className="fixed top-0 left-0 z-50 w-full overflow-hidden bg-black text-white border-b border-black/20">
            <div className="whitespace-nowrap py-2 animate-marquee">
                {[0, 1].map((i) => (
                    <span key={i} className="inline-block text-sm font-semibold tracking-wide">
                        {Array(6)
                            .fill(children)
                            .map((text, j) => (
                                <span key={j}>
                                    {text.toUpperCase()}
                                    <span className="px-8">·</span>
                                </span>
                            ))}
                    </span>
                ))}
            </div>
        </div>
    );
}
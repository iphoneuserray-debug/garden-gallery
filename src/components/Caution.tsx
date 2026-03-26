
interface CautionProps {
    children: string;
}

export default function Caution({ children }: CautionProps) {
    return (
        <div className="overflow-hidden w-full">
            <div className="animate-marquee">
                {[0, 1].map(i => (
                    <span key={i} className="leading-7 bold">
                        {Array(6).fill(children).map((text, j) => (
                            <span key={j}>{text}<span className="px-8">·</span></span>
                        ))}
                    </span>
                ))}
            </div>
        </div>
    )
}
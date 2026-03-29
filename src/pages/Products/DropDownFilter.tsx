import { ChevronDown } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface DropdownFilterProps {
    children: React.ReactNode;
    name: string;
}

export default function DropdownFilter({ children, name }: DropdownFilterProps) {
    return (
        <Popover>
            <PopoverTrigger className="inline-flex items-center gap-1 rounded-md border px-3 py-2 text-sm font-medium hover:bg-accent transition">
                {name} <ChevronDown className="size-3.5" />
            </PopoverTrigger>
            <PopoverContent align="start">
                {children}
            </PopoverContent>
        </Popover>
    );
}

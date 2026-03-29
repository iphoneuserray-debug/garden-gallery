import { Search } from "lucide-react";
import { InputGroup, InputGroupAddon, InputGroupInput } from "../ui/input-group";

export default function NavSearch() {
    return (
        <InputGroup>
            <InputGroupInput
                type="search"
                placeholder="Search..."
                className="w-48"
            />
            <InputGroupAddon align="inline-end">
                <Search />
            </InputGroupAddon>
        </InputGroup>
    );
}

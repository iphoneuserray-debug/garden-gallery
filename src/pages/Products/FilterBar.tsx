import { useState } from "react";
import CheckBoxFeild from "./CheckBoxField";
import DropdownFilter from "./DropDownFilter";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
const availabilityChoices = ["In Stock", "Out of Stock", "Pre-order"];

export default function FilterBar() {
    const [selectedAvailability, setSelectedAvailability] = useState<string[]>([]);
    const [value, setValue] = useState([0, 800]);
    return (
        <div className="flex gap-2 mb-4">
                <DropdownFilter name="Available">
                    <CheckBoxFeild
                        choices={availabilityChoices}
                        selected={selectedAvailability}
                        onChange={setSelectedAvailability}
                    />
                </DropdownFilter>
                <DropdownFilter name="Price Range">
                    <div className="mx-auto grid w-full max-w-xs gap-3">
                        <div className="flex items-center justify-between gap-2">
                            <Label htmlFor="slider-price_range">Price</Label>
                            <span className="text-sm text-muted-foreground">
                                ${value[0]} – ${value[1]}
                            </span>
                        </div>
                        <Slider
                            id="slider-price_range"
                            value={value}
                            onValueChange={setValue}
                            min={0}
                            max={800}
                            step={10}
                        />
                    </div>
                </DropdownFilter>
        </div>
    )
}

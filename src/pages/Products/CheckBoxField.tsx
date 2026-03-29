import { FieldGroup, Field, FieldLabel } from "@/components/ui/field";
import { Checkbox } from "@/components/ui/checkbox";

interface CheckBoxFieldProps {
    choices: string[];
    selected: string[];
    onChange: (selected: string[]) => void;
}

export default function CheckBoxFeild({ choices, selected, onChange }: CheckBoxFieldProps) {
    const toggle = (choice: string) => {
        onChange(
            selected.includes(choice)
                ? selected.filter((c) => c !== choice)
                : [...selected, choice]
        );
    };

    return (
        <FieldGroup>
            {choices.map((choice) => (
                <Field key={choice} orientation="horizontal">
                    <Checkbox
                        id={choice}
                        name={choice}
                        checked={selected.includes(choice)}
                        onCheckedChange={() => toggle(choice)}
                    />
                    <FieldLabel htmlFor={choice}>{choice}</FieldLabel>
                </Field>
            ))}
        </FieldGroup>
    )
}

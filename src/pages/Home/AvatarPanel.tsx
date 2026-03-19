import type { AvaProps } from "./Avatar";
import Ava from "./Avatar";

interface AvaPanelProsps {
    Avatars: Array<AvaProps>;
}

export default function AvaPanel({ Avatars }: AvaPanelProsps) {
    return (<div className="grid grid-cols-2 md:grid-cols-5 gap-x-5 gap-y-5 justify-items-center">
        {Avatars.map((value) => <Ava img={value.img} text={value.text} />)}
    </div>)
}
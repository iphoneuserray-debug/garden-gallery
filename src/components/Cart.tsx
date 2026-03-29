import { Button } from "@/components/ui/button"
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer"
import { ShoppingCart, X } from "lucide-react"

export function Cart() {
    return (
        <Drawer direction="right">
            <DrawerTrigger asChild>
                <Button variant="ghost" className="me-4 bg-transparent hover:bg-transparent"><ShoppingCart /></Button>
            </DrawerTrigger>
            <DrawerContent>
                <DrawerHeader>
                    <div className="flex justify-between">
                        <DrawerTitle>Cart</DrawerTitle>
                        <DrawerClose asChild>
                            <X className="me-4" />
                        </DrawerClose>
                    </div>
                </DrawerHeader>
                <div className="no-scrollbar overflow-y-auto px-4">
                    {/* Cart items */}
                </div>
                <DrawerFooter>
                    <Button disabled>Check Out</Button>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    )
}


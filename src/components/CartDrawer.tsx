import { Minus, Plus, Trash2, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Drawer } from './NavDrawer'
import { useCart } from '@/context/CartContext'

interface CartDrawerProps {
    open: boolean
    onClose: () => void
}

export default function CartDrawer({ open, onClose }: CartDrawerProps) {
    const { cart, subtotal, updateItemQty, removeItem } = useCart()
    const navigate = useNavigate()
    const empty = cart.items.length === 0

    const handleCheckout = () => {
        onClose()
        navigate('/checkout')
    }

    return (
        <Drawer open={open} onClose={onClose}>
            <div className="bg-[#F5EEE0] flex flex-col h-full">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-black/10 px-8 py-6">
                    <h2
                        className="font-black uppercase tracking-widest text-black"
                        style={{ fontSize: 'clamp(20px, 2.5vw, 26px)' }}
                    >
                        Cart
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-black/40 hover:text-black transition-colors"
                        aria-label="Close cart"
                    >
                        <X size={20} strokeWidth={1.5} />
                    </button>
                </div>

                {/* Items */}
                <div className="flex-1 overflow-y-auto px-8 py-6">
                    {empty ? (
                        <p className="text-black/30 uppercase tracking-widest text-xs font-bold">Your cart is empty</p>
                    ) : (
                        <div className="flex flex-col gap-6">
                            {cart.items.map(({ item, qty }) => (
                                <div key={item.id} className="flex gap-4 border-b border-black/10 pb-6">
                                    <img src={item.imgSrc} alt={item.title} className="h-24 w-24 object-cover bg-black/5" />
                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-start justify-between gap-3">
                                            <div>
                                                <p className="text-sm font-semibold uppercase tracking-wider">{item.title}</p>
                                                <p className="mt-1 text-xs uppercase tracking-widest text-black/40">{item.badge ?? 'Fresh Cut'}</p>
                                            </div>
                                            <button
                                                onClick={() => removeItem(item.id)}
                                                className="text-black/40 hover:text-black transition-colors"
                                                aria-label={`Remove ${item.title} from cart`}
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                        <p className="mt-3 text-sm">${item.price.toFixed(2)}</p>
                                        <div className="mt-4 flex items-center justify-between gap-4">
                                            <div className="flex items-center border border-black/20">
                                                <button
                                                    onClick={() => updateItemQty(item.id, qty - 1)}
                                                    className="flex h-8 w-8 items-center justify-center hover:bg-black/5 transition-colors"
                                                >
                                                    <Minus size={14} />
                                                </button>
                                                <span className="flex h-8 min-w-8 items-center justify-center border-x border-black/20 px-2 text-sm">{qty}</span>
                                                <button
                                                    onClick={() => updateItemQty(item.id, qty + 1)}
                                                    className="flex h-8 w-8 items-center justify-center hover:bg-black/5 transition-colors"
                                                >
                                                    <Plus size={14} />
                                                </button>
                                            </div>
                                            <p className="text-sm font-medium">${(item.price * qty).toFixed(2)}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="px-8 pb-8 pt-4 border-t border-black/10">
                    <div className="mb-4 flex items-center justify-between text-sm uppercase tracking-widest">
                        <span className="text-black/50">Subtotal</span>
                        <span className="font-semibold text-black">${subtotal.toFixed(2)}</span>
                    </div>
                    <button
                        className="w-full bg-black text-white uppercase tracking-widest font-bold py-4 text-sm hover:bg-white hover:text-black border border-black transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-40"
                        disabled={empty}
                        onClick={handleCheckout}
                    >
                        Check Out
                    </button>
                </div>
            </div>
        </Drawer>
    )
}

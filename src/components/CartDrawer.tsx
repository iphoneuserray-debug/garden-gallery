import { Minus, Plus, Trash2, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Drawer } from './NavDrawer'
import { useCart } from '@/context/CartContext'
import styles from './CartDrawer.module.css'

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
            <div className={styles.wrapper}>
                {/* Header */}
                <div className={styles.header}>
                    <h2 className={styles.title}>
                        Cart
                    </h2>
                    <button
                        onClick={onClose}
                        className={styles.closeButton}
                        aria-label="Close cart"
                    >
                        <X size={20} strokeWidth={1.5} />
                    </button>
                </div>

                {/* Items */}
                <div className={styles.itemsWrap}>
                    {empty ? (
                        <p className={styles.emptyText}>Your cart is empty</p>
                    ) : (
                        <div className={styles.itemsList}>
                            {cart.items.map(({ item, qty }) => (
                                <div key={item.id} className={styles.itemRow}>
                                    <img src={item.imgSrc} alt={item.title} className={styles.itemImg} />
                                    <div className={styles.itemInfo}>
                                        <div className={styles.itemTopRow}>
                                            <div>
                                                <p className={styles.itemTitle}>{item.title}</p>
                                                <p className={styles.itemBadge}>{item.badge ?? 'Fresh Cut'}</p>
                                            </div>
                                            <button
                                                onClick={() => removeItem(item.id)}
                                                className={styles.removeButton}
                                                aria-label={`Remove ${item.title} from cart`}
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                        <p className={styles.itemPrice}>${item.price.toFixed(2)}</p>
                                        <div className={styles.qtyRow}>
                                            <div className={styles.qtyControls}>
                                                <button
                                                    onClick={() => updateItemQty(item.id, qty - 1)}
                                                    className={styles.qtyButton}
                                                >
                                                    <Minus size={14} />
                                                </button>
                                                <span className={styles.qtyValue}>{qty}</span>
                                                <button
                                                    onClick={() => updateItemQty(item.id, qty + 1)}
                                                    className={styles.qtyButton}
                                                >
                                                    <Plus size={14} />
                                                </button>
                                            </div>
                                            <p className={styles.lineTotal}>${(item.price * qty).toFixed(2)}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className={styles.footer}>
                    <div className={styles.subtotalRow}>
                        <span className={styles.subtotalLabel}>Subtotal</span>
                        <span className={styles.subtotalValue}>${subtotal.toFixed(2)}</span>
                    </div>
                    <button
                        className={styles.checkoutButton}
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

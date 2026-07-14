import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { Crumb } from '@/components/Crumb'
import { useCart } from '@/context/CartContext'
import styles from './Checkout.module.css'

const STRIPE_PK = (import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY as string | undefined) ?? ''
const API_BASE = (import.meta.env.VITE_API_BASE as string | undefined) ?? 'http://localhost:3000'
const stripePromise = STRIPE_PK ? loadStripe(STRIPE_PK) : null

async function createPaymentIntent(cart: ReturnType<typeof useCart>['cart'], details: Record<string, unknown>) {
    const items = cart.items.map(({ item, qty }) => ({ productId: item.id, quantity: qty }))
    const res = await fetch(`${API_BASE}/payment/checkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cart: items, ...details }),
    })
    if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body?.message ?? `Checkout failed: ${res.status}`)
    }
    return (await res.json()).clientSecret as string
}

function PayForm() {
    const stripe = useStripe()
    const elements = useElements()
    const navigate = useNavigate()
    const { clearCart } = useCart()
    const [error, setError] = useState<string | null>(null)
    const [processing, setProcessing] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!stripe || !elements) return
        setProcessing(true)
        setError(null)
        const { error: stripeError } = await stripe.confirmPayment({
            elements,
            confirmParams: { return_url: `${window.location.origin}/checkout/success` },
            redirect: 'if_required',
        })
        if (stripeError) {
            setError(stripeError.message ?? 'Payment failed.')
            setProcessing(false)
            return
        }
        clearCart()
        navigate('/checkout/success')
    }

    return (
        <form onSubmit={handleSubmit} className={styles.form}>
            <PaymentElement />
            {error && <p className={styles.errorText}>{error}</p>}
            <button
                type="submit"
                disabled={!stripe || processing}
                className={styles.submitButton}
            >
                {processing ? 'Processing…' : 'Pay Now'}
            </button>
        </form>
    )
}

interface PickupLocation { id: string; name: string }
interface Coupon { code: string; discountAud: number }

export default function Checkout() {
    const { cart, subtotal } = useCart()
    const navigate = useNavigate()
    const [clientSecret, setClientSecret] = useState<string | null>(null)
    const [apiError, setApiError] = useState<string | null>(null)
    const [submitting, setSubmitting] = useState(false)
    const [pickupLocations, setPickupLocations] = useState<PickupLocation[]>([])
    const [pickupId, setPickupId] = useState('')
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('')
    const [wechat, setWechat] = useState('')
    const [deliveryType, setDeliveryType] = useState<'pickup' | 'delivery'>('pickup')
    const [line1, setLine1] = useState('')
    const [city, setCity] = useState('')
    const [state, setState] = useState('')
    const [postalCode, setPostalCode] = useState('')
    const [scheduledDate, setScheduledDate] = useState('')
    const [scheduledTime, setTimeSlot] = useState('09:00-13:00')
    const [couponCode, setCouponCode] = useState('')
    const [coupon, setCoupon] = useState<Coupon | null>(null)
    const [couponError, setCouponError] = useState<string | null>(null)
    const [couponLoading, setCouponLoading] = useState(false)

    useEffect(() => {
        // Skip the empty-cart redirect once a payment is in flight/succeeded — clearCart()
        // after a successful payment also empties the cart, which would otherwise bounce
        // this still-mounted page back to "/" instead of letting navigate('/checkout/success') stick.
        if (cart.items.length === 0) { if (!clientSecret) navigate('/'); return }
        fetch(`${API_BASE}/pickup-locations/active`)
            .then(r => r.json())
            .then((locs: PickupLocation[]) => { setPickupLocations(locs); if (locs.length > 0) setPickupId(locs[0].id) })
            .catch(() => {})
    }, [cart.items.length, navigate, clientSecret])

    const applyCoupon = async () => {
        if (!couponCode.trim()) return
        setCouponLoading(true)
        setCouponError(null)
        try {
            const res = await fetch(`${API_BASE}/coupons/validate?code=${encodeURIComponent(couponCode.trim())}&subtotal=${subtotal}`)
            const data = await res.json()
            if (data.valid && data.discountAud != null) {
                setCoupon({ code: couponCode.trim().toUpperCase(), discountAud: data.discountAud })
            } else {
                setCouponError(data.message ?? 'Invalid coupon code.')
            }
        } catch {
            setCouponError('Could not validate coupon. Please try again.')
        } finally {
            setCouponLoading(false)
        }
    }

    const total = subtotal - (coupon?.discountAud ?? 0)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setSubmitting(true)
        setApiError(null)
        const details = {
            name, email,
            ...(phone && { phone }),
            ...(wechat && { wechatNumber: wechat }),
            deliveryType,
            ...(scheduledDate && { scheduledDate }),
            scheduledTime,
            ...(deliveryType === 'delivery'
                ? { deliveryAddress: { line1, city, state, postalCode } }
                : { pickupLocationId: pickupId }),
            ...(coupon && { couponCode: coupon.code }),
        }
        try {
            const secret = await createPaymentIntent(cart, details)
            setClientSecret(secret)
        } catch (err) {
            setApiError(err instanceof Error ? err.message : String(err))
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <>
            <h1
                className={styles.heading}
                style={{ fontSize: 'clamp(36px, 6vw, 90px)', letterSpacing: '-0.02em' }}
            >
                Checkout
            </h1>
            <Crumb />
            <div className={styles.layout}>
                {/* Order summary */}
                <div className={styles.summaryCol}>
                    <p className={styles.sectionLabel}>Order Summary</p>
                    <div className={styles.itemsList}>
                        {cart.items.map(({ item, qty }) => (
                            <div key={item.id} className={styles.itemRow}>
                                <img src={item.imgSrc} alt={item.title} className={styles.itemImg} />
                                <div className={styles.itemInfo}>
                                    <p className={styles.itemTitle}>{item.title}</p>
                                    <p className={styles.itemQty}>Qty: {qty}</p>
                                </div>
                                <p className={styles.itemPrice}>${(item.price * qty).toFixed(2)}</p>
                            </div>
                        ))}
                    </div>

                    {/* Coupon */}
                    <div className={styles.couponWrap}>
                        <div className={styles.couponRow}>
                            <input
                                type="text"
                                value={couponCode}
                                onChange={e => { setCouponCode(e.target.value); setCouponError(null); if (coupon) setCoupon(null) }}
                                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), applyCoupon())}
                                placeholder="Coupon code"
                                disabled={!!coupon}
                                className={styles.couponInput}
                            />
                            {coupon ? (
                                <button type="button" onClick={() => { setCoupon(null); setCouponCode('') }} className={styles.couponButton}>
                                    Remove
                                </button>
                            ) : (
                                <button type="button" onClick={applyCoupon} disabled={couponLoading || !couponCode.trim()} className={styles.couponButton}>
                                    {couponLoading ? '…' : 'Apply'}
                                </button>
                            )}
                        </div>
                        {couponError && <p className={styles.couponError}>{couponError}</p>}
                        {coupon && <p className={styles.couponSuccess}>{coupon.code} — −${coupon.discountAud.toFixed(2)} off</p>}
                    </div>

                    {coupon && (
                        <div className={styles.summaryRow}>
                            <span>Subtotal</span><span>${subtotal.toFixed(2)}</span>
                        </div>
                    )}
                    {coupon && (
                        <div className={styles.discountRow}>
                            <span>Discount</span><span>−${coupon.discountAud.toFixed(2)}</span>
                        </div>
                    )}
                    <div className={styles.totalRow}>
                        <span className={styles.totalLabel}>Total</span>
                        <span className={styles.totalValue}>${total.toFixed(2)}</span>
                    </div>
                </div>

                {/* Form / Payment */}
                <div className={styles.formCol}>
                    {clientSecret ? (
                        <div>
                            <p className={styles.sectionLabel}>Payment</p>
                            <Elements stripe={stripePromise} options={{ clientSecret }}>
                                <PayForm />
                            </Elements>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className={styles.form}>
                            <div>
                                <p className={styles.sectionLabel}>Contact</p>
                                <div className={styles.fieldGroup}>
                                    <div>
                                        <label className={styles.fieldLabel}>Name</label>
                                        <input required type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Full name" className={styles.fieldInput} />
                                    </div>
                                    <div>
                                        <label className={styles.fieldLabel}>Email</label>
                                        <input required type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" className={styles.fieldInput} />
                                    </div>
                                    <div>
                                        <label className={styles.fieldLabel}>Phone (optional)</label>
                                        <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+61 4xx xxx xxx" className={styles.fieldInput} />
                                    </div>
                                    <div>
                                        <label className={styles.fieldLabel}>WeChat (optional)</label>
                                        <input type="text" value={wechat} onChange={e => setWechat(e.target.value)} placeholder="WeChat ID" className={styles.fieldInput} />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <p className={styles.sectionLabel}>Delivery</p>
                                <div className={styles.deliveryToggleRow}>
                                    {(['pickup', 'delivery'] as const).map(type => (
                                        <button
                                            key={type}
                                            type="button"
                                            onClick={() => setDeliveryType(type)}
                                            className={`${styles.deliveryButton} ${deliveryType === type ? styles.deliveryButtonActive : ''}`}
                                        >
                                            {type === 'pickup' ? 'Pick Up' : 'Delivery'}
                                        </button>
                                    ))}
                                </div>

                                {deliveryType === 'pickup' && pickupLocations.length > 0 && (
                                    <div>
                                        <label className={styles.fieldLabel}>Pick-up location</label>
                                        <select value={pickupId} onChange={e => setPickupId(e.target.value)} className={styles.fieldInput}>
                                            {pickupLocations.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
                                        </select>
                                    </div>
                                )}

                                {deliveryType === 'delivery' && (
                                    <div className={styles.fieldGroup}>
                                        <div>
                                            <label className={styles.fieldLabel}>Address</label>
                                            <input required type="text" value={line1} onChange={e => setLine1(e.target.value)} placeholder="Street address" className={styles.fieldInput} />
                                        </div>
                                        <div className={styles.twoColGrid}>
                                            <div>
                                                <label className={styles.fieldLabel}>City</label>
                                                <input required type="text" value={city} onChange={e => setCity(e.target.value)} placeholder="Melbourne" className={styles.fieldInput} />
                                            </div>
                                            <div>
                                                <label className={styles.fieldLabel}>State</label>
                                                <input required type="text" value={state} onChange={e => setState(e.target.value)} placeholder="VIC" className={styles.fieldInput} />
                                            </div>
                                        </div>
                                        <div>
                                            <label className={styles.fieldLabel}>Postcode</label>
                                            <input required type="text" value={postalCode} onChange={e => setPostalCode(e.target.value)} placeholder="3000" className={styles.fieldInput} />
                                        </div>
                                    </div>
                                )}

                                {/* Date + time */}
                                <div className={styles.fieldGroup} style={{ marginTop: '0.5rem' }}>
                                    <div>
                                        <label className={styles.fieldLabel}>
                                            {deliveryType === 'pickup' ? 'Pick-up Date' : 'Delivery Date'}
                                        </label>
                                        {deliveryType === 'pickup' && (
                                            <p className={styles.helperText}>Pick-up available every Tuesday</p>
                                        )}
                                        <input
                                            required
                                            type="date"
                                            value={scheduledDate}
                                            onChange={e => setScheduledDate(e.target.value)}
                                            min={new Date(Date.now() + 86400000).toISOString().split('T')[0]}
                                            className={styles.fieldInput}
                                        />
                                    </div>
                                    <div>
                                        <label className={styles.fieldLabel}>Preferred Time</label>
                                        <select value={scheduledTime} onChange={e => setTimeSlot(e.target.value)} className={styles.fieldInput}>
                                            <option value="09:00-13:00">Morning (9 am – 1 pm)</option>
                                            <option value="13:00-17:00">Afternoon (1 pm – 5 pm)</option>
                                            <option value="17:00-20:00">Evening (5 pm – 8 pm)</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {apiError && <p className={styles.errorText}>{apiError}</p>}
                            <button
                                type="submit"
                                disabled={submitting}
                                className={styles.submitButton}
                            >
                                {submitting ? 'Processing…' : 'Continue to Payment'}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </>
    )
}

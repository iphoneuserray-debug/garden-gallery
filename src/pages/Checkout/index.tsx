import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { Crumb } from '@/components/Crumb'
import { useCart } from '@/context/CartContext'

const STRIPE_PK = 'pk_test_51TL0lbPRK5sLXdEcUJ3V5vM9U5RJR08tbA21sM6c25DMjQn9cynOgyyeB3h4aTKk6jmArtdWvNaR82QHW7o4ePGM00b6vQfOnc'
const API_BASE = (import.meta.env.VITE_API_BASE as string | undefined) ?? 'http://localhost:3000'
const stripePromise = loadStripe(STRIPE_PK)

const inputCls = 'w-full border border-black py-3 px-4 text-sm focus:outline-none bg-transparent placeholder:text-black/30 rounded-none'
const labelCls = 'block text-xs tracking-[0.25em] uppercase text-black/40 mb-1'

async function createPaymentIntent(cart: ReturnType<typeof useCart>['cart'], details: Record<string, unknown>) {
    const items = cart.items.map(({ item, qty }) => ({ productId: item.id, quantity: qty }))
    const res = await fetch(`${API_BASE}/payment/checkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cart: items, ...details }),
    })
    if (!res.ok) throw new Error(`Checkout failed: ${res.status}`)
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
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <PaymentElement />
            {error && <p className="text-sm text-red-600 uppercase tracking-widest">{error}</p>}
            <button
                type="submit"
                disabled={!stripe || processing}
                className="w-full bg-black text-white uppercase tracking-widest font-bold py-4 text-sm hover:bg-white hover:text-black border border-black transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-40"
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
    const [couponCode, setCouponCode] = useState('')
    const [coupon, setCoupon] = useState<Coupon | null>(null)
    const [couponError, setCouponError] = useState<string | null>(null)
    const [couponLoading, setCouponLoading] = useState(false)

    useEffect(() => {
        if (cart.items.length === 0) { navigate('/'); return }
        fetch(`${API_BASE}/pickup-locations/active`)
            .then(r => r.json())
            .then((locs: PickupLocation[]) => { setPickupLocations(locs); if (locs.length > 0) setPickupId(locs[0].id) })
            .catch(() => {})
    }, [cart.items.length, navigate])

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
            ...(deliveryType === 'delivery' ? { deliveryAddress: { line1, city, state, postalCode } } : { pickupLocationId: pickupId }),
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
                className="font-light leading-none mb-5"
                style={{ fontSize: 'clamp(36px, 6vw, 90px)', letterSpacing: '-0.02em' }}
            >
                Checkout
            </h1>
            <Crumb />
            <div className="mt-8 flex flex-col lg:flex-row gap-12 lg:gap-20">
                {/* Order summary */}
                <div className="lg:w-[40%]">
                    <p className="text-xs tracking-[0.25em] uppercase text-black/40 mb-4">Order Summary</p>
                    <div className="flex flex-col gap-4">
                        {cart.items.map(({ item, qty }) => (
                            <div key={item.id} className="flex items-center gap-4 border-b border-black/10 pb-4">
                                <img src={item.imgSrc} alt={item.title} className="h-16 w-16 object-cover bg-black/5" />
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold uppercase tracking-wider">{item.title}</p>
                                    <p className="text-xs text-black/40 mt-0.5">Qty: {qty}</p>
                                </div>
                                <p className="text-sm font-medium">${(item.price * qty).toFixed(2)}</p>
                            </div>
                        ))}
                    </div>

                    {/* Coupon */}
                    <div className="mt-4">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={couponCode}
                                onChange={e => { setCouponCode(e.target.value); setCouponError(null); if (coupon) setCoupon(null) }}
                                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), applyCoupon())}
                                placeholder="Coupon code"
                                disabled={!!coupon}
                                className="flex-1 border border-black py-2 px-3 text-sm focus:outline-none bg-transparent placeholder:text-black/30 rounded-none disabled:opacity-40"
                            />
                            {coupon ? (
                                <button type="button" onClick={() => { setCoupon(null); setCouponCode('') }} className="border border-black px-3 py-2 text-xs uppercase tracking-widest hover:bg-black hover:text-white transition-colors">
                                    Remove
                                </button>
                            ) : (
                                <button type="button" onClick={applyCoupon} disabled={couponLoading || !couponCode.trim()} className="border border-black px-3 py-2 text-xs uppercase tracking-widest hover:bg-black hover:text-white transition-colors disabled:opacity-40">
                                    {couponLoading ? '…' : 'Apply'}
                                </button>
                            )}
                        </div>
                        {couponError && <p className="text-xs text-red-600 mt-1">{couponError}</p>}
                        {coupon && <p className="text-xs text-green-700 mt-1 uppercase tracking-wider">{coupon.code} — −${coupon.discountAud.toFixed(2)} off</p>}
                    </div>

                    {coupon && (
                        <div className="flex justify-between items-center mt-3 text-sm uppercase tracking-widest text-black/40">
                            <span>Subtotal</span><span>${subtotal.toFixed(2)}</span>
                        </div>
                    )}
                    {coupon && (
                        <div className="flex justify-between items-center mt-1 text-sm uppercase tracking-widest text-green-700">
                            <span>Discount</span><span>−${coupon.discountAud.toFixed(2)}</span>
                        </div>
                    )}
                    <div className="flex justify-between items-center mt-3 text-sm uppercase tracking-widest border-t border-black/10 pt-3">
                        <span className="text-black/50">Total</span>
                        <span className="font-semibold">${total.toFixed(2)}</span>
                    </div>
                </div>

                {/* Form / Payment */}
                <div className="flex-1">
                    {clientSecret ? (
                        <div>
                            <p className="text-xs tracking-[0.25em] uppercase text-black/40 mb-4">Payment</p>
                            <Elements stripe={stripePromise} options={{ clientSecret }}>
                                <PayForm />
                            </Elements>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                            <div>
                                <p className="text-xs tracking-[0.25em] uppercase text-black/40 mb-4">Contact</p>
                                <div className="flex flex-col gap-4">
                                    <div>
                                        <label className={labelCls}>Name</label>
                                        <input required type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Full name" className={inputCls} />
                                    </div>
                                    <div>
                                        <label className={labelCls}>Email</label>
                                        <input required type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" className={inputCls} />
                                    </div>
                                    <div>
                                        <label className={labelCls}>Phone (optional)</label>
                                        <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+61 4xx xxx xxx" className={inputCls} />
                                    </div>
                                    <div>
                                        <label className={labelCls}>WeChat (optional)</label>
                                        <input type="text" value={wechat} onChange={e => setWechat(e.target.value)} placeholder="WeChat ID" className={inputCls} />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <p className="text-xs tracking-[0.25em] uppercase text-black/40 mb-4">Delivery</p>
                                <div className="flex gap-4 mb-4">
                                    {(['pickup', 'delivery'] as const).map(type => (
                                        <button
                                            key={type}
                                            type="button"
                                            onClick={() => setDeliveryType(type)}
                                            className={`flex-1 py-3 text-xs uppercase tracking-widest font-bold border transition-colors ${deliveryType === type ? 'bg-black text-white border-black' : 'bg-transparent text-black border-black/30 hover:border-black'}`}
                                        >
                                            {type === 'pickup' ? 'Pick Up' : 'Delivery'}
                                        </button>
                                    ))}
                                </div>

                                {deliveryType === 'pickup' && pickupLocations.length > 0 && (
                                    <div>
                                        <label className={labelCls}>Pick-up location</label>
                                        <select value={pickupId} onChange={e => setPickupId(e.target.value)} className={inputCls}>
                                            {pickupLocations.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
                                        </select>
                                    </div>
                                )}

                                {deliveryType === 'delivery' && (
                                    <div className="flex flex-col gap-4">
                                        <div>
                                            <label className={labelCls}>Address</label>
                                            <input required type="text" value={line1} onChange={e => setLine1(e.target.value)} placeholder="Street address" className={inputCls} />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className={labelCls}>City</label>
                                                <input required type="text" value={city} onChange={e => setCity(e.target.value)} placeholder="Melbourne" className={inputCls} />
                                            </div>
                                            <div>
                                                <label className={labelCls}>State</label>
                                                <input required type="text" value={state} onChange={e => setState(e.target.value)} placeholder="VIC" className={inputCls} />
                                            </div>
                                        </div>
                                        <div>
                                            <label className={labelCls}>Postcode</label>
                                            <input required type="text" value={postalCode} onChange={e => setPostalCode(e.target.value)} placeholder="3000" className={inputCls} />
                                        </div>
                                    </div>
                                )}
                            </div>

                            {apiError && <p className="text-sm text-red-600 uppercase tracking-widest">{apiError}</p>}
                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full bg-black text-white uppercase tracking-widest font-bold py-4 text-sm hover:bg-white hover:text-black border border-black transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-40"
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

import { Link } from 'react-router-dom'

export default function CheckoutSuccess() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center gap-6">
            <h1
                className="font-light"
                style={{ fontSize: 'clamp(36px, 6vw, 90px)', letterSpacing: '-0.02em' }}
            >
                Thank You
            </h1>
            <p className="text-black/50 uppercase tracking-widest text-sm">
                Your order has been placed successfully.
            </p>
            <Link
                to="/products"
                className="mt-4 border border-black px-8 py-3 text-sm uppercase tracking-widest font-bold hover:bg-black hover:text-white transition-colors duration-200"
            >
                Continue Shopping
            </Link>
        </div>
    )
}

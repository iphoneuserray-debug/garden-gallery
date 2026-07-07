import { Link } from 'react-router-dom'
import styles from './Success.module.css'

export default function CheckoutSuccess() {
    return (
        <div className={styles.wrapper}>
            <h1
                className={styles.heading}
                style={{ fontSize: 'clamp(36px, 6vw, 90px)', letterSpacing: '-0.02em' }}
            >
                Thank You
            </h1>
            <p className={styles.subtitle}>
                Your order has been placed successfully.
            </p>
            <Link
                to="/products"
                className={styles.link}
            >
                Continue Shopping
            </Link>
        </div>
    )
}

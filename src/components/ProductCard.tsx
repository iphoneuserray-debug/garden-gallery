import { Link } from "react-router-dom";
import styles from "./ProductCard.module.css"


export default function ProductCard({ title, price, imgSrc, to }: { title: string; price: string; imgSrc: string; to: string }) {
    return (
        <Link to={to} className={styles.card}>
            <div className={styles.cardImageWrap}>
                <img
                    src={imgSrc}
                    alt={`${title}-Image`}
                    className={styles.cardImage}
                />
            </div>
            <div className={styles.cardInfo}>
                <p className={styles.cardTitle}>{title}</p>
                <p className={styles.cardPrice}>{price}</p>
            </div>
        </Link>
    )
}


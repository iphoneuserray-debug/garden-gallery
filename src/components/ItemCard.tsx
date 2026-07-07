import { Link } from "react-router-dom";
import styles from './ItemCard.module.css';

interface Props {
    title: string;
    price: string;
    imgSrc: string;
    badge?: string;
    to?: string;
}


export default function ItemCard({ title, price, imgSrc }: Props) {
    return (
        <Link to={`/detail/${title}`} >
            <img src={imgSrc} alt={`${title}-Image`} className={styles.image} />
            <div className={styles.info}>
                <h4 className={styles.title}>{title}</h4>
                <h5 className={styles.price}>{price}</h5>
            </div>
        </Link >
    )
}

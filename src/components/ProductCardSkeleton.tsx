import { Skeleton } from "./ui/skeleton";
import styles from "./ProductCardSkeleton.module.css"

export default function ProductCardSkeleton() {
    return (
        <div>
            <Skeleton className={styles.skeletonImage} />
            <Skeleton className={styles.skeletonTitle} />
            <Skeleton className={styles.skeletonPrice} />
        </div>
    )
}

import styles from './Caution.module.css';

interface CautionProps {
    children: string;
}

export default function Caution({ children }: CautionProps) {
    return (
        <div className={styles.wrapper}>
            <p className={styles.text}>
                {children}
            </p>
        </div>
    );
}
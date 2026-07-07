import React from 'react';
import styles from './Footer.module.css';

const Footer: React.FC = () => {
    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                <div className={styles.grid}>
                    {/* Company Info */}
                    <div>
                        <h3 className={styles.heading}>Flower Store</h3>
                        <p className={styles.mutedText}>Your destination for fresh flowers and arrangements.</p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className={styles.heading}>Quick Links</h3>
                        <ul className={styles.linkList}>
                            <li><a href="#">Home</a></li>
                            <li><a href="#">Shop</a></li>
                            <li><a href="#">About</a></li>
                            <li><a href="#">Contact</a></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className={styles.heading}>Contact</h3>
                        <p className={styles.mutedText}>Email: info@flowerstore.com</p>
                        <p className={styles.mutedText}>Phone: (555) 123-4567</p>
                    </div>
                </div>

                {/* Bottom Section */}
                <div className={styles.bottom}>
                    <p>&copy; 2026 Flower Store. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;

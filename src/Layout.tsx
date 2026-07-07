import { Outlet } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import { Toaster } from 'sonner'
import styles from './Layout.module.css'

export default function Layout() {
    return (
        <>
            <Header />
            <main className={styles.main}>
                <Outlet />
            </main>
            <Footer />
            <Toaster position="bottom-center" />
        </>
    )
}

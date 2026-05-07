import { Outlet } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'

export default function Layout() {
    return (
        <>
            <Header />
            <main className="p-8 w-full max-w-[1440px] mx-auto">
                <Outlet />
            </main>
            <Footer />
        </>
    )
}

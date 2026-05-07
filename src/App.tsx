import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Products from './pages/Products'
import Detail from './pages/Detail'
import Checkout from './pages/Checkout'
import CheckoutSuccess from './pages/Checkout/Success'
import Layout from './Layout'
import Login from './components/Login'
import { CartProvider } from './context/CartContext'

export default function App() {
    return (
        <CartProvider>
            <BrowserRouter>
                <Routes>
                    <Route element={<Layout />}>
                        <Route path="/" element={<Home />} />
                        <Route path="/products" element={<Products />} />
                        <Route path="/products/:text" element={<Products />} />
                        <Route path="/detail/:name" element={<Detail />} />
                        <Route path="/checkout" element={<Checkout />} />
                        <Route path="/checkout/success" element={<CheckoutSuccess />} />
                        <Route path="/login" element={<Login onLogin={() => { }} />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </CartProvider>
    )
}

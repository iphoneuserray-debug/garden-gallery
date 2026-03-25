import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Products from './pages/Products'
import Detail from './pages/Detail'
import Layout from './Layout'
import Login from './components/Login'

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<Layout />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/products" element={<Products />} />
                    <Route path="/detail/:name" element={<Detail />} />
                    <Route path="/login" element={<Login onLogin={() => {}} />} />
                </Route>
            </Routes>
        </BrowserRouter>
    )
}
import React from 'react'
import Home from './pages/Home/Home.jsx'
import DesktopOnly from './components/screen/MobielOnly.jsx'
import { Route, Routes } from 'react-router-dom'
import ProductDetail from './pages/ProductDetail/productDetail.jsx'
import Footer from './features/Home/Components/Footer/Footer.jsx'
import CartPage from './pages/Cart/CartPage.jsx'

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<DesktopOnly>
          <Home />
        </DesktopOnly>} />
        <Route path="/product/:productid" element={<DesktopOnly>
          <ProductDetail />
        </DesktopOnly>} />
        <Route path="/cart" element={<DesktopOnly>
          <CartPage />
        </DesktopOnly>} />
      </Routes>
      <Footer/>
    </div>
  )
}

export default App
import React from 'react'
import Home from './pages/Home/Home.jsx'
import DesktopOnly from './components/screen/MobielOnly.jsx'
import { Route, Routes } from 'react-router-dom'
import ProductDetail from './pages/ProductDetail/productDetail.jsx'
import Footer from './features/Home/Components/Footer/Footer.jsx'
import CartPage from './pages/Cart/CartPage.jsx'
import CheckoutPage from './pages/Checkout/CheckoutPage.jsx'
import SpecificCategoryProductPage from './pages/ProductDetail/SpecificCategoryProduct.jsx'
import PaymentSuccess from './features/Payment/components/PaymentSuccess.jsx'
import PaymentCancelled from './features/Payment/components/PaymentCancel.jsx'

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
          <Route path="/payment" element={<DesktopOnly>
          <CheckoutPage />
        </DesktopOnly>} />
        <Route path="/product" element={<DesktopOnly>
          <SpecificCategoryProductPage />
        </DesktopOnly>} />
         <Route path="/payment-success" element={<DesktopOnly>
          <PaymentSuccess />
        </DesktopOnly>} />
        <Route path="/payment-cancelled" element={<DesktopOnly>
          <PaymentCancelled />
        </DesktopOnly>} />
      </Routes>
      <Footer/>
    </div>
  )
}

export default App
import React from 'react'
import ProductDetail from './pages/productDetail/productDetail.jsx'
import Home from './pages/Home/Home.jsx'
import DesktopOnly from './components/screen/MobielOnly.jsx'
import { Route, Routes } from 'react-router-dom'

const App = () => {
  return (
    <div>
    <Routes>
      <Route path="/" element={ <DesktopOnly>
        <Home />
      </DesktopOnly>} />
       <Route path="/products/:productid" element={ <DesktopOnly>
        <ProductDetail />
      </DesktopOnly>} />
    </Routes>
    </div>
  )
}

export default App
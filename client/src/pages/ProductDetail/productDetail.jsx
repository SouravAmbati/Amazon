import React from 'react'
import ProductDetails from '../../features/ProductDetail/Components/productDetail.jsx'
import Navbar from '../../components/Navbar/Navbar'

const ProductDetail = () => {
  return (
    <div>
        <Navbar show={false}/>
        <ProductDetails/>
    </div>
  )
}

export default ProductDetail
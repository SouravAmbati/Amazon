import React from 'react'
import Cart from '../../features/Cart/Components/Cart'
import Navbar from '../../components/Navbar/Navbar'

const CartPage = () => {
  return (
    <div>
        <Navbar show={false}/>
        <Cart/>
    </div>
  )
}

export default CartPage
import React from 'react'
import CheckOut from '../../features/Checkout/Components/CheckOut'
import Navbar from '../../components/Navbar/Navbar'

const CheckoutPage = () => {
  return (
    <div>
        <Navbar show={false}/>
        <CheckOut/>
    </div>
  )
}

export default CheckoutPage
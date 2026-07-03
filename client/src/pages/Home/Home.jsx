import React, { useEffect, useState } from 'react'
import Navbar from '../../components/Navbar/Navbar.jsx'
import Carousel from '../../features/Home/Components/Carousel/carousel.jsx'
import CategoryCard from '../../features/Home/Components/CategoryCard/CategoryCard.jsx'
import Footer from '../../features/Home/Components/Footer/Footer.jsx'
import data from '../../features/Home/Data/ProductData.js'

const Home = () => {
  const [products,setProducts]=useState([]);
  useEffect(()=>{
    function fetchProducts(){
      if(!data){
        console.log("Data is not available")
      }else{
        setProducts(data);
      }
    }
    fetchProducts();
  },[])
  return (
    <div className="min-h-screen bg-[linear-gradient(to_bottom,#e3e6e6_0%,#f3f3f3_30%,#ffffff_100%)]">
      <Navbar />

      {/* Hero Banner */}
      <Carousel />

      {/* Cards */}
      <div className="relative
z-20
px-3
md:px-6
mt-4
md:-mt-60">
        <div className="max-w-[1500px] mt-8 mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {
            products.map((product,index)=>{
              return (<CategoryCard  key={product.id} categoryName={product.category} product={product}/>)
            })
          }
        </div>
      </div>
      <Footer/>
    </div>
  )
}

export default Home
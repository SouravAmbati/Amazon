import React, { useState } from 'react'
import SpecificCategoryProduct from '../../features/Product/SpecificCategoryProduct'
import Navbar from '../../components/Navbar/Navbar'
import { useSearchParams } from 'react-router-dom';

const SpecificCategoryProductPage = () => {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const type = searchParams.get("type");
  const limit = Number(searchParams.get("limit")) || 10;
  return (
    <div>
        <Navbar filter={type}/>
        <SpecificCategoryProduct/>
    </div>
  )
}

export default SpecificCategoryProductPage
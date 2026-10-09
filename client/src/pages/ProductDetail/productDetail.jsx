import React from "react";
import ProductDetails from "../../features/ProductDetail/Components/productDetail.jsx";
import Navbar from "../../components/Navbar/Navbar.jsx";

const ProductDetail = () => {
  return (
    <div className="min-h-screen w-full overflow-x-clip bg-white">
      <Navbar show={false} />
      <ProductDetails />
    </div>
  );
};

export default ProductDetail;
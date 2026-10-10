import React from "react";
import { useSearchParams } from "react-router-dom";

import Navbar from "../../components/Navbar/Navbar.jsx";
import SpecificCategoryProduct from "../../features/Product/SpecificCategoryProduct.jsx";

const SpecificCategoryProductPage = () => {
  const [searchParams] = useSearchParams();
  const type = searchParams.get("type");

  return (
    <div className="min-h-screen w-full overflow-x-clip bg-white">
      <Navbar filter={type} />
      <SpecificCategoryProduct />
    </div>
  );
};

export default SpecificCategoryProductPage;
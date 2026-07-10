import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import data from '../Home/Data/ProductData.js'
import CategoryCard from '../Home/Components/CategoryCard/CategoryCard.jsx';
import FilterProduct from '../Home/Components/FilterProducts/FilterProduct.jsx';

const SpecificCategoryProduct = () => {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const type = searchParams.get("type");
  const limit = Number(searchParams.get("limit")) || 10;
  const price = searchParams.get("price");
  useEffect(() => {
    function fetchProducts() {
        if (!data) return;

        const filteredCategories = data.filter(category =>
            category.category.startsWith(type)
        );

        const products = filteredCategories.flatMap(category => category.products);

        let filteredProducts = products;

        if (price) {
            const [min, max] = price.split("-");

            filteredProducts = products.filter(product => {
                if (max === "max") {
                    return product.price >= Number(min);
                }

                return (
                    product.price >= Number(min) &&
                    product.price <= Number(max)
                );
            });
        }

        setProducts(filteredProducts.slice(0, limit));
    }

    fetchProducts();

}, [type, limit, price]);
  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <h2 className="sr-only">Products</h2>
        <div className='mb-4'>
          <FilterProduct />
        </div>

        <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
          {products.map((product) => (
            <CategoryCard
              key={product.id}
              product={product}
              isListing={true}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default SpecificCategoryProduct
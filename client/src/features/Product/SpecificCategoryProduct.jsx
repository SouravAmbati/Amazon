import React, {
  useContext,
  useEffect,
  useState,
} from "react";

import { useSearchParams } from "react-router-dom";

import CategoryCard from "../Home/Components/CategoryCard/CategoryCard.jsx";
import FilterProduct from "../Home/Components/FilterProducts/FilterProduct.jsx";
import { ProductContext } from "../../contexts/ProductContext.jsx";

const SpecificCategoryProduct = () => {
  const [searchParams] = useSearchParams();

  const type = searchParams.get("type");
  const limit = Number(searchParams.get("limit")) || 10;
  const price = searchParams.get("price");

  const {
    getProductsByCategory,
    getProductsByFilter,
  } = useContext(ProductContext);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!type) {
      setProducts([]);
      return;
    }

    const fetchProducts = async () => {
      try {
        setLoading(true);

        let response;

        if (!price) {
          response = await getProductsByCategory(type, limit);
        } else {
          response = await getProductsByFilter(
            type,
            limit,
            price
          );
        }

        if (!response.success) {
          console.error(
            "Product API error:",
            response.message
          );

          setProducts([]);
          return;
        }

        const formattedProducts = response.data.map(
          (product) => ({
            id: product.id,
            name: product.product_name,
            price: product.price,
            images: product.images || [],
          })
        );

        setProducts(formattedProducts);
      } catch (error) {
        console.error("Fetch products error:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [
    type,
    limit,
    price,
    getProductsByCategory,
    getProductsByFilter,
  ]);

  return (
    <main className="min-h-screen w-full bg-white">
      <div className="mx-auto w-full max-w-[1600px] px-3 py-6 sm:px-5 sm:py-8 md:px-8 lg:px-10 lg:py-12">

        {/* FILTER */}
        <div className="mb-5 sm:mb-6">
          <FilterProduct />
        </div>

        {/* LOADING */}
        {loading && (
          <div className="flex min-h-48 items-center justify-center py-10">
            <div
              className="h-10 w-10 animate-spin rounded-full border-4 border-gray-300 border-t-indigo-600"
              role="status"
              aria-label="Loading products"
            />
          </div>
        )}

        {/* PRODUCTS */}
        {!loading && products.length > 0 && (
          <div className="grid min-w-0 grid-cols-2 gap-x-3 gap-y-7 min-[520px]:grid-cols-3 sm:gap-x-5 sm:gap-y-9 lg:grid-cols-4 xl:grid-cols-5 xl:gap-x-6">
            {products.map((product) => (
              <CategoryCard
                key={product.id}
                product={product}
                isListing={true}
              />
            ))}
          </div>
        )}

        {/* NO PRODUCTS */}
        {!loading && products.length === 0 && (
          <div className="flex min-h-48 items-center justify-center py-10 text-center">
            <p className="text-sm text-gray-500 sm:text-base">
              No products found.
            </p>
          </div>
        )}
      </div>
    </main>
  );
};

export default SpecificCategoryProduct;
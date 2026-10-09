import React from "react";
import { Link } from "react-router-dom";

const CategoryCard = ({
  categoryName,
  product,
  isListing = false,
}) => {
  if (isListing) {
    return (
      <Link
        to={`/product/${product.id}`}
        className="group block min-w-0"
      >
        <img
          src={product.images?.[0]}
          alt={product.name}
          className="aspect-square w-full rounded-lg bg-gray-200 object-cover transition-opacity group-hover:opacity-75"
        />

        <h3 className="mt-2 break-words text-sm text-gray-700 sm:mt-4">
          {product.name}
        </h3>

        <p className="mt-1 text-base font-medium text-gray-900 sm:text-lg">
          ₹{product.price}
        </p>
      </Link>
    );
  }

  return (
    <div className="h-full min-w-0 bg-white p-3 shadow-md sm:p-4">
      <h2 className="mb-3 break-words text-base font-bold leading-snug sm:mb-4 sm:text-lg">
        Keep shopping for {categoryName}
      </h2>

      <div className="grid grid-cols-2 gap-x-3 gap-y-4 sm:gap-x-4 sm:gap-y-5">
        {product.products.map((item) => (
          <div key={item.id} className="min-w-0">
            <Link
              to={`/product/${item.id}`}
              className="block"
            >
              <img
                src={item.images?.[0]}
                alt={item.name}
                loading="lazy"
                className="aspect-square w-full cursor-pointer bg-gray-100 object-cover"
              />
            </Link>

            <p className="mt-2 break-words text-xs font-medium leading-snug sm:text-sm">
              {item.name}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryCard;
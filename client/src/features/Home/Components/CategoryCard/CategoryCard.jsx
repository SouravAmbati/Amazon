import React from "react";
import { Link } from 'react-router-dom';

const CategoryCard = ({categoryName,product,isListing = false}) => {
  if (isListing) {
    return (
      <Link
        to={`/product/${product.id}`}
        className="group"
      >
        <img
          src={product.images[0]}
          alt={product.name}
          className="aspect-square w-full rounded-lg bg-gray-200 object-cover group-hover:opacity-75"
        />

        <h3 className="mt-4 text-sm text-gray-700">
          {product.name}
        </h3>

        <p className="mt-1 text-lg font-medium text-gray-900">
          ₹{product.price}
        </p>
      </Link>
    );
  }

  return (
    <div className="bg-white shadow-md p-4">
      <h2 className="text-xl font-bold mb-4">
        Keep shopping for {categoryName}
      </h2>

      <div className="grid grid-cols-2 gap-3">
        {product.products.map((product, index) => (
          <div key={index}>
          <Link to={`/product/${product.id}`}>
            <img
              src={product.images[0]}
              className="w-full cursor-pointer aspect-square object-cover"
            />
          </Link>

            <p className="mt-2 text-sm font-medium">
              {product.name}
            </p>

            <p className="text-xs text-gray-500">
              2 viewed
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryCard;
import React from "react";

const CategoryCard = ({categoryName,product}) => {

  return (
    <div className="bg-white shadow-md p-4">
      <h2 className="text-xl font-bold mb-4">
        Keep shopping for {categoryName}
      </h2>

      <div className="grid grid-cols-2 gap-3">
        {product.products.map((product, index) => (
          <div key={index}>
            <img
              src={product.image}
              className="w-full cursor-pointer aspect-square object-cover"
            />

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
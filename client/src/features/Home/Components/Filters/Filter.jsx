import React from "react";
import { FiFilter } from "react-icons/fi";
import { Link } from "react-router-dom";

const categories = [
  "Electronics",
  "Fashion",
  "Books",
  "Home & Kitchen",
  "Beauty",
  "Sports",
];

const FloatingFilter = () => {
  return (
    <div className="fab fixed bottom-6 right-6 z-50">

      {/* Main FAB Button */}
      <div
        tabIndex={0}
        role="button"
        className="
    btn
    btn-lg
    btn-circle
    bg-yellow-500
    hover:text-white
    text-black
    border-0
    shadow-xl
    hover:bg-yellow-700
  "
      >
        C
      </div>

      {/* Category Buttons */}
      {categories.map((item) => (
        <Link
          key={item}
          to={`/product?type=${item}&limit=12`}
          className="
            btn
            border-0
            btn-primary
            rounded-full
            bg-yellow-500
            hover:bg-yellow-700
            hover:text-white
            min-w-[180px]
            justify-start
            shadow-lg
          "
        >
          {item}
        </Link>
      ))}
    </div>
  );
};

export default FloatingFilter;
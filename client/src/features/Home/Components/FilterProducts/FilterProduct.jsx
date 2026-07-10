import React from "react";
import {
  useNavigate,
  useSearchParams,
} from "react-router-dom";

const FilterProduct = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const type = searchParams.get("type");
  const limit = searchParams.get("limit");
  const selectedPrice = searchParams.get("price");

  const priceRanges = [
    {
      label: "Under ₹1,000",
      value: "0-1000",
    },
    {
      label: "₹1,000 - ₹5,000",
      value: "1000-5000",
    },
    {
      label: "₹5,000 - ₹10,000",
      value: "5000-10000",
    },
    {
      label: "Above ₹10,000",
      value: "10000-max",
    },
  ];

  return (
    <div className="flex justify-center py-6">
      <form
        className="filter gap-2"
        onReset={(e) => {
          e.preventDefault();

          navigate(
            `/product?type=${type}&limit=${limit}`
          );
        }}
      >
        {/* Reset */}

        <input
          className="btn btn-square bg-white border border-gray-200 shadow-md hover:shadow-lg"
          type="reset"
          value="×"
        />

        {/* Price Filters */}

        {priceRanges.map((range) => (
          <input
            key={range.value}
            className="btn bg-white border border-gray-200 shadow-md hover:shadow-lg"
            type="radio"
            name="price"
            aria-label={range.label}
            checked={selectedPrice === range.value}
            onChange={() =>
              navigate(
                `/product?type=${type}&limit=${limit}&price=${range.value}`
              )
            }
          />
        ))}
      </form>
    </div>
  );
};

export default FilterProduct;
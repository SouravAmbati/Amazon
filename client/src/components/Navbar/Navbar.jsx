import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";
import data from "../../features/Home/Data/ProductData";
import { Link } from "react-router-dom";

const Navbar = ({products=[],show=true,filter}) => {
  const [search, setSearch] = useState("");
  const allProducts = data.flatMap(category => category.products);
  const searchableProducts = filter
  ? allProducts.filter(product => {
      const category = product.attributes.find(
        attr => attr.name === "Category"
      );

      return category?.values[0] === filter;
    })
  : allProducts;

  const filteredSuggestions = searchableProducts.filter(product =>
  product.name.toLowerCase().includes(search.toLowerCase())
).slice(0, 10);

  return (
    <div className="navbar bg-white shadow-sm px-6  md:px-6">
      {/* Left */}
      <div className="navbar-start">
        <a className="text-xl  md:text-3xl font-bold cursor-pointer">ShopZone</a>
      </div>

      {/* Center */}
      {
        show?<div className="navbar-center">
        <div className="relative w-full md:w-[600px] lg:w-[700px]">
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 rounded-md border border-gray-300 pl-10 pr-4 outline-none focus:border-black"
          />

          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />

          {search.length > 0 && (
            <div className="absolute top-12 left-0 w-full bg-white border border-gray-200 rounded-md shadow-xl z-50 overflow-hidden">
              {filteredSuggestions.length > 0 ? (
                filteredSuggestions.map((product) => (
                  <div
                    key={product.id}
                    onClick={() => setSearch(product)}
                    className="px-4 py-3 flex items-center gap-3 hover:bg-gray-100 cursor-pointer transition"
                  >
                    <FaSearch className="text-gray-400 text-sm" />
                    <span>{product.name}</span>
                  </div>
                ))
              ) : (
                <div className="px-4 py-3 text-gray-500">
                  No results found
                </div>
              )}
            </div>
          )}
        </div>
      </div>:''
      }

      {/* Right */}
      <div className="navbar-end gap-3"> 
        {/* Cart */}
        <div className=" btn btn-ghost btn-circle hover:bg-transparent h-5 w-5 md:h-6 md:w-6 hover:border-transparent hover:shadow-none active:bg-transparent focus:bg-transparent focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0">
          <Link to={"/cart"}><div className="indicator">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.3 2.3a1 1 0 00.7 1.7H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>

            <span className="badge badge-sm indicator-item border-none ">
              8
            </span>
          </div></Link>
        </div>

        {/* Avatar */}
        <div className="avatar cursor-pointer">
          <div className="w-8 md:w-10 rounded-full">
            <img
              src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
              alt="Avatar"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
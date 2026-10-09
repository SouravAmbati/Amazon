import React, { useState, useContext, useRef, useEffect } from "react";
import { FaSearch, FaBox, FaUser, FaSignOutAlt } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

import data from "../../features/Home/Data/ProductData.js";
import { ProductContext } from "../../contexts/ProductContext.jsx";

const Navbar = ({ products = [], show = true, filter }) => {
  const [search, setSearch] = useState("");
  const [profileOpen, setProfileOpen] = useState(false);

  const {
    cartCount,
    user,
    logout,
  } = useContext(ProductContext);

  const navigate = useNavigate();
  const profileRef = useRef(null);

  // Close profile dropdown when clicking outside.
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target)
      ) {
        setProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  const allProducts = data.flatMap(
    (category) => category.products
  );

  const searchableProducts = filter
    ? allProducts.filter((product) => {
        const category = product.attributes.find(
          (attr) => attr.name === "Category"
        );

        return category?.values[0] === filter;
      })
    : allProducts;

  const filteredSuggestions = searchableProducts
    .filter((product) =>
      product.name
        .toLowerCase()
        .includes(search.toLowerCase())
    )
    .slice(0, 10);

  const userName = user?.user_name?.trim() || "";
  const firstCharacter = userName
    ? userName.charAt(0).toUpperCase()
    : "";

  const handleLogout = async () => {
    await logout();
    setProfileOpen(false);
    navigate("/login");
  };

  return (
    <div className="navbar bg-white shadow-sm px-4 md:px-6">

      {/* LEFT */}
      <div className="navbar-start">
        <Link
          to="/"
          className="text-xl md:text-3xl font-bold"
        >
          ShopZone
        </Link>
      </div>

      {/* CENTER: SEARCH */}
      {show && (
        <div className="navbar-center">
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
                    <button
                      type="button"
                      key={product.id}
                      onClick={() => {
                        setSearch("");
                        navigate(`/product/${product.id}`);
                      }}
                      className="w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-gray-100 transition"
                    >
                      <FaSearch className="text-gray-400 text-sm" />
                      <span>{product.name}</span>
                    </button>
                  ))
                ) : (
                  <div className="px-4 py-3 text-gray-500">
                    No results found
                  </div>
                )}

              </div>
            )}
          </div>
        </div>
      )}

      {/* RIGHT */}
      <div className="navbar-end gap-3 md:gap-4">

        {/* ORDERS: only for logged-in users */}
        {user && (
          <Link
            to="/orders"
            className="flex items-center justify-center hover:text-gray-600 transition"
            title="Your Orders"
          >
            <FaBox className="text-xl md:text-2xl" />
          </Link>
        )}

        {/* CART */}
        <Link
          to="/cart"
          className="relative flex items-center justify-center"
          title="Cart"
        >
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

          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 badge badge-sm border-none  text-black">
              {cartCount}
            </span>
          )}
        </Link>

        {/* USER PROFILE */}
        <div className="relative" ref={profileRef}>

          {user ? (
            <>
              {/* Avatar + username */}
              <button
                type="button"
                onClick={() => setProfileOpen((open) => !open)}
                className="flex items-center gap-2 rounded-full hover:bg-gray-100 p-1 md:px-2 transition"
                aria-label="Open profile menu"
                aria-expanded={profileOpen}
              >
                {/* First character of logged-in user's name */}
                <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-gray-900 text-white flex items-center justify-center font-bold text-lg">
                  {firstCharacter}
                </div>

                <span className="hidden sm:block max-w-32 truncate text-sm font-semibold text-gray-800">
                  {userName}
                </span>
              </button>

              {/* Dropdown */}
              {profileOpen && (
                <div className="absolute right-0 top-12 w-64 rounded-xl border border-gray-200 bg-white shadow-xl z-50 overflow-hidden">

                  <div className="border-b border-gray-100 px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gray-900 text-white flex items-center justify-center font-bold text-lg">
                        {firstCharacter}
                      </div>

                      <div className="min-w-0">
                        <p className="font-semibold text-gray-900 truncate">
                          {userName}
                        </p>
                        <p className="text-xs text-gray-500">
                          Welcome to ShopZone
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-2">
                    <Link
                      to="/orders"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm hover:bg-gray-100"
                    >
                      <FaBox />
                      Your Orders
                    </Link>

                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 rounded-lg px-3 py-3 text-sm text-red-600 hover:bg-red-50"
                    >
                      <FaSignOutAlt />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <Link
              to="/login"
              className="flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm font-semibold hover:bg-gray-50"
            >
              <FaUser />
              <span>Login</span>
            </Link>
          )}

        </div>
      </div>
    </div>
  );
};

export default Navbar;
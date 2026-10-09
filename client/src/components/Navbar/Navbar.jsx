import React, { useState, useContext, useRef, useEffect } from "react";
import { FaSearch, FaBox, FaUser, FaSignOutAlt } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

import data from "../../features/Home/Data/ProductData.js";
import { ProductContext } from "../../contexts/ProductContext.jsx";

const Navbar = ({ products = [], show = true, filter }) => {
  const [search, setSearch] = useState("");
  const [profileOpen, setProfileOpen] = useState(false);

  const { cartCount, user, logout } = useContext(ProductContext);

  const navigate = useNavigate();
  const profileRef = useRef(null);

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
      document.removeEventListener("mousedown", handleClickOutside);
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
      product.name.toLowerCase().includes(search.toLowerCase())
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
    <header className="relative z-40 w-full bg-white shadow-sm">
      <div className="mx-auto flex w-full max-w-[1920px] flex-wrap items-center px-3 py-2 sm:px-4 md:flex-nowrap md:px-6">
        {/* LEFT: LOGO */}
        <div className="order-1 flex shrink-0 items-center">
          <Link
            to="/"
            className="whitespace-nowrap text-lg font-bold sm:text-xl lg:text-3xl"
          >
            ShopZone
          </Link>
        </div>

        {/* CENTER: SEARCH */}
        {show && (
          <div className="order-3 mt-2 w-full min-w-0 md:order-2 md:mx-6 md:mt-0 md:flex-1">
            <div className="relative mx-auto w-full max-w-3xl">
              <input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-10 w-full rounded-md border border-gray-300 pl-10 pr-4 text-sm outline-none focus:border-black sm:text-base"
              />

              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />

              {search.length > 0 && (
                <div className="absolute left-0 top-12 z-50 max-h-[60vh] w-full overflow-y-auto rounded-md border border-gray-200 bg-white shadow-xl">
                  {filteredSuggestions.length > 0 ? (
                    filteredSuggestions.map((product) => (
                      <button
                        type="button"
                        key={product.id}
                        onClick={() => {
                          setSearch("");
                          navigate(`/product/${product.id}`);
                        }}
                        className="flex w-full items-center gap-3 px-3 py-3 text-left text-sm transition hover:bg-gray-100 sm:px-4"
                      >
                        <FaSearch className="shrink-0 text-gray-400" />
                        <span className="min-w-0 break-words">
                          {product.name}
                        </span>
                      </button>
                    ))
                  ) : (
                    <div className="px-4 py-3 text-sm text-gray-500">
                      No results found
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* RIGHT: ORDERS, CART, PROFILE */}
        <div className="order-2 ml-auto flex shrink-0 items-center gap-3 sm:gap-4 md:order-3">
          {user && (
            <Link
              to="/orders"
              className="flex items-center justify-center transition hover:text-gray-600"
              title="Your Orders"
              aria-label="Your Orders"
            >
              <FaBox className="text-lg sm:text-xl md:text-2xl" />
            </Link>
          )}

          {/* CART */}
          <Link
            to="/cart"
            className="relative flex items-center justify-center"
            title="Cart"
            aria-label="Cart"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 sm:h-6 sm:w-6"
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
              <span className="badge badge-sm absolute -right-2 -top-2 border-none text-black">
                {cartCount}
              </span>
            )}
          </Link>

          {/* USER PROFILE */}
          <div className="relative" ref={profileRef}>
            {user ? (
              <>
                <button
                  type="button"
                  onClick={() => setProfileOpen((open) => !open)}
                  className="flex max-w-[140px] items-center gap-2 rounded-full p-1 transition hover:bg-gray-100 sm:max-w-[200px] sm:px-2"
                  aria-label="Open profile menu"
                  aria-expanded={profileOpen}
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-900 text-base font-bold text-white sm:h-10 sm:w-10 sm:text-lg">
                    {firstCharacter}
                  </div>

                  <span className="hidden max-w-32 truncate text-sm font-semibold text-gray-800 sm:block">
                    {userName}
                  </span>
                </button>

                {profileOpen && (
                  <div className="absolute right-0 top-12 z-50 w-64 max-w-[calc(100vw-1.5rem)] overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl">
                    <div className="border-b border-gray-100 px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-900 text-lg font-bold text-white">
                          {firstCharacter}
                        </div>

                        <div className="min-w-0">
                          <p className="truncate font-semibold text-gray-900">
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
                        className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm text-red-600 hover:bg-red-50"
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
                className="flex items-center gap-1.5 rounded-lg border border-gray-300 px-2 py-2 text-xs font-semibold hover:bg-gray-50 sm:gap-2 sm:px-3 sm:text-sm"
              >
                <FaUser />
                <span>Login</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
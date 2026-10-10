import React, { useState, useContext, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ProductContext } from "../../../contexts/ProductContext.jsx";

const ProductDetails = () => {
  const { productid } = useParams();
  const navigate = useNavigate();
  const [buyingNow, setBuyingNow] = useState(false);

  const {
    productDetail,
    productDetailLoading,
    getProductById,
    addToCart,
  } = useContext(ProductContext);

  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [addingToCart, setAddingToCart] = useState(false);

  const handleAddToCart = async () => {
    setAddingToCart(true);

    try {
      const response = await addToCart(productid, 1);

      if (!response.success) {
        console.error(response.message);
        return;
      }

      console.log("Product added to cart");
    } finally {
      setAddingToCart(false);
    }
  };

  const handleBuyNow = async () => {
    if (!productid || buyingNow) return;

    setBuyingNow(true);

    try {
      const response = await addToCart(productid, 1);

      if (!response?.success) {
        console.error(
          response?.message || "Failed to add product to cart"
        );
        return;
      }

      navigate("/payment");
    } catch (error) {
      console.error(
        "Buy Now error:",
        error.response?.data || error.message
      );
    } finally {
      setBuyingNow(false);
    }
  };


  useEffect(() => {
    if (productid) {
      getProductById(productid);
    }
  }, [productid, getProductById]);

  if (productDetailLoading || !productDetail) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-300 border-t-indigo-600" />
          <p className="text-sm text-gray-500">
            Loading product...
          </p>
        </div>
      </div>
    );
  }

  const product = productDetail;
  const images = product.images || [];
  const colors = product.colors || [];
  const sizes = product.sizes || [];

  const productName = product.product_name;
  const description = product.about_product;

  const imageClass =
    "h-full w-full rounded-lg bg-gray-50 object-cover";

  return (
    <div className="min-h-screen w-full overflow-x-clip bg-white">
      <div className="pt-4 sm:pt-6">

        {/* PRODUCT IMAGE GALLERY */}
        <div
          className="
            mx-auto
            grid
            w-full
            max-w-2xl
            grid-cols-2
            gap-2
            px-3
            sm:gap-4
            sm:px-6
            lg:mt-6
            lg:max-w-7xl
            lg:grid-cols-3
            lg:gap-8
            lg:px-8
          "
        >
          {/* IMAGE 1: LARGE LEFT IMAGE ON DESKTOP */}
          {images[0] && (
            <div
              className="
                col-span-2
                aspect-[4/3]
                min-w-0
                overflow-hidden
                lg:col-span-1
                lg:row-span-2
                lg:aspect-[3/4]
              "
            >
              <img
                alt={productName}
                src={images[0]}
                className={imageClass}
              />
            </div>
          )}

          {/* IMAGE 2: CENTER TOP ON DESKTOP */}
          {images[1] && (
            <div
              className="
                aspect-square
                min-w-0
                overflow-hidden
                lg:col-start-2
                lg:row-start-1
                lg:aspect-[3/2]
              "
            >
              <img
                alt={productName}
                src={images[1]}
                className={imageClass}
              />
            </div>
          )}

          {/* IMAGE 3: CENTER BOTTOM ON DESKTOP */}
          {images[2] && (
            <div
              className="
                aspect-square
                min-w-0
                overflow-hidden
                lg:col-start-2
                lg:row-start-2
                lg:aspect-[3/2]
              "
            >
              <img
                alt={productName}
                src={images[2]}
                className={imageClass}
              />
            </div>
          )}

          {/* IMAGE 4: TALL RIGHT IMAGE ON DESKTOP */}
          {images[3] && (
            <div
              className="
                aspect-square
                min-w-0
                overflow-hidden
                lg:col-start-3
                lg:row-span-2
                lg:row-start-1
                lg:aspect-[3/4]
              "
            >
              <img
                alt={productName}
                src={images[3]}
                className={imageClass}
              />
            </div>
          )}
        </div>

        {/* PRODUCT INFORMATION */}
        <div
          className="
            mx-auto
            grid
            w-full
            max-w-2xl
            grid-cols-1
            gap-8
            px-4
            pb-12
            pt-8
            sm:px-6
            lg:mt-8
            lg:max-w-7xl
            lg:grid-cols-3
            lg:gap-x-8
            lg:px-8
            lg:pb-24
            lg:pt-4
          "
        >
          {/* LEFT: TITLE, DESCRIPTION AND DETAILS */}
          <div
            className="
              min-w-0
              lg:col-span-2
              lg:border-r
              lg:border-gray-200
              lg:pr-8
            "
          >
            <h1 className="break-words text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
              {productName}
            </h1>

            {/* DESCRIPTION */}
            <section className="mt-6">
              <h2 className="text-lg font-semibold text-gray-900">
                Description
              </h2>

              <p className="mt-4 break-words text-sm leading-7 text-gray-600 sm:text-base">
                {description}
              </p>
            </section>

            {/* PRODUCT DETAILS */}
            <section className="mt-8">
              <h2 className="text-lg font-semibold text-gray-900">
                Product Details
              </h2>

              <dl className="mt-5 space-y-5">
                <div>
                  <dt className="text-sm font-medium text-gray-900">
                    Brand
                  </dt>
                  <dd className="mt-2 text-sm text-gray-600">
                    ShopZone
                  </dd>
                </div>

                <div>
                  <dt className="text-sm font-medium text-gray-900">
                    Category
                  </dt>
                  <dd className="mt-2 break-words text-sm text-gray-600">
                    {product.category}
                  </dd>
                </div>

                <div>
                  <dt className="text-sm font-medium text-gray-900">
                    Available Sizes
                  </dt>
                  <dd className="mt-2 flex flex-wrap gap-2">
                    {sizes.map((size, index) => (
                      <span
                        key={`${size}-${index}`}
                        className="text-sm text-gray-600"
                      >
                        {size}
                      </span>
                    ))}
                  </dd>
                </div>
              </dl>
            </section>
          </div>

          {/* RIGHT: PRICE, OPTIONS AND PURCHASE BUTTONS */}
          <div className="min-w-0 lg:row-span-3 lg:mt-0">
            <h2 className="sr-only">Product information</h2>

            <p className="text-2xl tracking-tight text-gray-900 sm:text-3xl">
              ₹{product.price}
            </p>

            <form
              className="mt-8"
              onSubmit={(event) => event.preventDefault()}
            >
              {/* COLORS */}
              {colors.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-900">
                    Color
                  </h3>

                  <fieldset
                    aria-label="Choose a color"
                    className="mt-4"
                  >
                    <div className="flex flex-wrap items-center gap-3">
                      {colors.map((color, index) => (
                        <label
                          key={`${color}-${index}`}
                          className="flex rounded-full outline outline-1 -outline-offset-1 outline-black/10"
                        >
                          <input
                            type="radio"
                            name="color"
                            value={color}
                            aria-label={color}
                            checked={
                              selectedColor === null
                                ? index === 0
                                : selectedColor === color
                            }
                            onChange={() => setSelectedColor(color)}
                            style={{ backgroundColor: color }}
                            className="h-8 w-8 cursor-pointer appearance-none rounded-full border border-gray-300 checked:outline checked:outline-2 checked:outline-offset-2 checked:outline-black"
                          />
                        </label>
                      ))}
                    </div>
                  </fieldset>
                </div>
              )}

              {/* SIZES */}
              {sizes.length > 0 && (
                <div className="mt-8 sm:mt-10">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="text-sm font-medium text-gray-900">
                      Size
                    </h3>

                    <a
                      href="#size-guide"
                      onClick={(event) => event.preventDefault()}
                      className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                    >
                      Size guide
                    </a>
                  </div>

                  <fieldset
                    aria-label="Choose a size"
                    className="mt-4"
                  >
                    <div className="grid grid-cols-2 gap-3 min-[400px]:grid-cols-3 sm:grid-cols-4 lg:grid-cols-3">
                      {sizes.map((size, index) => {
                        const isSelected =
                          selectedSize === null
                            ? index === 0
                            : selectedSize === size;

                        return (
                          <label
                            key={`${size}-${index}`}
                            className={`
                              relative flex min-h-12 cursor-pointer
                              items-center justify-center rounded-md
                              border p-3 transition
                              ${isSelected
                                ? "border-indigo-600 bg-indigo-600 text-white"
                                : "border-gray-300 bg-white text-gray-900"
                              }
                            `}
                          >
                            <input
                              value={size}
                              checked={isSelected}
                              onChange={() => setSelectedSize(size)}
                              name="size"
                              type="radio"
                              className="absolute inset-0 cursor-pointer appearance-none"
                            />

                            <span className="relative text-sm font-medium uppercase">
                              {size}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  </fieldset>
                </div>
              )}

              {/* ADD TO CART */}
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={addingToCart}
                className="
                  mt-8
                  flex min-h-12 w-full items-center justify-center
                  rounded-md border border-transparent
                  bg-indigo-600 px-6 py-3
                  text-base font-medium text-white
                  transition hover:bg-indigo-700
                  disabled:cursor-not-allowed disabled:opacity-50
                  sm:mt-10
                "
              >
                {addingToCart ? "Adding..." : "Add to Cart"}
              </button>

              {/* BUY NOW */}

              <button
                type="button"
                onClick={handleBuyNow}
                disabled={buyingNow}
                className="
        mt-3 flex min-h-12 w-full items-center justify-center
        rounded-md border border-indigo-600
        px-6 py-3 text-base font-medium text-black
        transition hover:bg-indigo-50
        disabled:cursor-not-allowed disabled:opacity-50
        focus:outline-none focus:ring-2
        focus:ring-indigo-500 focus:ring-offset-2
    "
              >
                {buyingNow ? "Processing..." : "Buy Now"}
              </button>

            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
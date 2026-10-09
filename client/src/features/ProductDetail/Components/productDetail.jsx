import React, { useState, useContext, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { ProductContext } from "../../../contexts/ProductContext.jsx";

const ProductDetails = () => {
  const { productid } = useParams();

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

  useEffect(() => {
    if (!productid) {
      return;
    }

    getProductById(productid);
  }, [productid, getProductById]);

  if (productDetailLoading || !productDetail) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-white">
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

  return (
    <main className="min-h-screen w-full overflow-x-clip bg-white">
      <div className="mx-auto w-full max-w-[1440px] px-3 py-4 sm:px-5 sm:py-6 md:px-8 lg:px-10 lg:py-10">
        <div className="grid min-w-0 grid-cols-1 gap-6 md:gap-8 lg:grid-cols-2 lg:gap-12 xl:gap-16">

          {/* PRODUCT IMAGE GALLERY */}
          <section className="min-w-0">
            {images.length > 0 ? (
              <div className="grid grid-cols-2 gap-2 sm:gap-4">
                {images.slice(0, 4).map((image, index) => (
                  <div
                    key={`${image}-${index}`}
                    className={`flex min-w-0 items-center justify-center overflow-hidden rounded-lg bg-gray-50 ${
                      index === 0
                        ? "col-span-2"
                        : "col-span-1"
                    } ${
                      index === 0
                        ? "aspect-[4/3] sm:aspect-[5/4] lg:aspect-[4/5]"
                        : "aspect-square"
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${productName} - Image ${index + 1}`}
                      loading={index === 0 ? "eager" : "lazy"}
                      className="h-full w-full object-contain"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex aspect-square items-center justify-center rounded-lg bg-gray-100 text-gray-500">
                No product image available
              </div>
            )}
          </section>

          {/* PRODUCT INFORMATION */}
          <section className="min-w-0">
            <div className="lg:sticky lg:top-6">
              {/* PRODUCT NAME */}
              <h1 className="break-words text-2xl font-bold leading-tight tracking-tight text-gray-900 sm:text-3xl lg:text-4xl">
                {productName}
              </h1>

              {/* PRICE */}
              <p className="mt-3 text-2xl font-semibold tracking-tight text-gray-900 sm:mt-4 sm:text-3xl">
                ₹{product.price}
              </p>

              <form
                className="mt-6 space-y-7 sm:mt-8 sm:space-y-8"
                onSubmit={(event) => event.preventDefault()}
              >
                {/* COLORS */}
                {colors.length > 0 && (
                  <div>
                    <h2 className="text-sm font-medium text-gray-900">
                      Color
                    </h2>

                    <fieldset
                      aria-label="Choose a color"
                      className="mt-3"
                    >
                      <div className="flex flex-wrap items-center gap-3">
                        {colors.map((color, index) => (
                          <label
                            key={`${color}-${index}`}
                            className="flex cursor-pointer rounded-full outline outline-1 -outline-offset-1 outline-black/10"
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
                  <div>
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <h2 className="text-sm font-medium text-gray-900">
                        Size
                      </h2>

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
                      className="mt-3"
                    >
                      <div className="grid grid-cols-4 gap-2 sm:gap-3">
                        {sizes.map((size, index) => (
                          <label
                            key={`${size}-${index}`}
                            className={`relative flex min-h-11 cursor-pointer items-center justify-center rounded-md border p-2 transition sm:p-3 ${
                              (
                                selectedSize === null
                                  ? index === 0
                                  : selectedSize === size
                              )
                                ? "border-indigo-600 bg-indigo-600 text-white"
                                : "border-gray-300 bg-white text-gray-900 hover:border-gray-500"
                            }`}
                          >
                            <input
                              value={size}
                              checked={
                                selectedSize === null
                                  ? index === 0
                                  : selectedSize === size
                              }
                              onChange={() => setSelectedSize(size)}
                              name="size"
                              type="radio"
                              className="absolute inset-0 cursor-pointer appearance-none rounded-md"
                            />

                            <span className="relative break-words text-sm font-medium uppercase">
                              {size}
                            </span>
                          </label>
                        ))}
                      </div>
                    </fieldset>
                  </div>
                )}

                {/* ADD TO CART */}
                <div className="space-y-3 border-t border-gray-200 pt-5 sm:pt-6">
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    disabled={addingToCart}
                    className="flex min-h-12 w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-base font-medium text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {addingToCart ? "Adding..." : "Add to Cart"}
                  </button>

                  {/* BUY NOW */}
                  <Link
                    to="/payment"
                    className="flex min-h-12 w-full items-center justify-center rounded-md border border-indigo-600 px-6 py-3 text-base font-medium text-black transition hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    Buy Now
                  </Link>
                </div>
              </form>

              {/* DESCRIPTION */}
              <section className="mt-8 border-t border-gray-200 pt-6 sm:mt-10 sm:pt-8">
                <h2 className="text-lg font-semibold text-gray-900">
                  Description
                </h2>

                <p className="mt-3 break-words text-sm leading-7 text-gray-600 sm:text-base">
                  {description || "No description available."}
                </p>
              </section>

              {/* PRODUCT DETAILS */}
              <section className="mt-8 border-t border-gray-200 pt-6 sm:mt-10 sm:pt-8">
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
                      {sizes.length > 0 ? (
                        sizes.map((size, index) => (
                          <span
                            key={`${size}-${index}`}
                            className="rounded-md bg-gray-100 px-3 py-1 text-sm text-gray-600"
                          >
                            {size}
                          </span>
                        ))
                      ) : (
                        <span className="text-sm text-gray-500">
                          No sizes available
                        </span>
                      )}
                    </dd>
                  </div>
                </dl>
              </section>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
};

export default ProductDetails;
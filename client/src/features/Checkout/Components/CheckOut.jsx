import React, {
  useContext,
  useMemo,
  useState
} from "react";

import { Link } from "react-router-dom";
import { ProductContext } from "../../../contexts/ProductContext.jsx";




const CheckOut = () => {

  const {
    cartItems,
    cartLoading,
    addOrder,
    getOrders
  } = useContext(ProductContext);


  const [paymentMethod, setPaymentMethod] =
    useState("stripe");


  const [placingOrder, setPlacingOrder] =
    useState(false);


  const [orderedProducts, setOrderedProducts] =
    useState([]);


  // =====================================================
  // SUBTOTAL
  // =====================================================

  const subtotal = useMemo(() => {

    return cartItems.reduce(
      (total, item) => {

        return (
          total +
          Number(item.price) *
          Number(item.counts)
        );

      },
      0
    );

  }, [cartItems]);


  const shipping = 10;

  const total = subtotal + shipping;


  // =====================================================
  // PLACE ORDER
  // =====================================================

  const handlePlaceOrder = async () => {

    if (cartItems.length === 0) {

      alert("Your cart is empty");

      return;
    }


    setPlacingOrder(true);


    try {

      // =====================================================
      // STRIPE
      // =====================================================

      if (paymentMethod === "stripe") {

        /*
         * For now, we create a Stripe Checkout Session
         * for each product.
         *
         * Later we should change the backend to create
         * ONE order containing all cart items.
         */

        for (const item of cartItems) {

          const itemAmount =
            Number(item.price) *
            Number(item.counts);


          const response =
            await addOrder(
              item.product_id,
              Number(item.counts),
              "stripe",
              itemAmount
            );


          if (!response.success) {

            throw new Error(
              response.message ||
              "Failed to create Stripe payment"
            );

          }


          // Stripe Checkout URL
          if (response.url) {

            window.location.href =
              response.url;

            return;

          }


          throw new Error(
            "Stripe checkout URL was not returned"
          );

        }

      }


      // =====================================================
      // COD
      // =====================================================

      if (paymentMethod === "cod") {

        for (const item of cartItems) {

          const response =
            await addOrder(
              item.product_id,
              Number(item.counts),
              "cod",
              Number(item.price) *
              Number(item.counts)
            );


          if (!response.success) {

            throw new Error(
              response.message ||
              "Failed to place COD order"
            );

          }

        }


        const ordersResponse =
          await getOrders();


        if (!ordersResponse.success) {

          throw new Error(
            ordersResponse.message ||
            "Order created but failed to fetch orders"
          );

        }


        setOrderedProducts(
          ordersResponse.data
        );


        alert(
          "Order placed successfully"
        );

      }


    } catch (error) {

      console.error(
        "Place order error:",
        error
      );


      alert(
        error.message ||
        "Failed to place order"
      );


    } finally {

      setPlacingOrder(false);

    }

  };


  // =====================================================
  // LOADING
  // =====================================================

  if (cartLoading) {

    return (
      <div className="
                flex
                min-h-[400px]
                items-center
                justify-center
            ">

        <div className="
                    h-10
                    w-10
                    animate-spin
                    rounded-full
                    border-4
                    border-gray-300
                    border-t-indigo-600
                " />

      </div>
    );

  }


  // =====================================================
  // RENDER
  // =====================================================

  return (

    <div className="
            max-w-7xl
            mx-auto
            px-6
            py-10
        ">

      <h1 className="
                text-3xl
                font-semibold
                mb-8
            ">
        Checkout
      </h1>


      <div className="
                grid
                lg:grid-cols-3
                gap-8
            ">


        {/* =====================================================
                    LEFT
                ===================================================== */}

        <div className="
                    lg:col-span-2
                    space-y-8
                ">


          {/* =====================================================
                        PAYMENT
                    ===================================================== */}

          <div className="
                        border
                        rounded-lg
                        p-6
                    ">

            <h2 className="
                            text-xl
                            font-semibold
                            mb-5
                        ">
              Payment Method
            </h2>


            <div className="
                            space-y-4
                        ">

              <label className="
                                flex
                                items-center
                                gap-3
                                cursor-pointer
                            ">

                <input
                  type="radio"
                  checked={
                    paymentMethod === "stripe"
                  }
                  onChange={() =>
                    setPaymentMethod(
                      "stripe"
                    )
                  }
                />

                <span>
                  Stripe
                </span>

              </label>


              <label className="
                                flex
                                items-center
                                gap-3
                                cursor-pointer
                            ">

                <input
                  type="radio"
                  checked={
                    paymentMethod === "cod"
                  }
                  onChange={() =>
                    setPaymentMethod(
                      "cod"
                    )
                  }
                />

                <span>
                  Cash on Delivery (COD)
                </span>

              </label>

            </div>

          </div>


          {/* =====================================================
                        PRODUCTS FROM CART
                    ===================================================== */}

          <div className="
                        border
                        rounded-lg
                        p-6
                    ">

            <h2 className="
                            text-xl
                            font-semibold
                            mb-6
                        ">
              Products
            </h2>


            {cartItems.length === 0 ? (

              <p className="
                                text-gray-500
                            ">
                Your cart is empty.
              </p>

            ) : (

              <div className="
                                space-y-6
                            ">

                {cartItems.map(
                  (item) => (

                    <div
                      key={
                        item.product_id
                      }
                      className="
                                                flex
                                                gap-5
                                                border-b
                                                pb-5
                                            "
                    >

                      <img
                        src={
                          item.images?.[0]
                        }
                        alt={
                          item.product_name
                        }
                        className="
                                                    w-24
                                                    h-24
                                                    object-cover
                                                    rounded
                                                "
                      />


                      <div className="
                                                flex-1
                                            ">

                        <h3 className="
                                                    font-semibold
                                                ">
                          {
                            item.product_name
                          }
                        </h3>


                        <p className="
                                                    text-gray-500
                                                    mt-2
                                                ">
                          Quantity :{" "}
                          {
                            item.counts
                          }
                        </p>


                        <p className="
                                                    text-gray-500
                                                    mt-1
                                                ">
                          ₹
                          {
                            Number(
                              item.price
                            ).toFixed(2)
                          }
                          {" "}each
                        </p>

                      </div>


                      <div className="
                                                font-semibold
                                            ">

                        ₹
                        {(
                          Number(
                            item.price
                          ) *
                          Number(
                            item.counts
                          )
                        ).toFixed(2)}

                      </div>

                    </div>

                  )
                )}

              </div>

            )}

          </div>


          {/* =====================================================
                        ORDERED PRODUCTS
                    ===================================================== */}

          {orderedProducts.length > 0 && (

            <div className="
                            border
                            rounded-lg
                            p-6
                        ">

              <h2 className="
                                text-xl
                                font-semibold
                                mb-6
                            ">
                Ordered Products
              </h2>


              <div className="
                                space-y-5
                            ">

                {orderedProducts.map(
                  (item) => (

                    <div
                      key={
                        item.order_id
                      }
                      className="
                                                flex
                                                gap-5
                                                border-b
                                                pb-5
                                            "
                    >

                      <img
                        src={
                          item.images?.[0]
                        }
                        alt={
                          item.product_name
                        }
                        className="
                                                    w-20
                                                    h-20
                                                    object-cover
                                                    rounded
                                                "
                      />


                      <div className="
                                                flex-1
                                            ">

                        <h3 className="
                                                    font-semibold
                                                ">
                          {
                            item.product_name
                          }
                        </h3>


                        <p className="
                                                    text-gray-500
                                                ">
                          ₹
                          {
                            Number(
                              item.price
                            ).toFixed(2)
                          }
                        </p>

                      </div>


                      <span className="
                                                text-green-600
                                                font-semibold
                                            ">
                        Ordered
                      </span>

                    </div>

                  )
                )}

              </div>

            </div>

          )}

        </div>


        {/* =====================================================
                    RIGHT - ORDER SUMMARY
                ===================================================== */}

        <div>

          <div className="
                        border
                        rounded-lg
                        p-6
                        sticky
                        top-24
                    ">

            <h2 className="
                            text-xl
                            font-semibold
                            mb-6
                        ">
              Order Summary
            </h2>


            <div className="
                            space-y-4
                        ">

              <div className="
                                flex
                                justify-between
                            ">

                <span>
                  Subtotal
                </span>

                <span>
                  ₹
                  {subtotal.toFixed(2)}
                </span>

              </div>


              <div className="
                                flex
                                justify-between
                            ">

                <span>
                  Shipping
                </span>

                <span>
                  ₹
                  {shipping.toFixed(2)}
                </span>

              </div>


              <hr />


              <div className="
                                flex
                                justify-between
                                text-lg
                                font-bold
                            ">

                <span>
                  Total
                </span>

                <span>
                  ₹
                  {total.toFixed(2)}
                </span>

              </div>

            </div>


            <button
              onClick={
                handlePlaceOrder
              }
              disabled={
                placingOrder ||
                cartItems.length === 0
              }
              className="
                                w-full
                                mt-8
                                bg-black
                                text-white
                                py-3
                                rounded-md
                                hover:opacity-90
                                disabled:opacity-50
                                disabled:cursor-not-allowed
                            "
            >

              {placingOrder
                ? "Placing Order..."
                : "Place Order"
              }

            </button>


            <div className="
                            mt-5
                            text-right
                        ">

              <Link
                to="/"
                className="
                                    text-sm
                                    text-gray-600
                                    underline
                                "
              >
                Continue shopping
              </Link>

            </div>

          </div>

        </div>

      </div>

    </div>

  );
};


export default CheckOut;
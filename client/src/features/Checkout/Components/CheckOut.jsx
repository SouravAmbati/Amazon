import React, { useState } from "react";

const CheckOut = () => {
  const [paymentMethod, setPaymentMethod] = useState("stripe");

  const products = [
    {
      id: 1,
      name: "Apple AirPods Pro",
      image:
        "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=300",
      price: 249,
      qty: 1,
    },
    {
      id: 2,
      name: "Mechanical Keyboard",
      image:
        "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=300",
      price: 99,
      qty: 2,
    },
  ];

  const subtotal = products.reduce(
    (acc, item) => acc + item.price * item.qty,
    0
  );

  const shipping = 10;
  const total = subtotal + shipping;

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">

      <h1 className="text-3xl font-semibold mb-8">
        Checkout
      </h1>

      <div className="grid lg:grid-cols-3 gap-8">

        {/* Left */}

        <div className="lg:col-span-2 space-y-8">

          {/* Shipping */}

          <div className="border rounded-lg p-6">

            <h2 className="text-xl font-semibold mb-5">
              Shipping Address
            </h2>

            <div className="grid md:grid-cols-2 gap-4">

              <input
                placeholder="Full Name"
                className="border rounded-md p-3 outline-none"
              />

              <input
                placeholder="Phone Number"
                className="border rounded-md p-3 outline-none"
              />

              <input
                placeholder="City"
                className="border rounded-md p-3 outline-none"
              />

              <input
                placeholder="Pincode"
                className="border rounded-md p-3 outline-none"
              />

              <textarea
                rows="4"
                placeholder="Address"
                className="border rounded-md p-3 md:col-span-2 outline-none"
              />
            </div>
          </div>

          {/* Payment */}

          <div className="border rounded-lg p-6">

            <h2 className="text-xl font-semibold mb-5">
              Payment Method
            </h2>

            <div className="space-y-4">

              <label className="flex items-center gap-3 cursor-pointer">

                <input
                  type="radio"
                  checked={paymentMethod === "stripe"}
                  onChange={() => setPaymentMethod("stripe")}
                />

                <span>Stripe</span>

              </label>

              <label className="flex items-center gap-3 cursor-pointer">

                <input
                  type="radio"
                  checked={paymentMethod === "cod"}
                  onChange={() => setPaymentMethod("cod")}
                />

                <span>Cash on Delivery (COD)</span>

              </label>

            </div>

          </div>

          {/* Products */}

          <div className="border rounded-lg p-6">

            <h2 className="text-xl font-semibold mb-6">
              Products
            </h2>

            <div className="space-y-6">

              {products.map((item) => (

                <div
                  key={item.id}
                  className="flex gap-5 border-b pb-5"
                >

                  <img
                    src={item.image}
                    alt=""
                    className="w-24 h-24 object-cover rounded"
                  />

                  <div className="flex-1">

                    <h3 className="font-semibold">
                      {item.name}
                    </h3>

                    <p className="text-gray-500 mt-2">
                      Quantity : {item.qty}
                    </p>

                  </div>

                  <div className="font-semibold">
                    ${(item.price * item.qty).toFixed(2)}
                  </div>

                </div>

              ))}

            </div>

          </div>

        </div>

        {/* Right */}

        <div>

          <div className="border rounded-lg p-6 sticky top-24">

            <h2 className="text-xl font-semibold mb-6">
              Order Summary
            </h2>

            <div className="space-y-4">

              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${subtotal}</span>
              </div>

              <div className="flex justify-between">
                <span>Shipping</span>
                <span>${shipping}</span>
              </div>

              <hr />

              <div className="flex justify-between text-lg font-bold">

                <span>Total</span>

                <span>${total}</span>

              </div>

            </div>

            <button
              className="w-full mt-8 bg-black text-white py-3 rounded-md hover:opacity-90"
            >
              Place Order
            </button>

          </div>

        </div>

      </div>

    </div>
  );
};

export default CheckOut;
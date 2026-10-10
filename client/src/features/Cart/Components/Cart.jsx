
import React, { useContext, useMemo } from "react";
import { Link } from "react-router-dom";
import { ProductContext } from "../../../contexts/ProductContext.jsx";

const Cart = () => {
    const {
        cartItems,
        cartLoading,
        updateCartCount,
        removeFromCart,
    } = useContext(ProductContext);

    const subtotal = useMemo(() => {
        return (cartItems || []).reduce(
            (total, item) =>
                total +
                Number(item.price || 0) * Number(item.counts || 0),
            0
        );
    }, [cartItems]);

    const handleQuantityChange = async (productId, value) => {
        const quantity = Math.max(1, Number(value) || 1);
        await updateCartCount(productId, quantity);
    };

    const decreaseQuantity = async (item) => {
        const currentQuantity = Number(item.counts) || 1;

        if (currentQuantity > 1) {
            await updateCartCount(item.product_id, currentQuantity - 1);
        }
    };

    const increaseQuantity = async (item) => {
        const currentQuantity = Number(item.counts) || 1;
        await updateCartCount(item.product_id, currentQuantity + 1);
    };

    const handleRemove = async (productId) => {
        await removeFromCart(productId);
    };

    const formatPrice = (price) =>
        Number(price || 0).toLocaleString("en-IN", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });

    if (cartLoading) {
        return (
            <div className="flex min-h-[300px] w-full items-center justify-center px-4">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600" />
            </div>
        );
    }

    // Reusable quantity selector
    const QuantityControl = ({ item }) => (
        <div className="inline-flex h-10 shrink-0 items-center overflow-hidden rounded-md border border-gray-300 bg-white">
            <button
                type="button"
                onClick={() => decreaseQuantity(item)}
                disabled={Number(item.counts) <= 1}
                aria-label={`Decrease quantity of ${item.product_name}`}
                className="flex h-full w-9 items-center justify-center text-lg font-medium text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-300"
            >
                −
            </button>

            <span
                aria-live="polite"
                aria-label={`Quantity: ${item.counts}`}
                className="flex h-full min-w-8 items-center justify-center px-1 text-sm font-medium text-gray-900"
            >
                {item.counts}
            </span>

            <button
                type="button"
                onClick={() => increaseQuantity(item)}
                aria-label={`Increase quantity of ${item.product_name}`}
                className="flex h-full w-9 items-center justify-center text-lg font-medium text-gray-700 transition hover:bg-gray-100"
            >
                +
            </button>
        </div>
    );

    return (
        <div className="w-full flex-1">
            <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
                {!cartItems || cartItems.length === 0 ? (
                    <div className="py-12 text-center sm:py-20">
                        <h2 className="text-xl font-semibold text-gray-900">
                            Your cart is empty
                        </h2>

                        <Link
                            to="/"
                            className="mt-5 inline-flex min-h-11 items-center justify-center rounded-md bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
                        >
                            Continue shopping
                        </Link>
                    </div>
                ) : (
                    <>
                        {/* CART ITEMS */}
                        <ul className="w-full space-y-4">
                            {cartItems.map((item) => {
                                const imageUrl = Array.isArray(item.images)
                                    ? item.images[0]
                                    : item.images;

                                return (
                                    <li
                                        key={item.product_id}
                                        className="w-full border-b border-gray-100 pb-4"
                                    >
                                        {/* PRODUCT IMAGE AND DETAILS */}
                                        <div className="flex w-full items-start gap-3 sm:items-center sm:gap-4">
                                            <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-md bg-white sm:h-20 sm:w-20">
                                                {imageUrl ? (
                                                    <img
                                                        src={imageUrl}
                                                        alt={item.product_name || "Product"}
                                                        className="block h-full w-full object-contain"
                                                    />
                                                ) : (
                                                    <span className="text-xs text-gray-400">
                                                        No image
                                                    </span>
                                                )}
                                            </div>

                                            <div className="min-w-0 flex-1 pt-1 sm:pt-0">
                                                <h3 className="break-words text-sm font-medium leading-5 text-gray-900 sm:text-base">
                                                    {item.product_name}
                                                </h3>

                                                <p className="mt-1 text-sm text-gray-600">
                                                    ₹{formatPrice(item.price)}
                                                </p>
                                            </div>

                                            {/* DESKTOP QUANTITY CONTROL */}
                                            <div className="hidden shrink-0 items-center gap-3 sm:flex">
                                                <QuantityControl item={item} />

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleRemove(item.product_id)
                                                    }
                                                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md text-xl text-gray-500 transition hover:bg-red-50 hover:text-red-600"
                                                    aria-label={`Remove ${item.product_name} from cart`}
                                                >
                                                    🗑
                                                </button>
                                            </div>
                                        </div>

                                        {/* MOBILE QUANTITY CONTROL */}
                                        <div className="mt-3 flex items-center justify-end gap-3 sm:hidden">
                                            <QuantityControl item={item} />

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleRemove(item.product_id)
                                                }
                                                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md text-xl text-gray-500 transition hover:bg-red-50 hover:text-red-600"
                                                aria-label={`Remove ${item.product_name} from cart`}
                                            >
                                                🗑
                                            </button>
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>

                        {/* CART SUMMARY */}
                        <div className="mt-6 w-full space-y-5 border-t border-gray-100 pt-6 sm:mt-8 sm:space-y-6 sm:pt-8">
                            <dl className="ml-auto w-full max-w-sm space-y-3 text-sm text-gray-700">
                                <div className="flex items-center justify-between gap-4">
                                    <dt>Subtotal</dt>

                                    <dd className="shrink-0 text-right tabular-nums">
                                        ₹{formatPrice(subtotal)}
                                    </dd>
                                </div>

                                <div className="flex items-center justify-between gap-4 font-semibold text-gray-900">
                                    <dt>Total</dt>

                                    <dd className="shrink-0 text-right tabular-nums">
                                        ₹{formatPrice(subtotal)}
                                    </dd>
                                </div>
                            </dl>

                            {/* CHECKOUT */}
                            <div className="flex w-full justify-end">
                                <Link
                                    to="/payment"
                                    className="inline-flex min-h-11 w-full items-center justify-center rounded-md bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 sm:w-auto sm:min-w-32"
                                >
                                    Checkout
                                </Link>
                            </div>

                            {/* CONTINUE SHOPPING */}
                            <div className="text-center sm:text-right">
                                <Link
                                    to="/"
                                    className="inline-flex min-h-10 items-center justify-center py-2 text-sm text-gray-600 underline underline-offset-2 hover:text-black sm:text-base"
                                >
                                    Continue shopping
                                </Link>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Cart;

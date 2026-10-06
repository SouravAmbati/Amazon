
import React, {
    useContext,
    useMemo,
} from "react";

import { Link } from "react-router-dom";

import { ProductContext } from "../../../contexts/ProductContext.jsx";
const Cart = () => {

    const {
        cartItems,
        cartLoading,
        updateCartCount,
        removeFromCart
    } = useContext(ProductContext);


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


    const handleQuantityChange = async (
        productId,
        value
    ) => {

        const quantity =
            Math.max(
                1,
                Number(value) || 1
            );


        await updateCartCount(
            productId,
            quantity
        );

    };


    const handleRemove = async (
        productId
    ) => {

        await removeFromCart(
            productId
        );

    };


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
                "/>

            </div>

        );

    }


    return (

        <div>

            <div
                className="
                    mx-auto
                    max-w-7xl
                    px-4
                    py-8
                    sm:px-6
                    lg:px-8
                "
            >

                {cartItems.length === 0 ? (

                    <div className="
                        py-20
                        text-center
                    ">

                        <h2 className="
                            text-xl
                            font-semibold
                            text-gray-900
                        ">
                            Your cart is empty
                        </h2>

                        <Link
                            to="/"
                            className="
                                mt-4
                                inline-block
                                text-sm
                                text-indigo-600
                                underline
                            "
                        >
                            Continue shopping
                        </Link>

                    </div>

                ) : (

                    <>

                        <ul className="space-y-4">

                            {cartItems.map(
                                (item) => (

                                    <li
                                        key={
                                            item.product_id
                                        }
                                        className="
                                            flex
                                            items-center
                                            gap-4
                                            border-b
                                            border-gray-100
                                            pb-4
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
                                                size-16
                                                rounded-sm
                                                object-cover
                                            "
                                        />


                                        <div>

                                            <h3 className="
                                                text-sm
                                                text-gray-900
                                            ">
                                                {
                                                    item.product_name
                                                }
                                            </h3>


                                            <p className="
                                                mt-1
                                                text-sm
                                                text-gray-600
                                            ">
                                                ₹
                                                {item.price}
                                            </p>

                                        </div>


                                        <div className="
                                            flex
                                            flex-1
                                            items-center
                                            justify-end
                                            gap-4
                                        ">

                                            <input
                                                type="number"
                                                min="1"
                                                value={
                                                    item.counts
                                                }
                                                onChange={(
                                                    e
                                                ) =>
                                                    handleQuantityChange(
                                                        item.product_id,
                                                        e.target.value
                                                    )
                                                }
                                                className="
                                                    h-8
                                                    w-14
                                                    rounded-sm
                                                    border
                                                    border-gray-300
                                                    bg-white
                                                    p-0
                                                    text-center
                                                    text-xs
                                                "
                                            />


                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleRemove(
                                                        item.product_id
                                                    )
                                                }
                                                className="
                                                    text-gray-600
                                                    hover:text-red-600
                                                "
                                            >

                                                <span className="
                                                    text-xl
                                                ">
                                                    🗑
                                                </span>

                                            </button>

                                        </div>

                                    </li>

                                )
                            )}

                        </ul>


                        <div className="
                            mt-8
                            space-y-6
                            border-t
                            border-gray-100
                            pt-8
                        ">

                            <dl className="
                                ml-auto
                                max-w-sm
                                space-y-2
                                text-sm
                                text-gray-700
                            ">

                                <div className="
                                    flex
                                    justify-between
                                ">

                                    <dt>
                                        Subtotal
                                    </dt>

                                    <dd>
                                        ₹
                                        {subtotal.toFixed(2)}
                                    </dd>

                                </div>


                                <div className="
                                    flex
                                    justify-between
                                    font-semibold
                                ">

                                    <dt>
                                        Total
                                    </dt>

                                    <dd>
                                        ₹
                                        {subtotal.toFixed(2)}
                                    </dd>

                                </div>

                            </dl>


                            <div className="
                                flex
                                items-center
                                justify-end
                            ">

                                <Link
                                    to="/payment"
                                    className="
                                        rounded-sm
                                        border
                                        border-blue-600
                                        bg-blue-600
                                        px-5
                                        py-3
                                        text-sm
                                        font-semibold
                                        text-white
                                        hover:bg-blue-700
                                    "
                                >
                                    Checkout
                                </Link>

                            </div>


                            <div className="
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

                    </>

                )}

            </div>

        </div>

    );

};

export default Cart;
import React, {
    useContext,
    useEffect,
    useState
} from "react";

import {
    Check,
    Package,
    Truck,
    MapPin
} from "lucide-react";

import {
    Link,
    useParams
} from "react-router-dom";

import {
    ProductContext
} from "../../../contexts/ProductContext.jsx";


const OrderView = () => {

    const {
        getOrderStatus
    } = useContext(ProductContext);

    const {
        orderId
    } = useParams();


    const [order, setOrder] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState(null);


    // =====================================================
    // FETCH ORDER
    // =====================================================

    const fetchOrder = async () => {

        try {

            const response =
                await getOrderStatus(orderId);


            if (!response.success) {

                throw new Error(
                    response.message ||
                    "Failed to fetch order"
                );

            }


            setOrder(response.data);

            setError(null);


        } catch (error) {

            console.error(
                "Order fetch error:",
                error
            );

            setError(
                error.message ||
                "Failed to fetch order"
            );


        } finally {

            setLoading(false);

        }
    };


    // =====================================================
    // INITIAL FETCH + POLLING
    // =====================================================

    useEffect(() => {

        if (!orderId) {
            return;
        }


        // Fetch immediately
        fetchOrder();


        // Then fetch every 5 seconds
        const interval = setInterval(() => {

            fetchOrder();

        }, 5000);


        return () => {

            clearInterval(interval);

        };

    }, [orderId]);


    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {

        return (
            <div
                className="
                    min-h-screen
                    flex
                    items-center
                    justify-center
                "
            >

                <div className="text-gray-500">
                    Loading order...
                </div>

            </div>
        );

    }


    // =====================================================
    // ERROR
    // =====================================================

    if (error || !order) {

        return (
            <div
                className="
                    min-h-screen
                    flex
                    flex-col
                    items-center
                    justify-center
                    gap-4
                "
            >

                <p className="text-red-500">
                    {error || "Order not found"}
                </p>


                <Link
                    to="/"
                    className="
                        px-5
                        py-2
                        bg-black
                        text-white
                        rounded-lg
                    "
                >
                    Continue Shopping
                </Link>

            </div>
        );

    }


    // =====================================================
    // IMPORTANT
    // =====================================================
    //
    // Your database currently uses:
    //
    // status
    //
    // But depending on your SELECT query you may return:
    //
    // order_status
    //
    // Support both for now.
    // =====================================================

    const status =
        String(
            order.status ??
            order.order_status ??
            "processing"
        ).toLowerCase();


    // =====================================================
    // STATUS STEPS
    // =====================================================

    const statusSteps = [

        {
            key: "processing",
            label: "Placed",
            icon: Check
        },

        {
            key: "confirmed",
            label: "Confirmed",
            icon: Package
        },

        {
            key: "shipped",
            label: "Shipped",
            icon: Truck
        },

        {
            key: "out_for_delivery",
            label: "Out for Delivery",
            icon: Truck
        },

        {
            key: "delivered",
            label: "Delivered",
            icon: MapPin
        }

    ];


    const statusOrder = [

        "processing",
        "confirmed",
        "shipped",
        "out_for_delivery",
        "delivered"

    ];


    const currentStatusIndex =
        statusOrder.indexOf(status);


    // =====================================================
    // CANCELLED
    // =====================================================

    const isCancelled =
        status === "cancelled";


    return (

        <div
            className="
                min-h-screen
                bg-gray-50
            "
        >

            <div
                className="
                    max-w-5xl
                    mx-auto
                    px-6
                    py-10
                "
            >

                {/* ========================================= */}
                {/* HEADER */}
                {/* ========================================= */}

                <div className="mb-8">

                    <h1
                        className="
                            text-3xl
                            font-bold
                            text-gray-900
                        "
                    >
                        Your Order
                    </h1>


                    <p
                        className="
                            text-sm
                            text-gray-500
                            mt-2
                        "
                    >
                    </p>

                </div>


                {/* ========================================= */}
                {/* ORDER STATUS */}
                {/* ========================================= */}

                <div
                    className="
                        bg-white
                        border
                        border-gray-200
                        rounded-xl
                        p-6
                        mb-6
                    "
                >

                    <div
                        className="
                            flex
                            items-center
                            justify-between
                            mb-8
                        "
                    >

                        <div>

                            <h2
                                className="
                                    text-xl
                                    font-semibold
                                "
                            >
                                Order Status
                            </h2>


                            <p
                                className="
                                    text-sm
                                    text-gray-500
                                    mt-1
                                "
                            >
                                Track your order
                            </p>

                        </div>


                        {/* CURRENT STATUS */}

                        <span
                            className={`
                                px-4
                                py-2
                                rounded-full
                                text-sm
                                font-medium

                                ${isCancelled
                                    ? `
                                            bg-red-50
                                            text-red-700
                                        `
                                    : status === "delivered"
                                        ? `
                                                bg-green-50
                                                text-green-700
                                            `
                                        : status === "confirmed"
                                            ? `
                                                    bg-blue-50
                                                    text-blue-700
                                                `
                                            : status === "shipped"
                                                ? `
                                                        bg-purple-50
                                                        text-purple-700
                                                    `
                                                : `
                                                        bg-yellow-50
                                                        text-yellow-700
                                                    `
                                }
                            `}
                        >
                            {
                                status
                                    .replaceAll(
                                        "_",
                                        " "
                                    )
                                    .replace(
                                        /^\w/,
                                        (c) =>
                                            c.toUpperCase()
                                    )
                            }
                        </span>

                    </div>


                    {/* ===================================== */}
                    {/* CANCELLED */}
                    {/* ===================================== */}

                    {
                        isCancelled
                            ?

                            (
                                <div
                                    className="
                                        bg-red-50
                                        border
                                        border-red-200
                                        text-red-700
                                        rounded-lg
                                        p-4
                                    "
                                >
                                    This order has been
                                    cancelled.
                                </div>
                            )

                            :

                            (
                                /* ================================= */
                                /* PROGRESS */
                                /* ================================= */

                                <div className="relative">

                                    {/* LINE */}

                                    <div
                                        className="
                                            absolute
                                            top-5
                                            left-0
                                            right-0
                                            h-1
                                            bg-gray-200
                                        "
                                    />


                                    {/* STEPS */}

                                    <div
                                        className="
                                            relative
                                            flex
                                            justify-between
                                        "
                                    >

                                        {
                                            statusSteps.map(
                                                (
                                                    step,
                                                    index
                                                ) => {

                                                    const Icon =
                                                        step.icon;


                                                    const completed =
                                                        currentStatusIndex >=
                                                        index;


                                                    return (

                                                        <div
                                                            key={
                                                                step.key
                                                            }
                                                            className="
                                                                flex
                                                                flex-col
                                                                items-center
                                                                relative
                                                                z-10
                                                            "
                                                        >

                                                            {/* CIRCLE */}

                                                            <div
                                                                className={`
                                                                    w-10
                                                                    h-10
                                                                    rounded-full
                                                                    flex
                                                                    items-center
                                                                    justify-center

                                                                    ${completed
                                                                        ? `
                                                                                bg-black
                                                                                text-white
                                                                            `
                                                                        : `
                                                                                bg-white
                                                                                text-gray-400
                                                                                border
                                                                                border-gray-300
                                                                            `
                                                                    }
                                                                `}
                                                            >

                                                                <Icon
                                                                    size={
                                                                        18
                                                                    }
                                                                />

                                                            </div>


                                                            {/* LABEL */}

                                                            <p
                                                                className={`
                                                                    text-xs
                                                                    mt-3
                                                                    text-center

                                                                    ${completed
                                                                        ? `
                                                                                text-gray-900
                                                                                font-medium
                                                                            `
                                                                        : `
                                                                                text-gray-400
                                                                            `
                                                                    }
                                                                `}
                                                            >
                                                                {
                                                                    step.label
                                                                }
                                                            </p>

                                                        </div>

                                                    );

                                                }
                                            )
                                        }

                                    </div>

                                </div>
                            )
                    }

                </div>


                {/* ========================================= */}
                {/* PRODUCT */}
                {/* ========================================= */}

                <div
                    className="
                        bg-white
                        border
                        border-gray-200
                        rounded-xl
                        p-6
                    "
                >

                    <h2
                        className="
                            text-xl
                            font-semibold
                            mb-6
                        "
                    >
                        Ordered Product
                    </h2>


                    <div
                        className="
                            flex
                            gap-5
                            items-center
                        "
                    >

                        {/* IMAGE */}

                        <div
                            className="
                                w-28
                                h-28
                                border
                                rounded-lg
                                overflow-hidden
                                bg-gray-50
                            "
                        >

                            <img
                                src={
                                    Array.isArray(
                                        order.images
                                    )
                                        ? order.images[0]
                                        : order.images
                                }
                                alt={
                                    order.product_name
                                }
                                className="
                                    w-full
                                    h-full
                                    object-contain
                                "
                            />

                        </div>


                        {/* PRODUCT INFO */}

                        <div>

                            <h3
                                className="
                                    text-lg
                                    font-semibold
                                    text-gray-900
                                "
                            >
                                {
                                    order.product_name
                                }
                            </h3>


                            <p
                                className="
                                    text-sm
                                    text-gray-500
                                    mt-2
                                "
                            >
                                Category:{" "}
                                {order.category}
                            </p>
                            <p className="text-sm text-gray-500 mt-2">
                                Quantity: {order.quantity}
                            </p>


                            <p
                                className="
                                    text-lg
                                    font-semibold
                                    mt-3
                                "
                            >
                                ₹
                                {Number(
                                    order.price
                                ).toLocaleString(
                                    "en-IN"
                                )}
                            </p>

                        </div>

                    </div>

                </div>


                {/* ========================================= */}
                {/* BACK */}
                {/* ========================================= */}

                <div className="mt-6">

                    <Link
                        to="/"
                        className="
                            text-sm
                            text-gray-600
                            hover:text-black
                        "
                    >
                        ← Continue Shopping
                    </Link>

                </div>

            </div>

        </div>

    );

};


export default OrderView;
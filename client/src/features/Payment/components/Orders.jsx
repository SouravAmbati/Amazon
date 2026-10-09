import React, {
    useContext,
    useEffect,
    useState
} from "react";

import {
    Package,
    Truck,
    CheckCircle,
    Clock,
    XCircle
} from "lucide-react";

import {
    Link
} from "react-router-dom";
import { ProductContext } from "../../../contexts/ProductContext";




const Orders = () => {

    const {
        getOrders
    } = useContext(ProductContext);


    const [orders, setOrders] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState(null);


    // =====================================================
    // FETCH ORDERS
    // =====================================================

    useEffect(() => {

        const fetchOrders = async () => {

            try {

                setLoading(true);

                const response =
                    await getOrders();


                if (!response.success) {

                    throw new Error(
                        response.message ||
                        "Failed to fetch orders"
                    );

                }


                setOrders(
                    Array.isArray(response.data)
                        ? response.data
                        : []
                );


            } catch (error) {

                console.error(
                    "Orders page error:",
                    error
                );

                setError(
                    error.message ||
                    "Failed to fetch orders"
                );

            } finally {

                setLoading(false);

            }

        };


        fetchOrders();

    }, [getOrders]);


    // =====================================================
    // STATUS ICON
    // =====================================================

    const getStatusIcon = (status) => {

        switch (status) {

            case "confirmed":
                return (
                    <CheckCircle
                        size={18}
                    />
                );

            case "shipped":
                return (
                    <Truck
                        size={18}
                    />
                );

            case "out_for_delivery":
                return (
                    <Truck
                        size={18}
                    />
                );

            case "delivered":
                return (
                    <CheckCircle
                        size={18}
                    />
                );

            case "cancelled":
                return (
                    <XCircle
                        size={18}
                    />
                );

            default:
                return (
                    <Clock
                        size={18}
                    />
                );

        }

    };


    // =====================================================
    // STATUS STYLE
    // =====================================================

    const getStatusStyle = (status) => {

        switch (status) {

            case "confirmed":
                return `
                    bg-blue-50
                    text-blue-700
                `;

            case "shipped":
                return `
                    bg-purple-50
                    text-purple-700
                `;

            case "out_for_delivery":
                return `
                    bg-orange-50
                    text-orange-700
                `;

            case "delivered":
                return `
                    bg-green-50
                    text-green-700
                `;

            case "cancelled":
                return `
                    bg-red-50
                    text-red-700
                `;

            default:
                return `
                    bg-yellow-50
                    text-yellow-700
                `;

        }

    };


    // =====================================================
    // FORMAT STATUS
    // =====================================================

    const formatStatus = (status) => {

        return String(
            status || "processing"
        )
            .replaceAll("_", " ")
            .replace(
                /^\w/,
                (character) =>
                    character.toUpperCase()
            );

    };


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
                    Loading your orders...
                </div>

            </div>
        );

    }


    // =====================================================
    // ERROR
    // =====================================================

    if (error) {

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
                    {error}
                </p>

                <Link
                    to="/"
                    className="
                        bg-black
                        text-white
                        px-5
                        py-2
                        rounded-lg
                    "
                >
                    Continue Shopping
                </Link>

            </div>
        );

    }


    return (

        <div
            className="
                min-h-screen
                bg-gray-50
                px-4
                md:px-8
                py-10
            "
        >

            <div
                className="
                    max-w-5xl
                    mx-auto
                "
            >

                {/* ========================================= */}
                {/* HEADER */}
                {/* ========================================= */}

                <div className="mb-8">

                    <h1
                        className="
                            text-3xl
                            md:text-4xl
                            font-bold
                            text-gray-900
                        "
                    >
                        Your Orders
                    </h1>

                    <p
                        className="
                            text-gray-500
                            mt-2
                        "
                    >
                        View and track your orders
                    </p>

                </div>


                {/* ========================================= */}
                {/* EMPTY */}
                {/* ========================================= */}

                {orders.length === 0 ? (

                    <div
                        className="
                            bg-white
                            border
                            border-gray-200
                            rounded-xl
                            p-10
                            text-center
                        "
                    >

                        <Package
                            size={50}
                            className="
                                mx-auto
                                text-gray-400
                                mb-4
                            "
                        />

                        <h2
                            className="
                                text-xl
                                font-semibold
                            "
                        >
                            No orders yet
                        </h2>

                        <p
                            className="
                                text-gray-500
                                mt-2
                            "
                        >
                            Your orders will appear here.
                        </p>

                        <Link
                            to="/"
                            className="
                                inline-block
                                mt-6
                                bg-black
                                text-white
                                px-6
                                py-3
                                rounded-lg
                            "
                        >
                            Start Shopping
                        </Link>

                    </div>

                ) : (

                    /* ======================================= */
                    /* ORDERS */
                    /* ======================================= */

                    <div className="space-y-5">

                        {orders.map((order) => {

                            const quantity =
                                Number(
                                    order.quantity
                                ) || 1;


                            const price =
                                Number(
                                    order.price
                                ) || 0;


                            const total =
                                price * quantity;


                            const status =
                                String(
                                    order.status ||
                                    order.order_status ||
                                    "processing"
                                ).toLowerCase();


                            const image =
                                Array.isArray(
                                    order.images
                                )
                                    ? order.images[0]
                                    : order.images;


                            return (

                                <Link
                                    key={
                                        order.order_id
                                    }
                                    to={
                                        `/order/${order.order_id}`
                                    }
                                    className="
                                        block
                                        bg-white
                                        border
                                        border-gray-200
                                        rounded-xl
                                        overflow-hidden
                                        hover:shadow-md
                                        transition
                                    "
                                >

                                    {/* ================================= */}
                                    {/* ORDER HEADER */}
                                    {/* ================================= */}

                                    <div
                                        className="
                                            bg-gray-50
                                            border-b
                                            px-5
                                            py-4
                                            flex
                                            flex-col
                                            md:flex-row
                                            md:items-center
                                            md:justify-between
                                            gap-3
                                        "
                                    >


                                        <div>

                                            <p
                                                className="
                                                    text-xs
                                                    text-gray-500
                                                "
                                            >
                                                ORDER DATE
                                            </p>

                                            <p
                                                className="
                                                    text-sm
                                                    text-gray-800
                                                "
                                            >
                                                {
                                                    order.created_at
                                                        ? new Date(
                                                            order.created_at
                                                        ).toLocaleDateString(
                                                            "en-IN",
                                                            {
                                                                day:
                                                                    "numeric",
                                                                month:
                                                                    "short",
                                                                year:
                                                                    "numeric"
                                                            }
                                                        )
                                                        : "-"
                                                }
                                            </p>

                                        </div>


                                        <div
                                            className={`
                                                inline-flex
                                                items-center
                                                gap-2
                                                px-3
                                                py-2
                                                rounded-full
                                                text-sm
                                                font-medium
                                                ${getStatusStyle(
                                                    status
                                                )}
                                            `}
                                        >

                                            {
                                                getStatusIcon(
                                                    status
                                                )
                                            }

                                            {
                                                formatStatus(
                                                    status
                                                )
                                            }

                                        </div>

                                    </div>


                                    {/* ================================= */}
                                    {/* ORDER PRODUCT */}
                                    {/* ================================= */}

                                    <div
                                        className="
                                            p-5
                                            flex
                                            flex-col
                                            md:flex-row
                                            md:items-center
                                            gap-5
                                        "
                                    >

                                        {/* IMAGE */}

                                        <div
                                            className="
                                                w-28
                                                h-28
                                                rounded-lg
                                                border
                                                bg-gray-50
                                                overflow-hidden
                                                shrink-0
                                            "
                                        >

                                            <img
                                                src={image}
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

                                        <div
                                            className="
                                                flex-1
                                            "
                                        >

                                            <h2
                                                className="
                                                    text-lg
                                                    font-semibold
                                                    text-gray-900
                                                "
                                            >
                                                {
                                                    order.product_name
                                                }
                                            </h2>


                                            <p
                                                className="
                                                    text-sm
                                                    text-gray-500
                                                    mt-2
                                                "
                                            >
                                                Category:{" "}
                                                {
                                                    order.category
                                                }
                                            </p>


                                            <p
                                                className="
                                                    text-sm
                                                    text-gray-500
                                                    mt-1
                                                "
                                            >
                                                Quantity:{" "}
                                                {quantity}
                                            </p>

                                        </div>


                                        {/* PRICE */}

                                        <div
                                            className="
                                                md:text-right
                                            "
                                        >

                                            <p
                                                className="
                                                    text-xs
                                                    text-gray-500
                                                "
                                            >
                                                TOTAL
                                            </p>


                                            <p
                                                className="
                                                    text-xl
                                                    font-bold
                                                    text-gray-900
                                                    mt-1
                                                "
                                            >
                                                ₹
                                                {
                                                    total.toLocaleString(
                                                        "en-IN",
                                                        {
                                                            minimumFractionDigits: 2
                                                        }
                                                    )
                                                }
                                            </p>


                                            <p
                                                className="
                                                    text-sm
                                                    text-gray-500
                                                    mt-1
                                                "
                                            >
                                                ₹
                                                {
                                                    price.toLocaleString(
                                                        "en-IN",
                                                        {
                                                            minimumFractionDigits: 2
                                                        }
                                                    )
                                                }{" "}
                                                each
                                            </p>

                                        </div>

                                    </div>


                                    {/* ================================= */}
                                    {/* TRACK ORDER */}
                                    {/* ================================= */}

                                    <div
                                        className="
                                            border-t
                                            px-5
                                            py-3
                                            text-sm
                                            font-medium
                                            text-gray-700
                                        "
                                    >
                                        View order and track delivery →
                                    </div>

                                </Link>

                            );

                        })}

                    </div>

                )}

            </div>

        </div>

    );

};

export default Orders;
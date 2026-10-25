
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
import socket from "../../../config/socketClient.js";

const OrderView = () => {
    const {
        getOrderStatus
    } = useContext(ProductContext);

    const {
        orderId
    } = useParams();

    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // FETCH ORDER

    const fetchOrder = async () => {
        try {
            const response = await getOrderStatus(orderId);

            if (!response.success) {
                throw new Error(
                    response.message || "Failed to fetch order"
                );
            }

            setOrder(response.data);
            setError(null);
        } catch (error) {
            console.error("Order fetch error:", error);

            setError(
                error.message || "Failed to fetch order"
            );
        } finally {
            setLoading(false);
        }
    };

    // Initial HTTP fetch, then listen for live status changes.
    useEffect(() => {
        if (!orderId) return;

        let active = true;

        const loadInitialOrder = async () => {
            try {
                const response = await getOrderStatus(orderId);

                if (!active) return;

                if (!response.success) {
                    throw new Error(
                        response.message || "Failed to fetch order"
                    );
                }

                setOrder(response.data);
                setError(null);
            } catch (error) {
                if (!active) return;

                console.error("Order fetch error:", error);
                setError(
                    error.message || "Failed to fetch order"
                );
            } finally {
                if (active) setLoading(false);
            }
        };

        const joinRoom = () => {
            socket.emit("joinOrder", String(orderId));
        };

        const handleOrderStatusUpdated = (update) => {
            if (String(update.orderId) !== String(orderId)) {
                return;
            }

            setOrder((currentOrder) => {
                if (!currentOrder) return currentOrder;

                return {
                    ...currentOrder,
                    status: update.status
                };
            });
        };

        socket.on("connect", joinRoom);
        socket.on("orderStatusUpdated", handleOrderStatusUpdated);

        if (socket.connected) {
            joinRoom();
        }

        loadInitialOrder();

        return () => {
            active = false;

            socket.off("connect", joinRoom);
            socket.off(
                "orderStatusUpdated",
                handleOrderStatusUpdated
            );

            if (socket.connected) {
                socket.emit("leaveOrder", String(orderId));
            }
        };
    }, [orderId, getOrderStatus]);


    // INITIAL FETCH + POLLING
    useEffect(() => {
        if (!orderId) {
            return;
        }

        fetchOrder();

        const interval = setInterval(() => {
            fetchOrder();
        }, 5000);

        return () => {
            clearInterval(interval);
        };
    }, [orderId]);

    // LOADING
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-gray-500">
                    Loading order...
                </div>
            </div>
        );
    }

    // ERROR
    if (error || !order) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-4">
                <p className="text-red-500">
                    {error || "Order not found"}
                </p>

                <Link
                    to="/"
                    className="px-5 py-2 bg-black text-white rounded-lg"
                >
                    Continue Shopping
                </Link>
            </div>
        );
    }

    // ORDER STATUS
    const status = String(
        order.status ??
        order.order_status ??
        "processing"
    ).toLowerCase();

    // STATUS STEPS
    const statusSteps = [
        {
            key: "processing",
            label: "Placed",
            icon: Check
        },
        {
            key: "confirmed",
            label: "Confirm",
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

    const isCancelled =
        status === "cancelled";

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-5xl mx-auto px-6 py-10">

                {/* HEADER */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">
                        Your Order
                    </h1>

                    <p className="text-sm text-gray-500 mt-2"></p>
                </div>

                {/* ORDER STATUS */}
                <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">

                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-xl font-semibold">
                                Order Status
                            </h2>

                            <p className="text-sm text-gray-500 mt-1">
                                Track your order
                            </p>
                        </div>

                        {/* CURRENT STATUS */}
                        <span
                            className={`
                                px-4 py-2 rounded-full text-sm font-medium
                                ${isCancelled
                                    ? "bg-red-50 text-red-700"
                                    : status === "delivered"
                                        ? "bg-green-50 text-green-700"
                                        : status === "confirmed"
                                            ? "bg-blue-50 text-blue-700"
                                            : status === "shipped"
                                                ? "bg-purple-50 text-purple-700"
                                                : "bg-yellow-50 text-yellow-700"
                                }
                            `}
                        >
                            {status
                                .replaceAll("_", " ")
                                .replace(
                                    /^\w/,
                                    (c) => c.toUpperCase()
                                )}
                        </span>
                    </div>

                    {/* CANCELLED */}
                    {isCancelled ? (
                        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4">
                            This order has been cancelled.
                        </div>
                    ) : (

                        /* RESPONSIVE PROGRESS TRACKER */
                        <div className="relative mt-2">

                            {/* CONNECTING LINE */}
                            <div className="absolute left-[10%] right-[10%] top-5 h-1 bg-gray-200" />

                            {/* STATUS STEPS */}
                            <div className="relative grid grid-cols-5">

                                {statusSteps.map((step, index) => {
                                    const Icon = step.icon;

                                    const completed =
                                        currentStatusIndex >= index;

                                    return (
                                        <div
                                            key={step.key}
                                            className="relative z-10 flex min-w-0 flex-col items-center"
                                        >
                                            {/* ICON CIRCLE */}
                                            <div
                                                className={`
                                                    flex h-10 w-10 shrink-0 items-center justify-center
                                                    rounded-full sm:h-11 sm:w-11
                                                    ${completed
                                                        ? "bg-black text-white"
                                                        : "border border-gray-300 bg-white text-gray-400"
                                                    }
                                                `}
                                            >
                                                <Icon size={18} />
                                            </div>

                                            {/* STATUS LABEL */}
                                            <p
                                                className={`
                                                    mt-3 w-full px-1 text-center
                                                    text-[10px] leading-tight
                                                    sm:text-xs sm:leading-snug
                                                    ${completed
                                                        ? "font-medium text-gray-900"
                                                        : "text-gray-400"
                                                    }
                                                `}
                                                style={{
                                                    overflowWrap: "anywhere"
                                                }}
                                            >
                                                {step.label}
                                            </p>
                                        </div>
                                    );
                                })}

                            </div>
                        </div>
                    )}
                </div>

                {/* ORDERED PRODUCT */}
                <div className="bg-white border border-gray-200 rounded-xl p-6">

                    <h2 className="text-xl font-semibold mb-6">
                        Ordered Product
                    </h2>

                    <div className="flex gap-5 items-center">

                        {/* IMAGE */}
                        <div className="w-28 h-28 border rounded-lg overflow-hidden bg-gray-50">
                            <img
                                src={
                                    Array.isArray(order.images)
                                        ? order.images[0]
                                        : order.images
                                }
                                alt={order.product_name}
                                className="w-full h-full object-contain"
                            />
                        </div>

                        {/* PRODUCT INFO */}
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">
                                {order.product_name}
                            </h3>

                            <p className="text-sm text-gray-500 mt-2">
                                Category: {order.category}
                            </p>

                            <p className="text-sm text-gray-500 mt-2">
                                Quantity: {order.quantity}
                            </p>

                            <p className="text-lg font-semibold mt-3">
                                ₹
                                {Number(
                                    order.price
                                ).toLocaleString("en-IN")}
                            </p>
                        </div>

                    </div>
                </div>

                {/* CONTINUE SHOPPING */}
                <div className="mt-6">
                    <Link
                        to="/"
                        className="text-sm text-gray-600 hover:text-black"
                    >
                        ← Continue Shopping
                    </Link>
                </div>

            </div>
        </div>
    );
};

export default OrderView;

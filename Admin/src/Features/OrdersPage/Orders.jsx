import React, { useState } from "react";
import {
    PackageCheck,
    Trash2
} from "lucide-react";

const Orders = () => {

    const [orders, setOrders] = useState([
        {
            id: 1,
            productName: "Apple iPhone 15 Pro Max",
            productImage:
                "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=200",
            customerName: "Sourav Ambati",
            quantity: 1,
            totalPrice: 159900,
            status: "Processing"
        },
        {
            id: 2,
            productName: "Sony WH-1000XM5 Wireless Headphones",
            productImage:
                "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200",
            customerName: "Rahul Sharma",
            quantity: 2,
            totalPrice: 59980,
            status: "Confirmed"
        },
        {
            id: 3,
            productName: "Apple MacBook Air M3",
            productImage:
                "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=200",
            customerName: "Priya Verma",
            quantity: 1,
            totalPrice: 114900,
            status: "Shipped"
        },
        {
            id: 4,
            productName: "Apple Watch Series 9",
            productImage:
                "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=200",
            customerName: "Amit Patel",
            quantity: 1,
            totalPrice: 41900,
            status: "Delivered"
        }
    ]);

    const [selectedOrders, setSelectedOrders] = useState([]);


    const orderStatuses = [
        "Processing",
        "Confirmed",
        "Shipped",
        "Out for Delivery",
        "Delivered",
        "Cancelled"
    ];


    const handleStatusChange = (orderId, newStatus) => {

        setOrders((previousOrders) =>
            previousOrders.map((order) =>
                order.id === orderId
                    ? {
                        ...order,
                        status: newStatus
                    }
                    : order
            )
        );

    };


    const handleSelectOrder = (orderId) => {

        setSelectedOrders((previousSelectedOrders) => {

            if (previousSelectedOrders.includes(orderId)) {

                return previousSelectedOrders.filter(
                    (id) => id !== orderId
                );

            }

            return [
                ...previousSelectedOrders,
                orderId
            ];

        });

    };


    const handleSelectAll = () => {

        if (selectedOrders.length === orders.length) {

            setSelectedOrders([]);

        } else {

            setSelectedOrders(
                orders.map((order) => order.id)
            );

        }

    };


    const handleDeleteSelected = () => {

        setOrders((previousOrders) =>
            previousOrders.filter(
                (order) =>
                    !selectedOrders.includes(order.id)
            )
        );

        setSelectedOrders([]);

    };


    const getStatusStyle = (status) => {

        switch (status) {

            case "Processing":
                return "bg-yellow-50 text-yellow-700 border-yellow-200";

            case "Confirmed":
                return "bg-blue-50 text-blue-700 border-blue-200";

            case "Shipped":
                return "bg-purple-50 text-purple-700 border-purple-200";

            case "Out for Delivery":
                return "bg-orange-50 text-orange-700 border-orange-200";

            case "Delivered":
                return "bg-green-50 text-green-700 border-green-200";

            case "Cancelled":
                return "bg-red-50 text-red-700 border-red-200";

            default:
                return "bg-gray-50 text-gray-700 border-gray-200";

        }

    };


    return (
        <div className="min-h-screen bg-gray-50 p-8">

            {/* PAGE HEADER */}

            <div className="mb-8">

                <h1 className="text-2xl font-bold text-gray-900">
                    Orders
                </h1>

                <p className="text-sm text-gray-500 mt-1">
                    Manage customer orders and delivery status
                </p>

            </div>


            {/* SELECTED ORDERS */}

            {selectedOrders.length > 0 && (

                <div
                    className="
                        flex
                        items-center
                        justify-between
                        mb-4
                        px-5
                        py-3
                        bg-red-50
                        border
                        border-red-200
                        rounded-lg
                    "
                >

                    <div className="flex items-center gap-2">

                        <Trash2
                            size={18}
                            className="text-red-600"
                        />

                        <span className="text-sm font-medium text-red-700">

                            {selectedOrders.length} order
                            {selectedOrders.length > 1 && "s"} selected

                        </span>

                    </div>


                    <button
                        type="button"
                        onClick={handleDeleteSelected}
                        className="
                            flex
                            items-center
                            gap-2
                            px-4
                            py-2
                            bg-red-600
                            text-white
                            text-sm
                            font-medium
                            rounded-lg
                            hover:bg-red-700
                            transition
                        "
                    >

                        <Trash2 size={16} />

                        Delete Selected

                    </button>

                </div>

            )}


            {/* ORDERS TABLE */}

            <div
                className="
                    bg-white
                    border
                    border-gray-200
                    rounded-xl
                    overflow-hidden
                    shadow-sm
                "
            >

                <div className="overflow-x-auto">

                    <table className="w-full">

                        {/* TABLE HEAD */}

                        <thead className="bg-gray-50 border-b border-gray-200">

                            <tr>

                                <th className="w-16 px-6 py-4">

                                    <input
                                        type="checkbox"
                                        className="checkbox checkbox-sm"
                                        checked={
                                            orders.length > 0 &&
                                            selectedOrders.length === orders.length
                                        }
                                        onChange={handleSelectAll}
                                    />

                                </th>


                                <th
                                    className="
                                        px-6
                                        py-4
                                        text-left
                                        text-xs
                                        font-semibold
                                        text-gray-500
                                        uppercase
                                        tracking-wider
                                    "
                                >
                                    Product
                                </th>


                                <th
                                    className="
                                        px-6
                                        py-4
                                        text-left
                                        text-xs
                                        font-semibold
                                        text-gray-500
                                        uppercase
                                        tracking-wider
                                    "
                                >
                                    Customer
                                </th>


                                <th
                                    className="
                                        px-6
                                        py-4
                                        text-left
                                        text-xs
                                        font-semibold
                                        text-gray-500
                                        uppercase
                                        tracking-wider
                                    "
                                >
                                    Order Details
                                </th>


                                <th
                                    className="
                                        px-6
                                        py-4
                                        text-left
                                        text-xs
                                        font-semibold
                                        text-gray-500
                                        uppercase
                                        tracking-wider
                                    "
                                >
                                    Total
                                </th>


                                <th
                                    className="
                                        px-6
                                        py-4
                                        text-left
                                        text-xs
                                        font-semibold
                                        text-gray-500
                                        uppercase
                                        tracking-wider
                                    "
                                >
                                    Delivery Status
                                </th>

                            </tr>

                        </thead>


                        {/* TABLE BODY */}

                        <tbody className="divide-y divide-gray-100">

                            {orders.map((order) => (

                                <tr
                                    key={order.id}
                                    className={`
                                        transition

                                        ${
                                            selectedOrders.includes(order.id)
                                                ? "bg-red-50"
                                                : "hover:bg-gray-50"
                                        }
                                    `}
                                >

                                    {/* CHECKBOX */}

                                    <td className="px-6 py-5">

                                        <input
                                            type="checkbox"
                                            className="checkbox checkbox-sm"
                                            checked={
                                                selectedOrders.includes(order.id)
                                            }
                                            onChange={() =>
                                                handleSelectOrder(order.id)
                                            }
                                        />

                                    </td>


                                    {/* PRODUCT */}

                                    <td className="px-6 py-5">

                                        <div className="flex items-center gap-4">

                                            <div
                                                className="
                                                    w-16
                                                    h-16
                                                    shrink-0
                                                    border
                                                    border-gray-200
                                                    rounded-lg
                                                    overflow-hidden
                                                    bg-gray-50
                                                "
                                            >

                                                <img
                                                    src={order.productImage}
                                                    alt={order.productName}
                                                    className="
                                                        w-full
                                                        h-full
                                                        object-contain
                                                    "
                                                />

                                            </div>


                                            <div>

                                                <p
                                                    className="
                                                        max-w-64
                                                        text-sm
                                                        font-semibold
                                                        text-gray-900
                                                    "
                                                >
                                                    {order.productName}
                                                </p>

                                                <p className="text-xs text-gray-400 mt-1">
                                                    Order #{order.id}
                                                </p>

                                            </div>

                                        </div>

                                    </td>


                                    {/* CUSTOMER */}

                                    <td className="px-6 py-5">

                                        <p className="text-sm font-medium text-gray-900">
                                            {order.customerName}
                                        </p>

                                    </td>


                                    {/* ORDER DETAILS */}

                                    <td className="px-6 py-5">

                                        <p className="text-sm text-gray-700">
                                            Quantity: {order.quantity}
                                        </p>

                                    </td>


                                    {/* TOTAL */}

                                    <td className="px-6 py-5">

                                        <p className="text-sm font-semibold text-gray-900">

                                            ₹
                                            {order.totalPrice.toLocaleString(
                                                "en-IN"
                                            )}

                                        </p>

                                    </td>


                                    {/* DELIVERY STATUS */}

                                    <td className="px-6 py-5">

                                        <select
                                            value={order.status}
                                            onChange={(e) =>
                                                handleStatusChange(
                                                    order.id,
                                                    e.target.value
                                                )
                                            }
                                            className={`
                                                min-w-44
                                                px-3
                                                py-2.5
                                                border
                                                rounded-lg
                                                text-sm
                                                font-medium
                                                outline-none
                                                cursor-pointer
                                                transition

                                                ${getStatusStyle(order.status)}
                                            `}
                                        >

                                            {orderStatuses.map((status) => (

                                                <option
                                                    key={status}
                                                    value={status}
                                                >
                                                    {status}
                                                </option>

                                            ))}

                                        </select>

                                    </td>

                                </tr>

                            ))}

                        </tbody>

                    </table>

                </div>

            </div>

        </div>
    );
};

export default Orders;
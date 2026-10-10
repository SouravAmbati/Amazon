import React, {
    useContext,
    useEffect,
    useState
} from "react";

import {
    PackageCheck,
    Trash2
} from "lucide-react";
import { ProductContext } from "../../context/ProductContext.jsx";



const Orders = () => {

    // --------------------------------------------------
    // PRODUCT CONTEXT
    // --------------------------------------------------

    const {
        GetOrders,
        UpdateOrderStatus
    } = useContext(ProductContext);


    // --------------------------------------------------
    // ORDERS
    // --------------------------------------------------

    const [orders, setOrders] = useState([]);

    const [loading, setLoading] = useState(true);


    // --------------------------------------------------
    // SELECTED ORDERS
    // --------------------------------------------------

    const [selectedOrders, setSelectedOrders] =
        useState([]);


    // --------------------------------------------------
    // ORDER STATUSES
    // --------------------------------------------------

    const orderStatuses = [
        {
            value: "processing",
            label: "Processing"
        },
        {
            value: "confirmed",
            label: "Confirmed"
        },
        {
            value: "shipped",
            label: "Shipped"
        },
        {
            value: "out_for_delivery",
            label: "Out for Delivery"
        },
        {
            value: "delivered",
            label: "Delivered"
        },
        {
            value: "cancelled",
            label: "Cancelled"
        }
    ];


    // --------------------------------------------------
    // GET ORDERS
    // --------------------------------------------------

    const fetchOrders = async () => {

        try {

            setLoading(true);

            const response =
                await GetOrders();


            if (!response.success) {
                throw new Error(
                    response.message ||
                    "Failed to fetch orders"
                );
            }


            const formattedOrders =
                response.data.map((order) => ({

                    id: order.order_id,

                    productId:
                        order.product_id,

                    productName:
                        order.product_name,

                    productImage:
                        Array.isArray(order.images)
                            ? order.images[0]
                            : order.images,

                    // Your current DB schema
                    // does not have customer data yet.
                    customerName:
                        "Customer",

                    // Your current orders table
                    // does not have quantity yet.
                    quantity: order.quantity,

                    totalPrice:
                        Number(order.price),

                    status:
                        order.order_status ||
                        "processing",

                    createdAt:
                        order.created_at
                }));


            setOrders(formattedOrders);


        } catch (error) {

            console.error(
                "Fetch orders error:",
                error
            );

            alert(
                error.message ||
                "Failed to fetch orders"
            );

        } finally {

            setLoading(false);
        }
    };


    // --------------------------------------------------
    // LOAD ORDERS
    // --------------------------------------------------

    useEffect(() => {

        fetchOrders();

    }, []);


    // --------------------------------------------------
    // UPDATE ORDER STATUS
    // --------------------------------------------------

    const handleStatusChange = async (
        orderId,
        newStatus
    ) => {

        try {

            const response =
                await UpdateOrderStatus(
                    orderId,
                    newStatus
                );


            if (!response.success) {

                throw new Error(
                    response.message ||
                    "Failed to update order status"
                );

            }


            // Update local UI after
            // database update succeeds

            setOrders((previousOrders) =>
                previousOrders.map(
                    (order) =>
                        order.id === orderId
                            ? {
                                ...order,
                                status: newStatus
                            }
                            : order
                )
            );


        } catch (error) {

            console.error(
                "Order status update error:",
                error
            );


            alert(
                error.message ||
                "Failed to update order status"
            );
        }
    };


    // --------------------------------------------------
    // SELECT ORDER
    // --------------------------------------------------

    const handleSelectOrder = (orderId) => {

        setSelectedOrders(
            (previousSelectedOrders) => {

                if (
                    previousSelectedOrders.includes(
                        orderId
                    )
                ) {

                    return previousSelectedOrders.filter(
                        (id) =>
                            id !== orderId
                    );

                }


                return [
                    ...previousSelectedOrders,
                    orderId
                ];
            }
        );
    };


    // --------------------------------------------------
    // SELECT ALL
    // --------------------------------------------------

    const handleSelectAll = () => {

        if (
            selectedOrders.length ===
            orders.length
        ) {

            setSelectedOrders([]);

        } else {

            setSelectedOrders(
                orders.map(
                    (order) => order.id
                )
            );
        }
    };


    // --------------------------------------------------
    // DELETE SELECTED
    // --------------------------------------------------

    const handleDeleteSelected = () => {

        setOrders(
            (previousOrders) =>
                previousOrders.filter(
                    (order) =>
                        !selectedOrders.includes(
                            order.id
                        )
                )
        );


        setSelectedOrders([]);
    };


    // --------------------------------------------------
    // STATUS STYLE
    // --------------------------------------------------

    const getStatusStyle = (status) => {

        switch (status) {

            case "processing":

                return (
                    "bg-yellow-50 " +
                    "text-yellow-700 " +
                    "border-yellow-200"
                );


            case "confirmed":

                return (
                    "bg-blue-50 " +
                    "text-blue-700 " +
                    "border-blue-200"
                );


            case "shipped":

                return (
                    "bg-purple-50 " +
                    "text-purple-700 " +
                    "border-purple-200"
                );


            case "out_for_delivery":

                return (
                    "bg-orange-50 " +
                    "text-orange-700 " +
                    "border-orange-200"
                );


            case "delivered":

                return (
                    "bg-green-50 " +
                    "text-green-700 " +
                    "border-green-200"
                );


            case "cancelled":

                return (
                    "bg-red-50 " +
                    "text-red-700 " +
                    "border-red-200"
                );


            default:

                return (
                    "bg-gray-50 " +
                    "text-gray-700 " +
                    "border-gray-200"
                );
        }
    };


    // --------------------------------------------------
    // LOADING
    // --------------------------------------------------

    if (loading) {

        return (
            <div
                className="
                    min-h-screen
                    bg-gray-50
                    p-8
                    flex
                    items-center
                    justify-center
                "
            >

                <div className="text-gray-500">
                    Loading orders...
                </div>

            </div>
        );
    }


    // --------------------------------------------------
    // UI
    // --------------------------------------------------

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

                            {selectedOrders.length > 1 &&
                                "s"
                            }

                            {" "}selected

                        </span>

                    </div>


                    <button
                        type="button"
                        onClick={
                            handleDeleteSelected
                        }
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

                        <thead
                            className="
                                bg-gray-50
                                border-b
                                border-gray-200
                            "
                        >

                            <tr>

                                <th className="w-16 px-6 py-4">

                                    <input
                                        type="checkbox"
                                        className="checkbox checkbox-sm"
                                        checked={
                                            orders.length > 0 &&
                                            selectedOrders.length ===
                                                orders.length
                                        }
                                        onChange={
                                            handleSelectAll
                                        }
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

                        <tbody
                            className="
                                divide-y
                                divide-gray-100
                            "
                        >

                            {orders.map((order) => (

                                <tr
                                    key={order.id}
                                    className={`
                                        transition

                                        ${
                                            selectedOrders.includes(
                                                order.id
                                            )
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
                                                selectedOrders.includes(
                                                    order.id
                                                )
                                            }
                                            onChange={() =>
                                                handleSelectOrder(
                                                    order.id
                                                )
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
                                                    src={
                                                        order.productImage
                                                    }
                                                    alt={
                                                        order.productName
                                                    }
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
                                                    {
                                                        order.productName
                                                    }
                                                </p>
                                            </div>

                                        </div>

                                    </td>


                                    {/* ORDER DETAILS */}

                                    <td className="px-6 py-5">

                                        <p className="text-sm text-gray-700">

                                            Quantity:{" "}
                                            {order.quantity}

                                        </p>

                                    </td>


                                    {/* TOTAL */}

                                    <td className="px-6 py-5">

                                        <p className="text-sm font-semibold text-gray-900">

                                            ₹
                                            {Number(
                                                order.totalPrice
                                            ).toLocaleString(
                                                "en-IN"
                                            )}

                                        </p>

                                    </td>


                                    {/* DELIVERY STATUS */}

                                    <td className="px-6 py-5">

                                        <select
                                            value={
                                                order.status
                                            }
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

                                                ${getStatusStyle(
                                                    order.status
                                                )}
                                            `}
                                        >

                                            {orderStatuses.map(
                                                (status) => (

                                                    <option
                                                        key={
                                                            status.value
                                                        }
                                                        value={
                                                            status.value
                                                        }
                                                    >
                                                        {
                                                            status.label
                                                        }
                                                    </option>

                                                )
                                            )}

                                        </select>

                                    </td>

                                </tr>

                            ))}


                            {/* NO ORDERS */}

                            {orders.length === 0 && (

                                <tr>

                                    <td
                                        colSpan="6"
                                        className="
                                            text-center
                                            py-12
                                            text-gray-500
                                        "
                                    >
                                        No orders found
                                    </td>

                                </tr>

                            )}

                        </tbody>

                    </table>

                </div>

            </div>

        </div>
    );
};


export default Orders;
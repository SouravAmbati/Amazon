import React, { useState } from "react";

import {
    Eye,
    Pencil,
    Trash2
} from "lucide-react";

import ProductDetail from "./ProductDetail";


const ProductsTable = () => {


    /* ================= PRODUCT DATA ================= */


    const [products, setProducts] = useState([

        {
            id: 1,

            name: "Apple iPhone 15 Pro Max",

            category: "Electronics",

            price: 159900,

            description:
                "The Apple iPhone 15 Pro Max features a premium titanium design, powerful performance and an advanced camera system. Designed for users who want high performance, premium build quality and professional-level photography capabilities.",

            images: [
                "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800",
                "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800",
                "https://images.unsplash.com/photo-1580910051074-3eb694886505?w=800",
                "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800"
            ],

            colors: [
                "#1f2937",
                "#d1d5db",
                "#2563eb",
                "#f5f5dc"
            ],

            sizes: [
                "128 GB",
                "256 GB",
                "512 GB",
                "1 TB"
            ]
        },


        {
            id: 2,

            name: "Sony WH-1000XM5 Wireless Headphones",

            category: "Electronics",

            price: 29990,

            description:
                "Premium wireless noise cancelling headphones with immersive sound quality, comfortable design and long battery life.",

            images: [
                "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800",
                "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800",
                "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800",
                "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800"
            ],

            colors: [
                "#000000",
                "#d1d5db",
                "#1e3a5f"
            ],

            sizes: [
                "Standard"
            ]
        },


        {
            id: 3,

            name: "Apple MacBook Air M3",

            category: "Electronics",

            price: 114900,

            description:
                "Apple MacBook Air powered by the M3 chip delivers fast performance, excellent battery life and a lightweight premium design.",

            images: [
                "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800",
                "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800",
                "https://images.unsplash.com/photo-1511385348-a52b4a160dc2?w=800",
                "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800"
            ],

            colors: [
                "#1f2937",
                "#d1d5db",
                "#e5e7eb"
            ],

            sizes: [
                "256 GB",
                "512 GB",
                "1 TB"
            ]
        },


        {
            id: 4,

            name: "Apple Watch Series 9",

            category: "Wearables",

            price: 41900,

            description:
                "Apple Watch Series 9 provides advanced health tracking, fitness features and seamless integration with Apple devices.",

            images: [
                "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=800",
                "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800",
                "https://images.unsplash.com/photo-1551816230-ef5deaed4a26?w=800",
                "https://images.unsplash.com/photo-1544117519-31a4b719223d?w=800"
            ],

            colors: [
                "#000000",
                "#ef4444",
                "#d1d5db"
            ],

            sizes: [
                "41mm",
                "45mm"
            ]
        }

    ]);



    /* ================= STATE ================= */


    // PRODUCTS SELECTED USING CHECKBOX

    const [selectedProducts, setSelectedProducts] = useState([]);


    // PRODUCT SELECTED FOR DETAIL POPUP

    const [selectedProduct, setSelectedProduct] = useState(null);



    /* ================= SELECT PRODUCT ================= */


    const handleSelectProduct = (id) => {

        if (selectedProducts.includes(id)) {

            setSelectedProducts(

                selectedProducts.filter(

                    productId => productId !== id

                )

            );

        } else {

            setSelectedProducts([

                ...selectedProducts,

                id

            ]);

        }

    };



    /* ================= SELECT ALL ================= */


    const handleSelectAll = () => {

        if (

            selectedProducts.length === products.length

        ) {

            setSelectedProducts([]);

        } else {

            setSelectedProducts(

                products.map(

                    product => product.id

                )

            );

        }

    };



    /* ================= DELETE SELECTED ================= */


    const handleDeleteSelected = () => {

        setProducts(

            products.filter(

                product =>

                    !selectedProducts.includes(

                        product.id

                    )

            )

        );


        setSelectedProducts([]);

    };



    /* ================= EDIT PRODUCT ================= */


    const handleEditProduct = (product) => {

        console.log(

            "Edit Product:",

            product

        );


        setSelectedProduct(null);

    };



    /* ================= UI ================= */


    return (

        <div className="p-8">


            {/* ================= PAGE TITLE ================= */}


            <div className="mb-6">

                <h1
                    className="
                        text-2xl
                        font-bold
                        text-gray-900
                    "
                >

                    Products

                </h1>


                <p
                    className="
                        text-sm
                        text-gray-500
                        mt-1
                    "
                >

                    Manage your ShopZone products

                </p>

            </div>



            {/* ================= SELECTED PRODUCT ACTION ================= */}


            {selectedProducts.length > 0 && (

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


                    <div
                        className="
                            flex
                            items-center
                            gap-2
                        "
                    >

                        <Trash2
                            size={18}
                            className="text-red-600"
                        />


                        <span
                            className="
                                text-sm
                                font-medium
                                text-red-700
                            "
                        >

                            {selectedProducts.length}

                            {" "}

                            product

                            {selectedProducts.length > 1 && "s"}

                            {" "}

                            selected

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
                            cursor-pointer
                        "
                    >

                        <Trash2 size={16} />


                        Delete Selected

                    </button>


                </div>

            )}



            {/* ================= PRODUCTS TABLE ================= */}


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


                        {/* ================= TABLE HEAD ================= */}


                        <thead
                            className="
                                bg-gray-50
                                border-b
                                border-gray-200
                            "
                        >


                            <tr>


                                {/* CHECKBOX */}


                                <th
                                    className="
                                        w-16
                                        px-6
                                        py-4
                                    "
                                >

                                    <input
                                        type="checkbox"
                                        className="
                                            checkbox
                                            checkbox-sm
                                        "
                                        checked={

                                            products.length > 0 &&

                                            selectedProducts.length ===

                                            products.length

                                        }
                                        onChange={handleSelectAll}
                                    />

                                </th>



                                {/* IMAGE */}


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

                                    Product Image

                                </th>



                                {/* PRODUCT NAME */}


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

                                    Product Name

                                </th>



                                {/* ACTIONS */}


                                <th
                                    className="
                                        px-6
                                        py-4
                                        text-right
                                        text-xs
                                        font-semibold
                                        text-gray-500
                                        uppercase
                                        tracking-wider
                                    "
                                >

                                    Actions

                                </th>


                            </tr>


                        </thead>



                        {/* ================= TABLE BODY ================= */}


                        <tbody
                            className="
                                divide-y
                                divide-gray-100
                            "
                        >


                            {products.map((product) => (


                                <tr
                                    key={product.id}
                                    className={`
                                        transition

                                        ${

                                            selectedProducts.includes(

                                                product.id

                                            )

                                                ? "bg-red-50"

                                                : "hover:bg-gray-50"

                                        }
                                    `}
                                >


                                    {/* ================= CHECKBOX ================= */}


                                    <td
                                        className="
                                            px-6
                                            py-4
                                        "
                                    >

                                        <input
                                            type="checkbox"
                                            className="
                                                checkbox
                                                checkbox-sm
                                            "
                                            checked={

                                                selectedProducts.includes(

                                                    product.id

                                                )

                                            }
                                            onChange={() =>

                                                handleSelectProduct(

                                                    product.id

                                                )

                                            }
                                        />

                                    </td>



                                    {/* ================= PRODUCT IMAGE ================= */}


                                    <td
                                        className="
                                            px-6
                                            py-4
                                        "
                                    >


                                        <div
                                            className="
                                                w-16
                                                h-16
                                                border
                                                border-gray-200
                                                rounded-lg
                                                overflow-hidden
                                                bg-gray-50
                                            "
                                        >


                                            <img
                                                src={product.images[0]}
                                                alt={product.name}
                                                className="
                                                    w-full
                                                    h-full
                                                    object-contain
                                                "
                                            />


                                        </div>


                                    </td>



                                    {/* ================= PRODUCT NAME ================= */}


                                    <td
                                        className="
                                            px-6
                                            py-4
                                        "
                                    >


                                        <p
                                            className="
                                                text-sm
                                                font-semibold
                                                text-gray-900
                                            "
                                        >

                                            {product.name}

                                        </p>


                                        <p
                                            className="
                                                text-xs
                                                text-gray-500
                                                mt-1
                                            "
                                        >

                                            {product.category}

                                        </p>


                                    </td>



                                    {/* ================= ACTIONS ================= */}


                                    <td
                                        className="
                                            px-6
                                            py-4
                                        "
                                    >


                                        <div
                                            className="
                                                flex
                                                items-center
                                                justify-end
                                                gap-2
                                            "
                                        >


                                            {/* VIEW PRODUCT */}


                                            <button
                                                type="button"
                                                title="View Product"
                                                onClick={() =>

                                                    setSelectedProduct(

                                                        product

                                                    )

                                                }
                                                className="
                                                    p-2
                                                    text-gray-500
                                                    rounded-lg
                                                    hover:bg-gray-100
                                                    hover:text-gray-900
                                                    transition
                                                    cursor-pointer
                                                "
                                            >


                                                <Eye size={19} />


                                            </button>



                                            {/* EDIT PRODUCT */}


                                            <button
                                                type="button"
                                                title="Edit Product"
                                                onClick={() =>

                                                    handleEditProduct(

                                                        product

                                                    )

                                                }
                                                className="
                                                    p-2
                                                    text-gray-500
                                                    rounded-lg
                                                    hover:bg-gray-100
                                                    hover:text-gray-900
                                                    transition
                                                    cursor-pointer
                                                "
                                            >


                                                <Pencil size={18} />


                                            </button>


                                        </div>


                                    </td>


                                </tr>


                            ))}


                        </tbody>


                    </table>


                </div>


            </div>



            {/* ================= EMPTY PRODUCT MESSAGE ================= */}


            {products.length === 0 && (

                <div
                    className="
                        text-center
                        py-16
                    "
                >

                    <p
                        className="
                            text-gray-500
                            text-sm
                        "
                    >

                        No products available

                    </p>

                </div>

            )}



            {/* ================= PRODUCT DETAIL POPUP ================= */}


            {selectedProduct && (

                <ProductDetail

                    product={selectedProduct}


                    onClose={() =>

                        setSelectedProduct(null)

                    }


                    onEdit={(product) =>

                        handleEditProduct(product)

                    }

                />

            )}


        </div>

    );

};


export default ProductsTable;
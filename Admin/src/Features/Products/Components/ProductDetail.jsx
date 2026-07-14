import React, { useEffect, useState } from "react";

import {
    X,
    Pencil,
    Package,
    IndianRupee,
    Palette,
    Ruler
} from "lucide-react";


const ProductDetail = ({
    product,
    onClose,
    onEdit
}) => {

    const [activeImage, setActiveImage] = useState("");


    useEffect(() => {

        if (product?.images?.length > 0) {

            setActiveImage(product.images[0]);

        }

    }, [product]);


    useEffect(() => {

        const handleEscape = (event) => {

            if (event.key === "Escape") {
                onClose();
            }

        };


        document.addEventListener(
            "keydown",
            handleEscape
        );


        document.body.style.overflow = "hidden";


        return () => {

            document.removeEventListener(
                "keydown",
                handleEscape
            );

            document.body.style.overflow = "";

        };

    }, [onClose]);


    if (!product) {
        return null;
    }


    return (

        <div
            className="
                fixed
                inset-0
                z-50
                flex
                items-center
                justify-center
                bg-black/50
                p-6
            "
            onClick={onClose}
        >

            {/* MODAL */}

            <div
                className="
                    w-full
                    max-w-6xl
                    max-h-[90vh]
                    bg-white
                    rounded-2xl
                    shadow-2xl
                    overflow-hidden
                    flex
                    flex-col
                "
                onClick={(event) =>
                    event.stopPropagation()
                }
            >


                {/* HEADER */}

                <div
                    className="
                        flex
                        items-center
                        justify-between
                        px-7
                        py-5
                        border-b
                        border-gray-200
                    "
                >

                    <div>

                        <h2
                            className="
                                text-xl
                                font-bold
                                text-gray-900
                            "
                        >
                            Product Details
                        </h2>


                        <p
                            className="
                                text-sm
                                text-gray-500
                                mt-1
                            "
                        >
                            View complete product information
                        </p>

                    </div>


                    <button
                        type="button"
                        onClick={onClose}
                        className="
                            w-10
                            h-10
                            flex
                            items-center
                            justify-center
                            rounded-lg
                            text-gray-500
                            hover:bg-gray-100
                            hover:text-gray-900
                            transition
                        "
                    >

                        <X size={21} />

                    </button>

                </div>



                {/* MODAL CONTENT */}

                <div
                    className="
                        flex-1
                        overflow-y-auto
                        p-7
                    "
                >

                    <div
                        className="
                            grid
                            grid-cols-2
                            gap-10
                        "
                    >


                        {/* ================= IMAGES ================= */}

                        <div
                            className="
                                flex
                                gap-4
                            "
                        >


                            {/* THUMBNAILS */}

                            <div
                                className="
                                    flex
                                    flex-col
                                    gap-3
                                "
                            >

                                {product.images.map(
                                    (image, index) => (

                                        <button
                                            type="button"
                                            key={index}
                                            onClick={() =>
                                                setActiveImage(image)
                                            }
                                            className={`
                                                w-20
                                                h-20
                                                rounded-xl
                                                border-2
                                                overflow-hidden
                                                bg-gray-50
                                                transition

                                                ${
                                                    activeImage === image

                                                        ? "border-gray-900"

                                                        : "border-gray-200 hover:border-gray-400"
                                                }
                                            `}
                                        >

                                            <img
                                                src={image}
                                                alt={`${product.name} ${index + 1}`}
                                                className="
                                                    w-full
                                                    h-full
                                                    object-contain
                                                    p-1
                                                "
                                            />

                                        </button>

                                    )
                                )}

                            </div>



                            {/* MAIN IMAGE */}

                            <div
                                className="
                                    flex-1
                                    h-[500px]
                                    bg-gray-50
                                    border
                                    border-gray-200
                                    rounded-2xl
                                    flex
                                    items-center
                                    justify-center
                                    overflow-hidden
                                "
                            >

                                <img
                                    src={activeImage}
                                    alt={product.name}
                                    className="
                                        w-full
                                        h-full
                                        object-contain
                                        p-6
                                    "
                                />

                            </div>

                        </div>



                        {/* ================= PRODUCT INFORMATION ================= */}

                        <div>


                            {/* CATEGORY */}

                            <div className="mb-4">

                                <span
                                    className="
                                        inline-flex
                                        items-center
                                        gap-2
                                        px-3
                                        py-1.5
                                        bg-gray-100
                                        text-gray-600
                                        text-xs
                                        font-semibold
                                        uppercase
                                        tracking-wide
                                        rounded-full
                                    "
                                >

                                    <Package size={14} />

                                    {product.category}

                                </span>

                            </div>



                            {/* NAME */}

                            <h1
                                className="
                                    text-3xl
                                    font-bold
                                    text-gray-900
                                    leading-tight
                                "
                            >

                                {product.name}

                            </h1>



                            {/* PRICE */}

                            <div
                                className="
                                    flex
                                    items-center
                                    mt-6
                                "
                            >

                                <IndianRupee
                                    size={25}
                                    className="text-gray-900"
                                />


                                <span
                                    className="
                                        text-3xl
                                        font-bold
                                        text-gray-900
                                    "
                                >

                                    {product.price.toLocaleString(
                                        "en-IN"
                                    )}

                                </span>

                            </div>



                            {/* DESCRIPTION */}

                            <div
                                className="
                                    mt-8
                                    pb-8
                                    border-b
                                    border-gray-200
                                "
                            >

                                <h3
                                    className="
                                        text-sm
                                        font-semibold
                                        text-gray-900
                                        mb-3
                                    "
                                >
                                    Product Description
                                </h3>


                                <p
                                    className="
                                        text-sm
                                        text-gray-600
                                        leading-7
                                    "
                                >

                                    {product.description}

                                </p>

                            </div>



                            {/* COLORS */}

                            <div
                                className="
                                    py-7
                                    border-b
                                    border-gray-200
                                "
                            >

                                <div
                                    className="
                                        flex
                                        items-center
                                        gap-2
                                        mb-4
                                    "
                                >

                                    <Palette
                                        size={18}
                                        className="text-gray-500"
                                    />


                                    <h3
                                        className="
                                            text-sm
                                            font-semibold
                                            text-gray-900
                                        "
                                    >
                                        Available Colors
                                    </h3>

                                </div>


                                <div
                                    className="
                                        flex
                                        items-center
                                        gap-3
                                    "
                                >

                                    {product.colors.map(
                                        (color) => (

                                            <div
                                                key={color}
                                                title={color}
                                                className="
                                                    w-10
                                                    h-10
                                                    rounded-full
                                                    border-2
                                                    border-white
                                                    shadow
                                                    ring-1
                                                    ring-gray-300
                                                "
                                                style={{
                                                    backgroundColor: color
                                                }}
                                            />

                                        )
                                    )}

                                </div>

                            </div>



                            {/* SIZES */}

                            <div className="py-7">

                                <div
                                    className="
                                        flex
                                        items-center
                                        gap-2
                                        mb-4
                                    "
                                >

                                    <Ruler
                                        size={18}
                                        className="text-gray-500"
                                    />


                                    <h3
                                        className="
                                            text-sm
                                            font-semibold
                                            text-gray-900
                                        "
                                    >
                                        Available Sizes
                                    </h3>

                                </div>


                                <div
                                    className="
                                        flex
                                        flex-wrap
                                        gap-2
                                    "
                                >

                                    {product.sizes.map(
                                        (size) => (

                                            <span
                                                key={size}
                                                className="
                                                    min-w-12
                                                    h-11
                                                    px-3
                                                    flex
                                                    items-center
                                                    justify-center
                                                    border
                                                    border-gray-300
                                                    rounded-lg
                                                    text-sm
                                                    font-semibold
                                                    text-gray-700
                                                    bg-white
                                                "
                                            >

                                                {size}

                                            </span>

                                        )
                                    )}

                                </div>

                            </div>

                        </div>

                    </div>

                </div>



                {/* FOOTER */}

                <div
                    className="
                        flex
                        items-center
                        justify-end
                        gap-3
                        px-7
                        py-5
                        border-t
                        border-gray-200
                        bg-gray-50
                    "
                >

                    <button
                        type="button"
                        onClick={onClose}
                        className="
                            px-5
                            py-2.5
                            border
                            border-gray-300
                            text-gray-700
                            text-sm
                            font-medium
                            rounded-lg
                            hover:bg-gray-100
                            transition
                        "
                    >

                        Close

                    </button>


                    <button
                        type="button"
                        onClick={() =>
                            onEdit(product)
                        }
                        className="
                            flex
                            items-center
                            gap-2
                            px-5
                            py-2.5
                            bg-gray-900
                            text-white
                            text-sm
                            font-medium
                            rounded-lg
                            hover:bg-gray-700
                            transition
                        "
                    >

                        <Pencil size={17} />

                        Edit Product

                    </button>

                </div>

            </div>

        </div>

    );

};


export default ProductDetail;
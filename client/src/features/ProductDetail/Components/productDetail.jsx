import React, {
    useContext,
    useEffect,
    useState,
} from "react";

import {
    Link,
    useParams,
} from "react-router-dom";
import { ProductContext } from "../../../contexts/ProductContext.jsx";




const ProductDetails = () => {

    const { productid } = useParams();

    const {
        productDetail,
        productDetailLoading,
        getProductById,
    } = useContext(ProductContext);


    const [selectedColor, setSelectedColor] = useState(null);

    const [selectedSize, setSelectedSize] = useState(null);


    /*
        =====================================================
        FETCH PRODUCT
        =====================================================
    */

    useEffect(() => {

        if (!productid) {
            return;
        }

        getProductById(productid);

    }, [
        productid,
        getProductById,
    ]);


    /*
        =====================================================
        LOADING
        =====================================================
    */

    if (productDetailLoading || !productDetail) {

        return (
            <div className="min-h-screen bg-white flex items-center justify-center">

                <div className="flex flex-col items-center gap-4">

                    <div
                        className="
                            h-10
                            w-10
                            animate-spin
                            rounded-full
                            border-4
                            border-gray-300
                            border-t-indigo-600
                        "
                    />

                    <p className="text-sm text-gray-500">
                        Loading product...
                    </p>

                </div>

            </div>
        );
    }


    const product = productDetail;


    /*
        =====================================================
        PRODUCT DATA
        =====================================================
    */

    const images = product.images || [];

    const colors = product.colors || [];

    const sizes = product.sizes || [];


    /*
        Your DB field:

        product_name

        UI needs:

        name
    */

    const productName = product.product_name;


    /*
        Your DB field:

        about_product

        UI needs:

        description
    */

    const description = product.about_product;


    return (
        <div className="bg-white min-h-screen">

            <div className="pt-6">


                {/* =====================================================
                    IMAGE GALLERY
                ===================================================== */}

                <div
                    className="
                        mx-auto
                        mt-6
                        max-w-2xl
                        sm:px-6
                        lg:grid
                        lg:max-w-7xl
                        lg:grid-cols-3
                        lg:gap-8
                        lg:px-8
                    "
                >

                    {/* IMAGE 1 */}

                    {images[0] && (

                        <img
                            alt={productName}
                            src={images[0]}
                            className="
                                row-span-2
                                aspect-3/4
                                size-full
                                rounded-lg
                                object-cover
                                max-lg:hidden
                            "
                        />

                    )}


                    {/* IMAGE 2 */}

                    {images[1] && (

                        <img
                            alt={productName}
                            src={images[1]}
                            className="
                                col-start-2
                                aspect-3/2
                                size-full
                                rounded-lg
                                object-cover
                                max-lg:hidden
                            "
                        />

                    )}


                    {/* IMAGE 3 */}

                    {images[2] && (

                        <img
                            alt={productName}
                            src={images[2]}
                            className="
                                col-start-2
                                row-start-2
                                aspect-3/2
                                size-full
                                rounded-lg
                                object-cover
                                max-lg:hidden
                            "
                        />

                    )}


                    {/* IMAGE 4 */}

                    {images[3] && (

                        <img
                            alt={productName}
                            src={images[3]}
                            className="
                                row-span-2
                                aspect-4/5
                                size-full
                                object-cover
                                sm:rounded-lg
                                lg:aspect-3/4
                            "
                        />

                    )}

                </div>


                {/* =====================================================
                    PRODUCT INFORMATION
                ===================================================== */}

                <div
                    className="
                        mx-auto
                        max-w-2xl
                        px-4
                        pt-10
                        pb-16
                        sm:px-6
                        lg:grid
                        lg:max-w-7xl
                        lg:grid-cols-3
                        lg:grid-rows-[auto_auto_1fr]
                        lg:gap-x-8
                        lg:px-8
                        lg:pt-16
                        lg:pb-24
                    "
                >


                    {/* =================================================
                        LEFT SIDE
                    ================================================= */}

                    <div
                        className="
                            lg:col-span-2
                            lg:border-r
                            lg:border-gray-200
                            lg:pr-8
                        "
                    >

                        <h1
                            className="
                                text-2xl
                                font-bold
                                tracking-tight
                                text-gray-900
                                sm:text-3xl
                            "
                        >
                            {productName}
                        </h1>

                    </div>


                    {/* =================================================
                        RIGHT SIDE OPTIONS
                    ================================================= */}

                    <div
                        className="
                            mt-4
                            lg:row-span-3
                            lg:mt-0
                        "
                    >

                        <h2 className="sr-only">
                            Product information
                        </h2>


                        {/* PRICE */}

                        <p
                            className="
                                text-3xl
                                tracking-tight
                                text-gray-900
                            "
                        >
                            ₹{product.price}
                        </p>


                        <form className="mt-10">


                            {/* =================================================
                                COLORS
                            ================================================= */}

                            {colors.length > 0 && (

                                <div>

                                    <h3
                                        className="
                                            text-sm
                                            font-medium
                                            text-gray-900
                                        "
                                    >
                                        Color
                                    </h3>


                                    <fieldset
                                        aria-label="Choose a color"
                                        className="mt-4"
                                    >

                                        <div className="flex items-center gap-x-3">

                                            {colors.map((color, index) => (

                                                <div
                                                    key={`${color}-${index}`}
                                                    className="
                                                        flex
                                                        rounded-full
                                                        outline
                                                        -outline-offset-1
                                                        outline-black/10
                                                    "
                                                >

                                                    <input
                                                        type="radio"
                                                        name="color"
                                                        value={color}
                                                        aria-label={color}
                                                        checked={
                                                            selectedColor === null
                                                                ? index === 0
                                                                : selectedColor === color
                                                        }
                                                        onChange={() =>
                                                            setSelectedColor(color)
                                                        }
                                                        style={{
                                                            backgroundColor: color,
                                                        }}
                                                        className="
                                                            size-8
                                                            appearance-none
                                                            rounded-full
                                                            border
                                                            border-gray-300
                                                            checked:outline-2
                                                            checked:outline-offset-2
                                                            checked:outline-black
                                                        "
                                                    />

                                                </div>

                                            ))}

                                        </div>

                                    </fieldset>

                                </div>

                            )}


                            {/* =================================================
                                SIZES
                            ================================================= */}

                            {sizes.length > 0 && (

                                <div className="mt-10">

                                    <div
                                        className="
                                            flex
                                            items-center
                                            justify-between
                                        "
                                    >

                                        <h3
                                            className="
                                                text-sm
                                                font-medium
                                                text-gray-900
                                            "
                                        >
                                            Size
                                        </h3>


                                        <a
                                            href="#"
                                            className="
                                                text-sm
                                                font-medium
                                                text-indigo-600
                                                hover:text-indigo-500
                                            "
                                        >
                                            Size guide
                                        </a>

                                    </div>


                                    <fieldset
                                        aria-label="Choose a size"
                                        className="mt-4"
                                    >

                                        <div
                                            className="
                                                grid
                                                grid-cols-4
                                                gap-3
                                            "
                                        >

                                            {sizes.map((size, index) => (

                                                <label
                                                    key={`${size}-${index}`}
                                                    className="
                                                        group
                                                        relative
                                                        flex
                                                        items-center
                                                        justify-center
                                                        rounded-md
                                                        border
                                                        border-gray-300
                                                        bg-white
                                                        p-3
                                                        has-checked:border-indigo-600
                                                        has-checked:bg-indigo-600
                                                        has-focus-visible:outline-2
                                                        has-focus-visible:outline-offset-2
                                                        has-focus-visible:outline-indigo-600
                                                    "
                                                >

                                                    <input
                                                        value={size}
                                                        checked={
                                                            selectedSize === null
                                                                ? index === 0
                                                                : selectedSize === size
                                                        }
                                                        onChange={() =>
                                                            setSelectedSize(size)
                                                        }
                                                        name="size"
                                                        type="radio"
                                                        className="
                                                            absolute
                                                            inset-0
                                                            appearance-none
                                                            focus:outline-none
                                                        "
                                                    />


                                                    <span
                                                        className="
                                                            text-sm
                                                            font-medium
                                                            text-gray-900
                                                            uppercase
                                                            group-has-checked:text-white
                                                        "
                                                    >
                                                        {size}
                                                    </span>

                                                </label>

                                            ))}

                                        </div>

                                    </fieldset>

                                </div>

                            )}


                            {/* =================================================
                                BUTTONS
                            ================================================= */}

                            <button
                                type="button"
                                className="
                                    mt-10
                                    flex
                                    w-full
                                    items-center
                                    justify-center
                                    rounded-md
                                    border
                                    border-transparent
                                    bg-indigo-600
                                    px-8
                                    py-3
                                    text-base
                                    font-medium
                                    text-white
                                    hover:bg-indigo-700
                                    focus:ring-2
                                    focus:ring-indigo-500
                                    focus:ring-offset-2
                                    focus:outline-hidden
                                "
                            >
                                Add to Cart
                            </button>


                            <Link to="/payment">

                                <button
                                    type="button"
                                    className="
                                        mt-2
                                        flex
                                        w-full
                                        items-center
                                        justify-center
                                        rounded-md
                                        border
                                        border-indigo-600
                                        px-8
                                        py-3
                                        text-base
                                        font-medium
                                        text-black
                                        hover:bg-indigo-50
                                        hover:cursor-pointer
                                        focus:ring-2
                                        focus:ring-indigo-500
                                        focus:ring-offset-2
                                        focus:outline-hidden
                                    "
                                >
                                    Buy Now
                                </button>

                            </Link>

                        </form>

                    </div>


                    {/* =================================================
                        DESCRIPTION + DETAILS
                    ================================================= */}

                    <div
                        className="
                            py-10
                            lg:col-span-2
                            lg:col-start-1
                            lg:border-r
                            lg:border-gray-200
                            lg:pt-6
                            lg:pr-8
                            lg:pb-16
                        "
                    >


                        {/* DESCRIPTION */}

                        <div>

                            <h2
                                className="
                                    text-lg
                                    font-semibold
                                    text-gray-900
                                "
                            >
                                Description
                            </h2>


                            <div className="mt-4">

                                <p
                                    className="
                                        text-base
                                        text-gray-600
                                    "
                                >
                                    {description}
                                </p>

                            </div>

                        </div>


                        {/* =================================================
                            PRODUCT DETAILS
                        ================================================= */}

                        <div className="mt-10">

                            <h2
                                className="
                                    text-lg
                                    font-semibold
                                    text-gray-900
                                "
                            >
                                Product Details
                            </h2>


                            <div className="mt-4 space-y-6">


                                {/* BRAND */}

                                <div>

                                    <p
                                        className="
                                            text-sm
                                            font-medium
                                            text-gray-900
                                        "
                                    >
                                        Brand
                                    </p>

                                    <div className="mt-2">

                                        <span
                                            className="
                                                text-sm
                                                text-gray-600
                                            "
                                        >
                                            ShopZone
                                        </span>

                                    </div>

                                </div>


                                {/* CATEGORY */}

                                <div>

                                    <p
                                        className="
                                            text-sm
                                            font-medium
                                            text-gray-900
                                        "
                                    >
                                        Category
                                    </p>

                                    <div className="mt-2">

                                        <span
                                            className="
                                                text-sm
                                                text-gray-600
                                            "
                                        >
                                            {product.category}
                                        </span>

                                    </div>

                                </div>


                                {/* SIZES */}

                                <div>

                                    <p
                                        className="
                                            text-sm
                                            font-medium
                                            text-gray-900
                                        "
                                    >
                                        Available Sizes
                                    </p>

                                    <div className="mt-2 flex flex-wrap gap-2">

                                        {sizes.map((size, index) => (

                                            <span
                                                key={`${size}-${index}`}
                                                className="
                                                    text-sm
                                                    text-gray-600
                                                "
                                            >
                                                {size}
                                            </span>

                                        ))}

                                    </div>

                                </div>


                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
};


export default ProductDetails;
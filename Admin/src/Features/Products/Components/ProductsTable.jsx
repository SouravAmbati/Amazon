import React, {
    useContext,
    useEffect,
    useState
} from "react";

import {
    Eye,
    Pencil,
    Trash2
} from "lucide-react";

import ProductDetail from "./ProductDetail";
import ProductEdit from "./ProductEdit";

import {
    ProductContext
} from "../../../context/ProductContext";


const ProductsTable = () => {


    /* =====================================================
       PRODUCT CONTEXT
    ===================================================== */

    const {
        products,
        loading,
        currentPage,
        pageCursors,
        hasNextPage,
        GetProducts,
        ChangePage,
        NextPage,
        PreviousPage
    } = useContext(ProductContext);


    /* =====================================================
       STATE
    ===================================================== */

    const [
        selectedProducts,
        setSelectedProducts
    ] = useState([]);


    // Product currently opened in ProductDetail
    const [
        selectedProduct,
        setSelectedProduct
    ] = useState(null);


    // Product currently being edited
    const [
        editingProduct,
        setEditingProduct
    ] = useState(null);


    /* =====================================================
       FETCH FIRST PAGE
    ===================================================== */

    useEffect(() => {

        GetProducts(1);

    }, []);


    /* =====================================================
       SELECT PRODUCT
    ===================================================== */

    const handleSelectProduct = (id) => {

        if (
            selectedProducts.includes(id)
        ) {

            setSelectedProducts(
                selectedProducts.filter(
                    productId =>
                        productId !== id
                )
            );

        } else {

            setSelectedProducts([
                ...selectedProducts,
                id
            ]);

        }

    };


    /* =====================================================
       SELECT ALL
    ===================================================== */

    const handleSelectAll = () => {

        if (
            products.length > 0 &&
            selectedProducts.length ===
            products.length
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


    /* =====================================================
       DELETE SELECTED
    ===================================================== */

    const handleDeleteSelected = () => {

        console.log(
            "Selected products:",
            selectedProducts
        );

        /*
         * Add your DELETE API here later.
         */

        setSelectedProducts([]);

    };


    /* =====================================================
       PAGE BUTTON
    ===================================================== */

    const handlePageChange = async (page) => {

        if (loading) {
            return;
        }

        await ChangePage(page);

    };


    /* =====================================================
       CHECK IF PAGE IS AVAILABLE
    ===================================================== */

    const isPageAvailable = (page) => {

        /*
         * Page 1 is always available.
         */

        if (page === 1) {
            return true;
        }


        /*
         * A page is available if we already
         * have the cursor required to fetch it.
         */

        return Boolean(
            pageCursors?.[page]
        );

    };


    /* =====================================================
       EDIT PRODUCT
    ===================================================== */

    const handleEditProduct = (product) => {

        // Put the selected product into edit state
        setEditingProduct(product);

    };


    /* =====================================================
       CLOSE EDITOR
    ===================================================== */

    const handleCloseEditor = () => {

        setEditingProduct(null);

    };


    /* =====================================================
       EDIT SUCCESS
    ===================================================== */

    const handleEditSuccess = () => {

        // Close edit modal
        setEditingProduct(null);

        // Close product detail modal
        setSelectedProduct(null);

    };


    /* =====================================================
       UI
    ===================================================== */

    return (

        <div className="p-8">


            {/* =====================================================
                PAGE TITLE
            ===================================================== */}

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


            {/* =====================================================
                SELECTED PRODUCT ACTION
            ===================================================== */}

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

                            {
                                selectedProducts.length > 1
                                    ? "s"
                                    : ""
                            }

                            {" selected"}

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
                            cursor-pointer
                        "
                    >

                        <Trash2 size={16} />

                        Delete Selected

                    </button>

                </div>

            )}


            {/* =====================================================
                PRODUCTS TABLE
            ===================================================== */}

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


                        {/* =====================================================
                            TABLE HEAD
                        ===================================================== */}

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
                                        onChange={
                                            handleSelectAll
                                        }
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

                                    VIEW

                                </th>


                            </tr>

                        </thead>


                        {/* =====================================================
                            TABLE BODY
                        ===================================================== */}

                        <tbody
                            className="
                                divide-y
                                divide-gray-100
                            "
                        >


                            {products.map(
                                (product) => (

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


                                        {/* =====================================================
                                            CHECKBOX
                                        ===================================================== */}

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


                                        {/* =====================================================
                                            PRODUCT IMAGE
                                        ===================================================== */}

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

                                                {
                                                    product.images?.[0]
                                                        ? (

                                                            <img
                                                                src={
                                                                    product.images[0]
                                                                }
                                                                alt={
                                                                    product.name
                                                                }
                                                                className="
                                                                    w-full
                                                                    h-full
                                                                    object-contain
                                                                "
                                                            />

                                                        )
                                                        : (

                                                            <div
                                                                className="
                                                                    w-full
                                                                    h-full
                                                                    flex
                                                                    items-center
                                                                    justify-center
                                                                    text-xs
                                                                    text-gray-400
                                                                "
                                                            >

                                                                No Image

                                                            </div>

                                                        )
                                                }

                                            </div>

                                        </td>


                                        {/* =====================================================
                                            PRODUCT NAME
                                        ===================================================== */}

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

                                                {
                                                    product.name
                                                }

                                            </p>


                                            <p
                                                className="
                                                    text-xs
                                                    text-gray-500
                                                    mt-1
                                                "
                                            >

                                                {
                                                    product.category
                                                }

                                            </p>

                                        </td>


                                        {/* =====================================================
                                            ACTIONS
                                        ===================================================== */}

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


                                                {/* VIEW */}

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

                                                    <Eye
                                                        size={19}
                                                    />

                                                </button>

                                            </div>

                                        </td>

                                    </tr>

                                )
                            )}


                            {/* =====================================================
                                INITIAL LOADING
                            ===================================================== */}

                            {
                                loading &&
                                products.length === 0 && (

                                    <tr>

                                        <td
                                            colSpan="4"
                                            className="
                                                px-6
                                                py-12
                                                text-center
                                                text-sm
                                                text-gray-500
                                            "
                                        >

                                            Loading products...

                                        </td>

                                    </tr>

                                )
                            }


                        </tbody>

                    </table>

                </div>

            </div>


            {/* =====================================================
                PAGINATION
            ===================================================== */}

            {
                products.length > 0 && (

                    <div
                        className="
                            flex
                            items-center
                            justify-center
                            gap-2
                            mt-6
                        "
                    >


                        {/* =====================================================
                            PREVIOUS
                        ===================================================== */}

                        <button
                            type="button"
                            onClick={
                                PreviousPage
                            }
                            disabled={
                                currentPage === 1 ||
                                loading
                            }
                            className="
                                px-3
                                py-2
                                border
                                border-gray-300
                                rounded-lg
                                text-sm
                                text-gray-600
                                hover:bg-gray-100
                                disabled:opacity-40
                                disabled:cursor-not-allowed
                                transition
                                cursor-pointer
                            "
                        >

                            Previous

                        </button>


                        {/* PAGE 1 */}

                        <button
                            type="button"
                            onClick={() =>
                                handlePageChange(1)
                            }
                            disabled={loading}
                            className={`
                                w-9
                                h-9
                                rounded-lg
                                text-sm
                                font-medium
                                transition
                                cursor-pointer

                                ${
                                    currentPage === 1
                                        ? "bg-gray-900 text-white"
                                        : "border border-gray-300 text-gray-600 hover:bg-gray-100"
                                }
                            `}
                        >

                            1

                        </button>


                        {/* PAGE 2 */}

                        {
                            isPageAvailable(2) && (

                                <button
                                    type="button"
                                    onClick={() =>
                                        handlePageChange(2)
                                    }
                                    disabled={
                                        loading
                                    }
                                    className={`
                                        w-9
                                        h-9
                                        rounded-lg
                                        text-sm
                                        font-medium
                                        transition
                                        cursor-pointer

                                        ${
                                            currentPage === 2
                                                ? "bg-gray-900 text-white"
                                                : "border border-gray-300 text-gray-600 hover:bg-gray-100"
                                        }
                                    `}
                                >

                                    2

                                </button>

                            )
                        }


                        {/* PAGE 3 */}

                        {
                            isPageAvailable(3) && (

                                <button
                                    type="button"
                                    onClick={() =>
                                        handlePageChange(3)
                                    }
                                    disabled={
                                        loading
                                    }
                                    className={`
                                        w-9
                                        h-9
                                        rounded-lg
                                        text-sm
                                        font-medium
                                        transition
                                        cursor-pointer

                                        ${
                                            currentPage === 3
                                                ? "bg-gray-900 text-white"
                                                : "border border-gray-300 text-gray-600 hover:bg-gray-100"
                                        }
                                    `}
                                >

                                    3

                                </button>

                            )
                        }


                        {/* PAGE 4 */}

                        {
                            isPageAvailable(4) && (

                                <button
                                    type="button"
                                    onClick={() =>
                                        handlePageChange(4)
                                    }
                                    disabled={
                                        loading
                                    }
                                    className={`
                                        w-9
                                        h-9
                                        rounded-lg
                                        text-sm
                                        font-medium
                                        transition
                                        cursor-pointer

                                        ${
                                            currentPage === 4
                                                ? "bg-gray-900 text-white"
                                                : "border border-gray-300 text-gray-600 hover:bg-gray-100"
                                        }
                                    `}
                                >

                                    4

                                </button>

                            )
                        }


                        {/* PAGE 5 */}

                        {
                            isPageAvailable(5) && (

                                <button
                                    type="button"
                                    onClick={() =>
                                        handlePageChange(5)
                                    }
                                    disabled={
                                        loading
                                    }
                                    className={`
                                        w-9
                                        h-9
                                        rounded-lg
                                        text-sm
                                        font-medium
                                        transition
                                        cursor-pointer

                                        ${
                                            currentPage === 5
                                                ? "bg-gray-900 text-white"
                                                : "border border-gray-300 text-gray-600 hover:bg-gray-100"
                                        }
                                    `}
                                >

                                    5

                                </button>

                            )
                        }


                        {/* NEXT */}

                        <button
                            type="button"
                            onClick={
                                NextPage
                            }
                            disabled={
                                !hasNextPage ||
                                loading
                            }
                            className="
                                px-3
                                py-2
                                border
                                border-gray-300
                                rounded-lg
                                text-sm
                                text-gray-600
                                hover:bg-gray-100
                                disabled:opacity-40
                                disabled:cursor-not-allowed
                                transition
                                cursor-pointer
                            "
                        >

                            Next

                        </button>


                    </div>

                )
            }


            {/* =====================================================
                LOADING NEXT PAGE
            ===================================================== */}

            {
                loading &&
                products.length > 0 && (

                    <div
                        className="
                            text-center
                            mt-4
                            text-sm
                            text-gray-500
                        "
                    >

                        Loading products...

                    </div>

                )
            }


            {/* =====================================================
                ALL PRODUCTS LOADED
            ===================================================== */}

            {
                products.length > 0 &&
                !hasNextPage && (

                    <div
                        className="
                            text-center
                            mt-4
                            text-sm
                            text-gray-400
                        "
                    >

                        No more products

                    </div>

                )
            }


            {/* =====================================================
                EMPTY
            ===================================================== */}

            {
                !loading &&
                products.length === 0 && (

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

                )
            }


            {/* =====================================================
                PRODUCT DETAIL
            ===================================================== */}

            {
                selectedProduct && (

                    <ProductDetail

                        product={
                            selectedProduct
                        }

                        onClose={() =>
                            setSelectedProduct(
                                null
                            )
                        }

                        onEdit={
                            handleEditProduct
                        }

                    />

                )
            }


            {/* =====================================================
                PRODUCT EDIT
            ===================================================== */}

            {
                editingProduct && (

                    <ProductEdit

                        product={
                            editingProduct
                        }

                        onClose={
                            handleCloseEditor
                        }

                        onSuccess={
                            handleEditSuccess
                        }

                    />

                )
            }


        </div>

    );

};


export default ProductsTable;
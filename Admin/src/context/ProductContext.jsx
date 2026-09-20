import { createContext, useEffect, useState } from "react"
import axios from "axios";
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL


export const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
    const [products, setProducts] = useState([]);

    const [currentPage, setCurrentPage] = useState(1);

    /*
     * Stores the cursor required to fetch each page.
     *
     * Page 1 doesn't need a cursor.
     *
     * Example:
     *
     * {
     *     1: null,
     *     2: "cursor-from-page-1",
     *     3: "cursor-from-page-2"
     * }
     */
    const [pageCursors, setPageCursors] = useState({
        1: null
    });

    /*
     * Store already fetched pages.
     *
     * This prevents unnecessary API calls when
     * going back to a page we already visited.
     */
    const [loadedPages, setLoadedPages] = useState({});

    const [hasNextPage, setHasNextPage] = useState(true);

    const [loading, setLoading] = useState(false);


    // =====================================================
    // GET PRODUCTS
    // =====================================================

    const GetProducts = async (page = 1) => {

        if (loading) {
            return;
        }

        try {

            setLoading(true);


            // Get cursor required for this page

            const cursor = pageCursors[page] || null;


            const params = {};

            if (cursor) {

                params.cursor = cursor;

            }


            console.log(
                `Fetching page ${page}`,
                params
            );


            const res = await axios.get(
                "/api/product/v1/product",
                {
                    params
                }
            );


            const response = res.data;


            console.log(
                `Page ${page} response:`,
                response
            );


            // =====================================================
            // FORMAT PRODUCTS
            // =====================================================

            const formattedProducts = response.data.map(
                (product) => ({

                    id: product.id,

                    name: product.product_name,

                    category: product.category,

                    price: Number(product.price),

                    description: product.about_product,

                    sizes: Array.isArray(product.sizes)
                        ? product.sizes
                        : [],

                    colors: product.colors
                        ? (
                            Array.isArray(product.colors)
                                ? product.colors
                                : [product.colors]
                        )
                        : [],

                    /*
                     * Your database image_url is an array.
                     *
                     * Therefore don't wrap an array inside
                     * another array.
                     */
                    images: Array.isArray(product.images)
                        ? product.images
                        : product.images
                            ? [product.images]
                            : []

                })
            );


            // =====================================================
            // SAVE PAGE DATA
            // =====================================================

            setLoadedPages(
                (previousPages) => ({

                    ...previousPages,

                    [page]: formattedProducts

                })
            );


            // =====================================================
            // DISPLAY PAGE
            // =====================================================

            setProducts(formattedProducts);


            // =====================================================
            // CURRENT PAGE
            // =====================================================

            setCurrentPage(page);


            // =====================================================
            // SAVE CURSOR FOR NEXT PAGE
            // =====================================================

            if (response.cursor) {

                setPageCursors(
                    (previousCursors) => ({

                        ...previousCursors,

                        [page + 1]: response.cursor

                    })
                );

            }


            // =====================================================
            // HAS NEXT PAGE
            // =====================================================

            setHasNextPage(
                response.hasNextPage
            );


        } catch (error) {

            console.error(
                "Get products error:",
                error.response?.data || error
            );

        } finally {

            setLoading(false);

        }

    };


    // =====================================================
    // CHANGE PAGE
    // =====================================================

    const ChangePage = async (page) => {

        if (loading) {
            return;
        }


        /*
         * If this page was already loaded,
         * don't make another API request.
         */

        if (loadedPages[page]) {

            setProducts(
                loadedPages[page]
            );

            setCurrentPage(page);


            /*
             * If we have a cursor for the next page,
             * another page exists.
             */

            setHasNextPage(
                Boolean(pageCursors[page + 1])
            );

            return;

        }


        /*
         * Don't allow fetching a page if we don't
         * have the cursor required for that page.
         *
         * Page 1 is the only exception.
         */

        if (
            page !== 1 &&
            !pageCursors[page]
        ) {

            return;

        }


        await GetProducts(page);

    };


    // =====================================================
    // NEXT PAGE
    // =====================================================

    const NextPage = async () => {

        if (
            loading ||
            !hasNextPage
        ) {

            return;

        }


        const nextPage =
            currentPage + 1;


        await ChangePage(
            nextPage
        );

    };


    // =====================================================
    // PREVIOUS PAGE
    // =====================================================

    const PreviousPage = async () => {

        if (
            loading ||
            currentPage <= 1
        ) {

            return;

        }


        await ChangePage(
            currentPage - 1
        );

    };
    const CreateProduct = async (sentProduct, idempotencyKey) => {
        try {
            const formData = new FormData();

            formData.append("product_name", sentProduct.name);
            formData.append("category", sentProduct.category);
            formData.append("price", sentProduct.price);
            formData.append("about_product", sentProduct.description);

            formData.append(
                "colors",
                JSON.stringify(sentProduct.colors)
            );

            formData.append(
                "sizes",
                JSON.stringify(sentProduct.sizes)
            );

            sentProduct.images.forEach((image, index) => {
                formData.append(`image${index + 1}`, image);
            });

            const res = await axios.post(
                "/api/product/v1/product",
                formData,
                {
                    headers: {
                        "IdempotencyKey": idempotencyKey
                    }
                }
            );

            return res.data.message;

        } catch (error) {
            console.error(error.response?.data || error);
            return null;
        }
    };
    return (
        <ProductContext.Provider
            value={{
                products,

                loading,

                currentPage,

                pageCursors,

                hasNextPage,

                GetProducts,

                ChangePage,

                NextPage,

                PreviousPage,

                CreateProduct
            }}
        >
            {children}
        </ProductContext.Provider>
    )
}
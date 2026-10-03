import { createContext, useState } from "react";
import axios from "axios";

axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

export const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
    const [products, setProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageCursors, setPageCursors] = useState({ 1: null });
    const [loadedPages, setLoadedPages] = useState({});
    const [hasNextPage, setHasNextPage] = useState(true);
    const [loading, setLoading] = useState(false);

    // --------------------------------------------------
    // GET PRODUCTS
    // --------------------------------------------------

    const GetProducts = async (page = 1) => {
        if (loading) return;

        try {
            setLoading(true);

            const cursor = pageCursors[page] || null;

            const params = {};

            if (cursor) {
                params.cursor = cursor;
            }

            console.log(`Fetching page ${page}`, params);

            const res = await axios.get(
                "/api/product/v1/product",
                {
                    params
                }
            );

            const response = res.data;
            console.log("debug", response);

            console.log(`Page ${page} response:`, response);

            const formattedProducts = response.data.map((product) => ({
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

                images: Array.isArray(product.images)
                    ? product.images
                    : product.images
                        ? [product.images]
                        : [],

                // IMPORTANT:
                // Required by PATCH /product
                imageId: product.image_id,

                colorId: product.color_id
            }));

            setLoadedPages((previousPages) => ({
                ...previousPages,
                [page]: formattedProducts
            }));

            setProducts(formattedProducts);

            setCurrentPage(page);

            if (response.cursor) {
                setPageCursors((previousCursors) => ({
                    ...previousCursors,
                    [page + 1]: response.cursor
                }));
            }

            setHasNextPage(response.hasNextPage);

        } catch (error) {

            console.error(
                "Get products error:",
                error.response?.data || error
            );

        } finally {
            setLoading(false);
        }
    };


    // --------------------------------------------------
    // CHANGE PAGE
    // --------------------------------------------------

    const ChangePage = async (page) => {

        if (loading) return;

        // Already loaded
        if (loadedPages[page]) {

            setProducts(loadedPages[page]);

            setCurrentPage(page);

            setHasNextPage(
                Boolean(pageCursors[page + 1])
            );

            return;
        }

        // Page doesn't have cursor
        if (page !== 1 && !pageCursors[page]) {
            return;
        }

        await GetProducts(page);
    };


    // --------------------------------------------------
    // NEXT PAGE
    // --------------------------------------------------

    const NextPage = async () => {

        if (loading || !hasNextPage) {
            return;
        }

        const nextPage = currentPage + 1;

        await ChangePage(nextPage);
    };


    // --------------------------------------------------
    // PREVIOUS PAGE
    // --------------------------------------------------

    const PreviousPage = async () => {

        if (loading || currentPage <= 1) {
            return;
        }

        await ChangePage(currentPage - 1);
    };


    // --------------------------------------------------
    // CREATE PRODUCT
    // --------------------------------------------------

    const CreateProduct = async (
        sentProduct,
        idempotencyKey,
        imageFormat
    ) => {
        try {

            // 1. Get signed upload URLs
            const imageUrls = await axios.post(
                "/api/product/v2/get-upload-urls",
                imageFormat
            );

            const { images, imagesKeys } = imageUrls.data;
            const productData = {
                product_name: sentProduct.name,
                category: sentProduct.category,
                price: sentProduct.price,
                about_product: sentProduct.description,
                colors: sentProduct.colors,
                sizes: sentProduct.sizes,
                imagesKeys: imagesKeys,
            };

            // 2. Upload all images to Backblaze
            const uploadPromises = sentProduct.images.map(
                (image, index) => {
                    return axios.put(
                        images[index].url,
                        image,
                        {
                            headers: {
                                "Content-Type": image.type,
                            },
                        }
                    );
                }
            );

            // This waits until ALL uploads succeed
            await Promise.all(uploadPromises);

            // 4. Now create the product
            const res = await axios.post(
                "/api/product/v2/product",
                productData,
                {
                    headers: {
                        idempotencyKey: idempotencyKey
                    }
                }
            );

            return res.data.message;

        } catch (error) {
            console.error(
                "Create product error:",
                error.response?.data || error
            );

            return null;
        }
    };


    // --------------------------------------------------
    // UPDATE PRODUCT
    // --------------------------------------------------

    const UpdateProduct = async (
        product,
        updatedProduct,
        idempotencyKey
    ) => {

        try {

            const formData = new FormData();

            formData.append(
                "product_name",
                updatedProduct.name
            );

            formData.append(
                "category",
                updatedProduct.category
            );

            formData.append(
                "price",
                updatedProduct.price
            );

            formData.append(
                "about_product",
                updatedProduct.description
            );

            formData.append(
                "colors",
                JSON.stringify(updatedProduct.colors)
            );

            formData.append(
                "sizes",
                JSON.stringify(updatedProduct.sizes)
            );


            // ------------------------------------------
            // NEW IMAGES
            // ------------------------------------------

            if (
                updatedProduct.images &&
                updatedProduct.images.length > 0
            ) {

                updatedProduct.images
                    .forEach((image, index) => {

                        formData.append(
                            `image${index + 1}`,
                            image
                        );

                    });

            }


            // ------------------------------------------
            // PATCH REQUEST
            // ------------------------------------------

            const res = await axios.patch(
                "/api/product/v1/product",
                formData,
                {
                    headers: {

                        // Idempotency key comes
                        // FROM COMPONENT
                        "idempotencyKey":
                            idempotencyKey,

                        product_id:
                            product.id,

                        image_id:
                            product.imageId,

                        color_id:
                            product.colorId
                    }
                }
            );


            return {
                success: true,
                data: res.data
            };

        } catch (error) {

            console.error(
                "Update product error:",
                error.response?.data || error
            );

            return {
                success: false,
                message:
                    error.response?.data?.message ||
                    error.message ||
                    "Failed to update product"
            };
        }
    };


    // --------------------------------------------------
    // UPDATE PRODUCT IN LOCAL STATE
    // --------------------------------------------------

    const UpdateProductInState = (
        productId,
        updatedProduct
    ) => {

        const updateProduct = (product) => {

            if (product.id !== productId) {
                return product;
            }

            return {
                ...product,

                name: updatedProduct.name,

                category: updatedProduct.category,

                price: Number(
                    updatedProduct.price
                ),

                description:
                    updatedProduct.description,

                colors:
                    updatedProduct.colors,

                sizes:
                    updatedProduct.sizes,

                // Only replace images if
                // backend returned/changed them.
                ...(updatedProduct.images
                    ? {
                        images:
                            updatedProduct.images
                    }
                    : {})
            };
        };


        // Update current products
        setProducts((previousProducts) =>
            previousProducts.map(updateProduct)
        );


        // Update every cached page
        setLoadedPages((previousPages) => {

            const updatedPages = {};

            Object.entries(previousPages)
                .forEach(([page, pageProducts]) => {

                    updatedPages[page] =
                        pageProducts.map(
                            updateProduct
                        );

                });

            return updatedPages;
        });
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

                CreateProduct,

                UpdateProduct,

                UpdateProductInState
            }}
        >
            {children}
        </ProductContext.Provider>
    );
};
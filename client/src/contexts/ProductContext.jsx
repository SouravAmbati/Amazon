import {
    createContext,
    useCallback,
    useEffect,
    useRef,
    useState,
} from "react";

import axios from "axios";

axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

export const ProductContext = createContext();

export const ProductProvider = ({ children }) => {

    const [products, setProducts] = useState([]);

    const [cursor, setCursor] = useState(null);

    const [loading, setLoading] = useState(false);

    const [hasNextPage, setHasNextPage] = useState(true);

    // Product detail
    const [productDetail, setProductDetail] = useState(null);

    const [productDetailLoading, setProductDetailLoading] = useState(false);


    // Prevent multiple API calls at the same time
    const loadingRef = useRef(false);

    // Prevent duplicate initial request
    const initializedRef = useRef(false);


    /*
        =====================================================
        GET PRODUCTS
        =====================================================
    */

    const getProducts = useCallback(async (nextCursor = null) => {

        if (loadingRef.current) {
            return;
        }

        if (!hasNextPage && nextCursor !== null) {
            return;
        }

        try {

            loadingRef.current = true;
            setLoading(true);

            let url = "/api/products/v1/products";

            if (nextCursor) {
                url += `?cursor=${nextCursor}`;
            }

            console.log("Fetching products:", url);

            const response = await axios.get(url);

            const result = response.data;

            console.log("Products API response:", result);


            if (!result.success) {
                throw new Error(
                    result.message || "Failed to fetch products"
                );
            }


            const newProducts = Array.isArray(result.data)
                ? result.data
                : [];


            if (newProducts.length === 0) {

                setHasNextPage(false);

                return;
            }


            setProducts((previousProducts) => [
                ...previousProducts,
                ...newProducts,
            ]);


            setCursor(result.cursor);

            setHasNextPage(true);


        } catch (error) {

            console.error(
                "Get products error:",
                error.response?.data || error.message
            );

        } finally {

            loadingRef.current = false;
            setLoading(false);

        }

    }, [hasNextPage]);


    /*
        =====================================================
        GET PRODUCT BY ID
        =====================================================
    */

    const getProductById = useCallback(async (productid) => {

        try {

            setProductDetailLoading(true);

            console.log(
                "Fetching product:",
                productid
            );


            const response = await axios.get(
                `/api/products/v1/product?productid=${productid}`
            );


            const result = response.data;

            console.log(
                "Product detail API response:",
                result
            );


            if (!result.success) {
                throw new Error(
                    result.message || "Failed to fetch product"
                );
            }


            /*
                Backend returns:

                {
                    success: true,
                    data: [
                        {
                            id,
                            product_name,
                            img,
                            color,
                            category,
                            sizes,
                            about_product,
                            price,
                            created_at
                        }
                    ]
                }
            */

            const product = result.data?.[0];


            if (!product) {
                throw new Error("Product not found");
            }


            /*
                Find the same product from the products
                already fetched by the homepage.

                This gives us:
                - images
                - colors
                - image_id
                - color_id
            */

            const existingProduct = products.find(
                (item) => item.id === product.id
            );


            /*
                Combine API detail data with the already
                available image/color information.
            */

            const completeProduct = {
                ...product,

                images:
                    existingProduct?.images || [],

                colors:
                    existingProduct?.colors || [],

                image_id:
                    existingProduct?.image_id || product.img,

                color_id:
                    existingProduct?.color_id || product.color,
            };


            setProductDetail(completeProduct);

            return {
                success: true,
                data: completeProduct,
            };


        } catch (error) {

            console.error(
                "Get product detail error:",
                error.response?.data || error.message
            );


            return {
                success: false,
                message:
                    error.response?.data?.message ||
                    error.message ||
                    "Failed to fetch product",
            };


        } finally {

            setProductDetailLoading(false);

        }

    }, [products]);


    /*
        =====================================================
        INITIAL PRODUCTS REQUEST
        =====================================================
    */

    useEffect(() => {

        if (initializedRef.current) {
            return;
        }

        initializedRef.current = true;

        getProducts();

    }, [getProducts]);


    /*
        =====================================================
        LOAD MORE PRODUCTS
        =====================================================
    */

    const loadMoreProducts = useCallback(() => {

        if (loadingRef.current) {
            return;
        }

        if (!hasNextPage) {
            return;
        }

        if (!cursor) {
            return;
        }

        getProducts(cursor);

    }, [
        cursor,
        hasNextPage,
        getProducts,
    ]);
    const getProductsByCategory = useCallback(
        async (type, limit = 10) => {

            try {

                setLoading(true);

                console.log(
                    "Fetching category products:",
                    type,
                    limit
                );


                const response = await axios.get(
                    "/api/products/v1/category",
                    {
                        params: {
                            type,
                            limit,
                        },
                    }
                );


                const result = response.data;


                console.log(
                    "Category products API response:",
                    result
                );


                if (!result.success) {

                    throw new Error(
                        result.message ||
                        "Failed to fetch category products"
                    );

                }


                return {
                    success: true,
                    data: Array.isArray(result.data)
                        ? result.data
                        : [],
                };


            } catch (error) {

                console.error(
                    "Get category products error:",
                    error.response?.data ||
                    error.message
                );


                return {
                    success: false,
                    message:
                        error.response?.data?.message ||
                        error.message ||
                        "Failed to fetch category products",
                    data: [],
                };


            } finally {

                setLoading(false);

            }

        },
        []
    );


    return (
        <ProductContext.Provider
            value={{
                products,
                loading,
                hasNextPage,
                loadMoreProducts,

                // Product detail
                productDetail,
                productDetailLoading,
                getProductById,
                getProductsByCategory,
            }}
        >
            {children}
        </ProductContext.Provider>
    );
};
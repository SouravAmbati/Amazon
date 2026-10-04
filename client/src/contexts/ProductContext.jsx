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

    // Prevent multiple API calls at the same time
    const loadingRef = useRef(false);

    // Prevent duplicate initial request
    const initializedRef = useRef(false);


    const getProducts = useCallback(async (nextCursor = null) => {

        // Don't make another request while current request is running
        if (loadingRef.current) {
            return;
        }

        // Don't request if we already know there are no more products
        if (!hasNextPage && nextCursor !== null) {
            return;
        }

        try {

            loadingRef.current = true;
            setLoading(true);

            let url = "/api/products/v1/products";

            // First request:
            // /api/products/v1/products

            // Next requests:
            // /api/products/v1/products?cursor=xxxxx
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


            // If backend returned no products,
            // there are no more products to load.
            if (newProducts.length === 0) {

                setHasNextPage(false);

                return;
            }


            // Add new products to existing products
            setProducts((previousProducts) => [
                ...previousProducts,
                ...newProducts,
            ]);


            // Save cursor for next request
            setCursor(result.cursor);


            /*
                Your backend currently returns:

                hasNextPage: result.rows.length

                which is a number.

                We only need to know whether the backend
                returned products here.
            */
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
        Initial API request.

        StrictMode can execute effects twice in development,
        so initializedRef prevents duplicate initial requests.
    */
    useEffect(() => {

        if (initializedRef.current) {
            return;
        }

        initializedRef.current = true;

        getProducts();

    }, [getProducts]);


    /*
        Called when the user reaches the bottom.
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

    }, [cursor, hasNextPage, getProducts]);


    return (
        <ProductContext.Provider
            value={{
                products,
                loading,
                hasNextPage,
                loadMoreProducts,
            }}
        >
            {children}
        </ProductContext.Provider>
    );
};
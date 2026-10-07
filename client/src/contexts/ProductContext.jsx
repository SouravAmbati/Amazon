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

    // =====================================================
    // STATE
    // =====================================================

    const [products, setProducts] = useState([]);

    const [cursor, setCursor] = useState(null);

    const [loading, setLoading] = useState(false);

    const [hasNextPage, setHasNextPage] = useState(true);

    // Product detail
    const [productDetail, setProductDetail] = useState(null);

    const [productDetailLoading, setProductDetailLoading] =
        useState(false);

    // Cart
    const [cartItems, setCartItems] = useState([]);

    const [cartLoading, setCartLoading] = useState(false);


    // =====================================================
    // REFS
    // =====================================================

    const loadingRef = useRef(false);

    const initializedRef = useRef(false);


    // =====================================================
    // GET PRODUCTS
    // =====================================================

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


    // =====================================================
    // GET PRODUCT BY ID
    // =====================================================

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

            const product = result.data?.[0];

            if (!product) {
                throw new Error("Product not found");
            }

            const existingProduct = products.find(
                (item) => item.id === product.id
            );

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


    // =====================================================
    // GET PRODUCTS BY CATEGORY
    // =====================================================

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


    // =====================================================
    // GET PRODUCTS BY FILTER
    // =====================================================

    const getProductsByFilter = useCallback(
        async (type, limit = 10, price) => {

            try {

                console.log(
                    "Fetching filtered products:",
                    {
                        type,
                        limit,
                        price,
                    }
                );

                const response = await axios.get(
                    "/api/products/v1/filter",
                    {
                        params: {
                            type,
                            limit,
                            price,
                        },
                    }
                );

                const result = response.data;

                console.log(
                    "Filter products API response:",
                    result
                );

                if (!result.success) {
                    throw new Error(
                        result.message ||
                        "Failed to fetch filtered products"
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
                    "Get filtered products error:",
                    error.response?.data ||
                    error.message
                );

                return {
                    success: false,
                    message:
                        error.response?.data?.message ||
                        error.message ||
                        "Failed to fetch filtered products",
                    data: [],
                };

            }

        },
        []
    );


    // =====================================================
    // GET CART
    // =====================================================

    // IMPORTANT:
    // getCart MUST be declared BEFORE the useEffect
    // that calls getCart().

    const getCart = useCallback(async () => {

        try {

            setCartLoading(true);

            const response = await axios.get(
                "/api/carts/v1/cart"
            );

            const result = response.data;

            if (!result.success) {
                throw new Error(
                    result.message ||
                    "Failed to fetch cart"
                );
            }

            const items = Array.isArray(result.data)
                ? result.data
                : [];

            setCartItems(items);

            return {
                success: true,
                data: items,
            };

        } catch (error) {

            console.error(
                "Get cart error:",
                error.response?.data ||
                error.message
            );

            return {
                success: false,
                message:
                    error.response?.data?.message ||
                    error.message ||
                    "Failed to fetch cart",
                data: [],
            };

        } finally {

            setCartLoading(false);
        }

    }, []);


    // =====================================================
    // ADD TO CART
    // =====================================================

    const addToCart = useCallback(
        async (productId, counts = 1) => {

            try {

                const response = await axios.post(
                    `/api/carts/v1/cart?productId=${productId}`,
                    {
                        counts,
                    }
                );

                const result = response.data;

                if (!result.success) {
                    throw new Error(
                        result.message ||
                        "Failed to add product to cart"
                    );
                }

                // Refresh cart from DB
                await getCart();

                return {
                    success: true,
                    data: result.result,
                    message: result.message,
                };

            } catch (error) {

                console.error(
                    "Add to cart error:",
                    error.response?.data ||
                    error.message
                );

                return {
                    success: false,
                    message:
                        error.response?.data?.message ||
                        error.message ||
                        "Failed to add product to cart",
                };
            }

        },
        [getCart]
    );


    // =====================================================
    // REMOVE FROM CART
    // =====================================================

    const removeFromCart = useCallback(
        async (productId) => {

            try {

                const response = await axios.delete(
                    `/api/carts/v1/cart?productId=${productId}`
                );

                const result = response.data;

                if (!result.success) {
                    throw new Error(
                        result.message ||
                        "Failed to remove product"
                    );
                }

                // Refresh cart from DB
                await getCart();

                return {
                    success: true,
                    message: result.message,
                };

            } catch (error) {

                console.error(
                    "Remove cart item error:",
                    error.response?.data ||
                    error.message
                );

                return {
                    success: false,
                    message:
                        error.response?.data?.message ||
                        error.message ||
                        "Failed to remove product",
                };
            }

        },
        [getCart]
    );


    // =====================================================
    // UPDATE CART COUNT
    // =====================================================

    const updateCartCount = useCallback(
        async (productId, counts) => {

            try {

                // If quantity becomes 0,
                // remove the product completely.
                if (counts <= 0) {

                    return await removeFromCart(
                        productId
                    );
                }

                const response = await axios.put(
                    `/api/carts/v1/cart?productId=${productId}`,
                    {
                        counts,
                    }
                );

                const result = response.data;

                if (!result.success) {
                    throw new Error(
                        result.message ||
                        "Failed to update cart quantity"
                    );
                }

                // Refresh cart from DB
                await getCart();

                return {
                    success: true,
                    data: result.result,
                };

            } catch (error) {

                console.error(
                    "Update cart count error:",
                    error.response?.data ||
                    error.message
                );

                return {
                    success: false,
                    message:
                        error.response?.data?.message ||
                        error.message ||
                        "Failed to update cart quantity",
                };
            }

        },
        [getCart, removeFromCart]
    );


    // =====================================================
    // INITIAL PRODUCTS REQUEST
    // =====================================================

    useEffect(() => {

        if (initializedRef.current) {
            return;
        }

        initializedRef.current = true;

        getProducts();

    }, [getProducts]);


    // =====================================================
    // INITIAL CART REQUEST
    // =====================================================

    // NOW getCart has already been initialized,
    // so this is safe.

    useEffect(() => {

        getCart();

    }, [getCart]);


    // =====================================================
    // LOAD MORE PRODUCTS
    // =====================================================

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


    // =====================================================
    // CART COUNT
    // =====================================================

    const cartCount = cartItems.reduce(
        (total, item) =>
            total + Number(item.counts),
        0
    );
    // =====================================================
    // ADD ORDER
    // =====================================================

    const addOrder = useCallback(
        async (productId) => {

            try {

                const response = await axios.post(
                    "/api/orders/v1/order",
                    {
                        productId
                    }
                );

                const result = response.data;

                if (!result.success) {

                    throw new Error(
                        result.message ||
                        "Failed to place order"
                    );

                }

                return {
                    success: true,
                    data: result.result,
                    message: result.message
                };

            } catch (error) {

                console.error(
                    "Add order error:",
                    error.response?.data ||
                    error.message
                );

                return {
                    success: false,
                    message:
                        error.response?.data?.message ||
                        error.message ||
                        "Failed to place order"
                };

            }

        },
        []
    );
    // =====================================================
    // GET ORDERS
    // =====================================================

    const getOrders = useCallback(
        async () => {

            try {

                const response = await axios.get(
                    "/api/orders/v1/orders"
                );

                const result = response.data;

                if (!result.success) {

                    throw new Error(
                        result.message ||
                        "Failed to fetch orders"
                    );

                }

                return {
                    success: true,

                    data: Array.isArray(result.data)
                        ? result.data
                        : []
                };

            } catch (error) {

                console.error(
                    "Get orders error:",
                    error.response?.data ||
                    error.message
                );

                return {
                    success: false,

                    message:
                        error.response?.data?.message ||
                        error.message ||
                        "Failed to fetch orders",

                    data: []
                };

            }

        },
        []
    );


    // =====================================================
    // PROVIDER
    // =====================================================

    return (
        <ProductContext.Provider
            value={{

                // Products
                products,
                loading,
                hasNextPage,
                loadMoreProducts,

                // Product detail
                productDetail,
                productDetailLoading,
                getProductById,

                // Category / filter
                getProductsByCategory,
                getProductsByFilter,

                // Cart
                cartItems,
                cartCount,
                cartLoading,

                getCart,
                addToCart,
                updateCartCount,
                removeFromCart,

                addOrder,
                getOrders,

            }}
        >
            {children}
        </ProductContext.Provider>
    );
};
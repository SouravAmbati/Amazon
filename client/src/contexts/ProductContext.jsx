import {
    createContext,
    useCallback,
    useEffect,
    useRef,
    useState,
} from "react";
import axios from "axios";
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;
axios.defaults.withCredentials = true;
export const ProductContext = createContext();
export const ProductProvider = ({ children }) => {
    // =====================================================
    // STATE
    // =====================================================
    const [products, setProducts] = useState([]);
    const [cursor, setCursor] = useState(null);
    const [loading, setLoading] = useState(false);
    const [hasNextPage, setHasNextPage] = useState(true);
    // Authentication
    const [user, setUser] = useState(null);
    const [authLoading, setAuthLoading] = useState(true);
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
    const getProducts = useCallback(
        async (nextCursor = null) => {
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
        },
        [hasNextPage]
    );
    // =====================================================
    // GET PRODUCT BY ID
    // =====================================================
    const getProductById = useCallback(
        async (productid) => {
            try {
                setProductDetailLoading(true);
                console.log("Fetching product:", productid);
                const response = await axios.get(
                    `/api/products/v1/product?productid=${productid}`
                );
                const result = response.data;
                console.log("Product detail API response:", result);
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
                    images: existingProduct?.images || [],
                    colors: existingProduct?.colors || [],
                    image_id: existingProduct?.image_id || product.img,
                    color_id: existingProduct?.color_id || product.color,
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
        },
        [products]
    );
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
                console.log("Category products API response:", result);
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
                    error.response?.data || error.message
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
                console.log("Fetching filtered products:", {
                    type,
                    limit,
                    price,
                });
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
                console.log("Filter products API response:", result);
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
                    error.response?.data || error.message
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
    const getCart = useCallback(async () => {
        if (!user) {
            setCartItems([]);
            return {
                success: true,
                data: [],
            };
        }
        try {
            setCartLoading(true);
            const response = await axios.get("/api/carts/v1/cart");
            const result = response.data;
            if (!result.success) {
                throw new Error(
                    result.message || "Failed to fetch cart"
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
                error.response?.data || error.message
            );
            return {
                success: false,
                message:
                    error.response?.data?.message || error.message,
                data: [],
            };
        } finally {
            setCartLoading(false);
        }
    }, [user]);
    // =====================================================
    // ADD TO CART
    // =====================================================
    const addToCart = useCallback(
        async (productId, counts = 1) => {
            try {
                if (!user) {
                    return {
                        success: false,
                        message: "Please login to add products to your cart.",
                    };
                }
                const response = await axios.post(
                    `/api/carts/v1/cart?productId=${productId}`,
                    {
                        counts,
                    }
                );
                const result = response.data;
                if (!result.success) {
                    throw new Error(
                        result.message || "Failed to add product to cart"
                    );
                }
                await getCart();
                return {
                    success: true,
                    data: result.result,
                    message: result.message,
                };
            } catch (error) {
                console.error(
                    "Add to cart error:",
                    error.response?.data || error.message
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
        [getCart, user]
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
                        result.message || "Failed to remove product"
                    );
                }
                await getCart();
                return {
                    success: true,
                    message: result.message,
                };
            } catch (error) {
                console.error(
                    "Remove cart item error:",
                    error.response?.data || error.message
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
                if (counts <= 0) {
                    return await removeFromCart(productId);
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
                await getCart();
                return {
                    success: true,
                    data: result.result,
                };
            } catch (error) {
                console.error(
                    "Update cart count error:",
                    error.response?.data || error.message
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
    // LOAD MORE PRODUCTS
    // =====================================================
    const loadMoreProducts = useCallback(() => {
        if (loadingRef.current) {
            return;
        }
        if (!hasNextPage || !cursor) {
            return;
        }
        getProducts(cursor);
    }, [cursor, hasNextPage, getProducts]);
    // =====================================================
    // CART COUNT
    // =====================================================
    const cartCount = cartItems.reduce(
        (total, item) => total + Number(item.counts || 0),
        0
    );
    // =====================================================
    // ADD ORDER
    // =====================================================
    const addOrder = useCallback(
        async (productId, quantity, paymentMethod, amount) => {
            try {
                if (!user) {
                    return {
                        success: false,
                        message: "Please login before placing an order.",
                    };
                }
                const response = await axios.post(
                    "/api/orders/v1/order",
                    {
                        productId,
                        quantity,
                        paymentMethod,
                        amount,
                    }
                );
                const result = response.data;
                if (!result.success) {
                    throw new Error(
                        result.message || "Failed to place order"
                    );
                }
                return {
                    success: true,
                    data: result.result,
                    orderId: result.orderId,
                    url: result.url,
                    sessionId: result.sessionId,
                    paymentMethod: result.paymentMethod,
                    message: result.message,
                };
            } catch (error) {
                console.error(
                    "Add order error:",
                    error.response?.data || error.message
                );
                return {
                    success: false,
                    message:
                        error.response?.data?.message ||
                        error.message ||
                        "Failed to place order",
                };
            }
        },
        [user]
    );
    // =====================================================
    // GET ORDERS
    // =====================================================
    const getOrders = useCallback(async () => {
        try {
            const response = await axios.get(
                "/api/orders/v1/orders"
            );
            const result = response.data;
            if (!result.success) {
                throw new Error(
                    result.message || "Failed to fetch orders"
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
                "Get orders error:",
                error.response?.data || error.message
            );
            return {
                success: false,
                message:
                    error.response?.data?.message ||
                    error.message ||
                    "Failed to fetch orders",
                data: [],
            };
        }
    }, []);
    // =====================================================
    // GET SINGLE ORDER STATUS
    // =====================================================
    const getOrderStatus = useCallback(async (orderId) => {
        try {
            const response = await axios.get(
                "/api/orders/v1/order/status",
                {
                    params: {
                        orderId,
                    },
                }
            );
            const result = response.data;
            if (!result.success) {
                throw new Error(
                    result.message || "Failed to fetch order status"
                );
            }
            return {
                success: true,
                data: result.data,
            };
        } catch (error) {
            console.error(
                "Get order status error:",
                error.response?.data || error.message
            );
            return {
                success: false,
                message:
                    error.response?.data?.message ||
                    error.message ||
                    "Failed to fetch order status",
            };
        }
    }, []);
    // =====================================================
    // SEARCH PRODUCTS
    // =====================================================
    const searchProducts = useCallback(
        async (query, limit = 10, category = null) => {
            try {
                if (!query || !query.trim()) {
                    return {
                        success: true,
                        data: [],
                    };
                }
                const response = await axios.get(
                    "/api/products/v1/search",
                    {
                        params: {
                            query: query.trim(),
                            limit,
                            ...(category ? { category } : {}),
                        },
                    }
                );
                const result = response.data;
                if (!result.success) {
                    throw new Error(
                        result.message || "Failed to search products"
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
                    "Search products error:",
                    error.response?.data || error.message
                );
                return {
                    success: false,
                    message:
                        error.response?.data?.message ||
                        error.message ||
                        "Failed to search products",
                    data: [],
                };
            }
        },
        []
    );
    // =====================================================
    // AUTHENTICATION
    // IMPORTANT: Declare checkAuth BEFORE its useEffect.
    // =====================================================
    const checkAuth = useCallback(async () => {
        try {
            const response = await axios.get("/api/user/v1/me");
            if (response.data.success) {
                setUser(response.data.user);
                return {
                    success: true,
                    user: response.data.user,
                };
            }
            setUser(null);
            return {
                success: false,
            };
        } catch (error) {
            setUser(null);
            return {
                success: false,
                message:
                    error.response?.data?.message ||
                    error.message ||
                    "Not authenticated",
            };
        } finally {
            setAuthLoading(false);
        }
    }, []);

    // Load the current session without referencing checkAuth in an effect dependency.
    useEffect(() => {
        let cancelled = false;

        const loadCurrentUser = async () => {
            try {
                const response = await axios.get("/api/user/v1/me");
                if (cancelled) return;

                if (response.data?.success) {
                    setUser(response.data.user ?? null);
                } else {
                    setUser(null);
                }
            } catch (error) {
                if (!cancelled) {
                    setUser(null);
                    // A 401 means there is no active session.
                    if (error.response?.status !== 401) {
                        console.error(
                            "Authentication check failed:",
                            error.response?.data || error.message
                        );
                    }
                }
            } finally {
                if (!cancelled) setAuthLoading(false);
            }
        };

        loadCurrentUser();
        return () => { cancelled = true; };
    }, []);

    // =====================================================
    // SIGNUP
    // =====================================================
    const signup = useCallback(
        async (username, email, password) => {
            try {
                const response = await axios.post(
                    "/api/user/v1/signup",
                    {
                        username,
                        email,
                        password,
                    }
                );
                if (!response.data.success) {
                    throw new Error(
                        response.data.message || "Signup failed"
                    );
                }
                setUser(response.data.user);
                return {
                    success: true,
                    user: response.data.user,
                };
            } catch (error) {
                return {
                    success: false,
                    message:
                        error.response?.data?.message ||
                        error.message ||
                        "Signup failed",
                };
            }
        },
        []
    );
    // =====================================================
    // LOGIN
    // =====================================================
    const login = useCallback(
        async (email, password) => {
            try {
                const response = await axios.post(
                    "/api/user/v1/login",
                    {
                        email,
                        password,
                    }
                );
                if (!response.data.success) {
                    throw new Error(
                        response.data.message || "Login failed"
                    );
                }
                setUser(response.data.user);
                return {
                    success: true,
                    user: response.data.user,
                };
            } catch (error) {
                return {
                    success: false,
                    message:
                        error.response?.data?.message ||
                        error.message ||
                        "Login failed",
                };
            }
        },
        []
    );
    // =====================================================
    // LOGOUT
    // =====================================================
    const logout = useCallback(async () => {
        try {
            await axios.post("/api/user/v1/logout");
            return {
                success: true,
            };
        } catch (error) {
            console.error(
                "Logout error:",
                error.response?.data || error.message
            );
            return {
                success: false,
                message:
                    error.response?.data?.message ||
                    error.message ||
                    "Logout failed",
            };
        } finally {
            setUser(null);
            setCartItems([]);
        }
    }, []);
    // =====================================================
    // LOAD CART AFTER AUTHENTICATION IS CHECKED
    // =====================================================
    useEffect(() => {
        if (authLoading) {
            return;
        }
        if (user) {
            getCart();
        } else {
            setCartItems([]);
        }
    }, [authLoading, user, getCart]);
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
                getProducts,
                // Product detail
                productDetail,
                productDetailLoading,
                getProductById,
                // Category and filter
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
                // Orders
                addOrder,
                getOrders,
                getOrderStatus,
                // Search
                searchProducts,
                // Authentication
                user,
                authLoading,
                signup,
                login,
                logout,
                checkAuth,
            }}
        >
            {children}
        </ProductContext.Provider>
    );
};

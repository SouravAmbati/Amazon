
import { Route, Routes } from "react-router-dom";

import Home from "./pages/Home/Home.jsx";
import DesktopOnly from "./components/screen/MobielOnly.jsx";
import ProductDetail from "./pages/ProductDetail/productDetail.jsx";
import Footer from "./features/Home/Components/Footer/Footer.jsx";
import CartPage from "./pages/Cart/CartPage.jsx";
import CheckoutPage from "./pages/Checkout/CheckoutPage.jsx";
import SpecificCategoryProductPage from "./pages/ProductDetail/SpecificCategoryProduct.jsx";
import PaymentSuccess from "./features/Payment/components/PaymentSuccess.jsx";
import PaymentCancelled from "./features/Payment/components/PaymentCancel.jsx";
import OrderView from "./features/Payment/components/OrderView.jsx";
import Orders from "./features/Payment/components/Orders.jsx";
import AuthPage from "./features/User/components/AuthPage.jsx";
import ProtectedRoute from "./features/User/components/ProtectedRoute.jsx";

const App = () => {
    return (
        <div>
            <Routes>
                {/* Public routes */}
                <Route
                    path="/product/:productid"
                    element={
                       
                            <ProductDetail />
                        
                    }
                />

                <Route
                    path="/payment-success"
                    element={
                        <DesktopOnly>
                            <PaymentSuccess />
                        </DesktopOnly>
                    }
                />

                <Route
                    path="/payment-cancelled"
                    element={
                        <DesktopOnly>
                            <PaymentCancelled />
                        </DesktopOnly>
                    }
                />

                <Route
                    path="/login"
                    element={
                        <DesktopOnly>
                            <AuthPage />
                        </DesktopOnly>
                    }
                />

                {/* Protected routes */}
                <Route element={<ProtectedRoute />}>
                    <Route
                        path="/"
                        element={
                           
                                <Home />
                           
                        }
                    />

                    <Route
                        path="/cart"
                        element={
                           
                                <CartPage />
                            
                        }
                    />

                    <Route
                        path="/payment"
                        element={
                           
                                <CheckoutPage />
                            
                        }
                    />

                    <Route
                        path="/product"
                        element={
                            
                                <SpecificCategoryProductPage />
                           
                        }
                    />

                    <Route
                        path="/order/:orderId"
                        element={
                           
                                <OrderView />
                            
                        }
                    />

                    <Route
                        path="/orders"
                        element={
                           
                                <Orders />
                            
                        }
                    />
                </Route>
            </Routes>

            <Footer />
        </div>
    );
};

export default App;
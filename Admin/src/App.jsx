import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";

import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";

import ProductsTable from "./Features/Products/Components/ProductsTable";
import CreateProduct from "./Features/Products/Components/CreateProduct";
import Orders from "./Features/OrdersPage/Orders";

import { AuthProvider } from "./context/AuthContext";
import Login from "./Features/Authentication/components/Login";
import ProtectedRoute from "./Features/Authentication/components/ProtectectedRoute.jsx";


const Dashboard = () => {
    const [activePage, setActivePage] = useState("products");

    return (
        <Sidebar
            activePage={activePage}
            setActivePage={setActivePage}
        >
            <Navbar />

            <main className="min-h-screen bg-gray-50">

                {activePage === "products" && (
                    <ProductsTable />
                )}

                {activePage === "create-product" && (
                    <CreateProduct />
                )}

                {/*
                {activePage === "out-of-stock" && (
                    <OutOfStock />
                )}
                */}

                {activePage === "orders" && (
                    <Orders />
                )}

            </main>
        </Sidebar>
    );
};


const App = () => {
    return (
        <AuthProvider>

            <Routes>

                {/* LOGIN PAGE */}
                <Route
                    path="/login"
                    element={<Login />}
                />

                {/* PROTECTED DASHBOARD */}
                <Route
                    path="/"
                    element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />

            </Routes>

        </AuthProvider>
    );
};


export default App;

import React, { useContext } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { ProductContext } from "../../../contexts/ProductContext.jsx";

export default function ProtectedRoute() {
    const { user, authLoading } = useContext(ProductContext);
    const location = useLocation();

    if (authLoading) {
        return (
            <div className="p-10 text-center">
                Checking login...
            </div>
        );
    }

    if (!user) {
        return (
            <Navigate
                to="/login"
                state={{ from: location }}
                replace
            />
        );
    }

    return <Outlet />;
}
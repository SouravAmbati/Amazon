import React, { createContext, useContext, useState } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(() => {
        return localStorage.getItem("isAuthenticated") === "true";
    });

    const [loading, setLoading] = useState(false);

    const login = async (email, password) => {
        try {
            setLoading(true);

            const response = await axios.post(
                "/api/auth/v1/login",
                {
                    email,
                    password
                }
            );

            if (response.data.success) {
                setIsAuthenticated(true);
                localStorage.setItem("isAuthenticated", "true");

                return {
                    success: true,
                    message: response.data.message
                };
            }

            return {
                success: false,
                message: response.data.message
            };

        } catch (error) {
            return {
                success: false,
                message:
                    error.response?.data?.message ||
                    error.message ||
                    "Login failed"
            };
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        setIsAuthenticated(false);
        localStorage.removeItem("isAuthenticated");
    };

    return (
        <AuthContext.Provider
            value={{
                isAuthenticated,
                loading,
                login,
                logout
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};
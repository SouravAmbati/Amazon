import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../../../context/AuthContext";

const Login = () => {
    const navigate = useNavigate();

    const { login, loading } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");

        const result = await login(email, password);

        if (result.success) {

            toast.success(
                result.message || "Login successful!"
            );

            navigate("/");

        } else {

            setError(result.message);

            toast.error(
                result.message || "Login failed"
            );
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">

            {/* Background decoration */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl" />

                <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl" />
            </div>

            {/* Login Card */}
            <div className="relative w-full max-w-md">

                <div className="bg-white rounded-2xl shadow-2xl p-8 sm:p-10">

                    {/* Logo */}
                    <div className="flex justify-center mb-7">

                        <div className="w-14 h-14 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-600/30">

                            <span className="text-white text-2xl font-bold">
                                S
                            </span>

                        </div>

                    </div>

                    {/* Heading */}
                    <div className="text-center mb-8">

                        <h1 className="text-3xl font-bold text-slate-900">
                            Welcome back
                        </h1>

                        <p className="text-slate-500 mt-2">
                            Sign in to your ShopZone admin panel
                        </p>

                    </div>

                    {/* Error */}
                    {error && (
                        <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3">

                            <p className="text-sm text-red-600">
                                {error}
                            </p>

                        </div>
                    )}

                    <form onSubmit={handleSubmit}>

                        {/* Email */}
                        <div className="mb-5">

                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Email address
                            </label>

                            <input
                                type="email"
                                value={email}
                                onChange={(e) =>
                                    setEmail(e.target.value)
                                }
                                placeholder="admin@example.com"
                                autoComplete="email"
                                required
                                className="
                                    w-full
                                    h-12
                                    px-4
                                    rounded-lg
                                    border
                                    border-slate-300
                                    bg-white
                                    text-slate-900
                                    placeholder:text-slate-400
                                    outline-none
                                    transition
                                    focus:border-indigo-500
                                    focus:ring-4
                                    focus:ring-indigo-500/10
                                "
                            />

                        </div>

                        {/* Password */}
                        <div className="mb-6">

                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Password
                            </label>

                            <input
                                type="password"
                                value={password}
                                onChange={(e) =>
                                    setPassword(e.target.value)
                                }
                                placeholder="Enter your password"
                                autoComplete="current-password"
                                required
                                className="
                                    w-full
                                    h-12
                                    px-4
                                    rounded-lg
                                    border
                                    border-slate-300
                                    bg-white
                                    text-slate-900
                                    placeholder:text-slate-400
                                    outline-none
                                    transition
                                    focus:border-indigo-500
                                    focus:ring-4
                                    focus:ring-indigo-500/10
                                "
                            />

                        </div>

                        {/* Login Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="
                                w-full
                                h-12
                                rounded-lg
                                bg-indigo-600
                                hover:bg-indigo-700
                                active:bg-indigo-800
                                text-white
                                font-semibold
                                transition
                                duration-200
                                shadow-lg
                                shadow-indigo-600/20
                                disabled:opacity-60
                                disabled:cursor-not-allowed
                            "
                        >

                            {loading ? (
                                <span className="flex items-center justify-center gap-2">

                                    <span className="loading loading-spinner loading-sm" />

                                    Signing in...

                                </span>
                            ) : (
                                "Sign in"
                            )}

                        </button>

                    </form>

                    {/* Footer */}
                    <div className="mt-8 pt-6 border-t border-slate-100 text-center">

                        <p className="text-xs text-slate-400">
                            ShopZone Admin Panel
                        </p>

                    </div>

                </div>

            </div>

        </div>
    );
};

export default Login;
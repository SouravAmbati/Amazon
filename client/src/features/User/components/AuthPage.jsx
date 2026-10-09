
import React, { useContext, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { ProductContext } from "../../../contexts/ProductContext.jsx";


export default function AuthPage() {
    const { user, authLoading, signup, login } =
        useContext(ProductContext);

    const navigate = useNavigate();

    const [isSignup, setIsSignup] = useState(false);
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    if (authLoading) {
        return <div className="p-10 text-center">Checking session...</div>;
    }

    if (user) {
        return <Navigate to="/" replace />;
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");
        setLoading(true);

        try {
            const result = isSignup
                ? await signup(username, email, password)
                : await login(email, password);

            if (!result.success) {
                setError(result.message || "Authentication failed");
                return;
            }

            navigate("/");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-md rounded-2xl border bg-white p-8 shadow-sm"
            >
                <Link to="/" className="text-2xl font-bold">
                    ShopZone
                </Link>

                <h1 className="mt-6 text-2xl font-semibold">
                    {isSignup ? "Create your account" : "Login"}
                </h1>

                <p className="mt-2 text-sm text-gray-500">
                    {isSignup
                        ? "Create an account to manage your cart and orders."
                        : "Login to access your cart and orders."}
                </p>

                {isSignup && (
                    <label className="mt-6 block text-sm font-medium">
                        Username
                        <input
                            required
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="mt-2 w-full rounded-lg border p-3"
                            placeholder="Your username"
                        />
                    </label>
                )}

                <label className="mt-5 block text-sm font-medium">
                    Email
                    <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="mt-2 w-full rounded-lg border p-3"
                        placeholder="you@example.com"
                    />
                </label>

                <label className="mt-5 block text-sm font-medium">
                    Password
                    <input
                        type="password"
                        required
                        minLength={8}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="mt-2 w-full rounded-lg border p-3"
                        placeholder="At least 8 characters"
                    />
                </label>

                {error && (
                    <p className="mt-4 text-sm text-red-600">
                        {error}
                    </p>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="mt-6 w-full rounded-lg bg-black p-3 font-semibold text-white disabled:opacity-50"
                >
                    {loading
                        ? "Please wait..."
                        : isSignup
                            ? "Create account"
                            : "Login"}
                </button>

                <p className="mt-6 text-center text-sm text-gray-600">
                    {isSignup
                        ? "Already have an account?"
                        : "New to ShopZone?"}{" "}
                    <button
                        type="button"
                        onClick={() => {
                            setIsSignup(!isSignup);
                            setError("");
                        }}
                        className="font-semibold underline"
                    >
                        {isSignup ? "Login" : "Create an account"}
                    </button>
                </p>
            </form>
        </div>
    );
}

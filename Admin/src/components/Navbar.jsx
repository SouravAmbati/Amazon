import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {

    const navigate = useNavigate();

    const { isAuthenticated, logout } = useAuth();

    const handleLogout = () => {
        logout();
        navigate("/login", { replace: true });
    };

    return (
        <div>
            <div className="navbar bg-base-100 shadow-sm bg-white">

                <div className="flex-1">
                    <a className="btn btn-ghost text-xl text-black">
                        ShopZone
                    </a>
                </div>

                <div className="flex-none">

                    <div className="dropdown dropdown-end">

                        <div
                            tabIndex={0}
                            role="button"
                            className="btn btn-ghost btn-circle avatar"
                        >
                            <div className="w-10 rounded-full">
                                <img
                                    alt="Profile"
                                    src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                                />
                            </div>
                        </div>

                        <ul
                            tabIndex="-1"
                            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
                        >

                            {!isAuthenticated && (
                                <li>
                                    <button
                                        onClick={() => navigate("/login")}
                                    >
                                        Login
                                    </button>
                                </li>
                            )}

                            {isAuthenticated && (
                                <>
                                    <li>
                                        <button onClick={handleLogout}>
                                            Logout
                                        </button>
                                    </li>
                                </>
                            )}

                        </ul>

                    </div>

                </div>

            </div>
        </div>
    );
};

export default Navbar;
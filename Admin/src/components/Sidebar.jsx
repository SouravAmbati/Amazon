import React from "react";

import {
    Package,
    PlusCircle,
    TriangleAlert,
    ShoppingBag,
    Settings
} from "lucide-react";

const Sidebar = ({
    children,
    activePage,
    setActivePage
}) => {

    const menuItems = [
        {
            name: "Products",
            page: "products",
            icon: Package
        },
        {
            name: "Create Product",
            page: "create-product",
            icon: PlusCircle
        },
        // {
        //     name: "Out Of Stock",
        //     page: "out-of-stock",
        //     icon: TriangleAlert
        // },
        {
            name: "Orders",
            page: "orders",
            icon: ShoppingBag
        }
    ];

    return (
        <div className="drawer lg:drawer-open min-h-screen">

            <input
                id="my-drawer-3"
                type="checkbox"
                className="drawer-toggle"
            />

            {/* RIGHT SIDE CONTENT */}

            <div className="drawer-content">
                {children}
            </div>


            {/* LEFT SIDEBAR */}

            <div className="drawer-side">

                <label
                    htmlFor="my-drawer-3"
                    aria-label="close sidebar"
                    className="drawer-overlay"
                ></label>


                <aside
                    className="
                        min-h-screen
                        w-64
                        bg-white
                        border-r
                        border-gray-200
                        shadow-[4px_0_15px_rgba(0,0,0,0.04)]
                        flex
                        flex-col
                    "
                >

                    {/* LOGO / TITLE */}

                    <div className="px-6 py-6 border-b border-gray-100">

                        <h1 className="text-xl font-bold text-gray-900">
                            ShopZone Admin
                        </h1>

                        <p className="text-sm text-gray-500 mt-1">
                            Seller Dashboard
                        </p>

                    </div>


                    {/* MENU */}

                    <div className="flex-1 px-3 py-6">

                        <p
                            className="
                                px-3
                                mb-3
                                text-xs
                                font-semibold
                                text-gray-400
                                uppercase
                                tracking-wider
                            "
                        >
                            Management
                        </p>


                        <ul className="space-y-1">

                            {menuItems.map((item) => {

                                const Icon = item.icon;

                                const isActive =
                                    activePage === item.page;

                                return (

                                    <li key={item.page}>

                                        <button
                                            onClick={() =>
                                                setActivePage(item.page)
                                            }
                                            className={`
                                                w-full
                                                flex
                                                items-center
                                                gap-3
                                                px-3
                                                py-2.5
                                                rounded-lg
                                                font-medium
                                                cursor-pointer
                                                transition

                                                ${
                                                    isActive
                                                        ? "bg-gray-100 text-gray-900"
                                                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                                                }
                                            `}
                                        >

                                            <Icon size={19} />

                                            {item.name}

                                        </button>

                                    </li>

                                );

                            })}

                        </ul>

                    </div>


                    {/* BOTTOM MENU */}

                    <div className="p-3 border-t border-gray-100">

                        <button
                            onClick={() =>
                                setActivePage("settings")
                            }
                            className={`
                                w-full
                                flex
                                items-center
                                gap-3
                                px-3
                                py-2.5
                                rounded-lg
                                font-medium
                                transition
                                cursor-pointer

                                ${
                                    activePage === "settings"
                                        ? "bg-gray-100 text-gray-900"
                                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                                }
                            `}
                        >

                            <Settings size={19} />

                            Settings

                        </button>

                    </div>

                </aside>

            </div>

        </div>
    );
};

export default Sidebar;
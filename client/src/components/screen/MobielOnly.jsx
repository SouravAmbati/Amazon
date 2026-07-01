import React, { useEffect, useState } from "react";

const DesktopOnly = ({ children }) => {
    const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);

    useEffect(() => {
        const handleResize = () => {
            setIsDesktop(window.innerWidth >= 1024);
        };

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    if (!isDesktop) {
        return (
            <div className="fixed inset-0 bg-gray-100 flex items-center justify-center p-6">
                <div className="bg-white shadow-xl rounded-lg p-10 max-w-lg text-center">
                    <h1 className="text-4xl font-bold mb-4">
                        Desktop Only
                    </h1>

                    <p className="text-gray-600 text-lg">
                        ShopZone is currently optimized for desktop screens.
                    </p>

                    <p className="text-gray-500 mt-2">
                        Please open this website on a laptop or desktop computer.
                    </p>

                    <div className="text-6xl mt-8">
                        💻
                    </div>
                </div>
            </div>
        );
    }

    return children;
};

export default DesktopOnly;
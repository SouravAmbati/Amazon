import React from "react";
import { Link, useSearchParams } from "react-router-dom";

const PaymentSuccess = () => {
    const [searchParams] = useSearchParams();

    const orderId = searchParams.get("orderId");
    const sessionId = searchParams.get("session_id");

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <div className="bg-white rounded-xl shadow-lg p-10 text-center max-w-md w-full">

                <div className="text-6xl mb-5">
                    ✅
                </div>

                <h1 className="text-3xl font-bold text-gray-800 mb-3">
                    Payment Successful!
                </h1>

                <p className="text-gray-600 mb-6">
                    Your payment has been successfully processed.
                </p>

                {orderId && (
                    <div className="bg-gray-100 rounded-lg p-4 mb-4 text-left">
                        <p className="text-sm text-gray-500">
                            Order ID
                        </p>

                        <p className="font-semibold text-gray-800 break-all">
                            {orderId}
                        </p>
                    </div>
                )}

                {sessionId && (
                    <p className="text-xs text-gray-400 break-all mb-6">
                        Payment Session: {sessionId}
                    </p>
                )}

                <Link
                    to="/"
                    className="inline-block bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800"
                >
                    Continue Shopping
                </Link>

            </div>
        </div>
    );
};

export default PaymentSuccess;
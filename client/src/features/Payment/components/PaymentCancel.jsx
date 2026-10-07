import React from "react";
import { Link } from "react-router-dom";

const PaymentCancelled = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <div className="bg-white rounded-xl shadow-lg p-10 text-center max-w-md w-full">

                <div className="text-6xl mb-5">
                    ❌
                </div>

                <h1 className="text-3xl font-bold text-gray-800 mb-3">
                    Payment Cancelled
                </h1>

                <p className="text-gray-600 mb-6">
                    Your payment was cancelled. No payment was completed.
                </p>

                <Link
                    to="/payment"
                    className="inline-block bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800"
                >
                    Back to Payment
                </Link>

            </div>
        </div>
    );
};

export default PaymentCancelled;
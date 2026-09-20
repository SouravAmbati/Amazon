import { createContext, useEffect, useState } from "react"
import axios from "axios";
import { useNavigate } from "react-router-dom";
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL


export const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
    const navigate = useNavigate();

    const CreateProduct = async (sentProduct,idempotencyKey) => {
    try {
        const formData = new FormData();

        formData.append("product_name", sentProduct.name);
        formData.append("category", sentProduct.category);
        formData.append("price", sentProduct.price);
        formData.append("about_product", sentProduct.description);

        formData.append(
            "colors",
            JSON.stringify(sentProduct.colors)
        );

        formData.append(
            "sizes",
            JSON.stringify(sentProduct.sizes)
        );

        sentProduct.images.forEach((image, index) => {
            formData.append(`image${index + 1}`, image);
        });

        const res = await axios.post(
            "/api/product/v1/product",
            formData,
            {
                headers: {
                    "IdempotencyKey": idempotencyKey
                }
            }
        );

        return res.data.message;

    } catch (error) {
        console.error(error.response?.data || error);
        return null;
    }
};
    return (
        <ProductContext.Provider value={{ CreateProduct }}>
            {children}
        </ProductContext.Provider>
    )
}
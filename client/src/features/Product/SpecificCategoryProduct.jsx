import React, {
    useContext,
    useEffect,
    useState,
} from "react";

import { useSearchParams } from "react-router-dom";

import CategoryCard from "../Home/Components/CategoryCard/CategoryCard.jsx";

import FilterProduct from "../Home/Components/FilterProducts/FilterProduct.jsx";
import { ProductContext } from "../../contexts/ProductContext.jsx";




const SpecificCategoryProduct = () => {

    const [searchParams] = useSearchParams();


    /*
        Get query parameters

        Example:

        /product?type=Beauty&limit=10

        type = Beauty
        limit = 10
    */

    const type = searchParams.get("type");

    const limit =
        Number(searchParams.get("limit")) || 10;

    const price =
        searchParams.get("price");


    /*
        Product Context
    */

    const {
        getProductsByCategory,
    } = useContext(ProductContext);


    /*
        Products returned by API
    */

    const [products, setProducts] = useState([]);


    /*
        Loading state specifically
        for category page
    */

    const [loading, setLoading] = useState(false);


    /*
        Fetch products whenever:

        type changes
        limit changes
        price changes
    */

    useEffect(() => {

        if (!type) {
            return;
        }


        const fetchProducts = async () => {

            try {

                setLoading(true);


                /*
                    Call backend API

                    GET:

                    /api/products/v1/category
                        ?type=Beauty
                        &limit=10
                */

                const response =
                    await getProductsByCategory(
                        type,
                        limit
                    );


                if (!response.success) {

                    console.error(
                        "Category API error:",
                        response.message
                    );

                    setProducts([]);

                    return;
                }


                /*
                    Backend returns:

                    {
                        id,
                        product_name,
                        price,
                        images
                    }

                    But CategoryCard expects:

                    {
                        id,
                        name,
                        price,
                        images
                    }
                */

                let formattedProducts =
                    response.data.map((product) => ({

                        id: product.id,

                        name: product.product_name,

                        price: product.price,

                        images: product.images || [],

                    }));


                /*
                    Price filtering

                    Your current backend API doesn't
                    receive the price parameter.

                    So for now price filtering
                    happens on the frontend.
                */

                if (price) {

                    const [min, max] =
                        price.split("-");


                    formattedProducts =
                        formattedProducts.filter(
                            (product) => {

                                const productPrice =
                                    Number(product.price);


                                if (max === "max") {

                                    return (
                                        productPrice >=
                                        Number(min)
                                    );

                                }


                                return (
                                    productPrice >=
                                        Number(min) &&

                                    productPrice <=
                                        Number(max)
                                );

                            }
                        );

                }


                setProducts(formattedProducts);


            } catch (error) {

                console.error(
                    "Fetch category products error:",
                    error
                );

                setProducts([]);

            } finally {

                setLoading(false);

            }

        };


        fetchProducts();


    }, [
        type,
        limit,
        price,
        getProductsByCategory,
    ]);


    return (

        <div className="bg-white">

            <div
                className="
                    mx-auto
                    max-w-2xl
                    px-4
                    py-16
                    sm:px-6
                    sm:py-24
                    lg:max-w-7xl
                    lg:px-8
                "
            >

                <h2 className="sr-only">
                    Products
                </h2>


                {/* Filter */}

                <div className="mb-4">

                    <FilterProduct />

                </div>


                {/* Loading */}

                {loading && (

                    <div
                        className="
                            flex
                            items-center
                            justify-center
                            py-10
                        "
                    >

                        <div
                            className="
                                h-10
                                w-10
                                animate-spin
                                rounded-full
                                border-4
                                border-gray-300
                                border-t-indigo-600
                            "
                        />

                    </div>

                )}


                {/* Products */}

                {!loading && (

                    <div
                        className="
                            grid
                            grid-cols-1
                            gap-x-6
                            gap-y-10
                            sm:grid-cols-2
                            lg:grid-cols-3
                            xl:grid-cols-4
                            xl:gap-x-8
                        "
                    >

                        {products.map((product) => (

                            <CategoryCard
                                key={product.id}
                                product={product}
                                isListing={true}
                            />

                        ))}

                    </div>

                )}


                {/* No products */}

                {!loading &&
                    products.length === 0 && (

                    <div className="py-10 text-center">

                        <p className="text-gray-500">
                            No products found.
                        </p>

                    </div>

                )}

            </div>

        </div>

    );
};


export default SpecificCategoryProduct;
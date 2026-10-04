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
        Example:

        /product?type=Beauty&limit=10

        /product?type=Beauty&limit=10&price=500-1000
    */

    const type = searchParams.get("type");

    const limit =
        Number(searchParams.get("limit")) || 10;

    const price =
        searchParams.get("price");


    const {
        getProductsByCategory,
        getProductsByFilter,
    } = useContext(ProductContext);


    const [products, setProducts] = useState([]);

    const [loading, setLoading] = useState(false);


    useEffect(() => {

        if (!type) {
            return;
        }


        const fetchProducts = async () => {

            try {

                setLoading(true);


                let response;


                /*
                    NO PRICE FILTER

                    Call:

                    /category?type=Beauty&limit=10
                */

                if (!price) {

                    console.log(
                        "No price filter selected"
                    );


                    response =
                        await getProductsByCategory(
                            type,
                            limit
                        );

                }


                /*
                    PRICE FILTER SELECTED

                    Example:

                    price = 500-1000

                    Call:

                    /filter
                        ?type=Beauty
                        &limit=10
                        &price=500-1000
                */

                else {

                    console.log(
                        "Price filter selected:",
                        price
                    );


                    response =
                        await getProductsByFilter(
                            type,
                            limit,
                            price
                        );

                }


                if (!response.success) {

                    console.error(
                        "Product API error:",
                        response.message
                    );

                    setProducts([]);

                    return;

                }


                /*
                    Backend:

                    product_name

                    Frontend CategoryCard:

                    name
                */

                const formattedProducts =
                    response.data.map(
                        (product) => ({

                            id: product.id,

                            name:
                                product.product_name,

                            price:
                                product.price,

                            images:
                                product.images || [],

                        })
                    );


                setProducts(
                    formattedProducts
                );


            } catch (error) {

                console.error(
                    "Fetch products error:",
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
        getProductsByFilter,
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

                    <div
                        className="
                            py-10
                            text-center
                        "
                    >

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
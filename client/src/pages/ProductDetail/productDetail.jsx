import React from 'react'
import { useParams } from "react-router-dom";
import data from "../../features/Home/Data/ProductData";
import { StarIcon } from '@heroicons/react/20/solid'



function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

const ProductDetail = () => {
    const { productid } = useParams();

    const product = data
        .flatMap(category => category.products)
        .find(product => product.id === Number(productid));
    const colorAttribute = product.attributes.find(
        (attribute) => attribute.name === "Color"
    );
    return (
        <div className="bg-white">
            <div className="pt-6">

                {/* Image gallery */}
                <div className="mx-auto mt-6 max-w-2xl sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-3 lg:gap-8 lg:px-8">
                    <img
                        alt={product.images[0]}
                        src={product.images[0]}
                        className="row-span-2 aspect-3/4 size-full rounded-lg object-cover max-lg:hidden"
                    />
                    <img
                        alt={product.images[1]}
                        src={product.images[1]}
                        className="col-start-2 aspect-3/2 size-full rounded-lg object-cover max-lg:hidden"
                    />
                    <img
                        alt={product.images[2]}
                        src={product.images[2]}
                        className="col-start-2 row-start-2 aspect-3/2 size-full rounded-lg object-cover max-lg:hidden"
                    />
                    <img
                        alt={product.images[3]}
                        src={product.images[3]}
                        className="row-span-2 aspect-4/5 size-full object-cover sm:rounded-lg lg:aspect-3/4"
                    />
                </div>

                {/* Product info */}
                <div className="mx-auto max-w-2xl px-4 pt-10 pb-16 sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-3 lg:grid-rows-[auto_auto_1fr] lg:gap-x-8 lg:px-8 lg:pt-16 lg:pb-24">
                    <div className="lg:col-span-2 lg:border-r lg:border-gray-200 lg:pr-8">
                        <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">{product.name}</h1>
                    </div>

                    {/* Options */}
                    <div className="mt-4 lg:row-span-3 lg:mt-0">
                        <h2 className="sr-only">Product information</h2>
                        <p className="text-3xl tracking-tight text-gray-900">₹{product.price}</p>



                        <form className="mt-10">
                            {/* Colors */}
                            <div>

                                <fieldset aria-label="Choose a color" className="mt-4">
                                    <div className="flex items-center gap-x-3">
                                        {colorAttribute && (
                                            <div>
                                                <h3 className="text-sm font-medium text-gray-900">Color</h3>

                                                <fieldset aria-label="Choose a color" className="mt-4">
                                                    <div className="flex items-center gap-x-3">
                                                        {colorAttribute.values.map((color) => (
                                                            <div
                                                                key={color}
                                                                className="flex rounded-full outline -outline-offset-1 outline-black/10"
                                                            >
                                                                <input
                                                                    value={color}
                                                                    defaultChecked={color === colorAttribute.values[0]}
                                                                    name="color"
                                                                    type="radio"
                                                                    aria-label={color}
                                                                      style={{ backgroundColor: color.code }}
                                                                    className="size-8 appearance-none rounded-full border border-gray-300 checked:outline-2 checked:outline-offset-2"
                                                                />
                                                            </div>
                                                        ))}
                                                    </div>
                                                </fieldset>
                                            </div>
                                        )}
                                    </div>
                                </fieldset>
                            </div>

                            {/* Sizes */}
                            {product.sizes && product.sizes.length > 0 && (
                                <div className="mt-10">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-sm font-medium text-gray-900">Size</h3>

                                        <a
                                            href="#"
                                            className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                                        >
                                            Size guide
                                        </a>
                                    </div>

                                    <fieldset aria-label="Choose a size" className="mt-4">
                                        <div className="grid grid-cols-4 gap-3">
                                            {product.sizes.map((size) => (
                                                <label
                                                    key={size}
                                                    className="group relative flex items-center justify-center rounded-md border border-gray-300 bg-white p-3 has-checked:border-indigo-600 has-checked:bg-indigo-600 has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-indigo-600"
                                                >
                                                    <input
                                                        value={size}
                                                        defaultChecked={size === product.sizes[0]}
                                                        name="size"
                                                        type="radio"
                                                        className="absolute inset-0 appearance-none focus:outline-none"
                                                    />

                                                    <span className="text-sm font-medium text-gray-900 uppercase group-has-checked:text-white">
                                                        {size}
                                                    </span>
                                                </label>
                                            ))}
                                        </div>
                                    </fieldset>
                                </div>
                            )}

                            <button
                                type="submit"
                                className="mt-10 flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-hidden"
                            >
                                Add to bag
                            </button>
                        </form>
                    </div>

                    <div className="py-10 lg:col-span-2 lg:col-start-1 lg:border-r lg:border-gray-200 lg:pt-6 lg:pr-8 lg:pb-16">
                        {/* Description */}
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900">
                                Description
                            </h2>

                            <div className="mt-4">
                                <p className="text-base text-gray-600">
                                    {product.description}
                                </p>
                            </div>
                        </div>


                        {/* Specifications */}
                        <div className="mt-10">
                            <h2 className="text-lg font-semibold text-gray-900">
                                Product Details
                            </h2>

                            <div className="mt-4 space-y-6">
                                {product.attributes.map((attribute) => (
                                    <div key={attribute.name}>
                                        <p className="text-sm font-medium text-gray-900">
                                            {attribute.name}
                                        </p>

                                        <div className="mt-2 flex flex-wrap gap-2">
                                            {attribute.values.map((value) => (
                                                <span
                                                    key={value}
                                                    className="text-sm text-gray-600"
                                                >
                                                    {typeof value === "object" ? value.name : value}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProductDetail
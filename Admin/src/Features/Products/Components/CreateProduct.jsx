import React, { useContext, useRef, useState } from "react";
import {
    ImagePlus,
    X,
    Plus,
    PackagePlus
} from "lucide-react";
import { ProductContext } from "../../../context/ProductContext";
import { toast } from 'react-toastify';
import { generateIdempotencyKey } from "../Data/generateIdempotencyKey.js";


const CreateProduct = () => {
    const idempotencyKey = generateIdempotencyKey();
    const [product, setProduct] = useState({
        name: "",
        category: "",
        price: "",
        description: "",
        colors: [],
        sizes: []
    });
    const { CreateProduct } = useContext(ProductContext);
    const [submitting, setSubmitting] = useState(false);

    const [images, setImages] = useState([]);
    const [selectedColor, setSelectedColor] = useState("#000000");

    const fileInputRef = useRef(null);

    const categories = [
        "Electronics",
        "Fashion",
        "Home & Kitchen",
        "Beauty",
        "Sports",
        "Books",
        "Toys",
        "Automotive"
    ];

    const availableSizes = [
        "XS",
        "S",
        "M",
        "L",
        "XL",
        "XXL"
    ];


    const handleChange = (e) => {
        const { name, value } = e.target;

        setProduct((previousProduct) => ({
            ...previousProduct,
            [name]: value
        }));
    };


    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);

        const remainingImageSlots = 4 - images.length;

        const selectedFiles = files.slice(
            0,
            remainingImageSlots
        );

        const newImages = selectedFiles.map((file) => ({
            file,
            preview: URL.createObjectURL(file)
        }));

        setImages((previousImages) => [
            ...previousImages,
            ...newImages
        ]);

        e.target.value = "";
    };


    const removeImage = (index) => {
        setImages((previousImages) => {
            URL.revokeObjectURL(
                previousImages[index].preview
            );

            return previousImages.filter(
                (_, imageIndex) => imageIndex !== index
            );
        });
    };


    const addColor = () => {
        if (product.colors.includes(selectedColor)) {
            return;
        }

        setProduct((previousProduct) => ({
            ...previousProduct,
            colors: [
                ...previousProduct.colors,
                selectedColor
            ]
        }));
    };


    const removeColor = (color) => {
        setProduct((previousProduct) => ({
            ...previousProduct,
            colors: previousProduct.colors.filter(
                (productColor) => productColor !== color
            )
        }));
    };


    const handleSizeSelection = (size) => {
        setProduct((previousProduct) => {
            const sizeAlreadySelected =
                previousProduct.sizes.includes(size);

            return {
                ...previousProduct,

                sizes: sizeAlreadySelected
                    ? previousProduct.sizes.filter(
                        (productSize) => productSize !== size
                    )
                    : [
                        ...previousProduct.sizes,
                        size
                    ]
            };
        });
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        if (submitting) return;

        if (images.length === 0) {
            toast.error("Please select at least one image");
            return;
        }

        if (!product.name.trim() || !product.category || !product.price) {
            toast.error("Please complete all required product fields");
            return;
        }

        setSubmitting(true);

        try {
            const productData = {
                ...product,
                images: images.map((image) => image.file),
            };

            const result = await CreateProduct(
                productData,
                idempotencyKey
            );

            toast.success(result);

            // Reset form after successful creation.
            images.forEach((image) => {
                URL.revokeObjectURL(image.preview);
            });

            setImages([]);

            setProduct({
                name: "",
                category: "",
                price: "",
                description: "",
                colors: [],
                sizes: [],
            });

        } catch (error) {
            toast.error(error.message || "Failed to create product");
        } finally {
            setSubmitting(false);
        }
    };


    return (
        <div className="min-h-screen bg-gray-50 p-8">

            <div className="max-w-6xl mx-auto">

                {/* PAGE HEADER */}

                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-900">
                        Create Product
                    </h1>

                    <p className="text-sm text-gray-500 mt-1">
                        Add a new product to your ShopZone store
                    </p>
                </div>


                <form
                    onSubmit={handleSubmit}
                    className="space-y-6"
                >

                    {/* PRODUCT IMAGES */}

                    <div className="
                        bg-white
                        border
                        border-gray-200
                        rounded-xl
                        p-6
                        shadow-sm
                    ">

                        <div className="mb-5">
                            <h2 className="text-base font-semibold text-gray-900">
                                Product Images
                            </h2>

                            <p className="text-sm text-gray-500 mt-1">
                                Upload up to 4 product images
                            </p>
                        </div>


                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleImageUpload}
                            className="hidden"
                        />


                        <div className="grid grid-cols-4 gap-4">

                            {images.map((image, index) => (

                                <div
                                    key={index}
                                    className="
                                        relative
                                        h-44
                                        border
                                        border-gray-200
                                        rounded-xl
                                        overflow-hidden
                                        bg-gray-50
                                        group
                                    "
                                >

                                    <img
                                        src={image.preview}
                                        alt={`Product ${index + 1}`}
                                        className="
                                            w-full
                                            h-full
                                            object-contain
                                            p-2
                                        "
                                    />


                                    <button
                                        type="button"
                                        onClick={() => removeImage(index)}
                                        className="
                                            absolute
                                            top-2
                                            right-2
                                            w-8
                                            h-8
                                            flex
                                            items-center
                                            justify-center
                                            bg-white
                                            text-gray-700
                                            rounded-full
                                            shadow
                                            opacity-0
                                            group-hover:opacity-100
                                            hover:text-red-600
                                            transition
                                        "
                                    >
                                        <X size={17} />
                                    </button>


                                    {index === 0 && (

                                        <span className="
                                            absolute
                                            bottom-2
                                            left-2
                                            bg-gray-900
                                            text-white
                                            text-xs
                                            px-2
                                            py-1
                                            rounded-md
                                        ">
                                            Main Image
                                        </span>

                                    )}

                                </div>

                            ))}


                            {images.length < 4 && (

                                <button
                                    type="button"
                                    onClick={() =>
                                        fileInputRef.current.click()
                                    }
                                    className="
                                        h-44
                                        border-2
                                        border-dashed
                                        border-gray-300
                                        rounded-xl
                                        flex
                                        flex-col
                                        items-center
                                        justify-center
                                        gap-2
                                        text-gray-500
                                        hover:border-gray-500
                                        hover:text-gray-800
                                        hover:bg-gray-50
                                        transition
                                    "
                                >

                                    <ImagePlus size={28} />

                                    <span className="text-sm font-medium">
                                        Upload Image
                                    </span>

                                    <span className="text-xs text-gray-400">
                                        {images.length}/4 uploaded
                                    </span>

                                </button>

                            )}

                        </div>

                    </div>


                    {/* PRODUCT FORM */}

                    <div className="grid grid-cols-3 gap-6">


                        {/* LEFT SIDE */}

                        <div className="
                            col-span-2
                            bg-white
                            border
                            border-gray-200
                            rounded-xl
                            p-6
                            shadow-sm
                        ">

                            <h2 className="text-base font-semibold text-gray-900 mb-6">
                                Product Information
                            </h2>


                            {/* PRODUCT NAME */}

                            <div className="mb-6">

                                <label className="
                                    block
                                    text-sm
                                    font-medium
                                    text-gray-700
                                    mb-2
                                ">
                                    Product Name
                                </label>

                                <input
                                    type="text"
                                    name="name"
                                    value={product.name}
                                    onChange={handleChange}
                                    placeholder="Enter product name"
                                    className="
                                        w-full
                                        px-4
                                        py-3
                                        border
                                        border-gray-300
                                        rounded-lg
                                        text-sm
                                        text-gray-900
                                        outline-none
                                        focus:border-gray-700
                                        focus:ring-1
                                        focus:ring-gray-700
                                    "
                                />

                            </div>


                            {/* DESCRIPTION */}

                            <div>

                                <label className="
                                    block
                                    text-sm
                                    font-medium
                                    text-gray-700
                                    mb-2
                                ">
                                    Product Description
                                </label>

                                <textarea
                                    name="description"
                                    value={product.description}
                                    onChange={handleChange}
                                    rows="9"
                                    placeholder="Describe your product..."
                                    className="
                                        w-full
                                        px-4
                                        py-3
                                        border
                                        border-gray-300
                                        rounded-lg
                                        text-sm
                                        text-gray-900
                                        outline-none
                                        resize-none
                                        focus:border-gray-700
                                        focus:ring-1
                                        focus:ring-gray-700
                                    "
                                />

                            </div>

                        </div>


                        {/* RIGHT SIDE */}

                        <div className="
                            bg-white
                            border
                            border-gray-200
                            rounded-xl
                            p-6
                            shadow-sm
                        ">

                            <h2 className="text-base font-semibold text-gray-900 mb-6">
                                Product Details
                            </h2>


                            {/* CATEGORY */}

                            <div className="mb-6">

                                <label className="
                                    block
                                    text-sm
                                    font-medium
                                    text-gray-700
                                    mb-2
                                ">
                                    Category
                                </label>

                                <select
                                    name="category"
                                    value={product.category}
                                    onChange={handleChange}
                                    className="
                                        w-full
                                        px-4
                                        py-3
                                        border
                                        border-gray-300
                                        rounded-lg
                                        text-sm
                                        text-gray-900
                                        bg-white
                                        outline-none
                                        focus:border-gray-700
                                        focus:ring-1
                                        focus:ring-gray-700
                                    "
                                >

                                    <option value="">
                                        Select category
                                    </option>

                                    {categories.map((category) => (

                                        <option
                                            key={category}
                                            value={category}
                                        >
                                            {category}
                                        </option>

                                    ))}

                                </select>

                            </div>


                            {/* PRICE */}

                            <div className="mb-6">

                                <label className="
                                    block
                                    text-sm
                                    font-medium
                                    text-gray-700
                                    mb-2
                                ">
                                    Product Price
                                </label>

                                <div className="relative">

                                    <span className="
                                        absolute
                                        left-4
                                        top-1/2
                                        -translate-y-1/2
                                        text-gray-500
                                    ">
                                        ₹
                                    </span>

                                    <input
                                        type="number"
                                        name="price"
                                        value={product.price}
                                        onChange={handleChange}
                                        placeholder="0.00"
                                        min="0"
                                        className="
                                            w-full
                                            pl-9
                                            pr-4
                                            py-3
                                            border
                                            border-gray-300
                                            rounded-lg
                                            text-sm
                                            text-gray-900
                                            outline-none
                                            focus:border-gray-700
                                            focus:ring-1
                                            focus:ring-gray-700
                                        "
                                    />

                                </div>

                            </div>


                            {/* COLORS */}

                            <div className="mb-6">

                                <label className="
                                    block
                                    text-sm
                                    font-medium
                                    text-gray-700
                                    mb-3
                                ">
                                    Product Colors
                                </label>


                                <div className="flex items-center gap-3 mb-4">

                                    <input
                                        type="color"
                                        value={selectedColor}
                                        onChange={(e) =>
                                            setSelectedColor(e.target.value)
                                        }
                                        className="
                                            w-11
                                            h-11
                                            rounded-lg
                                            cursor-pointer
                                            border
                                            border-gray-300
                                            p-1
                                        "
                                    />


                                    <span className="
                                        flex-1
                                        px-3
                                        py-2.5
                                        bg-gray-50
                                        border
                                        border-gray-200
                                        rounded-lg
                                        text-sm
                                        text-gray-600
                                        uppercase
                                    ">
                                        {selectedColor}
                                    </span>


                                    <button
                                        type="button"
                                        onClick={addColor}
                                        className="
                                            w-11
                                            h-11
                                            flex
                                            items-center
                                            justify-center
                                            bg-gray-900
                                            text-white
                                            rounded-lg
                                            hover:bg-gray-700
                                            transition
                                        "
                                    >
                                        <Plus size={19} />
                                    </button>

                                </div>


                                {product.colors.length > 0 && (

                                    <div className="flex flex-wrap gap-3">

                                        {product.colors.map((color) => (

                                            <button
                                                key={color}
                                                type="button"
                                                title={`Remove ${color}`}
                                                onClick={() =>
                                                    removeColor(color)
                                                }
                                                className="
                                                    relative
                                                    w-9
                                                    h-9
                                                    rounded-full
                                                    border-2
                                                    border-white
                                                    shadow
                                                    ring-1
                                                    ring-gray-300
                                                    group
                                                "
                                                style={{
                                                    backgroundColor: color
                                                }}
                                            >

                                                <X
                                                    size={14}
                                                    className="
                                                        absolute
                                                        inset-0
                                                        m-auto
                                                        text-white
                                                        opacity-0
                                                        group-hover:opacity-100
                                                    "
                                                />

                                            </button>

                                        ))}

                                    </div>

                                )}

                            </div>


                            {/* SIZES */}

                            <div>

                                <label className="
                                    block
                                    text-sm
                                    font-medium
                                    text-gray-700
                                    mb-3
                                ">
                                    Available Sizes
                                </label>


                                <div className="flex flex-wrap gap-2">

                                    {availableSizes.map((size) => {

                                        const selected =
                                            product.sizes.includes(size);

                                        return (

                                            <button
                                                key={size}
                                                type="button"
                                                onClick={() =>
                                                    handleSizeSelection(size)
                                                }
                                                className={`
                                                    min-w-11
                                                    h-10
                                                    px-3
                                                    rounded-lg
                                                    border
                                                    text-sm
                                                    font-medium
                                                    transition

                                                    ${selected
                                                        ? "bg-gray-900 border-gray-900 text-white"
                                                        : "bg-white border-gray-300 text-gray-600 hover:border-gray-600"
                                                    }
                                                `}
                                            >
                                                {size}
                                            </button>

                                        );

                                    })}

                                </div>

                            </div>

                        </div>

                    </div>


                    {/* SUBMIT */}

                    <div className="flex justify-end">

                        <button
                            type="submit"
                            disabled={submitting}
                            className="
                                flex
                                items-center
                                gap-2
                                px-6
                                py-3
                                bg-gray-900
                                text-white
                                text-sm
                                font-semibold
                                rounded-lg
                                hover:bg-gray-700
                                transition
                                shadow-sm
                            "
                        >

                            <PackagePlus size={19} />

                            Create Product

                        </button>

                    </div>

                </form>

            </div>

        </div>
    );
};

export default CreateProduct;
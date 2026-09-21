import React, {
    useContext,
    useEffect,
    useRef,
    useState
} from "react";

import {
    ImagePlus,
    X,
    Plus,
    Save,
    Loader2
} from "lucide-react";

import { ProductContext } from "../../../context/ProductContext";

import { toast } from "react-toastify";

import { generateIdempotencyKey } from "../Data/generateIdempotencyKey.js";


const ProductEdit = ({
    product,
    onClose,
    onSuccess
}) => {

    const {
        UpdateProduct,
        UpdateProductInState
    } = useContext(ProductContext);


    const fileInputRef = useRef(null);


    // --------------------------------------------------
    // FORM STATE
    // --------------------------------------------------

    const [formProduct, setFormProduct] = useState({

        name: "",

        category: "",

        price: "",

        description: "",

        colors: [],

        sizes: []
    });


    // Existing images
    const [existingImages, setExistingImages] =
        useState([]);


    // New image files
    const [newImages, setNewImages] =
        useState([]);


    const [selectedColor, setSelectedColor] =
        useState("#000000");


    const [saving, setSaving] =
        useState(false);


    // --------------------------------------------------
    // OPTIONS
    // --------------------------------------------------

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


    // --------------------------------------------------
    // LOAD PRODUCT INTO FORM
    // --------------------------------------------------

    useEffect(() => {

        if (!product) {
            return;
        }


        setFormProduct({

            name:
                product.name || "",

            category:
                product.category || "",

            price:
                product.price ?? "",

            description:
                product.description || "",

            colors:
                Array.isArray(product.colors)
                    ? [...product.colors]
                    : [],

            sizes:
                Array.isArray(product.sizes)
                    ? [...product.sizes]
                    : []
        });


        setExistingImages(
            Array.isArray(product.images)
                ? [...product.images]
                : []
        );


        setNewImages([]);

    }, [product]);


    // --------------------------------------------------
    // CLEANUP PREVIEW URLS
    // --------------------------------------------------

    useEffect(() => {

        return () => {

            newImages.forEach((image) => {

                if (image.preview) {

                    URL.revokeObjectURL(
                        image.preview
                    );

                }

            });

        };

    }, [newImages]);


    // --------------------------------------------------
    // HANDLE INPUT
    // --------------------------------------------------

    const handleChange = (e) => {

        const {
            name,
            value
        } = e.target;


        setFormProduct(
            (previousProduct) => ({

                ...previousProduct,

                [name]: value
            })
        );
    };


    // --------------------------------------------------
    // IMAGE UPLOAD
    // --------------------------------------------------

    const handleImageUpload = (e) => {

        const files =
            Array.from(e.target.files);


        const remainingSlots =
            4 - newImages.length;


        const selectedFiles =
            files.slice(
                0,
                remainingSlots
            );


        const preparedImages =
            selectedFiles.map((file) => ({

                file,

                preview:
                    URL.createObjectURL(file)

            }));


        setNewImages(
            (previousImages) => [
                ...previousImages,
                ...preparedImages
            ]
        );


        e.target.value = "";
    };


    // --------------------------------------------------
    // REMOVE NEW IMAGE
    // --------------------------------------------------

    const removeNewImage = (index) => {

        setNewImages(
            (previousImages) => {

                const image =
                    previousImages[index];


                if (image?.preview) {

                    URL.revokeObjectURL(
                        image.preview
                    );

                }


                return previousImages.filter(
                    (_, imageIndex) =>
                        imageIndex !== index
                );
            }
        );
    };


    // --------------------------------------------------
    // ADD COLOR
    // --------------------------------------------------

    const addColor = () => {

        if (
            formProduct.colors.includes(
                selectedColor
            )
        ) {
            return;
        }


        setFormProduct(
            (previousProduct) => ({

                ...previousProduct,

                colors: [
                    ...previousProduct.colors,
                    selectedColor
                ]
            })
        );
    };


    // --------------------------------------------------
    // REMOVE COLOR
    // --------------------------------------------------

    const removeColor = (color) => {

        setFormProduct(
            (previousProduct) => ({

                ...previousProduct,

                colors:
                    previousProduct.colors.filter(
                        (productColor) =>
                            productColor !== color
                    )
            })
        );
    };


    // --------------------------------------------------
    // SIZE SELECTION
    // --------------------------------------------------

    const handleSizeSelection = (size) => {

        setFormProduct(
            (previousProduct) => {

                const alreadySelected =
                    previousProduct.sizes.includes(
                        size
                    );


                return {

                    ...previousProduct,

                    sizes: alreadySelected

                        ? previousProduct.sizes.filter(
                            (productSize) =>
                                productSize !== size
                        )

                        : [
                            ...previousProduct.sizes,
                            size
                        ]
                };
            }
        );
    };


    // --------------------------------------------------
    // SUBMIT
    // --------------------------------------------------

    const handleSubmit = async (e) => {

        e.preventDefault();


        if (saving) {
            return;
        }


        try {

            setSaving(true);


            // ------------------------------------------
            // IMPORTANT:
            // Generate IDENTITY KEY HERE
            // NOT IN PRODUCT CONTEXT
            // ------------------------------------------

            const idempotencyKey =
                generateIdempotencyKey();


            const updatedProduct = {

                ...formProduct,

                images:
                    newImages.map(
                        (image) =>
                            image.file
                    )
            };


            console.log(
                "Updating product:",
                updatedProduct
            );


            console.log(
                "Idempotency Key:",
                idempotencyKey
            );


            // ------------------------------------------
            // CALL CONTEXT
            // ------------------------------------------

            const response =
                await UpdateProduct(
                    product,
                    updatedProduct,
                    idempotencyKey
                );


            if (!response.success) {

                toast.error(
                    response.message ||
                    "Failed to update product"
                );

                return;
            }


            // ------------------------------------------
            // UPDATE LOCAL STATE
            // ------------------------------------------

            UpdateProductInState(
                product.id,
                {
                    ...updatedProduct,

                    // If new images were not uploaded,
                    // keep existing images.
                    images:
                        newImages.length > 0
                            ? response.data?.images ||
                              existingImages
                            : existingImages
                }
            );


            toast.success(
                response.data?.message ||
                "Product updated successfully"
            );


            // ------------------------------------------
            // CLOSE MODAL
            // ------------------------------------------

            if (onSuccess) {
                onSuccess();
            }

        } catch (error) {

            console.error(
                "Update product error:",
                error
            );


            toast.error(
                "Failed to update product"
            );

        } finally {

            setSaving(false);
        }
    };


    // --------------------------------------------------
    // NO PRODUCT
    // --------------------------------------------------

    if (!product) {
        return null;
    }


    return (
        <div
            className="
                fixed
                inset-0
                z-50
                bg-black/50
                flex
                items-center
                justify-center
                p-6
            "
        >

            <div
                className="
                    w-full
                    max-w-6xl
                    max-h-[95vh]
                    overflow-y-auto
                    bg-gray-50
                    rounded-2xl
                    shadow-2xl
                "
            >

                {/* ---------------------------------- */}
                {/* HEADER */}
                {/* ---------------------------------- */}

                <div
                    className="
                        sticky
                        top-0
                        z-10
                        bg-white
                        border-b
                        border-gray-200
                        px-6
                        py-4
                        flex
                        items-center
                        justify-between
                    "
                >

                    <div>

                        <h2
                            className="
                                text-xl
                                font-bold
                                text-gray-900
                            "
                        >
                            Edit Product
                        </h2>

                        <p
                            className="
                                text-sm
                                text-gray-500
                                mt-1
                            "
                        >
                            Update product information
                        </p>

                    </div>


                    <button
                        type="button"
                        onClick={onClose}
                        className="
                            w-9
                            h-9
                            rounded-full
                            flex
                            items-center
                            justify-center
                            text-gray-500
                            hover:bg-gray-100
                            hover:text-gray-900
                        "
                    >
                        <X size={20} />
                    </button>

                </div>


                {/* ---------------------------------- */}
                {/* FORM */}
                {/* ---------------------------------- */}

                <form
                    id="product-edit-form"
                    onSubmit={handleSubmit}
                    className="p-6 space-y-6"
                >

                    {/* -------------------------------- */}
                    {/* IMAGES */}
                    {/* -------------------------------- */}

                    <div
                        className="
                            bg-white
                            border
                            border-gray-200
                            rounded-xl
                            p-6
                            shadow-sm
                        "
                    >

                        <div className="mb-5">

                            <h3
                                className="
                                    text-base
                                    font-semibold
                                    text-gray-900
                                "
                            >
                                Product Images
                            </h3>

                            <p
                                className="
                                    text-sm
                                    text-gray-500
                                    mt-1
                                "
                            >
                                Upload new images to
                                replace the product images.
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


                        <div
                            className="
                                grid
                                grid-cols-4
                                gap-4
                            "
                        >

                            {/* Existing images */}

                            {newImages.length === 0 &&
                                existingImages.map(
                                    (image, index) => (

                                        <div
                                            key={`existing-${index}`}
                                            className="
                                                relative
                                                h-44
                                                border
                                                border-gray-200
                                                rounded-xl
                                                overflow-hidden
                                                bg-gray-50
                                            "
                                        >

                                            <img
                                                src={image}
                                                alt={`Product ${index + 1}`}
                                                className="
                                                    w-full
                                                    h-full
                                                    object-contain
                                                    p-2
                                                "
                                            />

                                            {index === 0 && (

                                                <span
                                                    className="
                                                        absolute
                                                        bottom-2
                                                        left-2
                                                        bg-gray-900
                                                        text-white
                                                        text-xs
                                                        px-2
                                                        py-1
                                                        rounded-md
                                                    "
                                                >
                                                    Main Image
                                                </span>

                                            )}

                                        </div>

                                    )
                                )
                            }


                            {/* New images */}

                            {newImages.map(
                                (image, index) => (

                                    <div
                                        key={`new-${index}`}
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
                                            alt={`New product ${index + 1}`}
                                            className="
                                                w-full
                                                h-full
                                                object-contain
                                                p-2
                                            "
                                        />


                                        <button
                                            type="button"
                                            onClick={() =>
                                                removeNewImage(
                                                    index
                                                )
                                            }
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
                                                hover:text-red-600
                                            "
                                        >
                                            <X size={17} />
                                        </button>


                                        {index === 0 && (

                                            <span
                                                className="
                                                    absolute
                                                    bottom-2
                                                    left-2
                                                    bg-gray-900
                                                    text-white
                                                    text-xs
                                                    px-2
                                                    py-1
                                                    rounded-md
                                                "
                                            >
                                                New Main Image
                                            </span>

                                        )}

                                    </div>

                                )
                            )}


                            {/* Upload */}

                            {newImages.length < 4 && (

                                <button
                                    type="button"
                                    onClick={() =>
                                        fileInputRef.current?.click()
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

                                    <span
                                        className="
                                            text-sm
                                            font-medium
                                        "
                                    >
                                        Upload Image
                                    </span>

                                    <span
                                        className="
                                            text-xs
                                            text-gray-400
                                        "
                                    >
                                        {newImages.length}/4 new
                                    </span>

                                </button>

                            )}

                        </div>

                    </div>


                    {/* -------------------------------- */}
                    {/* PRODUCT INFORMATION */}
                    {/* -------------------------------- */}

                    <div
                        className="
                            grid
                            grid-cols-3
                            gap-6
                        "
                    >

                        {/* LEFT */}

                        <div
                            className="
                                col-span-2
                                bg-white
                                border
                                border-gray-200
                                rounded-xl
                                p-6
                                shadow-sm
                            "
                        >

                            <h3
                                className="
                                    text-base
                                    font-semibold
                                    text-gray-900
                                    mb-6
                                "
                            >
                                Product Information
                            </h3>


                            {/* Name */}

                            <div className="mb-6">

                                <label
                                    className="
                                        block
                                        text-sm
                                        font-medium
                                        text-gray-700
                                        mb-2
                                    "
                                >
                                    Product Name
                                </label>


                                <input
                                    type="text"
                                    name="name"
                                    value={formProduct.name}
                                    onChange={handleChange}
                                    className="
                                        w-full
                                        px-4
                                        py-3
                                        border
                                        border-gray-300
                                        rounded-lg
                                        text-sm
                                        text-black
                                        outline-none
                                        focus:border-gray-700
                                        focus:ring-1
                                        focus:ring-gray-700
                                    "
                                />

                            </div>


                            {/* Description */}

                            <div>

                                <label
                                    className="
                                        block
                                        text-sm
                                        font-medium
                                        text-gray-700
                                        mb-2
                                    "
                                >
                                    Product Description
                                </label>


                                <textarea
                                    name="description"
                                    value={formProduct.description}
                                    onChange={handleChange}
                                    rows="10"
                                    className="
                                        w-full
                                        px-4
                                        py-3
                                        border
                                        border-gray-300
                                        rounded-lg
                                        text-sm
                                        text-black
                                        outline-none
                                        resize-none
                                        focus:border-gray-700
                                        focus:ring-1
                                        focus:ring-gray-700
                                    "
                                />

                            </div>

                        </div>


                        {/* RIGHT */}

                        <div
                            className="
                                bg-white
                                border
                                border-gray-200
                                rounded-xl
                                p-6
                                shadow-sm
                            "
                        >

                            <h3
                                className="
                                    text-base
                                    font-semibold
                                    text-gray-900
                                    mb-6
                                "
                            >
                                Product Details
                            </h3>


                            {/* Category */}

                            <div className="mb-6">

                                <label
                                    className="
                                        block
                                        text-sm
                                        font-medium
                                        text-gray-700
                                        mb-2
                                    "
                                >
                                    Category
                                </label>


                                <select
                                    name="category"
                                    value={formProduct.category}
                                    onChange={handleChange}
                                    className="
                                        w-full
                                        px-4
                                        py-3
                                        border
                                        text-black
                                        border-gray-300
                                        rounded-lg
                                        text-sm
                                        bg-white
                                        outline-none
                                        focus:border-gray-700
                                    "
                                >

                                    <option value="">
                                        Select category
                                    </option>

                                    {categories.map(
                                        (category) => (

                                            <option
                                                key={category}
                                                value={category}
                                            >
                                                {category}
                                            </option>

                                        )
                                    )}

                                </select>

                            </div>


                            {/* Price */}

                            <div className="mb-6">

                                <label
                                    className="
                                        block
                                        text-sm
                                        font-medium
                                        text-gray-700
                                        mb-2
                                    "
                                >
                                    Product Price
                                </label>


                                <div className="relative">

                                    <span
                                        className="
                                            absolute
                                            left-4
                                            top-1/2
                                            -translate-y-1/2
                                            text-gray-500
                                        "
                                    >
                                        ₹
                                    </span>


                                    <input
                                        type="number"
                                        name="price"
                                        value={formProduct.price}
                                        onChange={handleChange}
                                        min="0"
                                        className="
                                            w-full
                                            pl-9
                                            pr-4
                                            py-3
                                            text-black
                                            border
                                            border-gray-300
                                            rounded-lg
                                            text-sm
                                            outline-none
                                            focus:border-gray-700
                                        "
                                    />

                                </div>

                            </div>


                            {/* COLORS */}

                            <div className="mb-6">

                                <label
                                    className="
                                        block
                                        text-sm
                                        font-medium
                                        text-gray-700
                                        mb-3
                                    "
                                >
                                    Product Colors
                                </label>


                                <div
                                    className="
                                        flex
                                        items-center
                                        gap-3
                                        mb-4
                                    "
                                >

                                    <input
                                        type="color"
                                        value={selectedColor}
                                        onChange={(e) =>
                                            setSelectedColor(
                                                e.target.value
                                            )
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


                                    <span
                                        className="
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
                                        "
                                    >
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
                                        "
                                    >
                                        <Plus size={19} />
                                    </button>

                                </div>


                                {formProduct.colors.length > 0 && (

                                    <div
                                        className="
                                            flex
                                            flex-wrap
                                            gap-3
                                        "
                                    >

                                        {formProduct.colors.map(
                                            (color) => (

                                                <button
                                                    key={color}
                                                    type="button"
                                                    onClick={() =>
                                                        removeColor(
                                                            color
                                                        )
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
                                                        backgroundColor:
                                                            color
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

                                            )
                                        )}

                                    </div>

                                )}

                            </div>


                            {/* SIZES */}

                            <div>

                                <label
                                    className="
                                        block
                                        text-sm
                                        font-medium
                                        text-gray-700
                                        mb-3
                                    "
                                >
                                    Available Sizes
                                </label>


                                <div
                                    className="
                                        flex
                                        flex-wrap
                                        gap-2
                                    "
                                >

                                    {availableSizes.map(
                                        (size) => {

                                            const selected =
                                                formProduct.sizes.includes(
                                                    size
                                                );


                                            return (

                                                <button
                                                    key={size}
                                                    type="button"
                                                    onClick={() =>
                                                        handleSizeSelection(
                                                            size
                                                        )
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

                                                        ${
                                                            selected
                                                                ? "bg-gray-900 border-gray-900 text-white"
                                                                : "bg-white border-gray-300 text-gray-600 hover:border-gray-600"
                                                        }
                                                    `}
                                                >
                                                    {size}
                                                </button>

                                            );

                                        }
                                    )}

                                </div>

                            </div>

                        </div>

                    </div>


                    {/* -------------------------------- */}
                    {/* FOOTER */}
                    {/* -------------------------------- */}

                    <div
                        className="
                            flex
                            justify-end
                            gap-3
                            pt-2
                        "
                    >

                        <button
                            type="button"
                            onClick={onClose}
                            disabled={saving}
                            className="
                                px-6
                                py-3
                                border
                                border-gray-300
                                rounded-lg
                                text-sm
                                font-medium
                                text-gray-700
                                hover:bg-gray-100
                            "
                        >
                            Cancel
                        </button>


                        <button
                            type="submit"
                            form="product-edit-form"
                            disabled={saving}
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
                                disabled:opacity-50
                                disabled:cursor-not-allowed
                            "
                        >

                            {saving ? (

                                <>
                                    <Loader2
                                        size={18}
                                        className="animate-spin"
                                    />

                                    Saving...
                                </>

                            ) : (

                                <>
                                    <Save size={18} />

                                    Save Changes
                                </>

                            )}

                        </button>

                    </div>

                </form>

            </div>

        </div>
    );
};


export default ProductEdit;
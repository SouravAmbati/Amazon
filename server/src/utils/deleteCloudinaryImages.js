import { v2 as cloudinary } from "cloudinary";

export const deleteCloudinaryImages = async (imagesURL = []) => {
    const results = await Promise.allSettled(
        imagesURL.map(async (imageURL) => {
            if (typeof imageURL !== "string") {
                throw new Error("Invalid image URL");
            }

            const match = imageURL.match(
                /\/upload\/(?:v\d+\/)?(.+)\.[a-zA-Z0-9]+$/
            );

            if (!match) {
                throw new Error(`Could not extract public_id from ${imageURL}`);
            }

            const publicId = match[1];

            const result = await cloudinary.uploader.destroy(
                publicId,
                { resource_type: "image" }
            );

            console.log(`Cloudinary cleanup for ${publicId}:`, result.result);

            if (result.result !== "ok" && result.result !== "not found") {
                throw new Error(`Deletion unsuccessful for ${publicId}`);
            }

            return { publicId, deleted: true };
        })
    );

    const failedImageIds = results.map((result, index) => {
        if (result.status === "rejected") {
            const imageURL = imagesURL[index];

            const match = typeof imageURL === "string"
                ? imageURL.match(/\/upload\/(?:v\d+\/)?(.+)\.[a-zA-Z0-9]+$/)
                : null;

            return match ? match[1] : null;
        }

        return null;
    }).filter(Boolean);

    return { results, failedImageIds };
};
import pool from "../db/connection.js";

export const storeInactiveImages = async (imagesIds = []) => {
    if (!imagesIds.length) return;

    await pool.query(
        `INSERT INTO inactive_images (images_ids)
         VALUES ($1)`,
        [imagesIds]
    );

    console.log("Failed Cloudinary image IDs saved for retry:", imagesIds);
};
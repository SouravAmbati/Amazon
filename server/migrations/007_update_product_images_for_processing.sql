ALTER TABLE product_images
    RENAME COLUMN storage_key
    TO original_storage_key;

ALTER TABLE product_images
    ADD COLUMN thumbnail_storage_key TEXT,
    ADD COLUMN medium_storage_key TEXT,
    ADD COLUMN large_storage_key TEXT,

    ADD COLUMN original_filename TEXT,
    ADD COLUMN mime_type TEXT,
    ADD COLUMN file_size BIGINT,

    ADD COLUMN width INTEGER,
    ADD COLUMN height INTEGER;

ALTER TABLE product_images
ADD CONSTRAINT product_images_file_size_positive
CHECK (
    file_size IS NULL
    OR file_size >= 0
);
ALTER TABLE product_images
ADD CONSTRAINT product_images_width_positive
CHECK (
    width IS NULL
    OR width > 0
);

ALTER TABLE product_images
ADD CONSTRAINT product_images_height_positive
CHECK (
    height IS NULL
    OR height > 0
);
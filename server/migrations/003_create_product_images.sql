CREATE TABLE product_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    product_id UUID NOT NULL,

    storage_key TEXT NOT NULL,

    sort_order INTEGER NOT NULL DEFAULT 0,

    status TEXT NOT NULL DEFAULT 'PENDING',

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_product_images_product
        FOREIGN KEY (product_id)
        REFERENCES products(id)
        ON DELETE CASCADE,

    CONSTRAINT product_images_sort_order_positive
        CHECK (sort_order >= 0),

    CONSTRAINT product_images_status_valid
        CHECK (
            status IN (
                'PENDING',
                'UPLOADED',
                'PROCESSING',
                'READY',
                'FAILED'
            )
        ),

    CONSTRAINT product_images_storage_key_unique
        UNIQUE (storage_key)
);

CREATE INDEX idx_product_images_product_id
    ON product_images(product_id);

CREATE INDEX idx_product_images_product_sort_order
    ON product_images(product_id, sort_order);
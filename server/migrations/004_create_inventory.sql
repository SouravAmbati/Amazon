CREATE TABLE inventory (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    product_id UUID NOT NULL UNIQUE,

    quantity INTEGER NOT NULL DEFAULT 0,

    reserved_quantity INTEGER NOT NULL DEFAULT 0,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_inventory_product
        FOREIGN KEY (product_id)
        REFERENCES products(id)
        ON DELETE CASCADE,

    CONSTRAINT inventory_quantity_positive
        CHECK (quantity >= 0),

    CONSTRAINT inventory_reserved_positive
        CHECK (reserved_quantity >= 0),

    CONSTRAINT inventory_reserved_not_exceed_quantity
        CHECK (reserved_quantity <= quantity)
);
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    name TEXT NOT NULL,

    description TEXT,

    price NUMERIC(12, 2) NOT NULL,

    status TEXT NOT NULL DEFAULT 'DRAFT',

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT products_price_positive
        CHECK (price >= 0),

    CONSTRAINT products_status_valid
        CHECK (status IN ('DRAFT', 'ACTIVE', 'ARCHIVED'))
);
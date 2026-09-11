CREATE TABLE idempotency_keys (
    key TEXT PRIMARY KEY,
    status VARCHAR(20) NOT NULL,
    response JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
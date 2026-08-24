CREATE TABLE storage_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    bucket_name TEXT NOT NULL,

    object_key TEXT NOT NULL,

    event_type TEXT NOT NULL,

    etag TEXT,

    size BIGINT,

    detected_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    processed_at TIMESTAMPTZ,

    UNIQUE (bucket_name, object_key, etag)
);
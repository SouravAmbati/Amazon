CREATE TABLE images(
    id SERIAL PRIMARY KEY,
    storage_key TEXT,
    image_status varchar(255) DEFAULT 'PENDING',
    created_At  TIMESTAMP
);
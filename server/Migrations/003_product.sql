CREATE TABLE product(
    id  SERIAL PRIMARY KEY,
    product_name TEXT,
    img INT REFERENCES images(id),
    color INT REFERENCES colors(id),
    product_status varchar(12),
    created_At  TIMESTAMP
);
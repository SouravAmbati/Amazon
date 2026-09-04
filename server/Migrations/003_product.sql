CREATE TABLE product(
    id  SERIAL PRIMARY KEY,
    product_name TEXT,
    img INT REFERENCES images(id),
    color INT REFERENCES colors(id),
    created_At  TIMESTAMP
);
CREATE TABLE product(
    id UUID PRIMARY KEY,
    product_name TEXT,
    img UUID REFERENCES images(id),
    color UUID REFERENCES colors(id),
    category VARCHAR(255),
    sizes VARCHAR(255)[],
    about_product TEXT,
    price NUMERIC(10,2),
    created_At  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
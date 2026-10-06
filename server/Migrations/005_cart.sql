CREATE TABLE cart(
    id UUID PRIMARY KEY,
    product UUID REFERENCES product(id),
    counts INT
    created_At  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
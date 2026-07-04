const categories = [
  "Electronics",
  "Fashion",
  "Home & Kitchen",
  "Books",
  "Beauty",
  "Sports",
  "Toys",
  "Groceries",
  "Automotive",
  "Health",
  "Gaming",
  "Office Supplies",
  "Pet Supplies",
  "Furniture",
  "Baby Products",
  "Jewelry",
  "Music",
  "Garden",
  "Kitchen Appliances",
  "Travel",
];

const brands = [
  "Sony",
  "Samsung",
  "Apple",
  "Nike",
  "Adidas",
  "Puma",
  "Dell",
  "HP",
  "Lenovo",
  "Asus",
  "Boat",
  "JBL",
  "Canon",
  "Logitech",
  "Philips",
  "Prestige",
  "Milton",
  "Cello",
  "Pigeon",
  "Havells",
];

const productTypes = [
  "Headphones",
  "Laptop",
  "Keyboard",
  "Mouse",
  "Monitor",
  "Shoes",
  "T-Shirt",
  "Watch",
  "Backpack",
  "Mixer",
  "Bottle",
  "Camera",
  "Speaker",
  "Tablet",
  "Smartphone",
  "Printer",
  "Chair",
  "Desk",
  "Football",
  "Face Wash",
  "Shampoo",
  "Toy Car",
  "Coffee Mug",
  "Air Fryer",
  "SSD",
  "Router",
  "TV",
  "Microwave",
  "Cookware Set",
  "Power Bank",
];
const availableSizes = [
  [],
  ["S", "M", "L"],
  ["M", "L", "XL"],
  ["XS", "S", "M", "L", "XL"],
  ["6", "7", "8", "9", "10"],
  ["32", "34", "36", "38", "40"],
  ["Small", "Medium", "Large"],
];

const data = Array.from({ length: 1000 }, (_, index) => ({
  id: index + 1,
  category: `${categories[index % categories.length]} ${
    Math.floor(index / categories.length) + 1
  }`,
  products: Array.from({ length: 4 }, (_, productIndex) => ({
    id: index * 4 + productIndex + 1,

    name: `${brands[(index + productIndex) % brands.length]} ${
      productTypes[(index * 4 + productIndex) % productTypes.length]
    }`,

    images: [
      `https://picsum.photos/seed/product-${index}-${productIndex}-1/600/600`,
      `https://picsum.photos/seed/product-${index}-${productIndex}-2/600/600`,
      `https://picsum.photos/seed/product-${index}-${productIndex}-3/600/600`,
      `https://picsum.photos/seed/product-${index}-${productIndex}-4/600/600`,
    ],

    price: Math.floor(Math.random() * (49999 - 499 + 1)) + 499,

    seller: "ShopZone Official",

    sizes: availableSizes[Math.floor(Math.random() * availableSizes.length)],

    description:
      "Experience premium quality with this product, designed for everyday use and built using durable materials.",

    attributes: [
      {
        name: "Brand",
        values: [brands[(index + productIndex) % brands.length]],
      },
      {
        name: "Category",
        values: [categories[index % categories.length]],
      },
      {
        name: "Weight",
        values: [`${Math.floor(Math.random() * 5) + 1} kg`],
      },
      {
        name: "Color",
        values: [
          {
            name: "Black",
            code: "#000000",
          },
          {
            name: "White",
            code: "#FFFFFF",
          },
          {
            name: "Blue",
            code: "#2563EB",
          },
          {
            name: "Red",
            code: "#DC2626",
          },
        ],
      },
      {
        name: "Material",
        values: ["Premium Plastic", "Metal", "Cotton", "Leather"],
      },
      {
        name: "Warranty",
        values: ["6 Months", "1 Year", "2 Years"],
      },
      {
        name: "Country of Origin",
        values: ["India", "China", "Vietnam"],
      },
      {
        name: "Manufacturer",
        values: ["ShopZone Pvt. Ltd."],
      },
      {
        name: "Model Number",
        values: [`SZ-${1000 + index}-${productIndex}`],
      },
    ],
  })),
}));

export default data;

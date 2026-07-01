import React from "react";

const CategoryCard = () => {
  const items = [
    {
      title: "Gaming",
      image: "https://picsum.photos/300?random=1",
    },
    {
      title: "Hair Oils",
      image: "https://picsum.photos/300?random=2",
    },
    {
      title: "Home Decor",
      image: "https://picsum.photos/300?random=3",
    },
    {
      title: "Backpacks",
      image: "https://picsum.photos/300?random=4",
    },
  ];

  return (
    <div className="bg-white shadow-md p-4">
      <h2 className="text-xl font-bold mb-4">
        Keep shopping for
      </h2>

      <div className="grid grid-cols-2 gap-3">
        {items.map((item, index) => (
          <div key={index}>
            <img
              src={item.image}
              alt={item.title}
              className="w-full aspect-square object-cover"
            />

            <p className="mt-2 text-sm font-medium">
              {item.title}
            </p>

            <p className="text-xs text-gray-500">
              2 viewed
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryCard;
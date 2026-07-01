import React from "react";
import CategoryCard from "../CategoryCard/CategoryCard";

const Section = ({ sectionName }) => {
  return (
    <div className="max-w-[1500px] mx-auto mt-8 px-5">
      <p className="text-[25px] font-bold mb-4">{sectionName}</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        <CategoryCard />
        <CategoryCard />
        <CategoryCard />
        <CategoryCard />
      </div>
    </div>
  );
};

export default Section;
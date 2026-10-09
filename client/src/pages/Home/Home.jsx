import React, {
  useContext,
  useEffect,
  useMemo,
} from "react";

import Navbar from "../../components/Navbar/Navbar.jsx";
import Carousel from "../../features/Home/Components/Carousel/carousel.jsx";
import CategoryCard from "../../features/Home/Components/CategoryCard/CategoryCard.jsx";
import FloatingFilter from "../../features/Home/Components/Filters/Filter.jsx";

import { ProductContext } from "../../contexts/ProductContext.jsx";

const Home = () => {
  const {
    products,
    loading,
    hasNextPage,
    loadMoreProducts,
  } = useContext(ProductContext);

  /*
   * Group API products into categories.
   * Each category card contains up to 4 products.
   */
  const categories = useMemo(() => {
    const grouped = {};

    products.forEach((product) => {
      if (!grouped[product.category]) {
        grouped[product.category] = [];
      }

      const categoryCards = grouped[product.category];

      let lastCard = categoryCards[categoryCards.length - 1];

      if (!lastCard || lastCard.products.length === 4) {
        lastCard = {
          id: `${product.category}-${categoryCards.length}-${product.id}`,
          category: product.category,
          products: [],
        };

        categoryCards.push(lastCard);
      }

      lastCard.products.push({
        id: product.id,
        name: product.product_name,
        price: product.price,
        images: product.images || [],
      });
    });

    return Object.values(grouped).flat();
  }, [products]);

  /*
   * Navbar search data.
   */
  const productNames = useMemo(() => {
    return products.map((product) => ({
      id: product.id,
      name: product.product_name,
    }));
  }, [products]);

  /*
   * Infinite scrolling.
   * Load more products when within 1000px
   * of the bottom of the page.
   */
  useEffect(() => {
    const handleScroll = () => {
      if (loading || !hasNextPage) {
        return;
      }

      const scrollPosition =
        window.innerHeight + window.scrollY;

      const pageHeight =
        document.documentElement.scrollHeight;

      const distanceFromBottom =
        pageHeight - scrollPosition;

      if (distanceFromBottom <= 1000) {
        loadMoreProducts();
      }
    };

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    // Check on initial load as well.
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [loading, hasNextPage, loadMoreProducts]);

  return (
    <div className="gradient min-h-screen w-full overflow-x-clip bg-[linear-gradient(to_bottom,#e3e6e6_0%,#f3f3f3_30%,#ffffff_100%)]">
      {/* Navbar */}
      <Navbar products={productNames} />

      {/* Hero carousel */}
      <Carousel />

      {/* Product categories */}
      <main className="relative z-20 mx-auto mt-3 w-full px-3 sm:px-4 md:-mt-60 md:mt-0 md:px-6">
        <div className="mx-auto mt-0 grid w-full max-w-[1500px] grid-cols-1 gap-4 min-[520px]:grid-cols-2 md:mt-8 md:gap-5 lg:grid-cols-3 xl:grid-cols-4">
          {categories.map((category) => (
            <CategoryCard
              key={category.id}
              categoryName={category.category}
              product={category}
            />
          ))}
        </div>
      </main>

      {/* Existing floating filter */}
      <FloatingFilter />
    </div>
  );
};

export default Home;
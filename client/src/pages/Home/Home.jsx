import React, {
  useContext,
  useEffect,
  useMemo,
  useRef,
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
      Group API products into categories.

      IMPORTANT:
      We keep ALL fetched products here.

      CategoryCard itself displays only 4.
  */
  const categories = useMemo(() => {

    const grouped = {};

    products.forEach((product) => {

        if (!grouped[product.category]) {
            grouped[product.category] = [];
        }

        const categoryCards = grouped[product.category];

        let lastCard =
            categoryCards[categoryCards.length - 1];

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
      Navbar search data
  */
  const productNames = useMemo(() => {

    return products.map((product) => ({
      id: product.id,
      name: product.product_name,
    }));

  }, [products]);


  /*
      EAGER LOADING

      The API will be called when the user comes
      within 1000px of the bottom.

      So we don't wait until the user actually
      reaches the bottom.
  */
  useEffect(() => {

    const handleScroll = () => {

      if (loading) {
        return;
      }

      if (!hasNextPage) {
        return;
      }

      const scrollPosition =
        window.innerHeight + window.scrollY;

      const pageHeight =
        document.documentElement.scrollHeight;


      /*
          Start loading when the user is
          1000px away from the bottom.
      */
      const distanceFromBottom =
        pageHeight - scrollPosition;


      if (distanceFromBottom <= 1000) {

        loadMoreProducts();

      }

    };


    window.addEventListener(
      "scroll",
      handleScroll,
      { passive: true }
    );


    /*
        Check once when the page initially loads.
        This handles cases where the content isn't
        tall enough to require scrolling.
    */
    handleScroll();


    return () => {

      window.removeEventListener(
        "scroll",
        handleScroll
      );

    };

  }, [
    loading,
    hasNextPage,
    loadMoreProducts,
  ]);


  return (
    <div
      className="
                gradient
                min-h-screen
                bg-[linear-gradient(to_bottom,#e3e6e6_0%,#f3f3f3_30%,#ffffff_100%)]
            "
    >

      <Navbar products={productNames} />

      <Carousel />


      <div
        className="
                    relative
                    z-20
                    px-3
                    md:px-6
                    mt-4
                    md:-mt-60
                "
      >

        <div
          className="
                        max-w-[1500px]
                        mt-8
                        mx-auto
                        grid
                        grid-cols-1
                        sm:grid-cols-2
                        lg:grid-cols-3
                        xl:grid-cols-4
                        gap-5
                    "
        >

          {categories.map((category) => (

            <CategoryCard
              key={category.id}
              categoryName={category.category}
              product={category}
            />

          ))}

        </div>



      </div>


      <FloatingFilter />

    </div>
  );
};


export default Home;
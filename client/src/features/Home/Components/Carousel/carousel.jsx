import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

import image1 from "./image1.jpg";
import image2 from "./image2.jpg";
import image3 from "./image3.jpg";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const Carousel = () => {
  return (
    <div className="relative w-full overflow-hidden">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        navigation={{
          nextEl: ".custom-next",
          prevEl: ".custom-prev",
        }}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        loop={true}
        className="h-[160px] w-full sm:h-[240px] md:h-[350px] lg:h-[450px] xl:h-[500px]"
      >
        <SwiperSlide className="h-full">
          <img
            src={image1}
            alt="Banner 1"
            className="h-full w-full select-none object-cover object-center"
            draggable="false"
          />
        </SwiperSlide>

        <SwiperSlide className="h-full">
          <img
            src={image2}
            alt="Banner 2"
            className="h-full w-full select-none object-cover object-center"
            draggable="false"
          />
        </SwiperSlide>

        <SwiperSlide className="h-full">
          <img
            src={image3}
            alt="Banner 3"
            className="h-full w-full select-none object-cover object-center"
            draggable="false"
          />
        </SwiperSlide>
      </Swiper>

      {/* Bottom gradient */}
      <div className="pointer-events-none absolute bottom-0 left-0 z-10 h-16 w-full bg-gradient-to-t from-gray-100 via-gray-100/60 to-transparent sm:h-24 md:h-40" />

      {/* Left Arrow */}
      <button
        type="button"
        aria-label="Previous banner"
        className="custom-prev absolute left-0 top-0 z-20 flex h-full w-9 cursor-pointer items-center justify-center transition-all duration-200 hover:bg-white/10 sm:w-12 md:w-20"
      >
        <FaChevronLeft className="text-xl text-black sm:text-2xl md:text-4xl" />
      </button>

      {/* Right Arrow */}
      <button
        type="button"
        aria-label="Next banner"
        className="custom-next absolute right-0 top-0 z-20 flex h-full w-9 cursor-pointer items-center justify-center transition-all duration-200 hover:bg-white/10 sm:w-12 md:w-20"
      >
        <FaChevronRight className="text-xl text-black sm:text-2xl md:text-4xl" />
      </button>
    </div>
  );
};

export default Carousel;
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
    <div className="relative w-full">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        navigation={{
          nextEl: ".custom-next",
          prevEl: ".custom-prev",
        }}
        // pagination={{ clickable: true }}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        loop={true}
        className="w-full h-[180px] md:h-[500px]"
      >
        <SwiperSlide>
          <img
            src={image1}
            alt="Banner 1"
            className="w-full h-auto object-cover select-none"
            draggable="false"
          />
        </SwiperSlide>

        <SwiperSlide>
          <img
            src={image2}
            alt="Banner 2"
            className="w-full h-auto object-cover select-none"
            draggable="false"
          />
        </SwiperSlide>

        <SwiperSlide>
          <img
            src={image3}
            alt="Banner 3"
            className="w-full h-auto object-cover select-none"
            draggable="false"
          />
        </SwiperSlide>
      </Swiper>
      <div className="pointer-events-none absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-gray-100 via-gray-100/70 to-transparent z-10"></div>


      {/* Left Arrow */}
      <button
        className="custom-prev absolute left-0 top-0 z-20 h-full w-20 flex items-center justify-center hover:bg-white/10 transition-all duration-200"
      >
        <FaChevronLeft className="text-4xl text-black" />
      </button>

      {/* Right Arrow */}
      <button
        className="custom-next absolute right-0 top-0 z-20 h-full w-20 flex items-center justify-center hover:bg-white/10 transition-all duration-200"
      >
        <FaChevronRight className="text-4xl text-black" />
      </button>
    </div>
  );
};

export default Carousel;
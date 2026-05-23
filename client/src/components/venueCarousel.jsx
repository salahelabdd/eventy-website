import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export default function VenueCarousel({ venue }) {
  const images =
    venue.images?.length > 0
      ? venue.images
      : [
          "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1200&q=80",
        ];

  return (
    <Swiper
      modules={[Navigation, Pagination]}
      navigation
      pagination={{ clickable: true }}
      spaceBetween={10}
      slidesPerView={1}
    >
      {images.map((img, i) => (
        <SwiperSlide key={i}>
          <img
            src={img}
            alt={`${venue.name}-${i}`}
            className="carousel-img"
            onError={(e) => {
              e.target.src =
                "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1200&q=80";
            }}
          />
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
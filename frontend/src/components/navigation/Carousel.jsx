import { useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const PreviousBtn = (props) => {
  const { onClick } = props;
  return (
    <button
      onClick={onClick}
      className="lg:block hidden absolute z-10 top-36 left-0 rounded-r-full py-20 px-3 bg-transparent hover:border-1 hover:border-black hover:bg-white/80 text-5xl"
    >
      <FontAwesomeIcon icon={faChevronLeft} />
    </button>
  );
};

const NextBtn = (props) => {
  const { onClick } = props;
  return (
    <button
      onClick={onClick}
      className="lg:block hidden absolute z-0 top-36 right-0 rounded-l-full py-20 px-3 bg-transparent hover:border-1 hover:border-black hover:bg-white/80 text-5xl"
    >
      <FontAwesomeIcon icon={faChevronRight} />
    </button>
  );
};

export default function Carousel({ data }) {
  const settings = {
    autoplay: true,
    autoplaySpeed: 5000,
    cssEase: "linear",
    speed: 500,
    infinitie: true,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <Slider {...settings} prevArrow={<PreviousBtn />} nextArrow={<NextBtn />}>
      {data.map((s, i) => {
        return (
          <Link to={s.link} key={i} className="shadow-md w-full h-full">
            <img src={s.image} className="object-cover" />
          </Link>
        );
      })}
    </Slider>
  );
}

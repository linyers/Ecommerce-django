import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { getProducts } from "../../utils/products.api";
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
      className="absolute left-0 top-14 z-10 rounded-sm py-20 px-3 md:py-8 md:px-4 hover:border-1 border-l-0 hover:border-black bg-white/50 hover:bg-white text-2xl text-gray-800"
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
      className="absolute right-0 top-14 md:top-10 z-10 rounded-sm py-20 px-3 md:py-8 md:px-4 hover:border-1 border-r-0 hover:border-black bg-white/50 hover:bg-white text-2xl text-gray-800"
    >
      <FontAwesomeIcon icon={faChevronRight} />
    </button>
  );
};

export default function ProductsSlick({ query, limit }) {
  const settings = {
    speed: 500,
    infinitie: true,
    slidesToShow: 5,
    slidesToScroll: 5,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
        }
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        }
      },
    ]

  };

  const [products, setProducts] = useState([]);

  useEffect(() => {
    const loadProducts = async () => {
      const data = await getProducts(query);
      setProducts(data.data.results);
    };
    loadProducts();
  }, []);

  return (
    <Slider
      {...settings}
      prevArrow={<PreviousBtn />}
      nextArrow={<NextBtn />}
    >
      {products?.slice(0, limit).map((p, i) => {
        return (
          <div key={i} className="flex">
            <Link to={`/${p.slug}`} className="w-64 h-64">
              <img
                className="w-full h-full"
                src={p.images[0]}
                alt={`Product ${i + 1}`}
              />
            </Link>
          </div>
        );
      })}
      {/*
       */}
    </Slider>
  );
}

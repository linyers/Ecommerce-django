import React from "react";
import { Link } from "react-router-dom";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faHeart} from '@fortawesome/free-regular-svg-icons'

export default function Product({ p }) {
  const beforePrice = Math.trunc(p.price / (1 - p.discount / 100));
  return (
    <>
      <div className="flex bg-white px-14 py-5 gap-8">
        <Link to={`/${p.slug}`} className="w-44 h-44">
          <img className="w-full h-full object-cover" src={p.images[0]} alt="" />
        </Link>
        <div className="flex w-full flex-col justify-center gap-5">
          <div className="flex gap-20 justify-between">
          <Link to={`/${p.slug}`} className="text-gray-900 hover:text-gray-900">
            <h3 className="text-xl font-light">{p.title}</h3>
          </Link>
          <a className="text-xl cursor-pointer text-blue-500 hover:text-blue-500">
            <FontAwesomeIcon icon={faHeart} />
          </a>
          </div>
          <Link to={`/${p.slug}`} className="flex w-fit flex-col">
            {p.discount && (
              <span className="text-sm line-through text-gray-400">
                <span className="text-gray-300 font-normal">
                  $ {beforePrice}
                </span>
              </span>
            )}
            <div className="flex gap-3 items-center">
              <span className="text-2xl font-medium text-gray-800">
                $ {p.price}
              </span>
              {p.discount && (
                <span className="text-emerald-600 font-semibold text-sm">
                  {p.discount}% OFF
                </span>
              )}
            </div>
          </Link>
        </div>
      </div>
      <hr />
    </>
  );
}

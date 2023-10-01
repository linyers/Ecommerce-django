import React from "react";
import { Link } from "react-router-dom";

export default function Product({ p }) {
  const beforePrice = Math.trunc(p.price / (1 - p.discount / 100));
  return (
    <div className="flex bg-white px-14 py-5 gap-8">
      <Link className="w-44 h-44">
        <img className="object-cover" src={p.images[0]} alt="" />
      </Link>
      <div className="flex flex-col justify-center gap-5">
        <Link className="text-gray-900 hover:text-gray-900">
          <h3 className="text-xl font-light">{p.title}</h3>
        </Link>
        <Link className="flex flex-col">
          {p.discount && (
            <span className="text-sm line-through text-gray-600">
              <span className="text-gray-400">$ {beforePrice}</span>
            </span>
          )}
          <div className="flex gap-3 items-center">
            <span className="text-2xl font-normal text-gray-950">$ {p.price}</span>
            {p.discount && (
              <span className="text-emerald-600 font-semibold text-sm">
                {p.discount}% OFF
              </span>
            )}
          </div>
        </Link>
      </div>
    </div>
  );
}

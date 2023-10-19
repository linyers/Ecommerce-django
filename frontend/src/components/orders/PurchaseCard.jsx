import React from "react";

export default function PurchaseCard({ purchases }) {
  return (
    <ul>
      {purchases?.map((p, i) => {
        return (
          <>
            <li
              className="flex flex-row w-full justify-between items-center"
              key={i}
            >
              <div className="ml-8 rounded-md my-4 w-28 ring-1 ring-gray-400">
                <img className="rounded-md" src={p.product.images[0]} alt="" />
              </div>
              <h4 className="font-bold">{p.product.title}</h4>
              <span className="text-gray-500 px-8">{p.product.author}</span>
            </li>
            <hr />
          </>
        );
      })}
    </ul>
  );
}

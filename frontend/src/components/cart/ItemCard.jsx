import { useContext } from "react";
import CartContext from "../../context/CartContext";

export default function ItemCard({ count, product, price, beforePrice, idx }) {
  const { removeItem } = useContext(CartContext);

  const handleRemoveItem = async (e, id) => {
    e.preventDefault();
    const body = {
      product_id: id
    };
    const response = await removeItem(body);
  };

  return (
    <div key={idx} className=" bg-white w-full rounded-md shadow-md">
      <h3 className="text-gray-900 py-3 px-8 text-xl font-semibold">
        Producto {idx + 1}
      </h3>
      <hr />
      <ul className="flex flex-col py-5 px-8 gap-5">
        <li className="flex justify-between items-center">
          <div className="flex gap-5 w-2/3 ">
            <img className="w-28" src={product.images[0]} alt="" />
            <div className="flex flex-col justify-evenly mr-3">
              <h3 className="text-lg autocomplete">{product.title}</h3>
              <a
                onClick={(e) => handleRemoveItem(e, product.id)}
                className="w-fit text-blue-600 hover:text-blue-500 text-sm"
                href=""
              >
                Eliminar
              </a>
            </div>
          </div>
          <div className="w-1/3 justify-between flex">
            <div className="flex flex-col justify-center items-center gap-3">
              <div className="ring-1 px-1 ring-gray-400 rounded-md text-center flex justify-between items-center">
                <button className="p-0 mx-2 text-blue-500 hover:text-blue-400 bg-white text-2xl rounded-none">
                  -
                </button>
                <input className="w-11 text-center outline-none" type="text" />
                <button className="p-0 mx-2 text-blue-500 hover:text-blue-400 bg-white text-2xl rounded-none">
                  +
                </button>
              </div>
              <span className="text-gray-400 text-sm font-normal">
                {product.stock - count} Disponible
              </span>
            </div>
            <div className="">
              {product.discount && (
                <div className="flex gap-2">
                  <span className="text-emerald-600 font-medium text-sm">
                    {product.discount}%
                  </span>
                  <span className="text-sm line-through text-gray-500">
                    <span className="text-gray-400 font-normal">
                      $ {beforePrice}
                    </span>
                  </span>
                </div>
              )}
              <span className="font-medium text-lg">$ {price}</span>
            </div>
          </div>
        </li>
      </ul>
    </div>
  );
}

import { useContext } from "react";
import { Link } from 'react-router-dom'
import ItemCard from "../components/cart/ItemCard";
import CartContext from "../context/CartContext";

export default function CartPage() {
  const { cart } = useContext(CartContext);
  return (
    <main className="bg-gray-600 flex flex-row gap-5 px-8 pr-16 p-10">
      {cart?.total_items !== 0 ? (
        <>
          <div className="md:w-3/4 w-full flex flex-col gap-3">
            {cart.cart?.map((c, i) => {
              const price = c.total_price_item;
              const beforePrice = Math.trunc(
                price / (1 - c.product.discount / 100)
              );
              return (
                <ItemCard
                  count={c.count}
                  product={c.product}
                  price={price}
                  beforePrice={beforePrice}
                  idx={i}
                  key={i}
                />
              );
            })}
          </div>
          <div className="w-1/4 fixed right-8">
            <div className=" bg-white w-full rounded-md">
              <h3 className="text-gray-900 py-3 px-8 text-xl font-semibold">
                Resumen de compra
              </h3>
              <hr />
              <ul>
                <li className="px-8 py-3 flex text-sm justify-between">
                  <span>Productos ({cart.total_items})</span>
                  <span>$ {cart.total_price}</span>
                </li>
                <hr />
                <li className="px-8 py-3 text-xl font-semibold flex justify-between">
                  <span>Total</span>
                  <span>$ {cart.total_price}</span>
                </li>
              </ul>
              <div className="px-8">
                <button className="mb-3 w-full bg-blue-500 hover:bg-blue-400 text-white">
                  Proceder a la compra
                </button>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="md:w-3/4 w-full bg-gray-300/90 rounded-md flex flex-col justify-center items-center py-10 gap-3">
            <img className="w-40" src="/bag.png" alt="" />
            <h3 className="text-gray-950 text-xl font-semibold">
              Carrito vacio
            </h3>
            <span className="text-gray-700 text-base">Anda y gasta</span>
            <Link className="p-5 bg-blue-500 rounded-lg hover:bg-blue-400" to="/">Descubre nuevos productos</Link>
          </div>
          <div className="w-1/4 fixed right-8">
            <div className=" bg-gray-300/90 w-full rounded-md">
              <h3 className="text-gray-400 py-3 px-8 text-xl font-semibold">
                Resumen de compra
              </h3>
              <hr />
              <div className="px-8 py-5 text-gray-400">
                <span>
                  Aqui veras el resumen de lo que vayas a comprar cuando tengas
                  productos en el carrito
                </span>
              </div>
            </div>
          </div>
        </>
      )}
    </main>
  );
}

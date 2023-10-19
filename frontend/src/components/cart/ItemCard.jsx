import { useContext, useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import CartContext from "../../context/CartContext";

export default function ItemCard({ count, product, price, beforePrice, idx }) {
  const { removeItem, updateItem } = useContext(CartContext);
  const inputRef = useRef();
  const [error, setError] = useState(false);

  useEffect(() => {
    inputRef.current.value = count;
  }, [count]);

  const handleRemoveItem = (e, id) => {
    e.preventDefault();
    const body = {
      product_id: id,
    };
    removeItem(body);
  };

  const onChangeInput = (e) => {
    if (inputRef.current.value === "") {
      setError(true);
      return;
    }
    if (
      parseInt(inputRef.current.value) < 1 ||
      parseInt(inputRef.current.value) > product.stock
    ) {
      setError(true);
      return;
    }
    setError(false);
  };

  const handleUpdateItem = (e, id) => {
    let timeout;
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      if (error) {
        return;
      }
      const quantity = parseInt(inputRef.current.value);
      const body = {
        product_id: id,
        product_quantity: quantity,
      };
      updateItem(body);
      clearTimeout(timeout);
    }, 1000);
  };

  const substractQuantityBtn = (e, id) => {
    if (parseInt(inputRef.current.value) < 2 || inputRef.current.value === "") {
      return;
    }
    inputRef.current.value = inputRef.current.value - 1;
    handleUpdateItem(e, id);
  };

  const addQuantityBtn = (e, id) => {
    if (parseInt(inputRef.current.value) > product.stock - 1) {
      return;
    }
    if (inputRef.current.value === "") {
      inputRef.current.value = 0;
      setError(false)
    }
    inputRef.current.value = parseInt(inputRef.current.value) + 1;
    handleUpdateItem(e, id);
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
            <Link className="w-28" to={`/${product.slug}`}>
              <img className="w-full" src={product.images[0]} alt="" />
            </Link>
            <div className="flex flex-col justify-evenly mr-3">
              <Link
                to={`/${product.slug}`}
                className="text-black hover:text-black"
              >
                <h3 className="text-lg autocomplete">{product.title}</h3>
              </Link>
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
                <button
                  onClick={(e) => substractQuantityBtn(e, product.id)}
                  className="p-0 mx-2 text-blue-500 hover:text-blue-400 bg-white text-2xl rounded-none"
                >
                  -
                </button>
                <input
                  ref={inputRef}
                  onKeyUp={(e) => handleUpdateItem(e, product.id)}
                  onWheel={(e) => {
                    e.target.blur();
                    e.stopPropagation();
                    setTimeout(() => {
                      e.target.focus();
                    }, 0);
                  }}
                  onChange={onChangeInput}
                  className="w-11 text-center outline-none"
                  type="number"
                />
                <button
                  onClick={(e) => addQuantityBtn(e, product.id)}
                  className="p-0 mx-2 text-blue-500 hover:text-blue-400 bg-white text-2xl rounded-none"
                >
                  +
                </button>
              </div>
              <span className="text-gray-400 text-sm font-normal">
                {error
                  ? "Ingresa un numero valido"
                  : `${product.stock} Disponible`}
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

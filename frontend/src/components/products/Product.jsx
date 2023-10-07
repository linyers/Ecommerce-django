import { useEffect, useState, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-regular-svg-icons";
import { getOneProduct } from "../../utils/products.api";
import ModalStock from './ModalStock'

export default function Product({ slug }) {
  const [product, setProduct] = useState({});
  const [imageIdx, setImageIdx] = useState(null);
  
  useEffect(() => {
    const getProduct = async () => {
      const response = await getOneProduct(slug);
      const data = response.data;
      setProduct(data);
      setImageIdx(0);
    };
    getProduct();
  }, []);

  return (
    <main className="flex flex-row bg-white mx-16 my-10 p-5 ring-1 ring-gray-300 rounded-sm shadow-xl">
      <div className=" w-11/12">
        <div className="flex flex-row gap-5">
          <ul className="w-14 flex flex-col gap-2">
            {product.images?.map((img, i) => {
              return (
                <li
                  onMouseOver={() => setImageIdx(i)}
                  className={`${
                    imageIdx === i
                      ? "ring-2 ring-blue-500"
                      : "ring-1 ring-gray-400"
                  } rounded-md`}
                  key={i}
                >
                  <img className="rounded-md" src={img} alt="" />
                </li>
              );
            })}
          </ul>
          {product.images && (
            <img className="w-5/6" src={product.images[imageIdx]} alt="" />
          )}
        </div>
        <hr className="mx-12 my-10" />
        <div className="px-12">
          <h4 className="text-3xl text-gray-950 mb-5">Descripción</h4>
          <p className="text-xl text-gray-600">{product.description}</p>
        </div>
      </div>
      <div className="w-5/12 h-fit top-5 flex flex-col sticky ring-1 ring-gray-400 rounded-md p-5">
        {product.sold !== 0 && (
          <span className="text-gray-500 font-light text-sm">
            {product.sold} vendidos
          </span>
        )}
        <div className="flex items-baseline justify-between">
          <h1 className="text-2xl font-semibold mt-2 mb-5">{product.title}</h1>
          <a className="text-2xl cursor-pointer text-blue-500 hover:text-blue-500">
            <FontAwesomeIcon icon={faHeart} />
          </a>
        </div>
        <span className="text-3xl">$ {product.price}</span>
        <ModalStock stock={product.stock} />
        <form action="" className="flex flex-col gap-2 mt-10">
          <button className="py-3 bg-blue-500 text-white hover:bg-blue-600 transition-all duration-200 ease-in hover:border-0 border-0">
            Comprar ahora
          </button>
          <button className="py-3 bg-blue-100 text-blue-600 hover:bg-blue-200 transition-all duration-200 ease-in hover:border-0 border-0">
            Agregar al carrito
          </button>
        </form>
      </div>
    </main>
  );
}

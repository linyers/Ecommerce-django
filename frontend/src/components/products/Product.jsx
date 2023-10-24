import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import CartContext from "../../context/CartContext";
import AuthContext from "../../context/AuthContext";
import { getOneProduct } from "../../utils/products.api";
import ModalStock from "./ModalStock";
import WishlistHeart from "./WishlistHeart";
import ReviewsList from "../reviews/ReviewsList";
import CommentsList from "../comments/CommentsList";

export default function Product({ slug }) {
  const navigate = useNavigate();
  const [product, setProduct] = useState({});
  const [unity, setUnity] = useState(1);
  const [imageIdx, setImageIdx] = useState(null);
  const { user } = useContext(AuthContext);
  const { addItem } = useContext(CartContext);
  const beforePrice = Math.trunc(product.price / (1 - product.discount / 100));

  useEffect(() => {
    const getProduct = async () => {
      const response = await getOneProduct(slug);
      const data = response.data;
      setProduct(data);
      setImageIdx(0);
    };
    
    getProduct();
  }, []);

  const handlePurchaseNow = async (e, id, quantity) => {
    e.preventDefault();
    if (!user) {
      navigate("/login");
      return;
    }
    const body = {
      product_id: id,
      product_quantity: quantity,
    };
    await addItem(body);
    navigate("/buying/");
  };

  const handleAddItemCart = async (e, id, quantity) => {
    e.preventDefault();
    if (!user) {
      navigate("/login");
      return;
    }
    const body = {
      product_id: id,
      product_quantity: quantity,
    };
    await addItem(body);
  };

  return (
    <main className="flex flex-row bg-white mx-16 my-10 p-5 ring-1 ring-gray-300 rounded-sm shadow-xl">
      <div className="w-11/12">
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
            <img className="w-fit" src={product.images[imageIdx]} alt="" />
          )}
        </div>
        <hr className="mx-12 my-10" />
        <section className="px-12">
          <h4 className="text-3xl text-gray-950 mb-5">Descripción</h4>
          <p className="text-xl text-gray-600">{product.description}</p>
        </section>
        <hr className="mx-12 my-10" />
        <section className="px-12">
          <h4 className="text-3xl text-gray-950 mb-5">Comentarios</h4>
          <CommentsList product_id={product.id} />
        </section>
        <hr className="mx-12 my-10" />
        <section className="px-12">
          <h4 className="text-3xl text-gray-950 mb-5">Reseñas</h4>
          <ReviewsList product_id={product.id} product_rate={product.rating} />
        </section>
      </div>
      <div className="w-5/12 h-fit top-5 flex flex-col sticky ring-1 ring-gray-400 rounded-md p-5">
        {product.sold !== 0 && (
          <span className="text-gray-500 font-light text-sm">
            {product.sold} vendidos
          </span>
        )}
        <div className="flex items-baseline justify-between">
          <h1 className="text-2xl font-semibold mt-2 mb-5">{product.title}</h1>
          <WishlistHeart product_id={product.id} />
        </div>
        <span className="mb-5">
          Condición: {!product.used ? "Nuevo" : "Usado"}
        </span>
        {product.discount && (
          <div className="flex gap-10 items-center">
            <span className="line-through text-gray-500">
              <span className="text-gray-400 font-normal">$ {beforePrice}</span>
            </span>
            <span className="font-bold text-green-600 text-sm">
              {product.discount}% OFF
            </span>
          </div>
        )}
        <span className="text-3xl">$ {product.price}</span>
        <ModalStock stock={product.stock} unity={unity} setUnity={setUnity} />
        <form action="" className="flex flex-col gap-2 mt-10">
          <button
            onClick={(e) => handlePurchaseNow(e, product.id, unity)}
            className="py-3 bg-blue-500 text-white hover:bg-blue-600 transition-all duration-200 ease-in hover:border-0 border-0"
          >
            Comprar ahora
          </button>
          <button
            onClick={(e) => handleAddItemCart(e, product.id, unity)}
            className="py-3 bg-blue-100 text-blue-600 hover:bg-blue-200 transition-all duration-200 ease-in hover:border-0 border-0"
          >
            Agregar al carrito
          </button>
        </form>
      </div>
    </main>
  );
}

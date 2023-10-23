import { useState, useContext } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../../../context/AuthContext";
import SellUpdateModalForm from "./SellUpdateModalForm";
import { deleteProduct, putProduct } from "../../../utils/products.api";
import toast from "react-hot-toast";

export default function SellProductCard({ setChange, product }) {
  const { authTokens } = useContext(AuthContext);
  const [open, setOpen] = useState(false);

  const handleDeleteProduct = async (e, slug) => {
    e.preventDefault();
    const response = await deleteProduct(authTokens.access, slug);
    if (response.status !== 204) {
      toast.error("No se pudo eliminar el producto");
      return;
    }
    setChange(true);
    toast.success("Producto eliminado");
  };

  return (
    <li className="flex flex-col justify-center gap-1 border rounded bg-gray-100 shadow-md p-5 w-56">
      <div className="flex flex-col gap-1 h-2/3">
        <Link
          to={`/${product.slug}`}
          className="text-black hover:text-black/80 w-fit"
          title="producto"
        >
          <h2 className="text-xl font-bold">{product.title}</h2>
        </Link>
        <p className="autocomplete w-full text-sm text-gray-500">
          {product.description}
        </p>
        <span className="text-sm text-gray-700">En stock: {product.stock}</span>
        <span className="text-sm text-gray-700">Vendidos: {product.sold}</span>
      </div>
      <div className="flex flex-col gap-2 h-1/3">
        <button
          onClick={(e) => setOpen(true)}
          className="cursor-pointer p-1 px-2 bg-blue-200 text-blue-600 hover:bg-blue-300 transition-all duration-100 ease-in hover:border-0 border-0 text-sm"
        >
          Modificar
        </button>
        <button
          onClick={(e) => handleDeleteProduct(e, product.slug)}
          className="cursor-pointer p-1 px-2 bg-red-600 text-white hover:bg-red-500 transition-all duration-100 ease-in hover:border-0 border-0 text-sm"
        >
          Eliminar
        </button>
        {open && <SellUpdateModalForm setChange={setChange} setOpen={setOpen} product={product} />}
      </div>
    </li>
  );
}

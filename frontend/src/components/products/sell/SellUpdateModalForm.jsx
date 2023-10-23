import { useEffect, useState, useContext } from "react";
import AuthContext from "../../../context/AuthContext";
import { getCategories, putProduct } from "../../../utils/products.api";
import toast from "react-hot-toast";
import Loader from "../../parts/Loader";
import FormErrors from "../../auth/FormErrors";

export default function SellUpdateModalForm({ setChange, setOpen, product }) {
  const { authTokens } = useContext(AuthContext);
  const [categories, setCategories] = useState([]);
  const [title, setTitle] = useState(product.title);
  const [category, setCategory] = useState(product.category);
  const [price, setPrice] = useState(product.price);
  const [discount, setDiscount] = useState(product.discount);
  const [stock, setStock] = useState(product.stock);
  const [description, setDescription] = useState(product.description);
  const [used, setUsed] = useState(product.used);
  const [error, setError] = useState({});
  const [load, setLoad] = useState(false);

  useEffect(() => {
    const categoriesData = async () => {
      const response = await getCategories();
      setCategories(response.data);
    };
    categoriesData();
  }, []);

  const closeModal = () => {
    setOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!e.target.images.files || !e.target.images.files[0]) {
      return;
    }

    const uploaded_images = e.target.images.files;

    const body = new FormData();
    body.append("title", title);
    body.append("category", category);
    body.append("price", price);
    body.append("stock", stock);
    body.append("description", description);
    body.append("used", used);
    body.append("uploaded_images", uploaded_images[0]);
    // i cant upload more than one image, this is a bug that i will fix later.
    // this send a FileList Type to the backend, but i cant get the data from it
    // so i just send the first image of the list
    // when i send a multiple images from postman to backend, it works fine
    if (discount) {
      body.append("discount", discount);
    }

    setLoad(true);
    try {
      const response = await putProduct(authTokens.access, product.slug, body);
      toast.success("Producto modificado!");
      setOpen(false);
      setChange(true);
    } catch (error) {
      setError(error.response.data);
    }
    setLoad(false);
  };

  return (
    <div className="fixed flex items-center justify-center bg-gray-500/50 w-full h-full z-50 top-0 right-0 left-0">
      <div className="bg-gray-200 w-1/2 h-4/5 overflow-scroll rounded-md shadow-lg">
        <button
          onClick={closeModal}
          className="p-2 fixed text-base font-normal bg-gray-200 text-gray-800 hover:text-gray-600"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-5 p-4 mt-4 justify-center items-center"
        >
          <h4 className="text-2xl font-semibold text-gray-700">
            Modificar Producto
          </h4>
          <span className="font-bold text-lg text-red-700">Recuerda que al cambiar el titulo se cambiara la url del producto</span>
          <div className="flex gap-5">
            <input
              type="text"
              placeholder={title}
              className={`py-2 px-2 ring-1 outline-blue-500 ring-gray-500 rounded-sm ${
                error["title"] && "ring-2 ring-red-600 outline-red-600"
              }`}
              onChange={(e) => {
                setError({});
                setTitle(e.target.value);
              }}
            />
            <select
            value={category}
              className={`py-2 ring-1 outline-blue-500 ring-gray-500 rounded-sm ${
                error["category"] && "ring-2 ring-red-600 outline-red-600"
              }`}
              onChange={(e) => {
                setError({});
                setCategory(e.target.value);
              }}
            >
              {categories?.map((c, i) => {
                return (
                  <option key={i} value={c}>
                    {c}
                  </option>
                );
              })}
            </select>
          </div>
          <div className="flex gap-5">
            <input
              className={`py-2 px-2 ring-1 outline-blue-500 ring-gray-500 rounded-sm ${
                error["price"] && "ring-2 ring-red-600 outline-red-600"
              }`}
              type="number"
              placeholder={price}
              onChange={(e) => {
                setError({});
                setPrice(parseFloat(e.target.value));
              }}
            />
            <input
              className={`py-2 px-2 ring-1 outline-blue-500 ring-gray-500 rounded-sm ${
                error["discount"] && "ring-2 ring-red-600 outline-red-600"
              }`}
              type="number"
              placeholder={discount}
              onChange={(e) => {
                setError({});
                setDiscount(parseInt(e.target.value));
              }}
            />
          </div>
          <input
            className={`py-2 px-2 ring-1 outline-blue-500 ring-gray-500 rounded-sm ${
              error["stock"] && "ring-2 ring-red-600 outline-red-600"
            }`}
            type="number"
            placeholder={stock}
            onChange={(e) => {
              setError({});
              setStock(parseInt(e.target.value));
            }}
          />
          <textarea
            className={`py-2 px-2 w-full h-52 resize-none ring-1 outline-blue-500 ring-gray-500 rounded-sm ${
              error["description"] && "ring-2 ring-red-600 outline-red-600"
            }`}
            onChange={(e) => {
              setError({});
              setDescription(e.target.value);
            }}
          >{description}</textarea>
          <input
            className={`py-2 px-2 ring-1 outline-blue-500 ring-gray-500 rounded-sm ${
              error["uploaded_images"] && "ring-2 ring-red-600 outline-red-600"
            }`}
            name="images"
            multiple
            type="file"
            onChange={(e) => setError({})}
          />
          <input
            className={`py-2 px-2 ring-1 outline-blue-500 ring-gray-500 rounded-sm ${
              error["used"] && "ring-2 ring-red-600 outline-red-600"
            }`}
            type="checkbox"
            checked={used}
            name=""
            id=""
            onChange={(e) => {
              setError({});
              setUsed(e.target.value);
            }}
          />{" "}
          <span>Usado?</span>
          <button
            className="bg-gray-600 hover:bg-gray-500 focus:outline-gray-800 hover:cursor-pointer rounded-md p-3 text-white"
            type="submit"
          >
            {load ? <Loader /> : "Enviar"}
          </button>
        </form>
      </div>
    </div>
  );
}

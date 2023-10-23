import { useEffect, useState, useContext } from "react";
import AuthContext from "../../../context/AuthContext";
import { getCategories, postProduct } from "../../../utils/products.api";
import toast from "react-hot-toast";
import Loader from "../../parts/Loader";
import FormErrors from "../../auth/FormErrors";

export default function SellForm({ setOpen }) {
  const { authTokens } = useContext(AuthContext);
  const [categories, setCategories] = useState([]);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState();
  const [discount, setDiscount] = useState(null);
  const [stock, setStock] = useState();
  const [description, setDescription] = useState("");
  const [used, setUsed] = useState(false);
  const [error, setError] = useState({});
  const [load, setLoad] = useState(false);

  useEffect(() => {
    const categoriesData = async () => {
      const response = await getCategories();
      setCategories(response.data);
    };
    categoriesData();
  }, []);

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
      const response = await postProduct(authTokens.access, body);
      toast.success("Producto publicado!");
      setOpen(false);
    } catch (error) {
      setError(error.response.data);
    }
    setLoad(false);
  };

  return (
    <form
      className="flex flex-col gap-3 p-5 ring-1 bg-gray-100 shadow-md ring-gray-400 rounded-md justify-center items-center"
      onSubmit={handleSubmit}
    >
      <h4 className="text-2xl font-bold mb-5">Publicar producto</h4>
      <FormErrors errors={error} />
      <div className="flex gap-5">
        <input
          type="text"
          placeholder="Titulo"
          className={`py-2 px-2 ring-1 outline-blue-500 ring-gray-500 rounded-sm ${
            error["title"] && "ring-2 ring-red-600 outline-red-600"
          }`}
          onChange={(e) => {
            setError({});
            setTitle(e.target.value);
          }}
        />
        <select
          className={`py-2 ring-1 outline-blue-500 ring-gray-500 rounded-sm ${
            error["category"] && "ring-2 ring-red-600 outline-red-600"
          }`}
          onChange={(e) => {
            setError({});
            setCategory(e.target.value);
          }}
        >
          <option value={""}>
            Categoria
          </option>
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
          placeholder="Precio 00.00"
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
          placeholder="Descuento (opcional) 0%-100%"
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
        placeholder="Stock 00"
        onChange={(e) => {
          setError({});
          setStock(parseInt(e.target.value));
        }}
      />
      <textarea
        className={`py-2 px-2 w-full h-52 resize-none ring-1 outline-blue-500 ring-gray-500 rounded-sm ${
          error["description"] && "ring-2 ring-red-600 outline-red-600"
        }`}
        name="description"
        onChange={(e) => {
          setError({});
          setDescription(e.target.value);
        }}
      ></textarea>
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
        name=""
        id=""
        onChange={(e) => {
          setError({});
          setUsed(e.target.value);
        }}
      />{" "}
      <span>Usado?</span>
      <div className="flex gap-5">
        <button
          className="cursor-pointer disabled:cursor-default disabled:bg-blue-300 bg-blue-500 text-white hover:bg-blue-600 transition-all duration-100 ease-in hover:border-0 border-0"
          type="submit"
        >
          {!load ? "Publicar" : <Loader />}
        </button>
        <button
          className="cursor-pointer bg-blue-200 text-blue-500 hover:text-blue-400 transition-all duration-100 ease-in hover:border-0 border-0"
          onClick={(e) => setOpen(false)}
        >
          Volver
        </button>
      </div>
    </form>
  );
}

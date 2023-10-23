import { useEffect, useState, useContext } from "react";
import { getProducts } from "../../../utils/products.api";
import SellProductCard from "./SellProductCard";
import AuthContext from "../../../context/AuthContext";

export default function SellProductsList() {
  const { user } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [change, setChange] = useState(false);

  useEffect(() => {
    const getProductsAuthor = async () => {
      const query = `author=${user.user_id}`;
      const response = await getProducts(query);
      const data = response.data.results;
      setProducts(data);
    };
    setChange(false);
    getProductsAuthor();
  }, [change]);

  return (
    <>
      <h3 className="text-2xl font-bold">
        {products.length > 0
          ? "Productos publicados"
          : "Todavia no tienes productos publicados"}
      </h3>
      <ul className="flex flex-wrap gap-5 justify-center">
        {products?.map((p, i) => {
          return <SellProductCard setChange={setChange} product={p} />;
        })}
      </ul>
    </>
  );
}

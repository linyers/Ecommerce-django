import { useEffect, useState } from "react";
import { getProducts } from "../../utils/products.api";
import Product from "./Product";

export default function ListProducts({ search, params }) {
  const [products, setProducts] = useState([]);
  const [count, setCount] = useState(0);
  const [page, setPage] = useState({});

  useEffect(() => {
    const loadProducts = async () => {
      const data = await getProducts(params);
      setProducts(data.data.results);
      setCount(data.data.count);
    };
    loadProducts();
  }, [params]);

  return (
    <main className="flex flex-row justify-center">
      <div className="py-10 px-16 w-1/6">
        <h2 className="text-4xl font-semibold text-gray-700">{search}</h2>
        <span>{count} resultados</span>
      </div>
      <div className="py-10 px-16 w-5/6">
        {products?.map((p, i) => {
          return (
            <>
              <Product key={i} p={p} />
              <hr />
            </>
          );
        })}
      </div>
    </main>
  );
}

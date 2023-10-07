import { useEffect, useState } from "react";
import { getProducts } from "../../utils/products.api";
import ProductCard from "./ProductCard";
import FilterProducts from "./FilterProducts";

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
      <div className="py-10 pl-12 w-1/6">
        <h2 className="text-2xl font-semibold text-gray-700">{search}</h2>
        <span className="text-sm text-gray-600">{count} resultados</span>
        <FilterProducts title={search} />
      </div>
      <div className="py-10 pr-16 pl-10 w-5/6">
        {products?.map((p, i) => {
          return <ProductCard key={i} p={p} />;
        })}
      </div>
    </main>
  );
}

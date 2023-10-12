import { useEffect, useState } from "react";
import { getProducts } from "../../utils/products.api";
import PaginationFooter from "./PaginationFooter";
import ProductCard from "./ProductCard";
import FilterProducts from "./FilterProducts";

export default function ListProducts({ search, query, actualPage }) {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState({});

  useEffect(() => {
    const loadProducts = async () => {
      const data = await getProducts(query);
      setProducts(data.data.results);
      setPage({
        actual: actualPage,
        next: data.data.next,
        previous: data.data.previous,
        last_page: data.data.total_pages,
        count: data.data.count,
      });
    };
    loadProducts();
  }, [query]);

  return (
    <main className="flex flex-col justify-center items-center">
      <section className="flex flex-row justify-center">
        <div className="py-10 pl-12 w-1/6">
          <h2 className="text-2xl font-semibold text-gray-700">{search}</h2>
          <span className="text-sm text-gray-600">{page.count} resultados</span>
          <FilterProducts title={search} />
        </div>
        <div className="py-10 pr-16 pl-10 w-5/6">
          {products?.map((p, i) => {
            return <ProductCard key={i} p={p} />;
          })}
        </div>
      </section>
      <section className=" mb-8">
        <PaginationFooter page={page} />
      </section>
    </main>
  );
}

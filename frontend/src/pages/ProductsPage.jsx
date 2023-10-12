import { useSearchParams, useParams, Navigate } from "react-router-dom";
import ListProducts from "../components/products/ListProducts";
import Product from "../components/products/Product";

export default function ProductsPage() {
  const params = useParams();
  const [searchParams] = useSearchParams();
  const filters = ["discount", "price", "category"];

  const search = searchParams.get("q");
  const actualPage = searchParams.get("page");

  const query = [
    `p=${actualPage !== null ? parseInt(actualPage) : 1}`,
    `title=${search}`,
    ...filters.map((f) => {
      return searchParams.get(f) && `${f}=${searchParams.get(f)}`;
    }),
  ]
    .filter((f) => f !== null)
    .join("&");

  return (
    <>
      {params.slug ? (
        <Product slug={params.slug} />
      ) : search ? (
        <ListProducts
          search={search}
          query={query}
          actualPage={actualPage !== null ? parseInt(actualPage) : 1}
        />
      ) : (
        <Navigate to="/" />
      )}
    </>
  );
}

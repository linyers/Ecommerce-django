import { useSearchParams, useParams, Navigate } from "react-router-dom";
import ListProducts from "../components/products/ListProducts";
import Product from "../components/products/Product";

export default function ProductsPage() {
  const params = useParams();
  const [searchParams] = useSearchParams();

  const search = searchParams.get("q");
  const title = `title__contains=${search}`;

  return (
    <>
      {params.slug ? (
        <Product slug={params.slug} />
      ) : search ? (
        <ListProducts search={search} params={title} />
      ) : (
        <Navigate to="/" />
      )}
    </>
  );
}

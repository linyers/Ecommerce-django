import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getProductsFilters } from "../../utils/products.api";

export default function FilterProducts({ title }) {
  const [discounts, setDiscounts] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const getFilters = async () => {
      const response = await getProductsFilters(title);
      setDiscounts(response.data.discounts);
      setCategories(response.data.categories);
    };
    getFilters();
  }, [title]);
  return (
    <>
      <ul className="mt-10">
        <li className="text-lg font-semibold text-gray-700 mb-1">Descuento</li>
        {discounts.map((d, i) => {
          return (
            <li key={i}>
              <Link
                className="text-sm font-medium text-gray-500 hover:text-gray-600"
                to={`/s?q=${title}&discount=${[d]}`}
              >
                Desde {d}% OFF
              </Link>
            </li>
          );
        })}
      </ul>
      <ul className="mt-10">
        <li className="text-lg font-semibold text-gray-700 mb-1">Categoria</li>
        {categories.map((c, i) => {
          return (
            <li key={i}>
              <Link
                className="text-sm font-medium text-gray-500 hover:text-gray-600"
                to={`/s?q=${title}&category=${[c]}`}
              >
                {c}
              </Link>
            </li>
          );
        })}
      </ul>
    </>
  );
}

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getProductsFilters } from "../../utils/products.api";

export default function FilterProducts({ title }) {
  const [discounts, setDiscounts] = useState([]);
  const [prices, setPrices] = useState([]);

  useEffect(() => {
    const getFilters = async () => {
      const response = await getProductsFilters(title);
      setDiscounts(response.data.discounts);
    };
    getFilters();
  }, [title]);
  return (
    <>
      <ul className="mt-10">
        <li className="text-lg font-semibold text-gray-700 mb-1">Precio</li>
        <li>
          <Link
            className="text-sm font-medium text-gray-500 hover:text-gray-600"
            to={`/s?q=${title}&price__range=${[0, 60000]}`}
          >
            Hasta $60.000
          </Link>
        </li>
        <li>
          <Link
            className="text-sm font-medium text-gray-500 hover:text-gray-600"
            to={`/s?q=${title}&price__range=${[60000, 80000]}`}
          >
            $60.000 a $80.000
          </Link>
        </li>
        <li>
          <Link
            className="text-sm font-medium text-gray-500 hover:text-gray-600"
            to={`/s?q=${title}&price__range=${[60000, 80000]}`}
          >
            $80.000
          </Link>
        </li>
        <li className="mt-2">
          <form className="flex gap-1" method="get">
            <input className="w-16 rounded-sm" type="text" name="price1" />
            -
            <input className="w-16 rounded-sm" type="text" name="price2" />
            <input
              type="submit"
              className="bg-gray-300 text-gray-400 rounded-full px-1.5"
              value=">"
            />
          </form>
        </li>
      </ul>
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
    </>
  );
}

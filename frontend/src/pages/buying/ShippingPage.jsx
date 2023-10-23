import { useContext, useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import AddressContext from "../../context/AddressContext";
import CartContext from "../../context/CartContext";
import OrdersContext from "../../context/OrdersContext";

export default function ShippingPage({ setBody }) {
  const navigate = useNavigate();
  const { cart } = useContext(CartContext);
  const { addressesData } = useContext(AddressContext);
  const [ship, setShip] = useState("costumer_address"); // Only 3 states, costumer_address, seller_address, no_shipping
  const [address, setAddress] = useState({});

  useEffect(() => {
    const getAddressesData = async () => {
      const response = await addressesData();
      const data = response.data;
      if (!data) {
        return;
      }
      const element = data.filter((element) => element.default);
      if (element.length > 0) {
        setAddress(element[0]);
      } else setAddress(data[0]);
    };
    getAddressesData();
  }, []);

  const handleOrder = async (e) => {
    e.preventDefault();
    if (ship === "delivery_point") {
      navigate("/shipping/delivery-point");
      return;
    }
    const purchases = [];
    cart.cart.forEach((c) => {
      purchases.push({ product: c.product.id, quantity: c.count });
    });

    let end_shipping = new Date();
    end_shipping.setDate(end_shipping.getDate() + 7);

    const shipping =
      ship !== "seller_address"
        ? {
            end_shipping,
            price: 1616,
          }
        : null;

    setBody({
      purchases,
      shipping,
      to_address_upload: ship === "costumer_address" ? address.id : null,
      from_address_upload: ship === "delivery_point" ? 13 : null,
      with_shipping: ship === "costumer_address" || ship === "delivery_point",
    });
  };

  return (
    <main className="bg-gray-600 flex flex-row gap-5 px-8 pr-16 p-10">
      <div className="w-full gap-8 bg-white rounded-md flex flex-col p-8">
        <h3 className="font-semibold text-2xl text-gray-950 ">
          Elige el punto de entrega
        </h3>
        <div
          className="flex flex-col gap-2"
          onChange={(e) => setShip(e.target.value)}
        >
          <span className="font-semibold">Recibir compra</span>
          {address ? (
            <>
              <label
                htmlFor="costumer_address"
                className="p-5 border-2 rounded-t-lg flex items-baseline gap-2 hover:bg-gray-100 hover:border-blue-300 cursor-pointer"
              >
                <input
                  type="radio"
                  checked={ship === "costumer_address"}
                  value="costumer_address"
                  id="costumer_address"
                />
                <div className="">
                  <h4 className="font-semibold text-xl text-gray-900">
                    Enviar a domicilio
                  </h4>
                  <span className="font-semibold">Llega en 7 dias</span>
                  <p>
                    {address.street_address},{" "}
                    {address.appartment_address &&
                      `Piso ${address.appartment_address}, `}{" "}
                    {address.city}, {address.country}, CP: {address.zip}.
                  </p>
                </div>
              </label>
              <Link
                className="px-5 w-fit text-black hover:text-blue-500"
                to={"/user-dashboard"}
              >
                Edita tus direcciones.
              </Link>
            </>
          ) : (
            <Link
              to={"/user-dashboard"}
              className="p-5 border-2 rounded-lg flex items-baseline gap-2 hover:bg-gray-100 hover:border-blue-300 cursor-pointer"
            >
              <span className="text-xl font-bold text-gray-900">
                No tienes direcciones, ve y edita tu perfil.
              </span>
            </Link>
          )}

          <span className="font-semibold mt-5">Retirar compra</span>
          <label
            htmlFor="delivery point"
            className="p-5 border-2 rounded-lg flex items-baseline gap-2 hover:bg-gray-100 hover:border-blue-300 cursor-pointer"
          >
            <input
              type="radio"
              checked={ship === "delivery_point"}
              value="delivery_point"
              id="delivery point"
            />
            <h4 className="font-semibold text-xl text-gray-900">
              Retirar en punto de entrega
            </h4>
          </label>
          {!cart?.cart.some(
            (c) => c.product.author !== cart.cart[0].product.author
          ) && (
            // if all products in cart are from the same author, then show this option
            // retire from seller address
            <label
              htmlFor="seller_address"
              className="p-5 border-2 rounded-lg flex items-baseline gap-2 hover:bg-gray-100 hover:border-blue-300 cursor-pointer"
            >
              <input
                type="radio"
                checked={ship === "seller_address"}
                value="seller_address"
                id="seller_address"
              />
              <h4 className="font-semibold text-xl text-gray-900">
                Retirar en domicilio del vendedor
              </h4>
            </label>
          )}
          <button
            onClick={handleOrder}
            className="mt-5 bg-blue-500 text-white hover:bg-blue-400 hover:text-white duration-200 transition-all"
          >
            Continuar
          </button>
        </div>
      </div>
    </main>
  );
}

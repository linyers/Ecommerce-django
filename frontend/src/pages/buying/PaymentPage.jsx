import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Elements,
  CardNumberElement,
  CardCvcElement,
  CardExpiryElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CartContext from "../../context/CartContext";
import OrdersContext from "../../context/OrdersContext";
import Loader from "../../components/parts/Loader";
import toast from "react-hot-toast";

const stripePromise = loadStripe(
  "pk_test_51O2eQPIi9hmdhtNeOSgDTegVXQbXiosh8vKqId0hJbv1Jbaour9OUPhzKgX9sePuQfs4D27iscvdgHx0yqPCe44500o2imwiPF"
);

const CheckoutForm = ({ amount }) => {
  const { createOrder } = useContext(OrdersContext);
  const { empityCart } = useContext(CartContext);
  const [load, setLoad] = useState(false);
  const [name, setName] = useState("");
  const [dni, setDni] = useState("");
  const navigate = useNavigate();
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoad(true);

    const body = JSON.parse(localStorage.getItem("orderBody"));
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: elements.getElement(CardNumberElement),
    });

    if (error || name === "" || dni === "") {
      setLoad(false);
      return;
    }

    const response = await createOrder({ ...body, payment: { amount } });
    if (response.status === 201) {
      await empityCart();
      toast.success("Compra realizada con exito");
      navigate("/my-purchases");
    } else {
      toast.error("Error al hacer la compra");
    }
    elements.getElement(CardNumberElement).clear();
    setLoad(false);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div>
        <label className="text-gray-400 text-sm">Numero de tarjeta</label>
        <CardNumberElement
          className="py-2 px-3 ring-1 outline-none ring-gray-500 rounded-sm"
          options={{
            showIcon: true,
          }}
        />
      </div>
      <div className="flex flex-col">
        <label className="text-gray-400 text-sm">Nombre</label>
        <input
          onChange={(e) => setName(e.target.value)}
          className="py-2 px-3 ring-1 outline-none ring-gray-500 rounded-sm"
          type="text"
        />
      </div>
      <div className="flex flex-row gap-5 w-full">
        <div className="w-full">
          <label className="text-gray-400 text-sm">Fecha de expiracion</label>
          <CardExpiryElement className="py-2 px-3 ring-1 outline-none ring-gray-500 rounded-sm" />
        </div>
        <div className="w-full">
          <label className="text-gray-400 text-sm">CVC</label>
          <CardCvcElement className="py-2 px-3 ring-1 outline-none ring-gray-500 rounded-sm" />
        </div>
      </div>
      <div className="flex flex-col">
        <label className="text-gray-400 text-sm">DNI del titular</label>
        <input
          onChange={(e) => setDni(e.target.value)}
          className="py-2 px-3 ring-1 outline-none ring-gray-500 rounded-sm"
          type="number"
        />
      </div>
      <button
        type="submit"
        className="bg-blue-500 text-white hover:bg-blue-400 hover:text-white duration-200 transition-all"
      >
        {load ? <Loader /> : "Comprar"}
      </button>
    </form>
  );
};

export default function PaymentPage() {
  const { cart } = useContext(CartContext);

  return (
    <main className="bg-gray-600 flex flex-row justify-center gap-5 p-8">
      <div className="w-1/3 bg-white rounded-md flex flex-col p-8">
        <Elements stripe={stripePromise}>
          <CheckoutForm amount={cart.total_price + 1616} />
        </Elements>
      </div>
      <div className="w-1/4 h-fit bg-white rounded-md flex flex-col py-4">
        <div className="bg-transparent w-full rounded-md">
          <h3 className="text-gray-900 py-3 px-8 text-xl font-semibold">
            Resumen de compra
          </h3>
          <hr />
          {cart && (
            <ul>
              <li className="px-8 py-3 flex text-sm justify-between">
                <span>Productos ({cart.total_items})</span>
                <span>$ {cart.total_price}</span>
              </li>
              <li className="px-8 pb-3 flex text-sm justify-between">
                <span>Envio</span>
                <span>$ 1616</span>
              </li>
              <hr />
              <li className="px-8 py-3 text-xl font-semibold flex justify-between">
                <span>Total</span>
                <span>$ {cart.total_price + 1616}</span>
              </li>
            </ul>
          )}
        </div>
      </div>
    </main>
  );
}

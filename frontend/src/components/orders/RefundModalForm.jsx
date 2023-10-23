import { useState, useContext } from "react";
import OrdersContext from "../../context/OrdersContext";
import Loader from "../parts/Loader";
import toast from "react-hot-toast";

export default function RefundModalForm({ setOpen, setChange, order }) {
  const [load, setLoad] = useState(false);
  const { createRefundOrder } = useContext(OrdersContext);

  const closeModal = () => {
    setOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoad(true);

    const response = await createRefundOrder(e.target.reason.value, order);
    if (response.status !== 201) {
      setLoad(false);
      setOpen(false);
      toast.error("No se pudo enviar la solicitud de rembolso");
      return;
    }
    toast.success("La solicitud de rembolso se envio exitosamente");
    setChange(true);
    setLoad(false);
    setOpen(false);
  };

  return (
    <div className="fixed flex items-center justify-center bg-gray-500/50 w-full h-full z-50 top-0 right-0 left-0">
      <div className="bg-gray-200 w-1/2 overflow-scroll rounded-md shadow-lg">
        <button
          onClick={closeModal}
          className="p-2 fixed text-base font-normal bg-gray-200 text-gray-800 hover:text-gray-600"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-5 p-4 mt-4 justify-center items-center"
        >
          <h4 className="text-2xl font-semibold text-gray-700">Solicitar Rembolso</h4>
          <textarea
            className="py-2 px-2 ring-1 w-2/3 h-52 resize-none outline-blue-500 ring-gray-500 rounded-sm"
            id="reason"
            placeholder="Razon del rembolso"
          ></textarea>
          <button
            className="bg-gray-600 hover:bg-gray-500 focus:outline-gray-800 hover:cursor-pointer rounded-md p-3 text-white"
            type="submit"
          >
            {load ? <Loader /> : "Enviar"}
          </button>
        </form>
      </div>
    </div>
  );
}

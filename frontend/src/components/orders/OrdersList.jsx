import { useEffect, useContext, useState } from "react";
import OrdersContext from "../../context/OrdersContext";
import RefundModalForm from "./RefundModalForm";
import PurchaseCard from "./PurchaseCard";
import moment from "moment";
import toast from "react-hot-toast";

const OrderStatusSpan = ({ status, differenceDays }) => {
  const statusDict = {
    on_the_way:
      differenceDays > 0 ? `Llega en ${differenceDays} Días` : "Llega hoy",
    delivered: "Entregado",
    pending_refund: "Rembolso pendiente",
    refund_not_accepted: "Rembolso no aceptado",
    refunded: "Rembolsado",
  };
  const statusColor = {
    on_the_way: differenceDays < 0 && "text-green-600",
    delivered: "text-green-600",
    pending_refund: "text-yellow-600",
    refund_not_accepted: "text-red-600",
    refunded: "text-green-600",
  };
  return (
    <span className={`text-sm font-semibold ${statusColor[status]}`}>
      {statusDict[status]}
    </span>
  );
};

export default function OrdersList() {
  const [orders, setOrders] = useState([]);
  const [open, setOpen] = useState(false);
  const [orderRefund, setOrderRefund] = useState(null);
  const [change, setChange] = useState(false);
  const { ordersData, updateOrder } = useContext(OrdersContext);

  useEffect(() => {
    const getOrdersData = async () => {
      const response = await ordersData();
      setOrders(response.data);
      setChange(false);
    };
    getOrdersData();
  }, [change]);

  const handleConfirmDelivered = async (e, id) => {
    const response = await updateOrder(id, "delivered");
    if (response.status !== 200) {
      toast.error("No se pudo confirmar la entrega");
      return;
    }
    setChange(!change);
  };

  return (
    <section className="mt-10">
      {orders?.map((o) => {
        const endShippingDate = new Date(o.shipping.end_shipping);
        const differenceDays = parseInt(
          (endShippingDate - new Date()) / (1000 * 60 * 60 * 24)
        );
        return (
          <article
            className="mb-10 ring-1 flex flex-col ring-gray-400 rounded-md bg-white shadow-md"
            key={o.id}
          >
            <div className="flex justify-between items-center py-3 px-8">
              <span className="text-sm font-semibold">
                {moment(o.start_date).format("LL")}
              </span>
              <OrderStatusSpan
                status={o.order_status}
                differenceDays={differenceDays}
              />
            </div>
            <hr />
            <PurchaseCard purchases={o.purchases} />
            <hr />
            <div className="px-8 py-3 flex flex-row justify-between">
              <button
                disabled={
                  o.order_status !== "on_the_way" || differenceDays > 0
                }
                onClick={(e) => handleConfirmDelivered(e, o.id)}
                className="cursor-pointer disabled:cursor-default disabled:bg-blue-300 p-1 px-2 bg-blue-500 text-white hover:bg-blue-600 transition-all duration-200 ease-in hover:border-0 border-0 text-sm"
              >
                Confirmar entrega
              </button>
              <button
                onClick={(e) => {
                  setOpen(true);
                  setOrderRefund(o.id);
                }}
                disabled={
                  o.order_status === "pending_refund" ||
                  o.order_status === "refund"
                }
                className="disabled:cursor-default disabled:bg-blue-50 disabled:text-blue-300 cursor-pointer p-1 px-2 bg-blue-100 text-blue-600 hover:bg-blue-200 transition-all duration-200 ease-in hover:border-0 border-0 text-sm"
              >
                Pedir rembolso
              </button>
              {open && o.id === orderRefund && (
                <RefundModalForm
                  setOpen={setOpen}
                  setChange={setChange}
                  order={orderRefund}
                />
              )}
            </div>
          </article>
        );
      })}
    </section>
  );
}

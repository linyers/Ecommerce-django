import { useEffect, useContext, useState } from "react";
import OrdersContext from "../../context/OrdersContext";
import PurchaseCard from "./PurchaseCard";
import moment from 'moment'

export default function OrdersList() {
  const [orders, setOrders] = useState([]);
  const { ordersData } = useContext(OrdersContext);

  useEffect(() => {
    const getOrdersData = async () => {
      const response = await ordersData();
      setOrders(response.data);
    };
    getOrdersData();
  }, []);
  return (
    <section className="mt-10">
      {orders?.map((o) => {
        return (
          <article
            className="mb-10 ring-1 flex flex-col ring-gray-400 rounded-md bg-white shadow-md"
            key={o.id}
          >
            <div className="flex justify-between py-4 px-10">
              <span className="text-sm font-semibold">{moment(o.start_date).format('LL')}</span>
              <span className="text-sm text-green-600 font-bold">
                {o.order_status}
              </span>
            </div>
            <hr />
            <PurchaseCard purchases={o.purchases} />
          </article>
        );
      })}
    </section>
  );
}

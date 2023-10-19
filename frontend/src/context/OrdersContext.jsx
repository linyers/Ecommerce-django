import { createContext } from "react";
import {
  getOrders,
  postOrders,
  putOrders,
} from "../utils/orders.api";

const OrdersContext = createContext();

export default OrdersContext;

export function OrdersProvider({ children }) {
  const authTokens = JSON.parse(localStorage.getItem("authTokens"));

  const ordersData = async () => {
    const response = await getOrders(authTokens.access);
    return response;
  };

  const createOrder = async (body) => {
   
    try {
      const response = await postOrders(authTokens.access, body);
      return response;
    } catch (error) {
      return error.response;
    }
  };

  const updateOrder = async (body) => {
    try {
      const response = await putOrders(authTokens.access, body);
      setChange(true);
      return response;
    } catch (error) {
      return error.response;
    }
  };

  const contextData = {
    ordersData,
    createOrder,
    updateOrder,
  };

  return (
    <OrdersContext.Provider value={contextData}>{children}</OrdersContext.Provider>
  );
}

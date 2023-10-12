import { createContext, useContext, useState, useEffect } from "react";
import AuthContext from "./AuthContext";
import {
  getItems,
  postItem,
  putItem,
  deleteItem,
  deleteCart,
} from "../utils/cart.api";
import toast from "react-hot-toast";

const CartContext = createContext();

export default CartContext;

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    localStorage.getItem("cart") ? localStorage.getItem("cart") : null;
  });
  const [change, setChange] = useState(false);
  const { authTokens } = useContext(AuthContext);

  useEffect(() => {
    console.log(cart);
    setChange(false);
    cartItems()
  }, [change]);

  const cartItems = async () => {
    const response = await getItems(authTokens.access);
    localStorage.setItem("cart", response.data);
    setCart(response.data);
    return response;
  };

  const addItem = async (body) => {
    try {
      const response = await postItem(authTokens.access, body);
      toast.success("Producto añadido al carrito");
      setChange(true);
      return response;
    } catch (error) {
      toast.error("Este producto ya esta en el carrito");
      return error.response;
    }
  };

  const updateItem = async (body) => {
    try {
      const response = await putItem(authTokens.access, body);
      setChange(true);
      return response;
    } catch (error) {
      return error.response;
    }
  };

  const removeItem = async (body) => {
    try {
      const response = await deleteItem(authTokens.access, body);
      toast.success("Producto eliminado del carrito");
      setChange(true);
      return response;
    } catch (error) {
      return error.response;
    }
  };

  const empityCart = async () => {
    try {
      const response = await deleteCart(authTokens.access);
      toast.success("Carrito vacio");
      setChange(true);
      return response;
    } catch (error) {
      return error.response;
    }
  };

  const contextData = {
    cart,
    cartItems,
    addItem,
    updateItem,
    removeItem,
    empityCart,
  };

  return (
    <CartContext.Provider value={contextData}>{children}</CartContext.Provider>
  );
}

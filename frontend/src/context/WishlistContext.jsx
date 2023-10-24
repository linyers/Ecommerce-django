import { createContext, useState, useEffect } from "react";
import {
  getItems,
  postItem,
  deleteItem,
} from "../utils/wishlist.api";
import toast from "react-hot-toast";

const WishlistContext = createContext();

export default WishlistContext;

export function WishlistProvider({ children }) {
  const [wishlist, setWishlist] = useState(() => {
    localStorage.getItem("wishlist") ? JSON.parse(localStorage.getItem("wishlist")) : null;
  });
  const [change, setChange] = useState(false);
  const authTokens = JSON.parse(localStorage.getItem("authTokens"));
  
  useEffect(() => {
    setChange(false);
    wishlistItems()
  }, [change]);

  const wishlistItems = async () => {
    const response = await getItems(authTokens.access);
    localStorage.setItem("wishlist", JSON.stringify(response.data));
    setWishlist(response.data);
    return response;
  };

  const addWishItem = async (body) => {
    try {
      const response = await postItem(authTokens.access, body);
      toast.success("Producto añadido a la lista de deseados");
      setChange(true);
      return response;
    } catch (error) {
      toast.error("Este producto ya esta en la lista de deseados");
      return error.response;
    }
  };

  const removeWishItem = async (body) => {
    try {
      const response = await deleteItem(authTokens.access, body);
      toast.success("Producto eliminado de la lista de deseados");
      setChange(true);
      return response;
    } catch (error) {
      return error.response;
    }
  };

  const contextData = {
    wishlist,
    getItems,
    addWishItem,
    removeWishItem,
  };

  return (
    <WishlistContext.Provider value={contextData}>{children}</WishlistContext.Provider>
  );
}

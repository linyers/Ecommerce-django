import { useEffect, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-regular-svg-icons";
import { faHeart as faHeartSolid } from "@fortawesome/free-solid-svg-icons";
import WishlistContext from "../../context/WishlistContext";
import AuthContext from "../../context/AuthContext";

export default function WishlistHeart({ product_id }) {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext)
  const { wishlist, addWishItem, removeWishItem } = useContext(WishlistContext);
  const [inWishlist, setInWishlist] = useState(false);

  useEffect(() => {
    const getWishlistItem = async () => {
      if (wishlist) {
        const item = wishlist.wishlist.find(
          (item) => item.product.id === product_id
        );
        if (item) {
          setInWishlist(true);
        }
        return;
      }
    };
    if (wishlist) {
      getWishlistItem();
    }
  }, [wishlist]);

  const handleAddWishlistItem = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate("/login");
      return;
    }
    const body = {
      product_id: product_id,
    };

    if (inWishlist) {
      await removeWishItem(body);
      setInWishlist(false);
      return;
    }
    await addWishItem(body);
    setInWishlist(true);
  };

  return (
    <>
      <a
        onClick={handleAddWishlistItem}
        className="text-2xl cursor-pointer text-blue-500 hover:text-blue-500"
      >
        {inWishlist ? (
          <FontAwesomeIcon icon={faHeartSolid} />
        ) : (
          <FontAwesomeIcon icon={faHeart} />
        )}
      </a>
    </>
  );
}

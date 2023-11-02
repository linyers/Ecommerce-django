import { useContext } from "react";
import AuthContext from "../../context/AuthContext";
import { deleteReview } from "../../utils/reviews.api";
import toast from "react-hot-toast";

export default function DeleteReviewButton({ id, setChange }) {
  const { authTokens } = useContext(AuthContext);

  const handleDeleteReview = async (e) => {
    e.preventDefault();
    const body = {
      id,
    };
    try {
      const response = await deleteReview(authTokens.access, body);
      toast.success("Reseña borrada!");
      setChange(true);
    } catch (error) {
      toast.error("Hubo un problema al eliminar la reseña");
    }
  };

  return (
    <a
      onClick={handleDeleteReview}
      className="text-gray-500 cursor-pointer hover:text-red-600"
    >
      Borrar
    </a>
  );
}

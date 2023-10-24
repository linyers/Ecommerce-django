import { useEffect, useState, useContext } from "react";
import { getReviews } from "../../utils/reviews.api";
import Review from "./Review";
import ReviewModalForm from "./ReviewModalForm";
import AuthContext from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Stars from "./Stars";

export default function ReviewsList({ product_id, product_rate }) {
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([]);
  const [open, setOpen] = useState(false);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const loadReviews = async () => {
      const body = {
        product_id,
      };
      const response = await getReviews(body);
      setReviews(response.data);
    };
    loadReviews();
  }, [product_id, open]);

  const handleOpenModal = (e) => {
    e.preventDefault();
    if (!user) {
      navigate("/login");
      return;
    }
    setOpen(true);
  };

  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-2 mb-10">
        <h4 className="text-6xl font-bold text-blue-600">{product_rate}</h4>
        <div>
        <Stars textSize="text-2xl" stars={product_rate} />
        <span className="text-gray-500 text-sm">{reviews.length} calificaciones</span>
        </div>
      </div>
      {reviews.length > 0 ? (
        <ul>
          {reviews.map((review, i) => (
            <Review key={i} review={review} />
          ))}
        </ul>
      ) : (
        <span className="font-bold text-lg mb-5">
          No hay reseñas para este producto
        </span>
      )}
      <button
        className="bg-blue-500 w-fit text-white hover:bg-blue-600 transition-all duration-200 ease-in hover:border-0 border-0"
        onClick={handleOpenModal}
      >
        Escribe una reseña
      </button>
      {open && <ReviewModalForm setOpen={setOpen} product={product_id} />}
    </div>
  );
}

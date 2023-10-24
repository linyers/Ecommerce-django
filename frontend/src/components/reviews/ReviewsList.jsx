import { useEffect, useState, useContext } from "react";
import { getReviews } from "../../utils/reviews.api";
import Review from "./Review";
import ReviewModalForm from "./ReviewModalForm";
import AuthContext from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function ReviewsList({ product_id }) {
  const navigate = useNavigate()
  const [reviews, setReviews] = useState([]);
  const [open, setOpen] = useState(false)
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
    e.preventDefault()
    if (!user) {
      navigate('/login')
      return
    }
    setOpen(true)
  }

  return (
    <div>
      {reviews.length > 0 ? (
        <ul>
          {reviews.map((review, i) => (
            <Review key={i} review={review} />
          ))}
        </ul>
      ) : (
        <span className="font-bold text-lg">
          No hay reseñas para este producto
        </span>
      )}
      <button onClick={handleOpenModal}>Escribe una reseña</button>
      {open && <ReviewModalForm setOpen={setOpen} product={product_id} /> }
    </div>
  );
}

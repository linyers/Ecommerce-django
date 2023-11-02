import { useContext, useState } from "react";
import Like from "./Like";
import Dislike from "./Dislike";
import AuthContext from "../../context/AuthContext";
import moment from "moment";
import Stars from "./Stars";
import UpdateReviewForm from "./UpdateReviewForm";
import DeleteReviewButton from "./DeleteReviewButton";

export default function Review({ review, setChange }) {
  const { user } = useContext(AuthContext);
  const [updateForm, setUpdateForm] = useState(false);
  const [disliked, setDisliked] = useState(
    review.dislikes.includes(user.user_id)
  );
  const [liked, setLiked] = useState(review.likes.includes(user.user_id));

  return (
    <li className="flex flex-col mb-10 justify-center">
      <div className="flex justify-between items-baseline">
        <Stars textSize="text-xs" stars={review.rate} />
        <span className="text-xs text-gray-500">
          {moment(review.created_at).fromNow()}
        </span>
      </div>
      <div className="flex my-4 justify-between">
        {updateForm ? (
          <UpdateReviewForm r={review} setUpdateForm={setUpdateForm} setChange={setChange} />
        ) : (
          <p>{review.body}</p>
        )}
        {review.author === user.username && !updateForm && (
          <div className="flex flex-col items-end">
            <a
              onClick={(e) => setUpdateForm(!updateForm)}
              className="text-gray-500 cursor-pointer hover:text-blue-400"
            >
              Editar
            </a>
            <DeleteReviewButton id={review.id} setChange={setChange} />
          </div>
        )}
      </div>
      <div className="flex gap-2 items-center justify-start">
        <span>
          {
            <Like
              liked={liked}
              setLiked={setLiked}
              setDisliked={setDisliked}
              id={review.id}
            />
          }
        </span>
        <span>
          {
            <Dislike
              disliked={disliked}
              setLiked={setLiked}
              setDisliked={setDisliked}
              id={review.id}
            />
          }
        </span>
      </div>
    </li>
  );
}

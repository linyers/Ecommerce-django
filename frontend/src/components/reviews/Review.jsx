import { useContext, useState } from "react";
import Like from "./Like";
import Dislike from "./Dislike";
import AuthContext from "../../context/AuthContext";
import moment from "moment";
import Stars from "./Stars";

export default function Review({ review }) {
  const { user } = useContext(AuthContext);
  const [disliked, setDisliked] = useState(
    review.dislikes.includes(user.user_id)
  );
  const [liked, setLiked] = useState(review.likes.includes(user.user_id));

  return (
    <li className="flex flex-col mb-10">
      <span className="flex justify-between items-center">
        <Stars textSize="text-xs" stars={review.rate} />
        <span className="text-xs text-gray-500">{moment(review.created_at).fromNow()}</span>
      </span>
      <p className="mb-2">{review.body}</p>
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

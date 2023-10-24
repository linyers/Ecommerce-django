import { useContext, useState } from "react";
import Like from "./Like";
import Dislike from "./Dislike";
import AuthContext from "../../context/AuthContext";
import moment from "moment";

export default function Review({ review }) {
  const { user } = useContext(AuthContext)
  const [disliked, setDisliked] = useState(review.dislikes.includes(user.user_id))
  const [liked, setLiked] = useState(review.likes.includes(user.user_id))

  return (
    <li>
      <span>{review.author}</span>
      <p>{review.body}</p>
      <span>{review.rate}</span>
      <span>{moment(review.created_at).fromNow()}</span>
      <span>{<Like liked={liked} setLiked={setLiked} setDisliked={setDisliked} id={review.id} />}</span>
      <span>{<Dislike disliked={disliked} setLiked={setLiked} setDisliked={setDisliked} id={review.id} />}</span>
    </li>
  );
}

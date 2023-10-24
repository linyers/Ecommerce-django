import { useState, useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsDown } from "@fortawesome/free-regular-svg-icons";
import { faThumbsDown as faThumbsDownSolid } from "@fortawesome/free-solid-svg-icons";
import { postDislike } from "../../utils/reviews.api";
import AuthContext from "../../context/AuthContext";

export default function Disike({ disliked, setLiked, setDisliked, id }) {
  const { authTokens } = useContext(AuthContext);

  const handleDislike = async (e) => {
    e.preventDefault();
    const body = {
      review_id: id
    }
    const response = await postDislike(authTokens.access, body)
    if (response.data.message === 'Dislike added') {
      setDisliked(true)
      setLiked(false)
      return
    }
    setDisliked(false)
  }

  return (
    <>
      <a onClick={handleDislike} className="text-blue-600 hover:text-blue-500">
        {disliked ? (
          <FontAwesomeIcon icon={faThumbsDownSolid} />
        ) : (
          <FontAwesomeIcon icon={faThumbsDown} />
        )}
      </a>
    </>
  );
}

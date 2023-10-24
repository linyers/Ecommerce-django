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
      <a onClick={handleDislike} className={`p-1 px-3 rounded-3xl  transition-all duration-200 ease-in ${disliked ? 'bg-blue-600 border-0 text-white hover:text-blue-600 hover:bg-white' : 'border-2 text-gray-500 hover:text-blue-500'}`}>
        {disliked ? (
          <FontAwesomeIcon icon={faThumbsDownSolid} />
        ) : (
          <FontAwesomeIcon icon={faThumbsDown} />
        )}
      </a>
    </>
  );
}

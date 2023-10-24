import { useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsUp } from "@fortawesome/free-regular-svg-icons";
import { faThumbsUp as faThumbsUpSolid } from "@fortawesome/free-solid-svg-icons";
import AuthContext from "../../context/AuthContext";
import { postLike } from '../../utils/reviews.api'

export default function Like({ liked, setLiked, setDisliked, id }) {
  const { authTokens } = useContext(AuthContext);

  const handleLike = async (e) => {
    e.preventDefault();
    const body = {
      review_id: id
    }
    const response = await postLike(authTokens.access, body)
    console.log(response.data.message)
    if (response.data.message === 'Like added') {
      console.log('first')
      setLiked(true)
      setDisliked(false)
      return
    }
    setLiked(false)
  }
  
  return (
    <>
      <a onClick={handleLike} className="text-blue-600 hover:text-blue-500">
        {liked ? (
          <FontAwesomeIcon icon={faThumbsUpSolid} />
        ) : (
          <FontAwesomeIcon icon={faThumbsUp} />
        )}
      </a>
    </>
  );
}

import { useContext, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-regular-svg-icons";
import { faStar as faStarSolid } from "@fortawesome/free-solid-svg-icons";
import { putReview } from '../../utils/reviews.api'
import AuthContext from "../../context/AuthContext";
import toast from "react-hot-toast";

export default function UpdateReviewForm({r, setUpdateForm, setChange}) {
  const { authTokens } = useContext(AuthContext);
  const [star, setStar] = useState(r.rate);
  const [review, setReview] = useState(r.body);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const body = {
      id: r.id,
      body: review,
      rate: star,
    };

    try {
      const response = await putReview(authTokens.access, body);
      toast.success('Reseña modificada!')
      setChange(true)
    } catch (error) {
      const response = error.response
      console.log(response)
      toast.error('Hubo un error al modificar la reseña.')
    }
    
    setUpdateForm(false);
  } 

  return (
    <>
      <form onSubmit={handleSubmit} className="w-full pr-10">
        <textarea
          type="text"
          cols="30"
          onChange={(e) => setReview(e.target.value)}
          rows="1"
          defaultValue={r.body}
          className="py-2 px-2 w-full resize-none border-b-2 outline-none focus:border-blue-500 border-gray-30 rounded-sm"
        />
        <div className="flex gap-1">
          {Array(5)
            .fill()
            .map((_, s) => (
              <label htmlFor={`star ${s + 1}`} key={s}>
                <input
                  onChange={(e) => setStar(s + 1)}
                  id={`star ${s + 1}`}
                  type="radio"
                  name="rating"
                  value={s + 1}
                  className="hidden"
                />
                {star === s + 1 ? (
                  <FontAwesomeIcon
                    className="text-blue-600 text-xl"
                    icon={faStarSolid}
                  />
                ) : (
                  <FontAwesomeIcon
                    className="text-gray-400 text-xl"
                    icon={faStar}
                  />
                )}
              </label>
            ))}
        </div>
      </form>
      <div className="flex flex-col items-end">
        <a
          onClick={handleSubmit}
          className="text-gray-500 cursor-pointer hover:text-blue-500"
        >
          Editar
        </a>
        <a
          onClick={(e) => setUpdateForm(false)}
          className="text-gray-500 cursor-pointer hover:text-gray-400"
        >
          Cancelar
        </a>
      </div>
    </>
  );
}

import { useContext, useEffect, useState } from "react";
import AuthContext from "../../context/AuthContext";
import { getComments } from "../../utils/comments.api";
import Comment from "./Comment";
import CommentModalForm from "./CommentModalForm";

export default function CommentsList({ product_id }) {
  const { user } = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const [parent, setParent] = useState(null);
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const loadComments = async () => {
      const body = {
        product_id,
      };
      const response = await getComments(body);
      setComments(response.data);
      console.log(response.data);
    };
    loadComments();
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
    <div>
      {comments.length > 0 ? (
        <ul>
          {comments.map(
            (comment, i) =>
              !comment.parent && (
                <li>
                  <Comment
                    key={i}
                    comment={comment}
                    setParent={setParent}
                    handleOpenModal={handleOpenModal}
                  />
                </li>
              )
          )}
        </ul>
      ) : (
        <span className="font-bold text-lg">
          No hay comentarios en este producto
        </span>
      )}
      <button onClick={handleOpenModal}>Comentar</button>
      {open && (
        <CommentModalForm
          setOpen={setOpen}
          product={product_id}
          parent={parent}
        />
      )}
    </div>
  );
}

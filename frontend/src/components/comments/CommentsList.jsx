import { useContext, useEffect, useState } from "react";
import AuthContext from "../../context/AuthContext";
import { getComments } from "../../utils/comments.api";
import Comment from "./Comment";
import CommentForm from "./CommentForm";

export default function CommentsList({ product_id }) {
  const { user } = useContext(AuthContext);
  const [open, setOpen] = useState(null); // null = closed, comment.id = open
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const loadComments = async () => {
      const body = {
        product_id,
      };
      const response = await getComments(body);
      setComments(response.data);
    };
    loadComments();
    if (open === 0) {
      setOpen(null);
    }
  }, [product_id, open]);

  const handleOpenForm = (e, id = 0) => {
    e.preventDefault();
    setOpen(id);
  };

  return (
    <div>
      <section>
        <CommentForm handleOpenForm={handleOpenForm} product={product_id} />
      </section>
      {comments.length > 0 ? (
        <ul>
          {comments.map(
            (comment, i) =>
              !comment.parent && (
                <Comment
                  key={i}
                  comment={comment}
                  open={open}
                  handleOpenForm={handleOpenForm}
                />
              )
          )}
        </ul>
      ) : (
        <span className="font-bold text-lg">
          No hay comentarios en este producto
        </span>
      )}
    </div>
  );
}

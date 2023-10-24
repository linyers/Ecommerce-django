import moment from "moment";
import React, { useContext, useState } from "react";
import CommentForm from "./CommentForm";
import AuthContext from "../../context/AuthContext";
import { deleteComment } from "../../utils/comments.api";
import toast from "react-hot-toast";

export default function Comment({
  comment,
  nested = false,
  open,
  handleOpenForm,
}) {
  const { user, authTokens } = useContext(AuthContext);
  const [edit, setEdit] = useState(null) // null = new comment, comment = edit comment

  const handleDeleteComment = async (e, id) => {
    e.preventDefault();
    try {
      const response = await deleteComment(authTokens.access, id);
    } catch (error) {
      toast.error(error.response.data.error);
    }
    handleOpenForm(e);
  };

  return (
    <li key={comment.id} className="flex flex-col ">
      <span className="">
        <span className="font-semibold mr-2">@{comment.author}</span>
        <span className="text-xs text-gray-500">
          {moment(comment.created_at).fromNow()}
        </span>
      </span>
      <p className="text-sm">
        {comment.parent && (
          <span className="text-gray-600 font-semibold">
            @{comment.parent_username}{" "}
          </span>
        )}
        {comment.comment}
      </p>
      {open !== comment.id ? (
        <div className="flex justify-end w-44">
          {user && user.username === comment.author && (
            <>
              <a
                className="my-1 w-fit text-black hover:text-white hover:bg-red-600/80 p-2 rounded-3xl text-xs font-semibold cursor-pointer"
                onClick={(e) => {
                  handleDeleteComment(e, comment.id);
                }}
              >
                borrar
              </a>
              <a
                className="my-1 w-fit text-black hover:text-white hover:bg-blue-600/80 p-2 rounded-3xl text-xs font-semibold cursor-pointer"
                onClick={(e) => {
                  setEdit(comment);
                  handleOpenForm(e, comment.id);
                }}
              >
                editar
              </a>
            </>
          )}
          <a
            className="my-1 w-fit text-black hover:text-black hover:bg-gray-300/50 p-2 rounded-3xl text-xs font-semibold cursor-pointer"
            onClick={(e) => {
              handleOpenForm(e, comment.id);
            }}
          >
            contestar
          </a>
        </div>
      ) : (
        <CommentForm
          handleOpenForm={handleOpenForm}
          product={comment.product}
          edit={edit}
          setEdit={setEdit}
          parent={comment.id}
        />
      )}
      {comment.replies && comment.replies.length > 0 && (
        <ul className={`${!comment.parent && "ml-5"}`}>
          {comment.replies.map((reply, i) => (
            <Comment
              key={i}
              comment={reply}
              open={open}
              handleOpenForm={handleOpenForm}
              nested
            />
          ))}
        </ul>
      )}
    </li>
  );
}

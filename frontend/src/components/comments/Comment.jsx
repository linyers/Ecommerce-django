import moment from "moment";
import React from "react";

export default function Comment({
  comment,
  nested = false,
  setParent,
  handleOpenModal,
}) {
  return (
    <>
      <span>{comment.author}</span>
      <p>
        {comment.parent && <span>@{comment.parent_username} </span>}{comment.comment}
      </p>
      <span>{moment(comment.created_at).fromNow()}</span>
      <a
        onClick={(e) => {
          setParent(comment.id);
          return handleOpenModal(e);
        }}
      >
        contestar
      </a>
      {comment.replies && comment.replies.length > 0 && (
        <ul className={`${!comment.parent && "ml-5"}`}>
          {comment.replies.map((reply, i) => (
            <li>
              <Comment
                key={i}
                comment={reply}
                setParent={setParent}
                handleOpenModal={handleOpenModal}
                nested
              />
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

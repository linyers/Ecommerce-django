import { useState, useContext, useRef } from "react";
import Loader from "../parts/Loader";
import { postComment, putComment } from "../../utils/comments.api";
import AuthContext from "../../context/AuthContext";
import toast from "react-hot-toast";

export default function CommentForm({
  handleOpenForm,
  edit,
  setEdit,
  product,
  parent = null,
}) {
  const { authTokens } = useContext(AuthContext);
  const textAreaRef = useRef();
  const [comment, setComment] = useState(edit ? edit.comment : "");
  const [load, setLoad] = useState(false);

  const handleCreate = async (e) => {
    e.preventDefault();
    const body = {
      comment,
      product,
      parent,
    };

    setLoad(true);
    try {
      const response = await postComment(authTokens.access, body);
      toast.success("Comentario publicado!");
    } catch (error) {
      const response = error.response;
      toast.error(response.data.error[0]);
    }
    setLoad(false);
    textAreaRef.current.value = "";
    setComment("");
    handleOpenForm(e, 0);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const body = {
      comment,
      product: edit.product,
      parent: edit.parent,
    };
    setLoad(true);
    try {
      const response = await putComment(
        authTokens.access,
        body,
        edit.id
      );
      toast.success("Comentario editado!");
    } catch (error) {
      const response = error.response;
      toast.error(response.data.error[0]);
    }
    setLoad(false);
    textAreaRef.current.value = "";
    setComment("");
    setEdit(null);
    handleOpenForm(e, 0);
  }

  return (
    <form
      onSubmit={edit ? handleUpdate : handleCreate}
      className="flex flex-col gap-5 mt-4 justify-center items-center"
    >
      <textarea
        id=""
        cols="30"
        rows="1"
        ref={textAreaRef}
        onChange={(e) => setComment(e.target.value)}
        defaultValue={edit ? edit.comment : ""}
        placeholder={edit ? "Edita tu comentario" : "Comenta algo..."}
        className="py-2 px-2 w-full resize-none border-b-2 outline-none focus:border-blue-500 border-gray-30 rounded-sm"
      ></textarea>
      <div className="flex gap-2 justify-end w-full">
        <button
          disabled={load || comment === "" || comment === edit?.comment}
          className="disabled:bg-gray-400 disabled:cursor-default bg-gray-600 hover:bg-gray-500 focus:outline-gray-800 hover:cursor-pointer rounded-md px-2 h-10 text-sm text-white"
          type="submit"
        >
          {load ? <Loader /> : edit ? "Editar" : "Comentar"}
        </button>
        <button
          onClick={(e) => {
            e.preventDefault();
            if (edit) {
              setEdit(null);
            }
            if (parent) {
              handleOpenForm(e);
              return;
            }
            textAreaRef.current.value = "";
            setComment("");
          }}
          className="disabled:bg-gray-400 disabled:cursor-default bg-gray-600 hover:bg-gray-500 focus:outline-gray-800 hover:cursor-pointer rounded-md px-2 h-10 text-sm text-white"
          type="submit"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}

import { useState, useContext } from "react";
import Loader from "../parts/Loader";
import {postComment } from '../../utils/comments.api'
import AuthContext from '../../context/AuthContext'
import toast from "react-hot-toast";

export default function CommentModalForm({ setOpen, product, parent=null }) {
  const { authTokens } = useContext(AuthContext);
  const [comment, setComment] = useState("");
  const [load, setLoad] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const body = {
      comment,
      product,
      parent
    };

    setLoad(true);
    try {
      const response = await postComment(authTokens.access, body);
      toast.success('Comentario publicado!')
    } catch (error) {
      const response = error.response
      toast.error(response.data.error[0])
    }
    setLoad(false);
    setOpen(false); 
  };

  return (
    <div className="fixed flex items-center justify-center bg-gray-500/20 w-full h-full z-50 top-0 right-0 left-0">
      <div className="bg-gray-200 w-1/2 overflow-scroll rounded-md shadow-lg">
        <button
          onClick={(e) => setOpen(false)}
          className="p-2 fixed text-base font-normal bg-gray-200 text-gray-800 hover:text-gray-600"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-5 p-4 mt-4 justify-center items-center"
        >
          <h4 className="text-2xl font-semibold text-gray-700 mt-5">
            Publicar Comentario
          </h4>
          <textarea
            name=""
            id=""
            cols="30"
            rows="10"
            onChange={(e) => setComment(e.target.value)}
            className="py-2 px-2 w-full h-52 resize-none ring-1 outline-blue-500 ring-gray-500 rounded-sm"
          ></textarea>
          <button
            disabled={load || comment === ""}
            className="disabled:bg-gray-400 disabled:cursor-default bg-gray-600 hover:bg-gray-500 focus:outline-gray-800 hover:cursor-pointer rounded-md p-3 text-white"
            type="submit"
          >
            {load ? <Loader /> : "Enviar"}
          </button>
        </form>
      </div>
    </div>
  );
}
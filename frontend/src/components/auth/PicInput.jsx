import { useState, useContext } from "react";
import AuthContext from "../../context/AuthContext";
import toast from 'react-hot-toast'
import Loader from "../parts/Loader";

export default function PicInput() {
  const { pic, setPic, updateUser } = useContext(AuthContext)
  const [load, setLoad] = useState(false);
  const [error, setError] = useState(false);

  const uploadUserImage = async (e) => {
    if (e.target.files && e.target.files[0]) {
      const image = e.target.files[0];
      const body = {
        pic: image,
      };
      setError(false);
      setLoad(true);
      const response = await updateUser(body);
      if (response.status === 200) {
        setPic(URL.createObjectURL(image));
        toast.success('Imagen de perfil actualizada!')
      } else {
        setError(true);
        toast.error('Sube una imagen valida.')
      }
      setLoad(false);
    }
  };

  return (
    <>
      {load ? (
        <span className="p-7"><Loader /></span>
      ) : (
        <label htmlFor="input-profile-pic" className="cursor-pointer">
          <img
            className={`object-cover ${
              error && "ring-2 ring-red-600"
            } w-20 h-20 rounded-full`}
            src={pic}
            alt=""
          />
        </label>
      )}
      <input
        type="file"
        onChange={uploadUserImage}
        id="input-profile-pic"
        className="hidden"
      />
    </>
  );
}

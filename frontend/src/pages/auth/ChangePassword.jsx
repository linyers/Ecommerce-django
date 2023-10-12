import { useState, useContext } from "react";
import { useParams } from "react-router-dom";
import Loader from "../../components/parts/Loader";
import AuthContext from "../../context/AuthContext";
import FormErrors from "../../components/auth/FormErrors";

function ChangePassword() {
  const params = useParams();
  const { changePassword } = useContext(AuthContext);
  const [newPassword, setNewPassword] = useState("");
  const [repeatNewPassword, setRepeatNewPassword] = useState("");
  const [error, setError] = useState({});
  const [load, setLoad] = useState(false);

  const handleSubmit = async (e) => {
    setLoad(true);
    const err = await changePassword(
      e,
      newPassword,
      repeatNewPassword,
      params.uid,
      params.token
    );
    setError(err);
    setLoad(false);
  };

  return (
    <div className="bg-gray-600 flex justify-center p-20">
      <div className="flex flex-col w-1/3 gap-5 shadow-md rounded-md bg-white p-8">
        <h2 className="text-5xl text-center">Cambiar Contraseña</h2>
        <form className="flex flex-col gap-5 mt-5" onSubmit={handleSubmit}>
          <FormErrors errors={error} />
          <input
            className={`py-2 px-3 ring-1 outline-blue-500 ring-gray-500 rounded-sm ${
              error["new_password"] && "ring-2 ring-red-600 outline-red-600"
            }`}
            type="password"
            name="newPassword"
            placeholder="Enter new password"
            onChange={(e) => {
              setNewPassword(e.target.value);
              setError({});
            }}
          />
          <input
            className={`py-2 px-3 ring-1 outline-blue-500 ring-gray-500 rounded-sm ${
              error["repeat_new_password"] &&
              "ring-2 ring-red-600 outline-red-600"
            }`}
            type="password"
            name="repeatNewPassword"
            placeholder="Repeat new password"
            onChange={(e) => {
              setRepeatNewPassword(e.target.value);
              setError({});
            }}
          />

          <button
            className="bg-gray-600 hover:bg-gray-500 disabled:cursor-default disabled:bg-gray-500/50 focus:outline-gray-800 hover:cursor-pointer rounded-md p-3 text-white"
            disabled={
              newPassword !== repeatNewPassword || newPassword.length < 8
            }
            type="submit"
          >
            {load ? <Loader /> : "Enviar"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ChangePassword;

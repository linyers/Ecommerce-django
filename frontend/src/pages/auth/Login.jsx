import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import FormErrors from "../../components/parts/FormErrors";
import Loader from "../../components/parts/Loader";
import AuthContext from "../../context/AuthContext";

function LoginPage() {
  let { loginUser } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState({});
  const [load, setLoad] = useState(false);
  const isValidEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;

  const handleSubmit = async (e) => {
    setLoad(true);
    const err = await loginUser(e, email, password);
    setError(err);
    setLoad(false);
  };

  return (
    <div className="bg-gray-600 flex justify-center p-20">
      <div className="flex flex-col w-1/3 gap-5 shadow-md rounded-md bg-white p-8">
        <h2 className="text-5xl text-center">Login</h2>
        <p className="text-lg text-center">
          No tienes una{" "}
          <Link
            className="font-normal text-gray-500 hover:text-gray-700"
            to="/register"
          >
            cuenta
          </Link>
          ?
        </p>
        <form className="flex flex-col gap-5 mt-5" onSubmit={handleSubmit}>
          <FormErrors errors={error} />
          <input
            className={`py-2 px-3 ring-1 outline-blue-500 ring-gray-500 rounded-sm ${
              error["email"] && "ring-2 ring-red-600 outline-red-600"
            }`}
            type="email"
            name="email"
            placeholder="Enter email address"
            onChange={(e) => {
              setEmail(e.target.value);
              setError({});
            }}
          />
          <input
            className={`py-2 px-3 ring-1 outline-blue-500 ring-gray-500 rounded-sm ${
              error["password"] && "ring-2 ring-red-600 outline-red-600"
            }`}
            type="password"
            name="password"
            placeholder="Enter password"
            onChange={(e) => {
              setPassword(e.target.value);
              setError({});
            }}
          />

          <button
            className="bg-gray-600 hover:bg-gray-500 disabled:cursor-default disabled:bg-gray-500/50 focus:outline-gray-800 hover:cursor-pointer rounded-md p-3 text-white"
            disabled={!isValidEmail.test(email) || password.length < 8}
            type="submit"
          >
            {load ? <Loader /> : "Enviar"}
          </button>
        </form>
        <p className="text-base">
          Te olvidaste la{" "}
          <Link
            className="font-normal text-gray-500 hover:text-gray-700"
            to="/change-password"
          >
            contraseña
          </Link>
          ?
        </p>
      </div>
    </div>
  );
}

export default LoginPage;

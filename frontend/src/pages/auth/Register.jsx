import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import Loader from "../../components/parts/Loader";
import FormErrors from "../../components/auth/FormErrors";
import AuthContext from "../../context/AuthContext";

function Register() {
  const { registerUser } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [load, setLoad] = useState(false);
  const [error, setError] = useState({});
  const isValidEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;

  const handleSubmit = async (e) => {
    setLoad(true);
    const err = await registerUser(
      e,
      email,
      username,
      password,
      repeatPassword
    );
    setLoad(false);
    setError(err);
    notify();
  };

  return (
    <div className="bg-gray-600 flex justify-center p-20">
      <div className="flex flex-col w-1/3 gap-5 shadow-md rounded-md bg-white p-8">
        <h2 className="text-5xl text-center">Register</h2>
        <p className="text-lg text-center">
          Ya tienes una{" "}
          <Link
            className="font-normal text-gray-500 hover:text-gray-700"
            to="/login"
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
              if (Object.keys(error).length !== 0) {
                setError({});
              }
            }}
          />
          <input
            className={`py-2 px-3 ring-1 outline-blue-500 ring-gray-500 rounded-sm ${
              error["username"] && "ring-2 ring-red-600 outline-red-600"
            }`}
            type="text"
            name="username"
            placeholder="Enter username"
            onChange={(e) => {
              setUsername(e.target.value);
              if (Object.keys(error).length !== 0) {
                setError({});
              }
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
              if (Object.keys(error).length !== 0) {
                setError({});
              }
            }}
          />
          <input
            className={`py-2 px-3 ring-1 outline-blue-500 ring-gray-500 rounded-sm ${
              error["repeat_password"] && "ring-2 ring-red-600 outline-red-600"
            }`}
            type="password"
            name="repeatPassword"
            placeholder="Repeat the password"
            onChange={(e) => {
              setRepeatPassword(e.target.value);
              if (Object.keys(error).length !== 0) {
                setError({});
              }
            }}
          />
          <button
            className="bg-gray-600 hover:bg-gray-500 disabled:cursor-default disabled:bg-gray-500/50 focus:outline-gray-800 hover:cursor-pointer rounded-md p-3 text-white"
            disabled={
              !isValidEmail.test(email) ||
              password.length < 8 ||
              password !== repeatPassword ||
              username.length < 3
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

export default Register;

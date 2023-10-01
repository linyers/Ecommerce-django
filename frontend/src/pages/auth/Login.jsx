import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import FormErrors from "../../components/parts/FormErrors";
import AuthContext from "../../context/AuthContext";

function LoginPage() {
  let { loginUser } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState({});

  return (
    <div className="bg-gray-700 flex justify-center p-20">
      <div className="flex flex-col w-1/3 gap-5 shadow-md rounded-md bg-white p-8">
        <h2 className="text-5xl text-center">Login</h2>
        <p className="text-lg text-center">
          No tienes una <Link className="font-normal text-black hover:text-gray-700" to="/register">cuenta</Link>?
        </p>
        <form
          className="flex flex-col gap-8 mt-5"
          onSubmit={async (e) => {
            const err = await loginUser(e, email, password);
            setError(err);
          }}
        >
          {Object.keys(error).length !== 0 && (
            <ul>
              {Object.keys(error).map((field, i) => {
                return (
                  <FormErrors field={field} error={error[field]} key={i} />
                );
              })}
            </ul>
          )}
          <input
            className={`py-2 px-3 ring-1 ring-gray-500 rounded-sm ${
              error["email"] || error["detail"] ? "ring-2 ring-red-600" : null
            }`}
            type="email"
            name="email"
            placeholder="Enter email address"
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
          <input
            className={`py-2 px-3 ring-1 ring-gray-500 rounded-sm ${
              error["password"] || error["detail"]
                ? "ring-2 ring-red-600"
                : null
            }`}
            type="password"
            name="password"
            placeholder="Enter password"
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
          <input className="bg-gray-600 hover:bg-gray-500 hover:cursor-pointer text-gray-950 rounded-md p-3" type="submit" />
        </form>
        <p className="text-base">
          Te olvidaste la <Link className="font-normal text-black hover:text-gray-700" to="/change-password">contraseña</Link>?
        </p>
      </div>
    </div>
  );
}

export default LoginPage;

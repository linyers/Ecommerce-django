import { useContext, useState } from "react";
import Loader from "../../components/parts/Loader";
import FormErrors from "../../components/parts/FormErrors";
import AuthContext from "../../context/AuthContext";

function Register() {
  const { registerUser } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [load, setLoad] = useState(false);
  const [error, setError] = useState({});

  return (
    <div>
      <form
        onSubmit={async (e) => {
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
          console.log(error);
        }}
      >
        {Object.keys(error).length !== 0 ? (
          <ul>
            {Object.keys(error).map((field, i) => {
              return <FormErrors field={field} error={error[field]} key={i} />;
            })}
          </ul>
        ) : null}
        <input
          className={`${error["email"] ? "ring-2 ring-red-600" : null}`}
          type="email"
          name="email"
          placeholder="Enter email address"
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        />
        <input
          className={`${error["username"] ? "ring-2 ring-red-600" : null}`}
          type="text"
          name="username"
          placeholder="Enter username"
          onChange={(e) => {
            setUsername(e.target.value);
          }}
        />
        <input
          className={`${error["password"] ? "ring-2 ring-red-600" : null}`}
          type="password"
          name="password"
          placeholder="Enter password"
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        />
        <input
          className={`${
            error["repeat_password"] ? "ring-2 ring-red-600" : null
          }`}
          type="password"
          name="repeatPassword"
          placeholder="Repeat the password"
          onChange={(e) => {
            setRepeatPassword(e.target.value);
          }}
        />
        <input type="submit" />
      </form>

      {load ? <Loader /> : null}
    </div>
  );
}

export default Register;

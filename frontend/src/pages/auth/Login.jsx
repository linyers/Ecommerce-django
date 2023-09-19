import { useContext, useState } from "react";
import FormErrors from "../../components/parts/FormErrors";
import AuthContext from "../../context/AuthContext";

function LoginPage() {
  let { loginUser } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState({});

  return (
    <div>
      <form
        onSubmit={async (e) => {
          const err = await loginUser(e, email, password);
          setError(err);
        }}
      >
        {Object.keys(error).length !== 0 && (
          <ul>
            {Object.keys(error).map((field, i) => {
              return <FormErrors field={field} error={error[field]} key={i} />;
            })}
          </ul>
        )}
        <input
          className={`${error["email"] || error["detail"] ? "ring-2 ring-red-600" : null}`}
          type="email"
          name="email"
          placeholder="Enter email address"
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        />
        <input
          className={`${error["password"] || error["detail"] ? "ring-2 ring-red-600" : null}`}
          type="password"
          name="password"
          placeholder="Enter password"
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        />
        <input type="submit" />
      </form>
    </div>
  );
}

export default LoginPage;

import { useContext, useState } from "react";
import AuthContext from "../../context/AuthContext";

function LoginPage() {
  let { loginUser } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div>
      <form
        onSubmit={(e) => {
          loginUser(e, email, password);
        }}
      >
        <input
          type="email"
          name="email"
          placeholder="Enter email address"
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        />
        <input
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

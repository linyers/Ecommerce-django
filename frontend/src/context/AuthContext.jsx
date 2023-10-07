import { createContext, useState, useEffect } from "react";
import jwtDecode from "jwt-decode";
import { useNavigate } from "react-router-dom";
import {
  postSignup,
  postLogin,
  postRefreshToken,
  getActivateAcount,
  postChangePasswordEmail,
  postChangePassword,
} from "../utils/auth.api";

const AuthContext = createContext();

export default AuthContext;

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() =>
    localStorage.getItem("authTokens")
      ? jwtDecode(localStorage.getItem("authTokens"))
      : null
  );
  const [authTokens, setAuthTokens] = useState(() =>
    localStorage.getItem("authTokens")
      ? JSON.parse(localStorage.getItem("authTokens"))
      : null
  );
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    if (loading) {
      updateToken();
    }

    const REFRESH_INTERVAL = 1000 * 60 * 4;
    let interval = setInterval(() => {
      if (authTokens) {
        updateToken();
      }
    }, REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, [authTokens, loading]);

  const registerUser = async (e, email, username, password, repeatPassword) => {
    e.preventDefault();
    try {
      const response = await postSignup({
        email,
        username,
        password,
        repeat_password: repeatPassword,
      });
    } catch (err) {
      return err.response.data;
    }

    navigate("/");
  };

  const loginUser = async (e, email, password) => {
    e.preventDefault();
    try {
      const response = await postLogin({
        email: email,
        password: password,
      });

      const data = await response.data;

      if (data) {
        localStorage.setItem("authTokens", JSON.stringify(data));
        setAuthTokens(data);
        setUser(jwtDecode(data.access));
        navigate("/");
      } else {
        alert("Something went wrong while logging in the user!");
      }
    } catch (err) {
      return err.response.data;
    }
  };

  const logoutUser = (e) => {
    e.preventDefault();
    localStorage.removeItem("authTokens");
    setAuthTokens(null);
    setUser(null);
    navigate("/");
  };

  const updateToken = async () => {
    const response = await postRefreshToken({ refresh: authTokens?.refresh });

    const data = await response.data;

    if (response.status === 200) {
      setAuthTokens(data);
      setUser(jwtDecode(data.access));
      localStorage.setItem("authTokens", JSON.stringify(data));
    } else {
      logoutUser();
    }

    if (loading) {
      setLoading(false);
    }
  };

  const activateUser = async (uid, token) => {
    try {
      const response = await getActivateAcount(uid, token);
      return response.status;
    } catch (err) {
      return err.response.status;
    }
  };

  const changePasswordEmail = async (e, email) => {
    e.preventDefault();
    try {
      const response = await postChangePasswordEmail({
        email,
      });
    } catch (err) {
      return err.response.data;
    }
    navigate("/");
  }

  const changePassword = async (e, newPassword, repeatNewPassword, uid, token) => {
    e.preventDefault();
    try {
      const response = await postChangePassword(uid, token, {
        new_password: newPassword,
        repeat_new_password: repeatNewPassword,
      })
    } catch (err) {
      if (err.response.status === 404) {
        const redirectHome = setTimeout(() => {
          navigate("/")
        }, 2000);
        
        return {Error: 'Link invalido, Redireccionando al home'}
      }
      return err.response.data;
    }
    navigate("/login");
  }

  const contextData = {
    user,
    authTokens,
    loginUser,
    logoutUser,
    registerUser,
    activateUser,
    changePasswordEmail,
    changePassword,
  };

  return (
    <AuthContext.Provider value={contextData}>{children}</AuthContext.Provider>
  );
}

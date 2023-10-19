import { createContext, useState, useEffect, useContext } from "react";
import jwtDecode from "jwt-decode";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  postSignup,
  postLogin,
  postRefreshToken,
  getActivateAcount,
  postChangePasswordEmail,
  postChangePassword,
  getUser,
  putUser,
} from "../utils/auth.api";
import CartContext from './CartContext'

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
  const [pic, setPic] = useState(user?.pic ? `http://127.0.0.1:8000/media/${user.pic}` : "/user.png");

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
  }, [authTokens, loading, pic]);

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
    toast.success(
      "Registrado Correctamente!. Chequea tu email para activarlo.",
      {
        duration: 6000,
      }
    );
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
        toast.error(
          "Algo salio mal al ingresar, intentalo nuevamente.",
        );
      }
    } catch (err) {
      return err.response.data;
    }
  };

  const logoutUser = (e) => {
    e.preventDefault();
    localStorage.removeItem("authTokens");
    localStorage.removeItem("cart")
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
    toast.success(
      "Chequea tu email para poder cambiar tu contraseña!.",
      {
        duration: 6000,
      }
    );
    navigate("/");
  };

  const changePassword = async (
    e,
    newPassword,
    repeatNewPassword,
    uid,
    token
  ) => {
    e.preventDefault();
    try {
      const response = await postChangePassword(uid, token, {
        new_password: newPassword,
        repeat_new_password: repeatNewPassword,
      });
    } catch (err) {
      if (err.response.status === 404) {
        const redirectHome = setTimeout(() => {
          navigate("/");
        }, 2000);

        return { Error: "Link invalido, Redireccionando al home" };
      }
      return err.response.data;
    }
    toast.success(
      "Tu contraseña fue actualizada!. Ahora puedes ingresar.",
    );
    navigate("/login");
  };

  const userInfo = async () => {
    const response = await getUser(authTokens.access)
    return response.data
  }

  const updateUser = async (body) => {
    try {
      const response = await putUser(authTokens.access, body);
      const image = response.data.pic
      setPic(image ? `http://127.0.0.1:8000${image}` : "/user.png");
      return response
    } catch (err) {
      return err.response;
    }
  }

  const contextData = {
    user,
    pic,
    setPic,
    authTokens,
    userInfo,
    updateUser,
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

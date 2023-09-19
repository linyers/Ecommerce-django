import { useContext, useEffect, useState } from "react";
import { useParams, Navigate } from "react-router-dom";
import AuthContext from "../../context/AuthContext";
import Loader from "../../components/parts/Loader";

function Activate() {
  const params = useParams();
  const [status, setStatus] = useState([]);
  const [redirect, setRedirect] = useState(false);
  const { activateUser } = useContext(AuthContext);

  useEffect(() => {
    const getStatus = async () => {
      setStatus(await activateUser(params.uid, params.token));
    };
    getStatus();

    const timeoutId = setTimeout(() => {
      setRedirect(true);
    }, 3000);

    return () => {
      clearTimeout(timeoutId);
    };
  }, []);

  return (
    <div>
      {status === 200 ? (
        <>
          <p>Gracias por validar tu email. Redireccionando al login</p>
          {redirect ? <Navigate to="/login" /> : <Loader />}
        </>
      ) : (
        <>
          <p>Este link ya no es valido. Redireccionando a home</p>
          {redirect ? <Navigate to="/" /> : <Loader />}
        </>
      )}
    </div>
  );
}

export default Activate;

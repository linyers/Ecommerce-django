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
    <div className="bg-gray-600 flex justify-center p-20">
      <div className="flex flex-col w-1/3 gap-5 shadow-md rounded-md bg-white p-8">
        {status === 200 ? (
          <>
            <p className="text-2xl text-center font-semibold text-gray-800">Gracias por validar tu email. Redireccionando al login</p>
            {redirect ? <Navigate to="/login" /> : <Loader />}
          </>
        ) : (
          <>
            <p className="text-2xl text-center font-semibold text-gray-800">Este link ya no es valido. Redireccionando a home</p>
            {redirect ? <Navigate to="/" /> : <Loader />}
          </>
        )}
      </div>
    </div>
  );
}

export default Activate;

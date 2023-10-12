import { useEffect, useState, useContext } from "react";
import AuthContext from "../../context/AuthContext";
import ModalUserForm from './ModalUserForm'

export default function PersonalData() {
  const { userInfo } = useContext(AuthContext);
  const [open, setOpen] = useState(false)
  const [user, setUser] = useState({});

  useEffect(() => {
    const getUserInfo = async () => {
      const response = await userInfo();
      setUser(response);
    };
    getUserInfo();
  }, [open]);

  return (
    <div className="flex flex-col w-1/2 gap-5 shadow-md rounded-sm bg-white py-5 px-8">
        <div className="flex gap-5 justify-between items-center">
          <h4 className="text-xl font-semibold text-gray-900">
            Datos personales
          </h4>
          <button onClick={() => setOpen(true)} className="p-1 text-base font-normal bg-gray-200 text-gray-800 hover:bg-gray-300 hover:text-gray-900">Editar</button>
        </div>
        <div className="flex justify-between gap-10 flex-wrap text-start md:text-center">
          <div className="flex gap-2 flex-col">
            <span>Nombre y apellido</span>
            <span className="text-gray-500">
              {user.first_name} {user.last_name}
            </span>
          </div>
          <div className="flex gap-2 flex-col">
            <span>DNI</span>
            <span className="text-gray-500">{user.dni}</span>
          </div>
          <div className="flex gap-2 flex-col">
            <span>Telefono</span>
            <span className="text-gray-500">{user.phone}</span>
          </div>
        </div>
        {open && <ModalUserForm setOpen={setOpen} user={user} />}
      </div>
  )
}

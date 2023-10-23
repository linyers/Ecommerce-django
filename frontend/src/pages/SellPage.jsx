import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import AddressContext from "../context/AddressContext";
import SellForm from '../components/products/sell/SellCreateForm'
import SellProductsList from '../components/products/sell/SellProductsList'


export default function SellPage() {
  const { userInfo } = useContext(AuthContext);
  const { addressesData } = useContext(AddressContext);
  const [open, setOpen] = useState(false)
  const [userCompleteProfile, setUserCompleteProfile] = useState(false);

  useEffect(() => {
    const getUserInfo = async () => {
      const user = await userInfo();
      const responseAddress = await addressesData();
      const address = responseAddress.data;
      if (!user.first_name || !user.last_name || !user.phone || !user.dni) {
        return;
      }
      if (address.filter((a) => a.default == true).length === 0) {
        return;
      }
      setUserCompleteProfile(true);
    };
    getUserInfo();
  }, []);

  return (
    <main className="bg-gray-600 flex flex-row gap-5 px-8 p-10">
      <div className="bg-white w-full rounded-md flex flex-col gap-3 p-8">
        <h3 className="text-gray-900 text-2xl font-semibold">Vender</h3>
        {!userCompleteProfile ? (
          <>
            <p className="mt-8 text-lg font-semibold w-1/2">
              Recuerda que para vender tus productos debes tener completado tu
              perfil y por lo menos una direccion por defecto
            </p>
            <Link
              to={"/user-dashboard"}
              className="mt-2 w-fit text-blue-500 hover:text-blue-400 font-bold"
            >
              Completa tu perfil
            </Link>
          </>
        ) : (
          <div className="flex flex-col gap-10 mt-2 w-full items-center">
            {!open && (
              <SellProductsList />
            )}
            <button onClick={(e) => setOpen(true)} className={`${open && 'hidden'} w-fit cursor-pointer bg-blue-500 text-white hover:bg-blue-600 transition-all duration-150 ease-in hover:border-0 border-0`}>
              Publicar un nuevo producto
            </button>
            {
              open && (
                <SellForm setOpen={setOpen} />
              )
            }
          </div>
        )}
      </div>
    </main>
  );
}

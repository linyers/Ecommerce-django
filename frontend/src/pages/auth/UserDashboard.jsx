import { useContext } from "react";
import AuthContext from "../../context/AuthContext";
import PersonalData from '../../components/auth/PersonalData'
import AddressesData from '../../components/address/AddressesData'
import PicInput from "../../components/auth/PicInput";

export default function UserDashboard() {
  const { user } = useContext(AuthContext)

  return (
    <main className="bg-gray-600 flex flex-col items-center gap-5 justify-center p-20">
      <div className="flex w-1/2 gap-8 items-center shadow-md rounded-sm bg-white p-5">
        <PicInput />
        <div className="text-xl font-semibold">
          <h3 className="text-gray-900">{user.username}</h3>
          <p className="text-base font-normal text-gray-600">{user.email}</p>
        </div>
      </div>
      <PersonalData />
      <AddressesData />
    </main>
  );
}

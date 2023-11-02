import { useContext, useState } from "react";
import AddressContext from "../../context/AddressContext";
import Loader from "../parts/Loader";
import UpdateForm from "./UpdateForm";

export default function ListAddresses({ setChange, addresses }) {
  const { removeAddress, updateAddress } = useContext(AddressContext);
  const [openUpdateForm, setOpenUpdateForm] = useState(-1) // -1 = no, any other number = yes. this is the id of the address to update
  const [load, setLoad] = useState(0);

  const handleRemoveAddress = async (id) => {
    setLoad(id);
    const response = await removeAddress(id);
    if (response.status === 204) {
      setChange(true);
    }
    setLoad(0);
  };

  return addresses?.map((a, i) => {
    if (a.id === openUpdateForm) {
      return (
        <UpdateForm address={a} setOpenUpdateForm={setOpenUpdateForm} setChange={setChange} />
      )
    }
    return (
      <div
        key={i}
        className="flex md:flex-row flex-col items-center gap-10 justify-between"
      >
        <div className="flex">
          <span className={`w-1/6 font-semibold ${a.default && 'text-blue-500'}`}>Dir. {i + 1}:</span>
          <span className="w-5/6 text-gray-500">
            {a.street_address}, {a.appartment_address && `Piso ${a.appartment_address}, `} {a.city} {a.country}
            , CP: {a.zip}.
          </span>
        </div>
        <div className="flex flex-col gap-2 w-fit">
        <button
          onClick={(e) => handleRemoveAddress(a.id)}
          className="p-1 text-sm font-normal bg-red-600 text-white hover:bg-red-500"
        >
          {load === a.id ? <Loader /> : "Borrar"}
        </button>
        <button
          onClick={(e) => setOpenUpdateForm(a.id)}
          className="p-1 text-sm font-normal bg-blue-500 text-white hover:bg-blue-400"
        >
          Editar
        </button>
        </div>
      </div>
    );
  });
}

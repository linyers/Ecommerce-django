import { useContext, useState } from "react";
import AddressContext from "../../context/AddressContext";
import Loader from "../parts/Loader";

export default function ListAddresses({ setDeleted, addresses }) {
  const { removeAddress } = useContext(AddressContext);
  const [load, setLoad] = useState(0);

  const handleRemoveAddress = async (id) => {
    setLoad(id);
    const response = await removeAddress(id);
    if (response.status === 204) {
      setDeleted(true);
    }
    setLoad(0);
    console.log(addresses)
  };

  return addresses?.map((a, i) => {
    return (
      <div
        key={i}
        className="flex md:flex-row flex-col items-start gap-10 justify-between"
      >
        <div className="flex">
          <span className="w-14 font-semibold">Dir. {i + 1}:</span>
          <span className="text-gray-500">
            {a.street_address}, Piso {a.apartment_address}, {a.city} {a.country}
            , CP: {a.zip}.
          </span>
        </div>
        <button
          onClick={() => handleRemoveAddress(a.id)}
          className="p-1 text-sm font-normal bg-red-600 text-white hover:bg-red-500"
        >
          {load === a.id ? <Loader /> : "Borrar"}
        </button>
      </div>
    );
  });
}

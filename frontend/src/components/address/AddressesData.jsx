import { useEffect, useState, useContext } from "react";
import AddressContext from "../../context/AddressContext";
import ListAddresses from './ListAddresses'
import ModalAddressForm from "./ModalAddressForm";

export default function AddressesData() {
  const { addressesData } = useContext(AddressContext);
  const [open, setOpen] = useState(false);
  const [deleted, setDeleted] = useState(false)
  const [addresses, setAddresses] = useState([]);

  useEffect(() => {
    const getAddressesData = async () => {
      const response = await addressesData();
      setAddresses(response.data);
      setDeleted(false)
    };
    getAddressesData();
  }, [open, deleted]);

  return (
    <div className="flex flex-col w-1/2 gap-8 shadow-md rounded-sm bg-white py-5 px-8">
      <div className="flex gap-5 justify-between items-center">
        <h4 className="text-xl font-semibold text-gray-900">Direcciones</h4>
        <button
          onClick={() => setOpen(true)}
          className="p-1 text-base font-normal bg-gray-200 text-gray-800 hover:bg-gray-300 hover:text-gray-900"
        >
          Subir
        </button>
      </div>
      <div className="flex gap-5 flex-col text-start">
        <ListAddresses setDeleted={setDeleted} addresses={addresses} />
      </div>
      {open && <ModalAddressForm setOpen={setOpen} />}
    </div>
  );
}

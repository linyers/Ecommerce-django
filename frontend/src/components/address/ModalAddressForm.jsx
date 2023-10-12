import { useState, useContext } from "react";
import AddressContext from "../../context/AddressContext";
import FormErrors from "../auth/FormErrors";
import Loader from "../parts/Loader";

export default function ModalAddressForm({ setOpen }) {
  const { createAddress } = useContext(AddressContext);
  const [load, setLoad] = useState(false);
  const [error, setError] = useState({});
  const [streetAddress, setStreetAddress] = useState(null);
  const [apartmentAddress, setApartmentAddress] = useState(null);
  const [country, setCountry] = useState(null);
  const [city, setCity] = useState(null);
  const [zip, setZip] = useState(null);

  const closeModal = () => {
    setOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoad(true);
    const body = {
      street_address: streetAddress,
      apartment_address: apartmentAddress,
      country,
      city,
      zip,
    };
    const response = await createAddress(body);
    if (response.status === 201) {
      setOpen(false);
    } else {
      setError(response.data);
    }
    setLoad(false);
  };

  return (
    <div className="fixed flex items-center justify-center bg-gray-500/50 w-full h-full z-50 top-0 right-0 left-0">
      <div className="bg-gray-200 w-1/2 h-1/2 overflow-scroll rounded-md shadow-lg">
        <button
          onClick={closeModal}
          className="p-2 fixed text-base font-normal bg-gray-200 text-gray-800 hover:text-gray-600"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-5 p-4 mt-2 justify-center items-center"
        >
          <h4 className="text-2xl font-semibold text-gray-700">
            Direccion
          </h4>
          <FormErrors errors={error} />
          <div className="flex gap-2">
            <input
              className={`py-2 px-2 ring-1 outline-blue-500 ring-gray-500 rounded-sm ${
                error["street_address"] && "ring-2 ring-red-600 outline-red-600"
              }`}
              type="text"
              placeholder="Calle"
              onChange={(e) => {
                setStreetAddress(e.target.value);
                setError({});
              }}
            />
            <input
              className={`py-2 px-2 ring-1 outline-blue-500 ring-gray-500 rounded-sm ${
                error["apartment_address"] &&
                "ring-2 ring-red-600 outline-red-600"
              }`}
              type="text"
              placeholder="Piso (opcional)"
              onChange={(e) => {
                setApartmentAddress(e.target.value);
                setError({});
              }}
            />
          </div>
          <div className="flex gap-2">
            <input
              className={`py-2 px-2 ring-1 outline-blue-500 ring-gray-500 rounded-sm ${
                error["country"] && "ring-2 ring-red-600 outline-red-600"
              }`}
              type="text"
              placeholder="Pais"
              onChange={(e) => {
                setCountry(e.target.value);
                setError({});
              }}
            />
            <input
              className={`py-2 px-2 ring-1 outline-blue-500 ring-gray-500 rounded-sm ${
                error["city"] && "ring-2 ring-red-600 outline-red-600"
              }`}
              type="text"
              placeholder="Ciudad"
              onChange={(e) => {
                setCity(e.target.value);
                setError({});
              }}
            />
          </div>
          <input
            className={`py-2 px-2 ring-1 outline-blue-500 ring-gray-500 rounded-sm ${
              error["zip"] && "ring-2 ring-red-600 outline-red-600"
            }`}
            type="text"
            placeholder="Codigo postal"
            onChange={(e) => {
              setZip(e.target.value);
              setError({});
            }}
          />
          <button
            className="bg-gray-600 hover:bg-gray-500 focus:outline-gray-800 hover:cursor-pointer rounded-md p-3 text-white"
            type="submit"
          >
            {load ? <Loader /> : "Enviar"}
          </button>
        </form>
      </div>
    </div>
  );
}

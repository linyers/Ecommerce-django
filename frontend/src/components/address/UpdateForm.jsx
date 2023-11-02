import { useState, useContext } from "react";
import AddressContext from "../../context/AddressContext";
import FormErrors from "../auth/FormErrors";
import Loader from "../parts/Loader";

export default function UpdateForm({ address, setOpenUpdateForm, setChange }) {
  const { updateAddress } = useContext(AddressContext);
  const [load, setLoad] = useState(false);
  const [error, setError] = useState({});
  const [streetAddress, setStreetAddress] = useState(address.street_address);
  const [apartmentAddress, setApartmentAddress] = useState(
    address.apartment_address
  );
  const [country, setCountry] = useState(address.country);
  const [city, setCity] = useState(address.city);
  const [zip, setZip] = useState(address.zip);
  const [defaultAddress, setDefaultAddress] = useState(address.default);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const body = {
      street_address: streetAddress,
      apartment_address: apartmentAddress,
      country,
      city,
      zip,
      default: defaultAddress,
    };

    setLoad(true);
    const response = await updateAddress(body, address.id);
    if (response.status === 200) {
      setOpenUpdateForm(-1);
      setChange(true)
    } else {
      setError(response.data);
    }
    setLoad(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-wrap gap-5 p-4 mt-2 items-center"
    >
      <FormErrors errors={error} />
      <input
        className={`py-2 px-2 w-32 text-sm border-b-2 outline-none focus:border-blue-500 border-gray-30 rounded-sm ${
          error["street_address"] &&
          "border-b-2 outline-none focus:border-red-600"
        }`}
        type="text"
        placeholder={address.street_address}
        onChange={(e) => {
          setStreetAddress(e.target.value);
          setError({});
        }}
      />
      <input
        className={`py-2 px-2 w-32 text-sm border-b-2 outline-none focus:border-blue-500 border-gray-30 rounded-sm ${
          error["apartment_address"] && "ring-2 ring-red-600 outline-red-600"
        }`}
        type="text"
        placeholder={address.appartment_address}
        onChange={(e) => {
          setApartmentAddress(e.target.value);
          setError({});
        }}
      />
      <input
        className={`py-2 px-2 w-32 text-sm border-b-2 outline-none focus:border-blue-500 border-gray-30 rounded-sm ${
          error["country"] && "ring-2 ring-red-600 outline-red-600"
        }`}
        type="text"
        placeholder={address.country}
        onChange={(e) => {
          setCountry(e.target.value);
          setError({});
        }}
      />
      <input
        className={`py-2 px-2 w-32 text-sm border-b-2 outline-none focus:border-blue-500 border-gray-30 rounded-sm ${
          error["city"] && "ring-2 ring-red-600 outline-red-600"
        }`}
        type="text"
        placeholder={address.city}
        onChange={(e) => {
          setCity(e.target.value);
          setError({});
        }}
      />
      <input
        className={`py-2 px-2 w-32 text-sm border-b-2 outline-none focus:border-blue-500 border-gray-30 rounded-sm ${
          error["zip"] && "ring-2 ring-red-600 outline-red-600"
        }`}
        type="text"
        placeholder={address.zip}
        onChange={(e) => {
          setZip(e.target.value);
          setError({});
        }}
      />
      <div>
        <input
          className={`py-2 px-2 outline-blue-500 ring-gray-500 rounded-sm ${
            error["default"] && "ring-2 ring-red-600 outline-red-600"
          }`}
          id="default_address"
          defaultChecked={address.default}
          type="checkbox"
          onChange={(e) => {
            setDefaultAddress(e.target.checked);
            setError({});
          }}
        />
        <label htmlFor="default_address" className="ml-2 text-sm text-gray-500">
          Direccion por defecto.
        </label>
      </div>
      <button
        className="bg-blue-500 hover:bg-blue-400 focus:outline-gray-800 hover:cursor-pointer rounded-md p-1 text-sm text-white"
        type="submit"
      >
        {load ? <Loader /> : "Editar"}
      </button>
      <button
      onClick={e => setOpenUpdateForm(-1)}
        className="bg-gray-600 hover:bg-gray-500 focus:outline-gray-800 hover:cursor-pointer rounded-md p-1 text-sm text-white"
        type="submit"
      >
        Cancelar
      </button>
    </form>
  );
}

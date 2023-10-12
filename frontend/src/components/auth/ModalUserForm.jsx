import { useState, useContext } from "react";
import AuthContext from "../../context/AuthContext";
import FormErrors from "./FormErrors";
import Loader from "../parts/Loader";

export default function ModalUserForm({ setOpen, user }) {
  const { updateUser } = useContext(AuthContext);
  const [load, setLoad] = useState(false);
  const [error, setError] = useState({});
  const [firstName, setFirstName] = useState(user.first_name);
  const [lastName, setLastName] = useState(user.last_name);
  const [dni, setDni] = useState(user.dni);
  const [phone, setPhone] = useState(user.phone);

  const closeModal = () => {
    setOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoad(true);
    const body = {
      first_name: firstName,
      last_name: lastName,
      dni,
      phone,
    };
    const response = await updateUser(body);
    if (response.status === 200) {
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
            Datos personales
          </h4>
          <FormErrors errors={error} />
          <div className="flex gap-2">
            <input
              className={`py-2 px-2 ring-1 outline-blue-500 ring-gray-500 rounded-sm ${
                error["names"] && "ring-2 ring-red-600 outline-red-600"
              }`}
              type="text"
              placeholder={firstName ? user.first_name : "Nombres"}
              onChange={(e) => {
                if (e.target.value === "" && user.first_name !== null) {
                  setFirstName(user.first_name);
                } else {
                  setFirstName(e.target.value);
                }
                setError({});
              }}
            />
            <input
              className={`py-2 px-2 ring-1 outline-blue-500 ring-gray-500 rounded-sm ${
                error["names"] && "ring-2 ring-red-600 outline-red-600"
              }`}
              type="text"
              placeholder={lastName ? user.last_name : "Apellidos"}
              onChange={(e) => {
                if (e.target.value === "" && user.last_name !== null) {
                  setLastName(user.last_name);
                } else {
                  setLastName(e.target.value);
                }
                setError({});
              }}
            />
          </div>
          <input
            className={`py-2 px-2 ring-1 outline-blue-500 ring-gray-500 rounded-sm ${
              error["dni"] && "ring-2 ring-red-600 outline-red-600"
            }`}
            type="text"
            placeholder={dni ? user.dni : "DNI"}
            onChange={(e) => {
              if (e.target.value === "" && user.dni !== null) {
                setDni(user.dni);
              } else {
                setDni(e.target.value);
              }
              setError({});
            }}
          />
          <input
            className={`py-2 px-2 ring-1 outline-blue-500 ring-gray-500 rounded-sm ${
              error["phone"] && "ring-2 ring-red-600 outline-red-600"
            }`}
            type="tel"
            placeholder={phone ? user.phone : "Telefono"}
            onChange={(e) => {
              if (e.target.value === "" && user.phone !== null) {
                setPhone(user.phone);
              } else {
                setPhone(e.target.value);
              }
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

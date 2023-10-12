import { createContext, useContext } from "react";
import AuthContext from './AuthContext'
import {
  getAddresses,
  getAddress,
  postAddress,
  putAddress,
  deleteAddress,
} from "../utils/address.api";
import toast from 'react-hot-toast'

const AddressContext = createContext();

export default AddressContext;

export function AddressProvider({ children }) {
  const { authTokens } = useContext(AuthContext);

  const addressesData = async () => {
    const response = await getAddresses(authTokens.access);
    return response
  }

  const addressData = async () => {
    const response = await getAddress(authTokens.access);
    return response
  }

  const createAddress = async (body) => {
    try {
      const response = await postAddress(authTokens.access, body);
      return response
    } catch (error) {
      return error.response
    }
  }

  const updateAddress = async (body, id) => {
    try {
      const response = await putAddress(authTokens.access, body, id);
      return response
    } catch (error) {
      return error.response
    }
  }

  const removeAddress = async (id) => {
    try {
      const response = await deleteAddress(authTokens.access, id);
      toast.success("Direccion eliminada!")
      return response
    } catch (error) {
      toast.success("Hubo un error al eliminar la direccion.")
      return error.response
    }
  }

  const contextData = {
    addressesData,
    addressData,
    createAddress,
    updateAddress,
    removeAddress,
  };

  return (
    <AddressContext.Provider value={contextData}>{children}</AddressContext.Provider>
  );
}
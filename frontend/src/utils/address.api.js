import axios from "axios";

const addressAPI = axios.create({
  baseURL: "http://localhost:8000/api/auth/user/addresses/",
});

export const getAddresses = (authToken) => {
  return addressAPI.get("", {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });
};

export const getAddress = (authToken, id) => {
  return addressAPI.get(`${id}`, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });
};

export const postAddress = (authToken, body) => {
  return addressAPI.post("", body, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });
};

export const putAddress = (authToken, body, id) => {
  return addressAPI.put(`${id}/`, body, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });
};

export const deleteAddress = (authToken, id) => {
  return addressAPI.delete(`${id}`, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });
};
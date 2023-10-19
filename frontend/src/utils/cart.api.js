import axios from "axios";

const addressAPI = axios.create({
  baseURL: "http://localhost:8000/api/cart/",
});

export const getItems = (authToken) => {
  return addressAPI.get("get-items/", {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });
};

export const postItem = (authToken, body) => {
  return addressAPI.post("add-item/", body, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });
};

export const putItem = (authToken, body) => {
  return addressAPI.put("update-item/", body, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });
};

export const deleteItem = (authToken, body) => {
  return addressAPI.delete("remove-item/", {
    data: body,
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });
};

export const deleteCart = (authToken) => {
  return addressAPI.delete("empty-cart/", {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });
};

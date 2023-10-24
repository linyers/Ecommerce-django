import axios from "axios";

const cartAPI = axios.create({
  baseURL: "http://localhost:8000/api/cart/",
});

export const getItems = (authToken) => {
  return cartAPI.get("get-items/", {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });
};

export const postItem = (authToken, body) => {
  return cartAPI.post("add-item/", body, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });
};

export const putItem = (authToken, body) => {
  return cartAPI.put("update-item/", body, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });
};

export const deleteItem = (authToken, body) => {
  return cartAPI.delete("remove-item/", {
    data: body,
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });
};

export const deleteCart = (authToken) => {
  return cartAPI.delete("empty-cart/", {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });
};

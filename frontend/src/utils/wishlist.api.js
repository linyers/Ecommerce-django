import axios from "axios";

const wishlistAPI = axios.create({
  baseURL: "http://localhost:8000/api/wishlist/",
});

export const getItems = (authToken) => {
  return wishlistAPI.get("get-items/", {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });
};

export const postItem = (authToken, body) => {
  return wishlistAPI.post("add-item/", body, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });
};

export const deleteItem = (authToken, body) => {
  return wishlistAPI.delete("remove-item/", {
    data: body,
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });
};
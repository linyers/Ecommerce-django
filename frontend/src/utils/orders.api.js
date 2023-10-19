import axios from "axios";

const ordersAPI = axios.create({
  baseURL: "http://localhost:8000/api/orders/",
});

export const getOrders = (authToken) => {
  return ordersAPI.get("", {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });
};

export const postOrders = (authToken, body) => {
  return ordersAPI.post("", body, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });
};

export const putOrders = (authToken, body, id) => {
  return ordersAPI.put(`${id}`, body, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });
};

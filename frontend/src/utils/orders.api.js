import axios from "axios";

const ordersAPI = axios.create({
  baseURL: "http://localhost:8000/api/orders/",
});

const refundAPI = axios.create({
  baseURL: "http://localhost:8000/api/refund/",
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
  return ordersAPI.put(`${id}/`, body, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });
};

// Refunds
export const postRefund = (authToken, body) => {
  return refundAPI.post("", body, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });
}

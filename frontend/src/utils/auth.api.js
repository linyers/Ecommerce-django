import axios from "axios";

const authAPI = axios.create({
  baseURL: "http://localhost:8000/api/auth/",
});

export const postSignup = (body) => {
  return authAPI.post("signup/", body);
};

export const postLogin = (body) => {
  return authAPI.post("login/", body);
};

export const postRefreshToken = (body) => {
  return authAPI.post("token-refresh/", body);
};

export const getActivateAcount = (uidb64, token) => {
  return authAPI.get(`activate/${uidb64}/${token}`);
};

export const postChangePasswordEmail = (body) => {
  return authAPI.post(`change-password/`, body);
};

export const postChangePassword = (uidb64, token, body) => {
  return authAPI.post(`change-password/${uidb64}/${token}`, body);
};

export const getUser = (authToken) => {
  return authAPI.get("user/", {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });
};

export const putUser = (authToken, body) => {
  return authAPI.put("user/", body, {
    headers: {
      "content-type": "multipart/form-data",
      Authorization: `Bearer ${authToken}`,
    },
  });
};

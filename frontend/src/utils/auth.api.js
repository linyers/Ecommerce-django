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

import axios from "axios";

const authAPI = axios.create({
  baseURL: "http://localhost:8000/api/",
});

export const postSignup = (body) => {
  return authAPI.post("auth/signup/", body);
};

export const postLogin = (body) => {
  return authAPI.post("auth/login/", body);
};

export const postRefreshToken = (body) => {
  return authAPI.post("auth/token-refresh/", body);
};

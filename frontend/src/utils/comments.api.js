import axios from "axios";

const commentsAPI = axios.create({
  baseURL: "http://localhost:8000/api/comments/",
});

export const getComments = (body) => {
  return commentsAPI.get("", {
    params: body,
  });
};

export const postComment = (authToken, body) => {
  return commentsAPI.post("", body, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });
};

export const putComment = (authToken, body, id) => {
  return commentsAPI.put(`${id}/`, body, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });
};

export const deleteComment = (authToken, id) => {
  return commentsAPI.delete(`${id}/`, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });
};

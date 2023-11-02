import axios from "axios";

const reviewsAPI = axios.create({
  baseURL: "http://localhost:8000/api/reviews/",
});

export const getReviews = (body) => {
  return reviewsAPI.get("", {
    params: body,
  });
};

export const postReview = (authToken, body) => {
  return reviewsAPI.post("", body, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });
};

export const putReview = (authToken, body) => {
  return reviewsAPI.put("", body, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });
};

export const deleteReview = (authToken, body) => {
  return reviewsAPI.delete("", {
    data: body,
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });
};

export const postLike = (authToken, body) => {
  return reviewsAPI.post("like/", body, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });
};

export const postDislike = (authToken, body) => {
  return reviewsAPI.post("dislike/", body, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });
};

import React from "react";

export default function FormErrors({ field, error, i }) {
  return (
    <>
      {field !== "detail" ? (
        <li key={i}>
          {field}: {error}
        </li>
      ) : (
        <li key={i}>{error}</li>
      )}
    </>
  );
}

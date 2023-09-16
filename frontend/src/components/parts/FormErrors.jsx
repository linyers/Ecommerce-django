import React from "react";

export default function FormErrors({ field, error, i }) {
  return (
    <>
      <li key={i}>
        {field}: {error}
      </li>
    </>
  );
}

import React from "react";

export default function FormErrors({ errors }) {
  return (
    <>
      <ul
        className={`flex flex-col gap-1 ${
          Object.keys(errors).length === 0 && "hidden"
        }`}
      >
        {Object.keys(errors).map((err, i) => {
          return (
            <React.Fragment key={i}>
              {Array.isArray(errors[err]) ? (
                errors[err].map((e, i) => {
                  <li
                    className="bg-red-600 text-gray-100 p-2 rounded-md"
                    key={i}
                  >
                    {e}
                  </li>;
                })
              ) : (
                <li className="bg-red-600 text-gray-100 p-2 rounded-md" key={i}>
                  {errors[err]}
                </li>
              )}
            </React.Fragment>
          );
        })}
      </ul>
    </>
  );
}

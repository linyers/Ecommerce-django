import React from "react";

export default function AutoComplete({
  handleSelection,
  sentence,
  titles,
  selectedItem,
}) {
  return (
    <>
      {titles.length > 0 && (
        <ul className="absolute w-full bg-white z-10 top-10 rounded-b-md ">
          {titles?.map((t, i) => {
            return (
              <li
                key={i}
                onClick={() => handleSelection(t)}
                className={`z-50 text-base p-1 ${
                  i === titles.length - 1 && "rounded-b-md"
                } hover:text-white hover:bg-blue-500 ${
                  i === selectedItem && "text-white bg-blue-500"
                }`}
              >
                {t.slice(0, sentence.length)}
                {t.length > sentence.length && (
                  <strong>{t.slice(sentence.length)}</strong>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}

import React from "react";
import { faStar } from "@fortawesome/free-regular-svg-icons";
import { faStar as faStarSolid } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Stars({ textSize, stars }) {
  return (
    <ul className="flex">
      {Array(5)
        .fill()
        .map((_, s) => (
          <li>
            {s + 1 <= stars ? (
              <FontAwesomeIcon
                className={`text-blue-600 ${textSize}`}
                icon={faStarSolid}
              />
            ) : (
              <FontAwesomeIcon
                className={`text-gray-400 ${textSize}`}
                icon={faStar}
              />
            )}
          </li>
        ))}
    </ul>
  );
}

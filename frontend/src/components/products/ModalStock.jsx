import { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { faCircleExclamation } from "@fortawesome/free-solid-svg-icons";

export default function ModalStock({ stock }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [unity, setUnity] = useState(1);
  const [tempUnity, setTempUnity] = useState(null);
  const modalRef = useRef();
  
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        setModalOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  });

  const submitUnity = (e) => {
    e.preventDefault();
    if (tempUnity <= stock && tempUnity > 0) {
      setUnity(tempUnity);
      setFormOpen(false);
      setModalOpen(false);
    }
  };

  const modalOpenClick = () => {
    if (!modalOpen) {
      return setModalOpen(true);
    }
    setModalOpen(false);
  };
  return (
    <div ref={modalRef}>
      <button
        onClick={modalOpenClick}
        className="p-0 flex gap-2 justify-start items-baseline mt-5 bg-transparent transition-none border-0"
      >
        <span className="text-lg font-normal">Cantidad:</span>
        <span className="text-lg">
          {`${unity} ${unity !== 1 ? "unidades " : "unidad "}`}
          <i className="text-sm text-blue-500">
            <FontAwesomeIcon
              className={`${
                modalOpen && "rotate-180"
              } transition-all duration-200`}
              icon={faChevronDown}
            />
          </i>
        </span>
        <span className="text-sm text-gray-500 font-normal">
          ({stock} disponibles)
        </span>
      </button>
      {modalOpen && (
        <ul className="bg-white rounded-md absolute shadow-lg border-2 border-gray-100 ">
          {Array.from({ length: 5 }, (x, i) => {
            return (
              <li
                onClick={() => {
                  setUnity(i + 1);
                  setModalOpen(false);
                }}
                className={`p-3 hover:bg-gray-100 cursor-pointer ${
                  i === 0 && "rounded-t-md"
                } ${
                  unity === i + 1 &&
                  "border-l-4 border-l-blue-500 text-blue-500"
                }`}
                key={i}
              >{`${i + 1} ${i + 1 !== 1 ? "unidades" : "unidad"}`}</li>
            );
          })}
          {formOpen ? (
            <li>
              <form onSubmit={submitUnity} className="flex flex-col" action="">
                <input
                  onChange={(e) => setTempUnity(parseInt(e.target.value))}
                  className={`p-3 hover:bg-gray-100 outline-none ${
                    tempUnity > stock
                      ? "ring-2  ring-red-500 bg-red-500/30 hover:bg-red-400/30"
                      : "rounded-b-md focus:ring-2 focus:ring-blue-500"
                  }`}
                  type="number"
                  placeholder="cantidad"
                />
                {tempUnity > stock && (
                  <span className="p-3 text-red-500 font-semibold">
                    <FontAwesomeIcon icon={faCircleExclamation} /> Sin stock
                  </span>
                )}
              </form>
            </li>
          ) : (
            <li
              className="p-3 hover:bg-gray-100 cursor-pointer rounded-b-md"
              onClick={() => setFormOpen(true)}
            >
              Más de 5 unidades
            </li>
          )}
        </ul>
      )}
    </div>
  );
}

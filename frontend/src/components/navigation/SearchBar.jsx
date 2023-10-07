import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getProductsSearch } from "../../utils/products.api";
import AutoComplete from "./AutoComplete";

export default function SearchBar() {
  const inputRef = useRef();
  const navigate = useNavigate();
  const [showAutoComplete, setShowAutoComplete] = useState(false);
  const [titles, setTitles] = useState([]);
  const [selectedItem, setSelectedItem] = useState(-1);

  const getProductsAutoComplete = async (word) => {
    const response = await getProductsSearch(word);
    const data = response.data;
    setTitles(data);
  };

  const handleInput = () => {
    const { value } = inputRef.current;
    const sentence = value;
    const shouldOpenAutoComplete = /^\w+/.test(sentence);
    setShowAutoComplete(shouldOpenAutoComplete);
    shouldOpenAutoComplete && getProductsAutoComplete(sentence);
  };

  const handleSelection = (userHandle) => {
    inputRef.current.value = userHandle;
    navigate(`/s?q=${userHandle.replaceAll("/", "", 2)}`);
  };

  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown" && selectedItem < titles.length - 1) {
      setSelectedItem((prev) => prev + 1);
    } else if (e.key === "ArrowUp" && selectedItem > -1) {
      setSelectedItem((prev) => prev - 1);
    } else if (e.key === "Enter" && inputRef.current.value.length > 0) {
      const search =
        selectedItem > -1 ? titles[selectedItem] : inputRef.current.value;
      inputRef.current.value = search;
      navigate(`/s?q=${search.replaceAll("/", "", 2)}`);
      setShowAutoComplete(false);
      setSelectedItem(-1);
      inputRef.current.blur();
    } else {
      setSelectedItem(-1);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (inputRef.current && !inputRef.current.contains(event.target)) {
        setShowAutoComplete(false);
        setSelectedItem(-1);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative flex items-center justify-center w-1/3">
      <form
        className="items-center justify-center w-full flex flex-col"
        method="get"
        onSubmit={(e) => e.preventDefault()}
      >
        <input
          className="focus:outline-none focus:ring-1 ring-blue-600 shadow-sm z-20 bg-bondi-blue-50 md:w-full px-2 p-1"
          type="text"
          name="q"
          placeholder="Busca productos..."
          autoComplete="off"
          onKeyUp={handleInput}
          onKeyDown={handleKeyDown}
          ref={inputRef}
        />
      </form>
      {showAutoComplete && (
        <AutoComplete
          handleSelection={handleSelection}
          sentence={inputRef.current.value}
          titles={titles}
          selectedItem={selectedItem}
        />
      )}
    </div>
  );
}

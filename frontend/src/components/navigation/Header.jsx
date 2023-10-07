import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping } from "@fortawesome/free-solid-svg-icons";
import AuthContext from "../../context/AuthContext";
import SearchBar from "./SearchBar";

function Header() {
  const { user, logoutUser } = useContext(AuthContext);

  return (
    <header className="bg-gray-800 py-2 px-8 flex flex-row justify-between">
      <div className="flex flex-row items-center gap-3">
        <img
          className="rounded-full w-12 cursor-pointer"
          src="/lolascarne.jpg"
          alt=""
        />
        <Link className="font-bold text-xl" to="/">
          Ecommerce
        </Link>
      </div>
      <SearchBar />
      <nav className="flex items-center">
        <ul className="flex flex-row gap-5">
          {user ? (
            <>
              <li>
                <Link to={"/user-dashboard"}>User</Link>
              </li>
              <li>
                <a className="cursor-pointer" onClick={logoutUser}>
                  Logout
                </a>
              </li>
              <li>
                <Link to="/pucharses">Mis compras</Link>
              </li>
              <li>
                <Link className="text-lg" to="/cart">
                  <FontAwesomeIcon icon={faCartShopping} />
                </Link>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/login">Login</Link>
              </li>
              <li>
                <Link to="/register">Register</Link>
              </li>
              <li>
                <Link to="/login">Mis compras</Link>
              </li>
              <li>
                <Link className="text-lg" to="/login">
                  <FontAwesomeIcon icon={faCartShopping} />
                </Link>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
}

export default Header;

import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping } from "@fortawesome/free-solid-svg-icons";
import CartContext from "../../context/CartContext";
import AuthContext from "../../context/AuthContext";
import SearchBar from "./SearchBar";

function Header() {
  const { user, pic, logoutUser } = useContext(AuthContext);
  const { cart } = useContext(CartContext);

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
        <ul className="flex flex-row items-center gap-5">
          {user ? (
            <>
              <li>
                <Link
                  className="flex items-center gap-3"
                  to={"/user-dashboard"}
                >
                  <div className="w-12 h-12 flex items-center ring-1 ring-gray-200 hover:ring-gray-400 bg-white rounded-full">
                    <img
                      className="object-contain rounded-full w-12 h-12"
                      src={pic}
                      alt=""
                    />
                  </div>
                  <span>{user.username}</span>
                </Link>
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

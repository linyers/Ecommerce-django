import React, { useContext } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../../context/AuthContext";

function Header() {
  const { user, logoutUser } = useContext(AuthContext);

  return (
    <header className="bg-bondi-blue-800 py-3 px-5 flex flex-row justify-between">
      <Link to="/">Ecommerce</Link>
      <form action="get">
        <input className="rounded-md px-2 p-1" type="text" name="q" id="" />
      </form>
      <nav>
        <ul className="flex flex-row gap-5">
          <li>
            <Link to="/cart">Carrito</Link>
          </li>
          <li>
            <Link to="/my-pucharses">Mis compras</Link>
          </li>
          {user ? (
            <li>
              <a onClick={logoutUser}>Logout</a>
            </li>
          ) : (
            <>
              <li>
                <Link to="/login">Login</Link>
              </li>
              <li>
                <Link to="/register">Register</Link>
              </li>
            </>
          )}
          {user && <p>Hello {user.username}!</p>}
        </ul>
      </nav>
    </header>
  );
}

export default Header;

import React, { useContext } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../../context/AuthContext";

function Header() {
  const { user, logoutUser } = useContext(AuthContext);

  return (
    <header className="bg-bondi-blue-800 py-2 px-8 flex flex-row justify-between">
      <div className="flex flex-row items-center gap-3">
        <img
          className="rounded-full w-12 cursor-pointer"
          src="lolascarne.jpg"
          alt=""
        />
        <Link
          className="font-bold text-xl text-bondi-blue-100 hover:text-bondi-blue-300"
          to="/"
        >
          Ecommerce
        </Link>
      </div>
      <form
        className="items-center flex"
        action="get"
        onSubmit={(e) => e.preventDefault()}
      >
        <input className="rounded-md px-2 p-1" type="text" name="q" id="" />
      </form>
      <nav className="flex items-center">
        <ul className="flex flex-row gap-5">
          <li>
            <Link
              className="text-bondi-blue-100 hover:text-bondi-blue-300"
              to="/cart"
            >
              Carrito
            </Link>
          </li>
          <li>
            <Link
              className="text-bondi-blue-100 hover:text-bondi-blue-300"
              to="/my-pucharses"
            >
              Mis compras
            </Link>
          </li>
          {user ? (
            <>
              <li>
                <Link
                  className="text-bondi-blue-100 hover:text-bondi-blue-300"
                  to={"/user-dashboard"}
                >
                  User
                </Link>
              </li>
              <li>
                <a
                  className="text-bondi-blue-100 hover:text-bondi-blue-300 cursor-pointer"
                  onClick={logoutUser}
                >
                  Logout
                </a>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link
                  className="text-bondi-blue-100 hover:text-bondi-blue-300"
                  to="/login"
                >
                  Login
                </Link>
              </li>
              <li>
                <Link
                  className="text-bondi-blue-100 hover:text-bondi-blue-300"
                  to="/register"
                >
                  Register
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

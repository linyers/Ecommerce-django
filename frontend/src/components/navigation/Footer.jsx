import React from "react";
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronUp } from "@fortawesome/free-solid-svg-icons";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { faEnvelope } from "@fortawesome/free-regular-svg-icons";

function Footer() {
  return (
    <footer className="bg-white">
      <a
        href="#"
        className="bg-gray-800 hover:bg-gray-700 block text-center p-1 text-2xl"
      >
        <FontAwesomeIcon icon={faChevronUp} />
      </a>
      <section className="bg-gray-900 p-5 pt-8 flex justify-evenly text-sm items-start">
        <ul>
          <li className="text-white mb-4">Acerca de</li>
          <li>
            <a className="text-gray-400 font-thin" href="">
              Ecommerce
            </a>
          </li>
        </ul>
        <ul>
          <li className="text-white mb-4">Ayuda</li>
          <li>
            <Link to={'/s?q=a'} className="text-gray-400 font-thin">
              Comprar
            </Link>
          </li>
          <li>
            <Link to={'/sell'} className="text-gray-400 font-thin">
              Vender
            </Link>
          </li>
          <li>
            <a className="text-gray-400 font-thin" href="">
              Centro de seguridad
            </a>
          </li>
        </ul>
        <ul>
          <li className="text-white mb-4">Mi cuenta</li>
          <li>
            <Link to={'/my-purchases'} className="text-gray-400 font-thin">
              Compras
            </Link>
          </li>
          <li>
            <Link to={'/sell'} className="text-gray-400 font-thin">
              Ventas
            </Link>
          </li>
        </ul>
      </section>
      <section className="flex justify-center gap-20 p-10 bg-gray-900">
        <a className="text-lg" href="mailto:info@ecommerce.com">
          <FontAwesomeIcon icon={faEnvelope} /> info@ecommerce.com
        </a>
        <a className="text-lg" href="https://github.com/linyers">
          <FontAwesomeIcon icon={faGithub} /> Linyers
        </a>
      </section>
    </footer>
  );
}

export default Footer;

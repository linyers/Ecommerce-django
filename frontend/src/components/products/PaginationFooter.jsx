import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons'

export default function PaginationFooter({ page }) {
  const location = useLocation();
  const params = location.search.replace(/&page=\d+/g, "");
  return (
    <div className="flex flex-row gap-5 items-center">
      {page.actual !== 1 && (
        <Link
          className="duration-150 py-1 px-2 hover:bg-gray-300 text-blue-500 hover:text-blue-600"
          to={`/s${params}&page=${page.actual - 1}`}
        >
          <FontAwesomeIcon icon={faChevronLeft} /> Anterior
        </Link>
      )}
      <div>
        <span className="py-1 px-2 mr-1 text-gray-500 bg-gray-300">{page.actual}</span>
        <span className="py-1 text-gray-500">de {page.last_page}</span>
      </div>
      {page.actual !== page.last_page && (
        <Link
          className="duration-150 py-1 px-2 hover:bg-gray-300 text-blue-500 hover:text-blue-600"
          to={`/s${params}&page=${page.actual + 1}`}
        >
          Siguiente <FontAwesomeIcon icon={faChevronRight} /> 
        </Link>
      )}
    </div>
  );
}

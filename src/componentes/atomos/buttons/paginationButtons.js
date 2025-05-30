/* eslint linebreak-style: ["error", "windows"] */
/* eslint-disable */
import React from 'react';
import PropTypes from 'prop-types';
import {
  IconFirst, IconLast, IconNext, IconPrev,
} from '../../../assets/icons/icons';

const Pagination = ({
  page,
  pageRange,
  nextPage,
  previusPage,
  jumpToPage,
  jumpToFirstPage,
  jumpToLastPage,
  lastPage,
  // isLoading = false,
}) => {
  const isLoading = false;
  return (
    <div className="flex text-sm text-gray-700">
      <button
        type="button"
        className={`rounded-l-xl rounded-r-lg bg-white px-2.5 py-1.5 transition duration-300 
      ${isLoading || page === 1 ? 'cursor-not-allowed text-gray-400' : 'hover:bg-blue-100'}`}
        onClick={jumpToFirstPage}
      >
        <IconFirst />
      </button>
      <button
        type="button"
        className={`bg-white p-1.5 mr-1 transition duration-300 rounded-xl
      ${isLoading || page === 1 ? 'cursor-not-allowed text-gray-400' : 'hover:bg-blue-100'}`}
        onClick={previusPage}
      >
        <IconPrev />
      </button>
      {pageRange.map((pageFromArray) => (
        <button
          key={pageFromArray}
          type="button"
          value={pageFromArray}
          className={`${pageFromArray === page ? 'bg-primary text-white border-primary hover:border-dark-primary hover:bg-dark-primary' : 'border-blue-400 '} rounded-xl bg-white hover:bg-blue-100 border w-9 p-1 transition duration-300 mr-1  ${isLoading ? 'cursor-not-allowed text-gray-400' : ''}`}
          onClick={() => jumpToPage(pageFromArray)}
        >
          {pageFromArray}
        </button>
      ))}
      <button
        type="button"
        className={`bg-white border-blue-400 px-1.5 rounded-xl transition duration-300
       ${isLoading || lastPage === page ? 'cursor-not-allowed text-gray-400' : 'hover:bg-blue-100'}`}
        onClick={nextPage}
      >
        <IconNext />
      </button>
      <button
        type="button"
        className={`rounded-r-xl rounded-l-lg bg-white border-blue-400 px-2.5 py-1.5 transition duration-300 
      ${isLoading || lastPage === page ? 'cursor-not-allowed text-gray-400' : 'hover:bg-blue-100'}`}
        onClick={jumpToLastPage}
      >
        <IconLast />
      </button>
    </div>
  );
};

Pagination.propTypes = {
  page: PropTypes.number.isRequired,
  pageRange: PropTypes.arrayOf(PropTypes.number).isRequired,
  lastPage: PropTypes.number.isRequired,
  nextPage: PropTypes.func.isRequired,
  previusPage: PropTypes.func.isRequired,
  jumpToPage: PropTypes.func.isRequired,
  jumpToFirstPage: PropTypes.func.isRequired,
  jumpToLastPage: PropTypes.func.isRequired,
};

export default Pagination;

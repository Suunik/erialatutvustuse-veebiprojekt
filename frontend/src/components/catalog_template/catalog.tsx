"use client";
import React from 'react';
import CatalogBookCard from '../books/catalog_bookcard';
import { Book } from '../models/book';

interface CatalogProps {
  catalogName: String | undefined;
  bookList: Book[];
}

const Catalog: React.FC<CatalogProps> = ({ bookList, catalogName }) => {
  return (
    <div className="w-full px-4 sm:px-8 lg:px-10 py-10">
      {/* Catalog Section */}
      <div className="flex flex-col items-center gap-10">
        {/* Catalog Name */}
        <h1 className="text-3xl sm:text-4xl font-bold text-[#E31A7E] self-start mb-6 sm:ml-5">
          {catalogName}
        </h1>

        {/* Grid for Book Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6 sm:gap-8 md:gap-10 max-w-[90%] md:max-w-[1200px] mx-auto">
          {bookList.map((book, index) => (
            <CatalogBookCard key={index} {...book} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Catalog;

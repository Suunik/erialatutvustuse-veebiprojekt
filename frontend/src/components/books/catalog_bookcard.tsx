"use client";

import Link from 'next/link';
import { Book } from '../models/book' 
import NoImageAvailable from './pictures/No_image_available.png'

const CatalogBookCard: React.FC<Book> = (book) => {
  return (
    
    <Link href={{
      pathname: "/tootevaade",
      query: {
        bookID: book.id,
      },
    }} passHref>
    
      <div className="flex flex-col items-center gap-4 cursor-pointer z-fold-card">
        {/* Book Image */}
        <div className="relative w-[120px] sm:w-[150px] md:w-[175px] lg:w-[200px] xl:w-[250px] h-[200px] sm:h-[250px] md:h-[300px] lg:h-[350px] xl:h-[400px]">
          <img
            src={book.picture_url && book.picture_url !== '' ? book.picture_url : NoImageAvailable.src}
            alt={book.title}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              borderRadius: "0.375rem",
            }}
            className="shadow"
          />
        </div>

        {/* Book Info */}
        <div className="text-center">
          <h2 className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl text-[#000000]">
            {book.title}
          </h2>
          <p className="text-xs sm:text-sm md:text-base text-gray-600">
            {book.author}
          </p>
          <p className="text-sm sm:text-base md:text-lg text-gray-800 font-medium mt-1">
            {book.price + " €"}
          </p>
        </div>
      </div>
    </Link>
  );
  
};

export default CatalogBookCard;

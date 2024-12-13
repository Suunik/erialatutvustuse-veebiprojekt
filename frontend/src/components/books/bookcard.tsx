import Link from "next/link";
import { Book } from "../models/book";
import NoImageAvailable from "./pictures/No_image_available.png";

interface BookCardProps extends Book {
  offerLabel: string;
}

const BookCard: React.FC<BookCardProps> = ({ offerLabel, ...book }) => {
  return (
    <Link
      href={{
        pathname: "/tootevaade",
        query: {
          bookID: book.id,
        },
      }}
      passHref
    >
      <div className="max-w-full p-4 sm:p-6 bg-white rounded-lg shadow-md flex flex-col">
        <h3 className="text-pink-600 font-semibold text-xl sm:text-2xl mb-6 sm:mb-10">
          {offerLabel}
        </h3>
        <div className="w-[200px] h-[300px] sm:h-[375px] lg:w-[300px] lg:h-[450px] mb-6 sm:mb-8">
          <img
            src={
              book.picture_url && book.picture_url !== ""
                ? book.picture_url
                : NoImageAvailable.src
            }
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
        <h4 className="text-sm sm:text-lg font-semibold text-gray-800 break-words max-w-xs">
          {book.title}
        </h4>
        <p className="text-sm sm:text-base text-gray-500 break-words max-w-xs">{book.author}</p>
        <p className="text-sm sm:text-base text-gray-800 font-semibold mt-1">
          {book.price + " €"}
        </p>
      </div>
    </Link>
  );
};

export default BookCard;
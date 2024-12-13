import { NextPage } from "next";
import Image from "next/image";
import PinkButton from "../buttons/pink_button";
import { Book } from "../models/book";
import { useCart } from "../shopping_cart/cart_content";
import { useState } from "react";
import Popup from "../popup/popup";
import MessageTemplate from "../popup/popup_message_template";

interface BookData {
  book: Book | null;
}

const NoBookFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <p className="text-lg font-semibold text-gray-600">Raamatut ei leitud!</p>
  </div>
);

const Offer: NextPage<BookData> = ({ book }) => {
  const { addToCart } = useCart();
  const [isPopupVisible, setIsPopupVisible] = useState(false);

  const handleGoBack = () => {
    window.history.back();
  };

  if (!book) return <NoBookFallback />;

  const handleAddToCart = () => {
    addToCart(book);
    setIsPopupVisible(true);
  };

  const closePopup = () => {
    setIsPopupVisible(false);
  };

  return (
    <div className="max-w-[1920px] mx-auto px-4 box-border text-left text-xl text-black font-sans relative pb-20 pt-20">
      <div className="flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="self-start pr-8">
          <button
            onClick={handleGoBack}
            className="text-lg sm:text-xl font-semibold text-[#E31A7E] hover:text-[#C40079] transition"
          >
            ← Tagasi
          </button>
        </div>
        <div className="relative w-full min-w-[280px] sm:max-w-[350px] md:max-w-[400px] aspect-[2/3]">
          <Image src={book.picture_url} alt="Book cover" layout="fill" objectFit="cover" />
        </div>
        <div className="flex flex-col items-center justify-center gap-6 sm:gap-8 text-center max-w-[300px] sm:max-w-[350px] md:max-w-[400px]">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold">{book.title}</h1>
          <h2 className="text-gray-600 text-base sm:text-lg">{book.author}</h2>
          <p className="text-sm sm:text-base leading-snug">{book.description}</p>
          <div className="flex flex-col items-center gap-4 sm:gap-6 mt-4">
            <span className="text-2xl sm:text-3xl md:text-4xl">{book.price} €</span>
            <PinkButton 
              label="Lisa ostukorvi" 
              onClick={handleAddToCart}
              className="w-[150px] sm:w-[150px] h-[50px] md:h-[60px] bg-[#E31A7E] rounded-full flex items-center justify-center text-white text-sm sm:text-lg hover:bg-[#C40079] transition"
            />
          </div>
        </div>
      </div>
      
      {isPopupVisible && (
        <Popup isVisible={isPopupVisible} onClose={closePopup}>
          <MessageTemplate text="Raamat on lisatud ostukorvi!" onClick={closePopup} />
        </Popup>
      )}
    </div>
  );
};

export default Offer;

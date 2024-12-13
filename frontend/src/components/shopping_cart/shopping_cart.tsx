"use client";

import { NextPage } from "next";
import { useMemo, useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { useCart } from "../../components/shopping_cart/cart_content";
import PinkButton from "../buttons/pink_button";
import Popup from "../popup/popup";
import MessageTemplate from "../popup/popup_message_template";

const ShoppingCart: NextPage = () => {
  const { cart, removeFromCart } = useCart();
  const [isHydrated, setIsHydrated] = useState(false);
  const [quantities, setQuantities] = useState<Record<number, number>>({});
  const [isPopupVisible, setIsPopupVisible] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
    // Initialize quantities for each cart item
    const initialQuantities: Record<number, number> = {};
    cart.forEach((item) => {
      initialQuantities[item.book.id] = 1; // Default quantity of 1
    });
    setQuantities(initialQuantities);
  }, [cart]);

  const calculateItemTotal = (price: number, quantity: number) =>
    (price * quantity).toFixed(2);

  const totalPrice = useMemo(() => {
    return cart.reduce((total, item) => {
      const quantity = quantities[item.book.id] || 1; // Use quantity or default to 1
      return total + item.book.price * quantity;
    }, 0);
  }, [cart, quantities]);

  const handleRemove = (bookId: number) => {
    removeFromCart(bookId);
    setQuantities((prev) => {
      const updated = { ...prev };
      delete updated[bookId];
      return updated;
    });
  };

  const increaseQuantity = (bookId: number) => {
    setQuantities((prev) => ({
      ...prev,
      [bookId]: (prev[bookId] || 1) + 1,
    }));
  };

  const decreaseQuantity = (bookId: number) => {
    setQuantities((prev) => {
      const currentQuantity = prev[bookId] || 1;
      if (currentQuantity > 1) {
        return {
          ...prev,
          [bookId]: currentQuantity - 1,
        };
      }
      return prev;
    });
  };

  const handleCheckout = () => {
    cart.forEach((item) => removeFromCart(item.book.id));
    setIsPopupVisible(true);
  };

  const closePopup = useCallback(() => {
    setIsPopupVisible(false);
  }, []);

  if (!isHydrated) {
    return <p>Loading...</p>;
  }

  return (
    <div className="flex flex-col items-center bg p-4 sm:p-8">
      <div className="border border-[#E31A7E] bg-gray-150 w-full max-w-4xl mx-auto rounded-lg shadow-md">
        {cart.length === 0 ? (
          <p className="text-center py-8 text-lg text-gray-700">Ostukorv on tühi.</p>
        ) : (
          <div>
            <div className="hidden sm:flex flex-row justify-between border-b border-[#E31A7E] py-4 px-4 text-lg text-[#000000]">
              <div className="flex-1 text-center">Pilt</div>
              <div className="flex-1 text-center">Nimi</div>
              <div className="flex-1 text-center">Kogus</div>
              <div className="flex-1 text-center">Hind</div>
              <div className="flex-1 text-center"></div>
            </div>

            {cart.map((item) => {
              const quantity = quantities[item.book.id] || 1;
              return (
                <div
                  key={item.book.id}
                  className="flex flex-col sm:flex-row justify-between items-center text-black border-b border-[#E31A7E] py-4 px-4"
                >
                  <div className="flex-1 flex justify-center">
                    <Image
                      src={item.book.picture_url}
                      alt={item.book.title}
                      width={88}
                      height={128}
                    />
                  </div>
                  <div className="flex-1 text-center">{item.book.title}</div>
                  <div className="flex-1 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => decreaseQuantity(item.book.id)}
                        className="px-3 py-1 border-gray-400"
                      >
                        -
                      </button>
                      <div className="px-2 py-1 border border-[#E31A7E] rounded bg-gray-100 text-black">
                        {quantity}
                      </div>

                      <button
                        onClick={() => increaseQuantity(item.book.id)}
                        className="px-3 py-1 border-gray-400"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className="flex-1 text-center">
                    {calculateItemTotal(item.book.price, quantity)} €
                  </div>
                  <div className="flex-1 text-center">
                    <button
                      onClick={() => handleRemove(item.book.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Eemalda
                    </button>
                  </div>
                </div>
              );
            })}

            <div className="flex flex-col sm:flex-row justify-between border-t border-[#E31A7E] py-4 px-4 font-semibold text-lg text-black">
              <div className="flex-1 text-center">Kokku</div>
              <div className="flex-1"></div>
              <div className="flex-1"></div>
              <div className="flex-1 text-center">
                {totalPrice.toFixed(2).replace(".", ",")} €
              </div>
            </div>
          </div>
        )}
      </div>

      {cart.length > 0 && (
        <div className="mt-8 w-full max-w-xs sm:max-w-md flex justify-center">
          <PinkButton label="Maksma" className="px-6 py-4 text-lg" onClick={handleCheckout} />
        </div>
      )}
      <Popup isVisible={isPopupVisible} onClose={closePopup}>
        <MessageTemplate text="Makse õnnestus" onClick={closePopup} />
      </Popup>
    </div>
  );
};

export default ShoppingCart;

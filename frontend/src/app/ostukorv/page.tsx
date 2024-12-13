"use client"
import { CartProvider } from "../../components/shopping_cart/cart_content"; // Import CartProvider
import ShoppingCart from "@/components/shopping_cart/shopping_cart";
import Footer from "@/components/footer/footer";
import Header from "@/components/header";
import { useEffect, useState } from "react";

const ShoppingCartPage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const userData = sessionStorage.getItem("user");
    if (userData) {
      const user = JSON.parse(userData);
      setIsLoggedIn(user.isLoggedIn);
    }
  }, []);

  const handleLoginLogout = () => {
    if (isLoggedIn) {
      sessionStorage.removeItem("user");
    }
    setIsLoggedIn(!isLoggedIn);
  };

  return (
    <CartProvider> {/* Wrap the content in CartProvider */}
      <div className="flex flex-col min-h-screen max-w-[1920px] mx-auto font-[family-name:var(--font-geist-sans)]">
        <Header isLoggedIn={isLoggedIn} onLoginLogout={handleLoginLogout} />
        <div className="flex-grow flex flex-col items-center w-full max-w-[90%] mx-auto pt-20 pb-20 gap-8">
          <h1 className="mb-4 text-3xl sm:text-4xl lg:text-5xl font-serif text-pink-600 text-left w-full">
            Teie ostukorv
          </h1>
          <div className="w-full max-w-[1200px]">
            <ShoppingCart />  {/* ShoppingCart component */}
          </div>
        </div>
        <Footer />
      </div>
    </CartProvider>
  );
};

export default ShoppingCartPage;

import React, { useState, useEffect } from "react";
import { MdOutlineShoppingCart } from "react-icons/md";
import { CgProfile } from "react-icons/cg";
import Link from "next/link";
import LoginRegister from "./login/login_register";
import DropdownMenu from "./drop-down menu/drop_down";
import PinkButton from "./buttons/pink_button";

interface HeaderProps {
  isLoggedIn: boolean;
  onLoginLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ isLoggedIn, onLoginLogout }) => {
  const [isAuthPopupOpen, setAuthPopupOpen] = useState(false);
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setDropdownOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleProfileClick = () => {
    if (!isLoggedIn) {
      setAuthPopupOpen(true);
    } else {
      onLoginLogout();
      window.location.href = "/";
    }
  };

  const handleDropDownClick = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  const closeAuthPopup = () => {
    setAuthPopupOpen(false);
  };

  const closeDropdown = () => {
    setDropdownOpen(false);
  };

  return (
    <header className="w-full flex flex-col shadow-md">
      <div className="flex justify-between items-center p-3 sm:p-4 gap-2 bg-[#3A2F6F] text-white">
        {/* Dropdown Button for Mobile */}
        <div className="lg:hidden cursor-pointer" onClick={handleDropDownClick}>
          <span className="text-2xl sm:text-3xl">&#9776;</span>
        </div>

        <Link href="/" className="instrumentserif text-xl sm:text-2xl lg:text-3xl">
          Raamatupood
        </Link>

        <div className="flex items-center ml-auto gap-3 sm:gap-4">
          {!isLoggedIn ? (
            <div
              className="cursor-pointer text-white hover:text-[#E31A7E] block"
              onClick={handleProfileClick}
            >
              <CgProfile className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8" />
            </div>
          ) : (
            <PinkButton 
              label="Logi välja" 
              onClick={handleProfileClick} 
              className="px-1 py-0.5 sm:px-5 sm:py-3 text-[10px] sm:text-sm bg-[#E31A7E] text-white rounded-full sm:w-auto text-center hover:bg-[#C40079] transition-all"
            />
          )}

          <div className="cursor-pointer flex items-center gap-2 hover:text-[#E31A7E]">
            <Link href="/ostukorv" passHref>
              <div className="flex items-center gap-2">
                <MdOutlineShoppingCart className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8" />
              </div>
            </Link>
          </div>
        </div>
      </div>

      <DropdownMenu isOpen={isDropdownOpen} onClose={closeDropdown} />

      {/* Desktop Navbar */}
      <div className="hidden lg:flex w-full bg-[#4AAEC5] py-2 sm:py-3">
        <nav className="flex justify-center gap-5 sm:gap-10 w-full">
          <a href="/kataloog?catalogName=Ajalugu" className="hover:text-[#E31A7E] text-sm lg:text-base">
            Ajalugu
          </a>
          <a href="/kataloog?catalogName=Ilukirjandus" className="hover:text-[#E31A7E] text-sm lg:text-base">
            Ilukirjandus
          </a>
          <a href="/kataloog?catalogName=Kodu%20ja%20Aed" className="hover:text-[#E31A7E] text-sm lg:text-base">
            Kodu ja Aed
          </a>
          <a href="/kataloog?catalogName=Lastekirjandus" className="hover:text-[#E31A7E] text-sm lg:text-base">
            Lastekirjandus
          </a>
          {isLoggedIn && (
            <>
              <Link href="#" className="hover:text-[#E31A7E]">
                Minu Raamatud
              </Link>
              <Link href="/raamatu-lisamine" className="hover:text-[#E31A7E]">
                Lisa Raamat
              </Link>
            </>
          )}
        </nav>
      </div>

      <LoginRegister isVisible={isAuthPopupOpen} onClose={closeAuthPopup} />
    </header>
  );
};

export default Header;

"use client"
import React from "react";
import { useLoginService } from "../login/login_service";

interface DropdownMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({ isOpen, onClose }) => {
  const { isLoggedIn } = useLoginService();

  if (!isOpen) return null;

  return (
    <div className="fixed top-0 left-0 bg-[#4FC1E9] p-10 sm:p-14 md:p-16 lg:p-18 xl:p-20 w-full min-h-[500px] z-50">
      <div className="flex justify-between items-center mb-8">
        <h2 className="mr-5 text-white font-bold text-4xl sm:text-5xl md:text-6xl">
          Kategooriad
        </h2>
        <button
          onClick={onClose}
          className="text-white text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl hover:text-[#E31A7E]"
        >
          &times;
        </button>
      </div>

      <ul className="flex flex-col gap-6">
        <a
          href="/kataloog?catalogName=Ajalugu"
          className="text-white font-medium hover:text-[#E31A7E] text-xl sm:text-2xl md:text-3xl"
        >
          Ajalugu
        </a>
        <a
          href="/kataloog?catalogName=Ilukirjandus"
          className="text-white font-medium hover:text-[#E31A7E] text-xl sm:text-2xl md:text-3xl"
        >
          Ilukirjandus
        </a>
        <a
          href="/kataloog?catalogName=Kodu%20ja%20Aed"
          className="text-white font-medium hover:text-[#E31A7E] text-xl sm:text-2xl md:text-3xl"
        >
          Kodu ja Aed
        </a>
        <a
          href="/kataloog?catalogName=Lastekirjandus"
          className="text-white font-medium hover:text-[#E31A7E] text-xl sm:text-2xl md:text-3xl"
        >
          Lastekirjandus
        </a>
        {isLoggedIn && (
          <>
            <li className="text-white font-medium hover:underline text-xl sm:text-2xl md:text-3xl">
              Minu raamatud
            </li>
            <a
              href="/raamatu-lisamine"
              className="text-white font-medium hover:underline text-xl sm:text-2xl md:text-3xl"
            >
              Lisa raamat
            </a>
          </>
        )}
      </ul>
    </div>
  );
};

export default DropdownMenu;

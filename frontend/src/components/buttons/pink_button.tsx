import React, { FunctionComponent } from 'react';
import Link from 'next/link';

type ButtonProps = {
    className?: string;
    onClick?: () => void;
    label: string;
    navigateTo?: string; // Optional URL to navigate to
    type?: "button" | "submit"; // Default to "button"
};

const PinkButton: FunctionComponent<ButtonProps> = ({
    onClick, 
    label, 
    navigateTo, 
    type = "button",
    className = ""
}) => {
    const buttonElement = (
        <button
            type={type}
            className={"bg-[#E31A7E] rounded-full text-white px-5 py-3 hover:bg-[#C40079] transition w-fit " + className}
            onClick={type === "button" && !navigateTo ? onClick : undefined}
        >
            {label}
        </button>
    );
    return navigateTo ? (
        <Link href={navigateTo}>
            {buttonElement}
        </Link>
    ) : (
        buttonElement
    );
};

export default PinkButton;
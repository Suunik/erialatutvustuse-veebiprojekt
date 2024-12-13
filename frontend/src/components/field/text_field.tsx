
import React, { useState } from "react";

interface TextFieldProps {
    fieldPrompt: string;
    setInput: (value: string) => void;
}

const TextField: React.FC<TextFieldProps> = ({ fieldPrompt, setInput }) => {
    const [likesInput, setLikesInput] = useState("");

    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newValue = e.target.value;
        setLikesInput(newValue);
        setInput(newValue); // Pass the value to the parent via the callback
    };

    return (
        <div className="flex flex-col gap-2">
            <div className="text-[25px] text-pink-600">{fieldPrompt}</div>
            <textarea
                className="w-full h-20 border border-pink-600 rounded-lg p-3 text-black text-[16px] resize-y"
                placeholder="Kirjuta oma vastus siia"
                value={likesInput}
                onChange={handleInputChange}
            />
        </div>
    );
};

export default TextField;
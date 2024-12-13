import type { NextPage } from 'next';
import PinkButton from '../buttons/pink_button';

export type Message = {
    className?: string;
    text?: string;
    onClick?: () => void;
};

const MessageTemplate: NextPage<Message> = ({ className = "", text="", onClick }) => {
    return (
        <div className="p-8 ">
            <div className="flex justify-center p-8">
                <p className="text-2xl text-black leading-6">{text}</p>
            </div>
            <div className="flex justify-center">
                <PinkButton label="Sulge" onClick={onClick} className="px-6 py-3 text-lg"/>
            </div>
        </div>
    );
};

export default MessageTemplate;
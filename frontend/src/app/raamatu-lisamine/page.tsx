"use client"

import type { NextPage } from 'next';
import { useState, useCallback, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../../components/header';
import Footer from '../../components/footer/footer';
import PinkButton from '@/components/buttons/pink_button';
import Popup from '@/components/popup/popup';
import TextField from '@/components/field/text_field';
import MessageTemplate from '@/components/popup/popup_message_template';
import { useLoginService } from '@/components/login/login_service';

const Book: NextPage = () => {
    const [isBookSuccessOpen, setBookSuccessOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const { isLoggedIn, handleLoginLogout, userId } = useLoginService(); // Assume userId is provided by useLoginService
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [category, setCategory] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState<number>();
    const [picture, setPicture] = useState<File | null>(null);
    const router = useRouter();

    const validateFormData = () => {
        if (!title || !author || !category || !description || price === undefined || price < 0) {
            return "Kõik väljad peavad olema täidetud korrektselt.";
        }
        return null;
    };

    const postFormData = useCallback(async () => {
        const validationError = validateFormData();
        if (validationError) {
            setErrorMessage(validationError);
            return;
        }
        const formData = new FormData();
        formData.append('title', title);
        formData.append('author', author);
        formData.append('category', category); // Ensure category is appended correctly
        formData.append('description', description);
        formData.append('price', price?.toFixed(2) || ''); // Ensure price is formatted as a string with two decimal places
        formData.append('userId', userId !== null ? userId.toString() : "1"); // Append userId to the form data
        if (picture) {
            formData.append('picture', picture);
        }
    
        // Debug FormData
        for (const pair of formData.entries()) {
            console.log(`${pair[0]}: ${pair[1]}`);
        }
    
        try {
            const response = await fetch('http://localhost:8080/addBook', {
                method: 'POST',
                body: formData,
            });
    
            if (response.ok) {
                setBookSuccessOpen(true);
                setErrorMessage(null);
            } else {
                const errorText = await response.text();
                setErrorMessage(`Failed to add book: ${errorText}`);
            }
        } catch (error) {
            if (error instanceof Error) {
                console.error("Error message:", error.message);
              } else {
                console.error("Unexpected error:", error);
              }
        }
    }, [title, author, category, description, price, picture, userId]);

    const closeBookSuccess = useCallback(() => {
        setBookSuccessOpen(false);
    }, []);

    const onBookButtonClick = useCallback(() => {
        if (router) {
            router.push('/');
        }
    }, [router]);

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setPicture(e.target.files[0]);
        }
    };

    const handlePriceChange = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        const parsedValue = parseFloat(value);
        if (!isNaN(parsedValue)) {
            setPrice(parsedValue);
        } else {
            setPrice(undefined); // Reset to undefined if the input is invalid
        }
    };

    return (
        <div className="max-w-[1920px] mx-auto grid grid-rows-[auto_1fr_auto] items-center justify-items-center min-h-screen gap-8 sm:gap-16 font-[family-name:var(--font-geist-sans)]">
            <Header isLoggedIn={isLoggedIn} onLoginLogout={handleLoginLogout} />
            <main className="flex flex-col items-center justify-center w-full min-h-[80vh] gap-12 sm:gap-24 mx-auto px-4 sm:px-6">
                <h1 className="text-[32px] sm:text-[48px] text-pink-600 font-serif text-left mt-5 pr-[20%] sm:pr-[60%]">
                    Lisa raamat
                </h1>
                <section className="w-full max-w-[885px] flex flex-col gap-5 mt-10">
                    <TextField fieldPrompt='Raamatu nimi' setInput={setTitle} />
                    <TextField fieldPrompt='Autor' setInput={setAuthor} />
                    <div className="flex flex-col gap-2">
                        <label className="text-[25px] text-pink-600">Kategooria</label>
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="w-full p-2 border border-pink-600 text-gray-600 rounded-lg focus:outline-none focus:border-black focus:text-black transition-all"
                        >
                            <option value="">Valige kategooria</option>
                            <option value="Ajalugu">Ajalugu</option>
                            <option value="Ilukirjandus">Ilukirjandus</option>
                            <option value="Kodu ja Aed">Kodu ja Aed</option>
                            <option value="Lastekirjandus">Lastekirjandus</option>
                        </select>
                    </div>

                    <TextField fieldPrompt='Kirjeldus' setInput={setDescription} />
                    <TextField 
                        fieldPrompt='Hind' 
                        setInput={(value) => {
                            const parsedValue = parseFloat(value);
                            if (!isNaN(parsedValue)) {
                                setPrice(parsedValue);
                            } else {
                                setPrice(undefined);
                            }
                        }} 
                        inputType="number"
                        step="0.01"
                        value={price?.toString() || ''}
                    />
                    <div className="flex flex-col gap-2">
                        <label className="text-lg">Pilt</label>
                        <input
                            type="file"
                            accept="image/*"
                            className="w-full p-2 border rounded"
                            onChange={handleFileChange}
                        />
                        {picture && (
                            <div className="mt-4">
                                <img 
                                    src={URL.createObjectURL(picture)}
                                    alt="Book preview"
                                    className="max-w-full max-h-[200px] object-contain"
                                />
                            </div>
                        )}
                    </div>
                    {errorMessage && (
                        <div className="text-red-500 text-center mt-4">
                            {errorMessage}
                        </div>
                    )}
                    <div className="flex justify-end">
                        <PinkButton onClick={postFormData} label='Lisa raamat'/>
                    </div>
                    {isBookSuccessOpen && (
                        <Popup isVisible={isBookSuccessOpen} onClose={closeBookSuccess}>
                            <MessageTemplate text='Raamat on lisatud!' onClick={closeBookSuccess} />
                        </Popup>
                    )}
                </section>
            </main>
            <Footer />
        </div>
    );
};

export default Book;

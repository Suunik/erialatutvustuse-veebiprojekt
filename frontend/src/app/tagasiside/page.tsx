"use client";

import type { NextPage } from 'next';
import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/compat/router';
import MessageTemplate from '@/components/popup/popup_message_template';
import Header from '../../components/header';
import Footer from '../../components/footer/footer';
import PinkButton from '@/components/buttons/pink_button';
import Popup from '@/components/popup/popup';
import TextField from '@/components/field/text_field';
import RecommendationRadio from '@/components/field/recommendation_radio';

const Feedback: NextPage = () => {
    const [isFeedbackSuccessOpen, setFeedbackSuccessOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [likesInput, setLikesInput] = useState('');
    const [dislikesInput, setDislikesInput] = useState('');
    const [recommendationValue, setRecommendationValue] = useState<boolean | null>(null);

    useEffect(() => {
        const userData = sessionStorage.getItem('user');
        if (userData) {
            const user = JSON.parse(userData);
            setIsLoggedIn(user.isLoggedIn);
        }
    }, []);

    const handleLoginLogout = () => {
        if (isLoggedIn) {
            sessionStorage.removeItem('user');
        }
        setIsLoggedIn(!isLoggedIn);
    };

    const postFormData = useCallback(async () => {
        const formData = {
            likes: likesInput,
            dislikes: dislikesInput,
            recommendation: recommendationValue,
        };

        try {
            const response = await fetch('http://localhost:8080/addFeedback', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                setFeedbackSuccessOpen(true);
            } else {
                console.error('Failed to submit feedback');
            }
        } catch (error) {
            console.error('Error submitting feedback:', error);
        }
    }, [likesInput, dislikesInput, recommendationValue]);

    const closeFeedbackSuccess = useCallback(() => {
        setFeedbackSuccessOpen(false);
    }, []);

    return (
        <div className="max-w-[1920px] mx-auto min-h-screen flex flex-col items-center justify-between font-[family-name:var(--font-geist-sans)]">
            <Header isLoggedIn={isLoggedIn} onLoginLogout={handleLoginLogout} />

            <div className="flex flex-col items-center justify-center w-full max-w-[90%] pt-20 pb-20 md:max-w-[70%] lg:max-w-[50%] min-h-[70vh] gap-8">
                {/* Title */}
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-pink-600 text-left w-full">
                    Tagasiside
                </h1>

                {/* Form */}
                <div className="w-full flex flex-col gap-6">
                    <TextField fieldPrompt="Mis meeldib?" setInput={setLikesInput} />
                    <TextField fieldPrompt="Mis ei meeldi?" setInput={setDislikesInput} />
                    <RecommendationRadio
                        recommendationValue={recommendationValue}
                        setRecommendationValue={setRecommendationValue}
                    />
                    <div className="flex justify-end">
                        <PinkButton onClick={postFormData} label="Saada vastus" className="py-3 px-6" />
                    </div>
                </div>

                {/* Success Popup */}
                {isFeedbackSuccessOpen && (
                    <Popup isVisible={isFeedbackSuccessOpen} onClose={closeFeedbackSuccess}>
                        <MessageTemplate text='Aitäh tagasiside eest!' onClick={closeFeedbackSuccess} />
                    </Popup>
                )}
            </div>

            <Footer />
        </div>
    );
};

export default Feedback;

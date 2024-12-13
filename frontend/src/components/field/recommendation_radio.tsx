"use client";

import React from "react";

interface RecommendationProps {
    recommendationValue: boolean | null;
    setRecommendationValue: (value: boolean) => void;
}

const RecommendationRadio: React.FC<RecommendationProps> = ({
    recommendationValue,
    setRecommendationValue,
}) => {
    return (
        <div className="flex flex-col gap-3">
            <div className="text-[25px] text-pink-600">Soovitaksite sõbrale?</div>
            <div className="flex gap-5 items-center">
                <label className="flex items-center gap-2 cursor-pointer">
                    <input
                        type="radio"
                        name="recommendation"
                        className="w-5 h-5 text-pink-600 focus:ring-pink-600"
                        value="true"
                        checked={recommendationValue === true}
                        onChange={() => setRecommendationValue(true)}
                    />
                    <span className="text-[20px] text-gray-700">Jah</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                    <input
                        type="radio"
                        name="recommendation"
                        className="w-5 h-5 text-pink-600 focus:ring-pink-600"
                        value="false"
                        checked={recommendationValue === false}
                        onChange={() => setRecommendationValue(false)}
                    />
                    <span className="text-[20px] text-gray-700">Ei</span>
                </label>
            </div>
        </div>
    );
};

export default RecommendationRadio;

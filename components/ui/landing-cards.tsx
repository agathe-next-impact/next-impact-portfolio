import React from 'react';
import Image from 'next/image';
import { MagicCard } from '../magicui/magic-card';
import { title } from 'process';

interface CardProps {
    imageUrl: string;
    title: string;
    text: string;
}

const LandingCard: React.FC<CardProps> = ({ imageUrl, title, text }) => {
    return (
        <div className="relative flex basis-2/5 flex-col rounded-2xl bg-white bg-clip-border border border-from-lightblue border-to-pink-400 transition-all duration-300 ease-in-out hover:scale-105 ">
            <div className="relative mx-4 -mt-6 h-60 overflow-hidden rounded-xl bg-blue-gray-500 bg-clip-border text-white ">
                <Image
                    src={imageUrl}
                    alt="Card Image"
                    width={320}
                    height={240}
                    className="h-full w-full object-cover object-top"
                />
            </div>
            <div className="pb-3 px-4">
                <h3 className="block font-googletitre text-xl font-medium text-regularblue">
                    {title}
                </h3>
                <p className="text-mediumblue font-light">
                    {text}
                </p>
            </div>
        </div>
    );
}

export default LandingCard;

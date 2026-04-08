"use client";

import { ChevronDown } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

interface QuestionsListProps {
    mainImage: string;
    mainTitle: string;
    mainDescription: string;
    resourcesTitle: string;
    ctaButtons: {
        href: string;
        text: string;
        image: string;
    }[];
}

export default function Question({
    mainImage,
    mainTitle,
    mainDescription,
    resourcesTitle,
    ctaButtons,
}: QuestionsListProps) {
    const [showResources, setShowResources] = useState(false);
    const resourcesRef = useRef<HTMLDivElement>(null);

    return (
            <div className='col-span-1 flex flex-row gap-4 relative'>
                <div>
                    <div
                        className='flex gap-4 relative items-center justify-center bg-white rounded-lg p-4 transition-all duration-300 ease-in-out'
                        onClick={() => {
                            setShowResources((prev) => !prev); // Bascule l'état
                        }}
                    >
                        <Image
                            src={mainImage}
                            alt="Main Image"
                            width={100}
                            height={100}
                            className="mx-auto"
                        />
                        <div>
                            <h3 className="text-xl font-bold text-regularblue mb-2">{mainTitle}</h3>
                            <p>{mainDescription}</p>
                        </div>
                        <ChevronDown
                            className={`text-regularblue cursor-pointer transition-transform duration-300 ${
                                showResources ? 'rotate-180' : ''
                            }`}
                            size={48}
                        />
                    </div>
                    {/* Resources Section */}
                    <motion.div
                        ref={resourcesRef}
                        initial={{ height: 0, opacity: 0, translateY: -20 }}
                        animate={
                            showResources
                                ? { height: "13rem", opacity: 1, translateY: 0 }
                                : { height: 0, opacity: 0, translateY: -20 }
                        }
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                        className="absolute left-0 top-full w-full flex flex-col justify-between bg-white rounded-lg p-2 overflow-hidden z-10"
                    >
                        <div className="h-full p-4 flex flex-col items-center justify-between">
                            <h3 className="text-xl font-bold text-center text-regularblue mb-2">
                                {resourcesTitle}
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
                                {ctaButtons.map((button, index) => (
                                    <Link
                                        key={index}
                                        href={button.href}
                                        className={`pl-2 mx-auto text-sm font-medium text-regularblue ${
                                            index === ctaButtons.length - 1 ? 'col-span-2' : 'col-span-1'
                                        }`}
                                    >
                                        <Button className="gap-1 rounded-3xl bg-white border border-regularblue/30 hover:bg-regularblue/10 text-darkblue-600 transition-all duration-900 ease-in-out">
                                            <Image
                                                src={button.image}
                                                alt={button.text}
                                                width={20}
                                                height={20}
                                                className="mr-2"
                                            />
                                            {button.text}
                                        </Button>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
    );
}

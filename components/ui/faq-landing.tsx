import React from "react";
import Image from "next/image";

    type FaqItem = {
        question: string;
        answer: string;
    };

    type FaqLandingProps = {
        title?: string;
        image?: string;
        imageAlt?: string;
        items: FaqItem[];
    };

    export const FaqLanding: React.FC<FaqLandingProps> = ({
        title = "Foire aux questions",
        image,
        imageAlt,
        items,
    }) => (
        <section className="container mx-auto px-4 py-16">
            <div className="text-center mb-12">
                <h2 className="text-4xl font-medium text-regularblue mb-4">{title}</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="col-span-1 place-content-center">
                    <Image
                        src={image || "/placeholder.png"}
                        alt={imageAlt || "FAQ Image"}
                        width={300}
                        height={300}
                        className="w-3/4 mx-auto rounded-2xl overflow-hidden"
                    />
                </div>

                <div className="grid col-span-2 gap-8 max-w-3xl mx-auto">
                    {items.map((item, idx) => (
                        <div key={idx}>
                            <h3 className="font-semibold text-regularblue mb-2">{item.question}</h3>
                            <p className="text-mediumblue">{item.answer}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );

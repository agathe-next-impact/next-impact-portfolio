import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CheckCircle } from "lucide-react";

type Offer = {
    badge: string;
    title: string;
    description: string;
    price: string;
    features: string[];
    button: {
        label: string;
        href: string;
        external?: boolean;
    };
    highlighted?: boolean;
};

type TarifsLandingProps = {
    sectionTitle: string;
    sectionSubtitle: string;
    offers: Offer[];
};

export function TarifsLanding({
    sectionTitle,
    sectionSubtitle,
    offers,
}: TarifsLandingProps) {
    return (
        <section id="tarifs" className="container mx-auto px-4 pt-8 pb-16">
            <div className="text-center mb-12">
                <h2 className="text-4xl font-medium text-regularblue mb-4">
                    {sectionTitle}
                </h2>
                <p className="text-lg text-regularblue/80">{sectionSubtitle}</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                {offers.map((offer, idx) => {
                    const CardTag = offer.button.external ? "a" : Link;
                    const cardProps = offer.button.external
                        ? {
                                href: offer.button.href,
                                target: "_blank",
                                rel: "noopener noreferrer",
                                className: "w-full block",
                            }
                        : {
                                href: offer.button.href,
                                className: "w-full",
                            };
                    return (
                        <Card
                            key={offer.title}
                            className={offer.highlighted ? "border-lightblue/30 " : ""}
                        >
                            <CardHeader>
                                <Badge className="w-fit mb-4 font-medium uppercase bg-lightblue/10 text-mediumblue">
                                    {offer.badge}
                                </Badge>
                                <CardTitle className="text-2xl font-medium text-regularblue">
                                    {offer.title}
                                </CardTitle>
                                <CardDescription className="text-mediumblue">
                                    {offer.description}
                                </CardDescription>
                                <div className="text-3xl font-medium text-regularblue mt-2">
                                    {offer.price}
                                </div>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-2 text-mediumblue">
                                    {offer.features.map((feature) => (
                                        <li key={feature} className="flex items-center gap-2 text-sm">
                                            <CheckCircle className="h-4 w-4 text-regularblue" />
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                                <CardTag {...cardProps}>
                                    <Button className="w-full mt-6 rounded-full bg-regularblue hover:bg-regularblue/80">
                                        {offer.button.label}
                                    </Button>
                                </CardTag>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
        </section>
    );
}

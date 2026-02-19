"use client";

import React from "react";

interface PageLayoutProps {
    titre: string;
    sousTitre?: string;
    children?: React.ReactNode;
}

const PageLayout: React.FC<PageLayoutProps> = ({ titre, sousTitre, children }) => (
    <div className="relative w-full min-h-screen flex flex-col">
        {/* Layout principal */}
        <section className="relative w-full pt-4 md:pt-8 lg:pt-12 xl:pt-12">
            <div className="container px-4 md:px-6">
                <div className="flex justify-center space-y-4 py-8">
                    <h1 className="font-medium text-center text-white">{titre}</h1>
                </div>
                {sousTitre && (
                    <p className="text-xl text-white/80 text-center max-w-2xl mx-auto">{sousTitre}</p>
                )}
            </div>
        </section>
        {/* Contenu principal de la page */}
        <main className="relative z-20 flex-1 flex flex-col">
            {children}
        </main>
    </div>
);

export default PageLayout;
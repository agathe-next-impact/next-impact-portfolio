"use client";

import { useState } from "react";

interface TableOfContentsPopupProps {
  tableOfContents: { id: string; text: string; level: number }[];
}

export default function TableOfContentsPopup({ tableOfContents }: TableOfContentsPopupProps) {
  // Affichage direct de la table des matières, sans bouton et sans puces
  const getClassByLevel = (level: number) => {
    switch (level) {
      case 1:
        return "text-lg font-bold text-mediumblue/90";
      case 2:
        return "text-base font-medium text-mediumblue mb-8";
      case 3:
        return "text-sm font-normal text-mediumblue/80 mb-8";
      default:
        return "text-sm font-normal text-gray-500";
    }
  };

  return (
    <nav className="relative w-full h-max bg-darkblue/80 pl-4 pt-2 pb-2 pr-2 rounded-lg">
      <ol className="h-max space-y-8 list-decimal m-0">
        {tableOfContents
          .filter((item) => item.level === 2)
          .map((item) => (
            <li key={item.id} className={getClassByLevel(item.level)}>
              <a
                href={`#${item.id}`}
                className="text-white hover:text-lightblue transition-colors duration-200"
              >
                {item.text}
              </a>
            </li>
          ))}
      </ol>
    </nav>
  );
}
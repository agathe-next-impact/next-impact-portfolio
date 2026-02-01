"use client";

import React, { useRef } from "react";
import { CDCCard } from "@/components/tools";

export default function Process() {

  const timelineRef = useRef<HTMLDivElement>(null);

    return (
        <section className="container mx-auto px-4 md:py-24">
          <div className="w-max mx-auto text-center mb-12 bg-mediumblue/70 backdrop-blur-xl p-6 rounded-2xl border border-lightblue/20">
            <h2 className="text-3xl md:text-4xl font-medium text-white mb-4">
              Projet en 5 étapes
            </h2>
            <p className="text-lg text-white/80">
              Un processus rodé pour votre réussite
            </p>
          </div>
          <div className="relative max-w-4xl mx-auto" ref={timelineRef}>
            {/* Ligne centrale dégradée */}
            <div
              className="h-full bg-white/20 absolute left-1/2 top-0 w-[1px] -translate-x-1/2 rounded-full pointer-events-none"
            />
            <ol className="relative z-10 grid md:grid-cols-1 gap-0">
              {[
                {
                  step: "1",
                  title: "Analyse & Cadrage",
                  duration: "1 semaine",
                  description: "Audit de l'existant et définition des besoins",
                },
                {
                  step: "2",
                  title: "Conception & Validation",
                  duration: "2 semaines",
                  description: "Wireframes, maquettes et validation",
                },
                {
                  step: "3",
                  title: "Développement",
                  duration: "3-4 semaines",
                  description: "Développement et intégration",
                },
                {
                  step: "4",
                  title: "Optimisation & Tests",
                  duration: "1 semaine",
                  description: "Performance, SEO et formation équipes",
                },
                {
                  step: "5",
                  title: "Mise en Ligne",
                  duration: "1 semaine",
                  description: "Migration, tests et support",
                },
              ].map((phase, index, arr) => (
                <li
                  key={index}
                  className="relative flex md:items-center py-8 group"
                >
                  {/* Point de timeline */}
                  <div className="absolute left-1/2 -translate-x-1/2 z-10">
                    <div className="w-5 h-5 bg-coral rounded-full flex items-center justify-center font-googletitre text-xs text-transparent">
                      {phase.step}
                    </div>
                  </div>
                  {/* Contenu */}
                  <div
                    className={`w-full md:pt-0 pt-4 md:w-1/2 px-8 ${
                      index % 2 === 0
                        ? "ml-auto text-left"
                        : "mr-auto text-left"
                    }`}
                  >
                    <div className="bg-mediumblue/80 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
                      <div className="flex flex-col items-start gap-4 md:gap-2 mb-2">
                        <div className="text-sm px-2 py-1 rounded-full bg-lightblue/20 text-white/80 font-medium">
                          {phase.duration}
                        </div>
                        <div className="text-xl font-googletitre font-medium text-lightyellow">
                          {phase.title}
                        </div>
                      <p className="text-lg md:text-base text-white/80 text-left">
                        {phase.description}
                      </p>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </div>


        </section>
    );
}
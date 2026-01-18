"use client";

import React, { useRef } from "react";
import { CDCCard } from "@/components/tools";

export default function Process() {

  const timelineRef = useRef<HTMLDivElement>(null);

    return (
        <section className="container mx-auto px-4 py-24">
          <div className="text-center mb-12">
            <h2 className="text-5xl font-medium text-regularblue mb-4">
              Méthode éprouvée en 5 étapes
            </h2>
            <p className="text-lg text-regularblue/80">
              Un processus rodé pour votre réussite
            </p>
          </div>

          <div className="relative max-w-4xl mx-auto" ref={timelineRef}>
            {/* Ligne centrale dégradée */}
            <div
              className="absolute left-1/2 top-0 w-[1px] -translate-x-1/2 rounded-full pointer-events-none"
              style={{
                height: "100%",
                background:
                  "linear-gradient(to bottom, lightyellow 0%, coral 100%)", // pink-300 -> blue-300
              }}
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
                  title: "Mise en Ligne et formation",
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
                    <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center font-googletitre text-lg text-regularblue">
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
                    <div className="bg-white rounded-2xl border border-lightyellow/50 p-6">                        
                    <span className="w-max text-xs px-2 py-1 rounded-full bg-lightblue/20 text-regularblue font-medium">
                          {phase.duration}
                        </span>
                      <div className="flex md:flex-row flex-col items-center gap-2 mb-2 mt-4">
                        <span className="text-2xl font-googletitre font-medium text-regularblue">
                          {phase.title}
                        </span>
                      </div>
                      <p className="text-mediumblue md:text-left text-center">
                        {phase.description}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </div>


        </section>
    );
}
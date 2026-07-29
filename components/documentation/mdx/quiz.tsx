"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { CheckCircle, XCircle, HelpCircle } from "lucide-react";

interface QuizProps {
  question: string;
  options: string[];
  answer: number;
  explanation?: string;
}

export function Quiz({ question, options, answer, explanation }: QuizProps) {
  const [selected, setSelected] = useState<number | null>(null);
  if (!options || !Array.isArray(options)) return null;
  const answered = selected !== null;
  const correct = selected === answer;

  return (
    <div className="my-8 rounded-2xl border border-extralightblue bg-extralightblue/20 p-3 sm:p-5">
      <div className="flex items-start gap-2 sm:gap-3 mb-3 sm:mb-4">
        <HelpCircle className="h-5 w-5 text-regularblue shrink-0 mt-0.5" />
        <p className="font-googletitre font-medium text-darkblue text-sm">{question}</p>
      </div>
      <div className="space-y-2 ml-0 sm:ml-8">
        {options.map((option, i) => (
          <button
            key={i}
            onClick={() => !answered && setSelected(i)}
            disabled={answered}
            className={cn(
              "w-full text-left rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-googletexte transition-all border",
              !answered && "hover:bg-regularblue/5 border-extralightblue cursor-pointer",
              answered && i === answer && "bg-green-50 border-green-300 text-green-800",
              answered && i === selected && i !== answer && "bg-coral/5 border-coral/30 text-coral",
              answered && i !== answer && i !== selected && "opacity-50 border-extralightblue",
              !answered && "border-extralightblue text-mediumblue/80"
            )}
          >
            <div className="flex items-center gap-2 sm:gap-3">
              <span className={cn(
                "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-medium",
                answered && i === answer ? "bg-green-200 text-green-800" :
                answered && i === selected ? "bg-coral/20 text-coral" :
                "bg-regularblue/10 text-regularblue"
              )}>
                {answered && i === answer ? <CheckCircle className="h-4 w-4" /> :
                 answered && i === selected ? <XCircle className="h-4 w-4" /> :
                 String.fromCharCode(65 + i)}
              </span>
              <span>{option}</span>
            </div>
          </button>
        ))}
      </div>
      {answered && explanation && (
        <div className={cn(
          "mt-3 sm:mt-4 ml-0 sm:ml-8 rounded-xl px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-googletexte",
          correct ? "bg-green-50 text-green-800" : "bg-orange/5 text-mediumblue/80"
        )}>
          <p className="font-medium mb-1">{correct ? "Bonne réponse !" : "Pas tout à fait..."}</p>
          <p>{explanation}</p>
        </div>
      )}
    </div>
  );
}

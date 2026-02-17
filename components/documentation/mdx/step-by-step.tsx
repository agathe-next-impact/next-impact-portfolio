"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface Step {
  title: string;
  children: ReactNode;
}

interface StepByStepProps {
  children: ReactNode;
}

export function StepByStep({ children }: StepByStepProps) {
  return (
    <div className="my-8 relative">
      <div className="space-y-0">
        {children}
      </div>
    </div>
  );
}

interface StepProps {
  number: number;
  title: string;
  children: ReactNode;
}

export function Step({ number, title, children }: StepProps) {
  return (
    <div className="relative pl-12 pb-8 last:pb-0">
      {/* Vertical line */}
      <div className="absolute left-[15px] top-10 bottom-0 w-px bg-extralightblue last:hidden" />
      {/* Number circle */}
      <div className="absolute left-0 top-0 flex h-8 w-8 items-center justify-center rounded-full bg-regularblue/10 border border-regularblue/20">
        <span className="text-sm font-googletitre font-bold text-regularblue">{number}</span>
      </div>
      {/* Content */}
      <div>
        <h4 className="font-googletitre font-medium text-darkblue text-base mb-2 !mt-0 !pt-0">
          {title}
        </h4>
        <div className="text-mediumblue/80 text-sm font-googletexte [&>p]:mb-2 [&>p:last-child]:mb-0">
          {children}
        </div>
      </div>
    </div>
  );
}

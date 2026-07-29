import React from "react";

export default function SummaryBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="my-6 p-6 rounded-xl border border-coral/30 bg-coral/10 text-mediumblue text-lg font-medium">
      <pre>{children}</pre>
    </div>
  );
}
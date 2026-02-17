"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Check, X, Minus } from "lucide-react";

interface ComparisonTableProps {
  headers: [string, string];
  rows: { label: string; left: string | boolean; right: string | boolean }[];
  highlight?: "left" | "right";
}

function CellValue({ value }: { value: string | boolean }) {
  if (value === true) return <Check className="h-4 w-4 text-green-600 mx-auto" />;
  if (value === false) return <X className="h-4 w-4 text-coral mx-auto" />;
  if (value === "-") return <Minus className="h-4 w-4 text-mediumblue/80 mx-auto" />;
  return <span className="text-mediumblue/80 text-sm">{value}</span>;
}

export function ComparisonTable({ headers, rows, highlight }: ComparisonTableProps) {
  if (!headers || !rows || !Array.isArray(rows)) return null;
  return (
    <div className="my-8 overflow-x-auto rounded-2xl border border-extralightblue">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr>
            <th className="text-left px-2 sm:px-4 py-2 sm:py-3 bg-extralightblue/50 text-darkblue font-googletitre font-medium border-b border-extralightblue w-1/3 text-xs sm:text-sm" />
            <th className={cn(
              "text-center px-2 sm:px-4 py-2 sm:py-3 font-googletitre font-medium border-b border-extralightblue text-xs sm:text-sm",
              highlight === "left" ? "bg-regularblue/10 text-regularblue" : "bg-extralightblue/50 text-darkblue"
            )}>
              {headers[0]}
            </th>
            <th className={cn(
              "text-center px-2 sm:px-4 py-2 sm:py-3 font-googletitre font-medium border-b border-extralightblue text-xs sm:text-sm",
              highlight === "right" ? "bg-regularblue/10 text-regularblue" : "bg-extralightblue/50 text-darkblue"
            )}>
              {headers[1]}
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="hover:bg-regularblue/5 transition-colors">
              <td className="px-2 sm:px-4 py-2 sm:py-3 text-darkblue font-googletexte font-medium border-b border-extralightblue/50 text-xs sm:text-sm">
                {row.label}
              </td>
              <td className={cn(
                "text-center px-2 sm:px-4 py-2 sm:py-3 border-b border-extralightblue/50",
                highlight === "left" && "bg-regularblue/5"
              )}>
                <CellValue value={row.left} />
              </td>
              <td className={cn(
                "text-center px-2 sm:px-4 py-2 sm:py-3 border-b border-extralightblue/50",
                highlight === "right" && "bg-regularblue/5"
              )}>
                <CellValue value={row.right} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

import { Leaf } from "lucide-react";

export function EcoScoreFooter() {
  return (
    <div className="w-full border-t border-lightblue/10 py-4">
      <div className="container flex items-center justify-center gap-2.5 px-4">
        <Leaf className="h-3.5 w-3.5 text-white/80" />
        <p className="text-xs text-white/80 font-googletexte tracking-wide">
          Empreinte carbone : Faible (0.12g)
        </p>
      </div>
    </div>
  );
}

import { Leaf } from "lucide-react";

export function EcoScoreFooter() {
  return (
    <div style={{
      width: "100%",
      borderTop: "1px solid var(--rule)",
      padding: "0.875rem 0",
    }}>
      <div className="container" style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "0.5rem",
      }}>
        <Leaf style={{ width: "0.875rem", height: "0.875rem", color: "var(--muted-color)" }} />
        <p className="annot" style={{ letterSpacing: "0.06em" }}>
          Empreinte carbone : Faible (0.12g)
        </p>
      </div>
    </div>
  );
}

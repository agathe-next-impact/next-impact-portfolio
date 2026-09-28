import {
  Accessibility,
  Bot,
  ChartLine,
  FileCode2,
  FileText,
  Gauge,
  GitBranch,
  Lightbulb,
  Lock,
  Map,
  MousePointerClick,
  Search,
  Server,
  ShieldCheck,
  Wrench,
  type LucideIcon,
} from "lucide-react";

// ─────────────────────────────────────────────────────────────────────────────
// L'icône d'une partie d'audit, choisie d'après son titre.
//
// Notion porte un émoji par sous-page (🔐, 🚀…) : son rendu change d'un système
// à l'autre et jure avec le reste de l'espace, tout en traits. On garde l'idée
// (un repère visuel par partie), pas l'émoji. Le premier motif qui correspond
// l'emporte ; à défaut, une page.
// ─────────────────────────────────────────────────────────────────────────────

const MOTIFS: [RegExp, LucideIcon][] = [
  [/preconis|recommand|synthese/, Lightbulb],
  [/securi/, ShieldCheck],
  [/perform|vitesse|web vitals/, Gauge],
  [/code|fichier|developpe/, FileCode2],
  [/plateforme|technique|serveur|heberg|infra/, Server],
  [/roadmap|feuille de route|plan d/, Map],
  [/scenario|option/, GitBranch],
  [/analytics|audience|trafic|statisti|addendum/, ChartLine],
  [/seo|referencement|recherche/, Search],
  [/\bia\b|geo|intelligence artificielle/, Bot],
  [/accessib/, Accessibility],
  [/rgpd|donnees|confidential/, Lock],
  [/ux|ergonom|parcours/, MousePointerClick],
  [/maintenance|exploitation/, Wrench],
];

function normaliser(texte: string): string {
  return texte.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
}

export function iconePartie(titre: string): LucideIcon {
  const t = normaliser(titre);
  return MOTIFS.find(([motif]) => motif.test(t))?.[1] ?? FileText;
}

export function IconePartie({ titre, className = "h-[1em] w-[1em]" }: { titre: string; className?: string }) {
  const Icone = iconePartie(titre);
  return <Icone aria-hidden className={`shrink-0 ${className}`} strokeWidth={1.5} />;
}

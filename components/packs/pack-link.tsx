import type * as React from "react";
import { Link } from "@/i18n/navigation";
import { packHref, type Situation } from "@/lib/situations";

type Href = Parameters<typeof Link>[0]["href"];

/**
 * Le lien d'un pack : sa page, ou, pour un pack sans page (`lienExterne`,
 * Arbitrage), son lien externe dans un nouvel onglet. Un seul endroit décide,
 * pour que les cartes, les badges et les listes ne pointent jamais vers une
 * page qui n'existe pas.
 */
export function PackLink({
  situation,
  className,
  children,
}: {
  situation: Situation;
  className?: string;
  children: React.ReactNode;
}) {
  if (situation.lienExterne) {
    return (
      <a href={situation.lienExterne} target="_blank" rel="noopener noreferrer" className={className}>
        {children}
      </a>
    );
  }
  return (
    <Link href={packHref(situation.slug) as Href} className={className}>
      {children}
    </Link>
  );
}

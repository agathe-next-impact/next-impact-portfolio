import * as React from "react";

/**
 * Tableau comparatif NOMMÉ — enveloppe un tableau markdown et lui injecte un
 * vrai `<caption>` en premier enfant du `<table>`.
 *
 * C'est le format le plus repris par les moteurs de réponse : un tableau HTML
 * légendé est extractible tel quel, là où un comparatif en image est invisible.
 * Le gabarit GEO impose cette forme pour tout comparatif.
 *
 * Usage en MDX (lignes vides obligatoires autour du tableau) :
 *
 *   <DataTable caption="Ce que vous récupérez selon la famille d'outil">
 *
 *   | Colonne A | Colonne B |
 *   |---|---|
 *   | … | … |
 *
 *   </DataTable>
 */
export function DataTable({
  caption,
  children,
}: {
  caption: string;
  children?: React.ReactNode;
}) {
  const nodes = React.Children.toArray(children);
  const table = nodes.find(
    (node): node is React.ReactElement<{ children?: React.ReactNode }> =>
      React.isValidElement(node) && node.type === "table",
  );

  // Pas de tableau à l'intérieur : on ne casse pas le rendu, on laisse passer.
  if (!table) return <>{children}</>;

  const captionEl = (
    <caption
      key="caption"
      className="caption-top pb-3 text-left font-mono text-[10px] uppercase tracking-[0.14em] text-mid-gray"
    >
      {caption}
    </caption>
  );

  return (
    <div className="my-8 overflow-x-auto">
      {React.cloneElement(
        table,
        {},
        captionEl,
        ...React.Children.toArray(table.props.children),
      )}
    </div>
  );
}

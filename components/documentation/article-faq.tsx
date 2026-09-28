// FAQ d'un article de documentation, lue dans le front matter (`faq:`) — la
// même source que le JSON-LD FAQPage de la page. Accordéon natif <details>
// (100 % SSR, sans JS), même rendu que la FAQ de la home : Google exige que
// les questions balisées soient visibles dans la page.
//
// Rendue seulement quand le corps de l'article n'a pas déjà sa propre section
// FAQ (voir hasFaqSection) : sinon les questions apparaîtraient deux fois.

import { Plus } from "lucide-react";
import type { ArticleFaqEntry } from "@/lib/markdown";

/** Vrai quand le corps porte déjà un titre « Questions fréquentes » ou « FAQ ». */
export function hasFaqSection(content: string): boolean {
  return /^#{2,4}\s.*(questions fr[ée]quentes|faq|frequently asked)/im.test(content);
}

export function ArticleFaq({
  entries,
  locale,
}: {
  entries: ArticleFaqEntry[];
  locale: string;
}) {
  return (
    <section className="mt-10" aria-labelledby="article-faq">
      {/* Titre dans .doc-prose : même style que les h2 du corps de l'article. */}
      <div className="doc-prose">
        <h2 id="article-faq">
          {locale === "en" ? "Frequently asked questions" : "Questions fréquentes"}
        </h2>
      </div>
      <div className="mt-6 border-t border-dark-gray">
        {entries.map((entry) => (
          <details key={entry.question} className="group border-b border-dark-gray">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 [&::-webkit-details-marker]:hidden">
              <span className="font-inter-tight text-base font-regular text-foreground">
                {entry.question}
              </span>
              <Plus
                size={16}
                aria-hidden="true"
                className="shrink-0 text-mid-gray transition-transform group-open:rotate-45"
              />
            </summary>
            <p className="max-w-3xl pb-6 font-inter-tight text-base leading-relaxed text-mid-gray">
              {entry.answer}
            </p>
          </details>
        ))}
      </div>
    </section>
  );
}

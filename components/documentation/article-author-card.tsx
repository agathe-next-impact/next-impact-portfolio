import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";

/**
 * Encart auteur de fin d'article — composant UNIQUE partagé par tous les
 * articles du gabarit (jamais dupliqué). Signe le contenu d'une personne
 * identifiable : c'est le pendant visible du nœud `Person` du JSON-LD, et un
 * des signaux E-E-A-T les plus lus par les moteurs de réponse.
 *
 * Chiffres de parcours : référence unique — 20 ans d'expérience digitale, dont
 * 6 en développement.
 */
export function ArticleAuthorCard({ locale }: { locale: Locale }) {
  const t =
    locale === "en"
      ? {
          kicker: "Written by",
          name: "Agathe Karinthi-Martin",
          role: "20 years of digital experience, 6 in development",
          blurb:
            "Independent web tech advisor — I help small organizations decide what to build, with which technology, and how far to go.",
          link: "About me",
        }
      : {
          kicker: "Écrit par",
          name: "Agathe Karinthi-Martin",
          role: "20 ans d'expérience digitale, dont 6 en développement",
          blurb:
            "Conseil techno web indépendant — j'aide les petites structures à décider quoi construire, avec quelle technologie, et jusqu'où aller.",
          link: "À propos",
        };

  return (
    <aside className="flex flex-col gap-5 border border-dark-gray bg-jet/30 p-6 sm:flex-row sm:items-start sm:gap-6 md:p-8">
      <Image
        src="/img/agathe.png"
        alt={t.name}
        width={80}
        height={80}
        sizes="80px"
        className="h-20 w-20 shrink-0 rounded-sm border border-dark-gray object-cover"
      />
      <div className="flex flex-col gap-2">
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-mid-gray">
          {t.kicker}
        </p>
        <p className="text-base font-medium text-foreground">{t.name}</p>
        <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-accent-secondary">
          {t.role}
        </p>
        <p className="max-w-[60ch] font-inter-tight text-sm leading-relaxed text-mid-gray">
          {t.blurb}
        </p>
        <Link
          href="/a-propos"
          className="mt-1 inline-flex w-fit items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.1em] text-foreground no-underline transition-colors hover:text-accent-secondary"
        >
          {t.link}
          <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
        </Link>
      </div>
    </aside>
  );
}

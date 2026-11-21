import { ArrowRight } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { FamilleKey } from "@/lib/case-studies-data";
import type { Locale } from "@/i18n/routing";

const BTN_PRIMARY =
  "group inline-flex w-full items-center justify-center gap-2 border border-accent-secondary bg-accent-secondary px-5 py-3 text-center font-mono text-sm font-semibold uppercase tracking-[0.08em] text-obsidian transition-colors hover:bg-accent-secondary/85";
const BTN_GHOST =
  "group inline-flex w-full items-center justify-center gap-2 border border-dark-gray px-5 py-3 text-center font-mono text-2xs uppercase tracking-[0.08em] text-foreground transition-colors hover:bg-jet";

/** Lien de prise de RDV existant — ne pas créer de nouvelle destination. */
const CALENDAR_URL = "https://calendar.app.google/RwZqaabSR5aDMnk46";

/**
 * CTA de fin de fiche : le bouton chaud, fonction de la famille du cas (→ RDV).
 *
 * Le bouton froid « Réserver mon audit gratuit » (→ /scan) est retiré des
 * fiches à la demande d'Agathe (2026-11-21) : le bouton chaud, désormais seul,
 * prend le style principal. La clé i18n `cta.cold` reste en place pour le
 * rétablir.
 *
 * Exception automatisations : ces fiches gardent leur bouton froid « Demander
 * un diagnostic », qui mène à l'offre conseil (/conseil), en plus du chaud.
 */
export default async function CaseStudyCTA({
  famille,
  locale,
}: {
  famille: FamilleKey;
  locale: Locale;
}) {
  const t = await getTranslations({ locale, namespace: "caseStudyDetail.cta" });
  const isAutomation = famille === "automatisations";

  return (
    <div className="flex flex-col gap-2.5">
      {isAutomation && (
        <Link href="/conseil" className={BTN_PRIMARY}>
          {t("coldConseil")} <ArrowRight size={13} />
        </Link>
      )}
      <a
        href={CALENDAR_URL}
        target="_blank"
        rel="noopener noreferrer"
        className={isAutomation ? BTN_GHOST : BTN_PRIMARY}
      >
        {t(`warm.${famille}`)} <ArrowRight size={13} />
      </a>
    </div>
  );
}

import { ArrowRight } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { FamilleKey } from "@/lib/case-studies-data";
import type { Locale } from "@/i18n/routing";

const BTN_PRIMARY =
  "group inline-flex w-full items-center justify-center gap-2 border border-charcoal bg-vermilion px-5 py-3 text-center font-mono text-[12px] font-semibold uppercase tracking-[0.08em] text-white transition-colors hover:bg-vermilion-bright";
const BTN_GHOST =
  "group inline-flex w-full items-center justify-center gap-2 border border-dark-gray px-5 py-3 text-center font-mono text-[11px] uppercase tracking-[0.08em] text-foreground transition-colors hover:bg-jet";

/** Lien de prise de RDV existant — ne pas créer de nouvelle destination. */
const CALENDAR_URL = "https://calendar.app.google/RwZqaabSR5aDMnk46";

/**
 * CTA de fin de fiche à deux températures : froid (diagnostic), chaud fonction
 * de la famille du cas (→ RDV). Froid en primaire : un prospect qui vérifie
 * n'est pas prêt pour un RDV.
 *
 * Exception agents-ia : un diagnostic de site web n'a aucun sens pour
 * un cas d'agent IA — le froid mène à l'offre conseil. Le libellé change avec
 * la destination : /conseil n'est pas un outil de 2 minutes, promettre « 2 min »
 * là-dessus serait une promesse cassée.
 */
export default async function CaseStudyCTA({
  famille,
  locale,
}: {
  famille: FamilleKey;
  locale: Locale;
}) {
  const t = await getTranslations({ locale, namespace: "caseStudyDetail.cta" });
  const isAutomation = famille === "agents-ia";

  return (
    <div className="flex flex-col gap-2.5">
      <Link href={isAutomation ? "/conseil" : "/audit-site-web"} className={BTN_PRIMARY}>
        {t(isAutomation ? "coldConseil" : "cold")} <ArrowRight size={13} />
      </Link>
      <a
        href={CALENDAR_URL}
        target="_blank"
        rel="noopener noreferrer"
        className={BTN_GHOST}
      >
        {t(`warm.${famille}`)} <ArrowRight size={13} />
      </a>
    </div>
  );
}

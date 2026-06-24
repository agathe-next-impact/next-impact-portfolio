import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { CookieSettingsButton } from "@/components/cookie-settings-button";
import { LocaleSwitcher } from "@/components/locale-switcher";

const KICKER = "font-mono text-[10px] uppercase tracking-[0.1em] text-mid-gray";
const FOOT_LINK =
  "font-mono text-[11px] uppercase tracking-[0.06em] text-mid-gray no-underline transition-colors hover:text-foreground";

const NAV_LINKS = [
  { href: "/services",            key: "services" },
  { href: "/wordpress-headless",  key: "wordpressHeadlessPillar" },
  { href: "/etudes-de-cas",       key: "caseStudies" },
  { href: "/documentation",       key: "documentation" },
  { href: "/blog",                key: "blog" },
  { href: "/avantage-oeth",       key: "oethAdvantage" },
  { href: "/a-propos",            key: "about" },
  { href: "/mentions-legales",    key: "legalNotice" },
  { href: "/confidentialite",     key: "privacy" },
] as const;

const RESOURCE_LINKS = [
  { href: "/audit-site-web", key: "freeAiAudit" },
  { href: "/conseil", key: "visioConseil" },
  { href: "/depannage-wordpress", key: "wordpressExpress" },
  { href: "/outils",        key: "tools" },
  { href: "/contact",       key: "startWebApp" },
] as const;

// Pages partenaires — footer uniquement, jamais dans le header (doctrine :
// ne pas encombrer la navigation principale d'un prospect froid).
const PARTNER_LINKS = [
  { href: "/apporteurs", key: "referralPartners" },
  { href: "/agences",    key: "whiteLabelAgencies" },
] as const;

export default function Footer() {
  const t = useTranslations("footer");
  const year = new Date().getFullYear();

  return (
    <footer className="bg-obsidian px-2.5 lg:px-0">
      <div className="mx-auto w-full max-w-[1200px]">
        {/* Main grid */}
        <div className="grid grid-cols-1 divide-y divide-dark-gray border border-dark-gray bg-jet sm:grid-cols-2 lg:grid-cols-4 lg:divide-x lg:divide-y-0">
          {/* Col 1 — Identity */}
          <div className="p-8">
            <div className={KICKER}>Studio</div>
            <div className="mt-4 text-lg text-foreground">{t("company")}</div>
            <p className="mt-3 font-inter-tight text-sm leading-relaxed text-mid-gray">
              {t("owner")}
            </p>
            <p className="mt-2 font-inter-tight text-sm leading-relaxed text-mid-gray">
              {t("address")}
            </p>
            <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.08em] text-mid-gray">
              SIREN 532 675 386
            </p>
          </div>

          {/* Col 2 — Navigation */}
          <div className="p-8">
            <div className={KICKER}>{t("usefulLinks")}</div>
            <nav className="mt-4 flex flex-col gap-2.5">
              {NAV_LINKS.map((item) => (
                <Link
                  key={item.key}
                  href={item.href as Parameters<typeof Link>[0]["href"]}
                  className={FOOT_LINK}
                >
                  {t(item.key as Parameters<typeof t>[0])}
                </Link>
              ))}
            </nav>
          </div>

          {/* Col 3 — Resources */}
          <div className="p-8">
            <div className={KICKER}>{t("resources")}</div>
            <nav className="mt-4 flex flex-col gap-2.5">
              {RESOURCE_LINKS.map((item) => (
                <Link
                  key={item.key}
                  href={item.href as Parameters<typeof Link>[0]["href"]}
                  className={FOOT_LINK}
                >
                  {t(item.key as Parameters<typeof t>[0])}
                </Link>
              ))}
            </nav>

            {/* Pages partenaires — footer uniquement */}
            <div className={`${KICKER} mt-6`}>{t("partners")}</div>
            <nav className="mt-3 flex flex-col gap-2.5">
              {PARTNER_LINKS.map((item) => (
                <Link
                  key={item.key}
                  href={item.href as Parameters<typeof Link>[0]["href"]}
                  className={FOOT_LINK}
                >
                  {t(item.key as Parameters<typeof t>[0])}
                </Link>
              ))}
            </nav>
          </div>

          {/* Col 4 — Contact */}
          <div className="p-8">
            <div className={KICKER}>{t("contactQuestion")}</div>
            <a
              href="mailto:agathe@next-impact.digital"
              className="mt-4 block font-mono text-[11px] tracking-[0.06em] text-foreground no-underline transition-colors hover:text-vermilion"
            >
              agathe@next-impact.digital
            </a>
            <a
              href="tel:0673981638"
              className="mt-2 block font-mono text-[11px] tracking-[0.06em] text-foreground no-underline transition-colors hover:text-vermilion"
            >
              06 73 98 16 38
            </a>
            <Link
              href="/contact"
              className="mt-5 inline-flex h-9 items-center rounded-sm bg-vermilion px-4 font-mono text-[10px] font-semibold uppercase tracking-[0.1em] text-white no-underline transition-colors hover:bg-vermilion-bright"
            >
              {t("startWebApp")}
            </Link>
          </div>
        </div>

        {/* Colophon */}
        <div className="flex flex-wrap items-center justify-between gap-2 border border-t-0 border-dark-gray bg-jet px-6 py-4">
          <span className="font-mono text-[9px] uppercase tracking-[0.1em] text-mid-gray">
            © {year} NEXT IMPACT DIGITAL
          </span>
          <span className="font-mono text-[9px] uppercase tracking-[0.1em] text-mid-gray">
            {t("updated")}
          </span>
          <CookieSettingsButton className="font-mono text-[9px] uppercase tracking-[0.1em] text-mid-gray transition-colors hover:text-foreground" />
          <LocaleSwitcher />
          <a
            href="#__next"
            className="font-mono text-[9px] uppercase tracking-[0.1em] text-mid-gray no-underline transition-colors hover:text-foreground"
          >
            ↑ HAUT DE PAGE
          </a>
        </div>
      </div>
    </footer>
  );
}

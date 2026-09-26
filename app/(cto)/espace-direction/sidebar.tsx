"use client";

import { useCallback, useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import * as Dialog from "@radix-ui/react-dialog";
import * as Tooltip from "@radix-ui/react-tooltip";
import {
  Activity,
  BookOpen,
  Briefcase,
  CalendarPlus,
  Download,
  FileText,
  Gauge,
  Flag,
  Folder,
  Gavel,
  Handshake,
  House,
  KeyRound,
  Layers,
  ListChecks,
  LogOut,
  Mail,
  Menu,
  Moon,
  PanelLeftClose,
  PanelLeftOpen,
  Scale,
  Search,
  Sun,
  X,
  type LucideIcon,
} from "lucide-react";
import { deconnexion } from "./actions";
import { NAV_COOKIE } from "./nav";
import { viderPagesHorsLigne } from "./pwa";

// ─────────────────────────────────────────────────────────────────────────────
// La barre latérale de l'espace.
//
// Seul morceau client du gabarit : tout ce qu'elle affiche (entrées, groupes,
// pastilles) est calculé côté serveur par `shell.tsx` et arrive en props. Elle
// ne gère que ce qui n'existe que dans le navigateur — replier, ouvrir le
// tiroir, le raccourci clavier.
//
// Trois états :
//  - bureau déployé (248 px) : libellés, groupes, pastilles ;
//  - bureau replié (64 px)  : icônes seules, info-bulle au survol et au focus,
//    pastille réduite à un point — le mot reste dans l'info-bulle et dans
//    l'étiquette lue par le lecteur d'écran ;
//  - mobile et tablette (< 1024 px) : l'application installable. Barre
//    d'onglets en bas d'écran (Accueil + un onglet par groupe, cinq au plus),
//    sous-onglets du groupe courant sous la barre du haut, et une feuille
//    « Plus » (Radix Dialog : focus piégé, Échap, clic sur le fond) pour la
//    situation, le contact et les réglages — refermée à chaque navigation.
//
// L'état replié vit dans un COOKIE, pas dans le localStorage : le serveur le lit
// et rend la page directement dans le bon état. Un localStorage ne se lit
// qu'après l'hydratation — la barre s'ouvrirait puis se refermerait à chaque
// page.
// ─────────────────────────────────────────────────────────────────────────────

export type NavIconName =
  | "tableau"
  | "missions"
  | "prestations"
  | "decisions"
  | "audit"
  | "site"
  | "rapports"
  | "cartographie"
  | "a-traiter"
  | "a-arbitrer"
  | "propositions"
  | "veille"
  | "documents";

const ICONS: Record<NavIconName, LucideIcon> = {
  tableau: House,
  missions: Flag,
  prestations: Briefcase,
  decisions: Gavel,
  audit: Search,
  site: Activity,
  rapports: FileText,
  cartographie: Layers,
  "a-traiter": ListChecks,
  "a-arbitrer": Scale,
  propositions: Handshake,
  veille: BookOpen,
  documents: Folder,
};

export type BadgeTone = "neutre" | "attention" | "alerte" | "nouveau";

export interface NavBadge {
  /** Court : « 2 », « 1 faille ». */
  text: string;
  /** La phrase complète, pour l'info-bulle et le lecteur d'écran. */
  description: string;
  tone: BadgeTone;
}

export interface NavItem {
  key: NavIconName;
  href: string;
  label: string;
  active: boolean;
  badge: NavBadge | null;
}

export interface NavGroup {
  label: string | null;
  items: NavItem[];
}

export type SituationTone = "neutre" | "attention" | "alerte" | "fait";

export interface SituationLigne {
  label: string;
  valeur: string;
  tone: SituationTone;
}

/**
 * La situation actuelle, en tête de barre : l'état du site d'après le dernier
 * relevé WP Umbrella, et le dernier audit remis. Toujours sous les yeux, quelle
 * que soit la page — c'est le repère auquel tout le reste se rapporte.
 */
export interface Situation {
  site: {
    verdict: string;
    tone: SituationTone;
    /** « Relevé WP Umbrella du … », ou null avant le premier relevé. */
    releve: string | null;
    /** Le dernier passage a échoué : les chiffres datent du précédent. */
    enEchec: boolean;
    lignes: SituationLigne[];
    href: string | null;
  } | null;
  audit: {
    titre: string;
    mesures: string | null;
    href: string;
    /** Audits précédents, en plus de celui-ci. */
    autres: number;
  } | null;
}

export interface SidebarProps {
  company: string;
  person: string | null;
  groups: NavGroup[];
  situation: Situation | null;
  initialCollapsed: boolean;
  /** Le signal de la barre du haut sur mobile (« 2 à traiter »), s'il y a lieu. */
  signal: NavBadge | null;
  contact: { mailto: string; calendly: string };
  appareilsHref: string | null;
  restitution: { href: string; label: string };
  /** Vue de supervision : ni appareils ni déconnexion — ce ne sont pas les siens. */
  admin: boolean;
}

const BADGE_CLASS: Record<BadgeTone, string> = {
  neutre: "border-dark-gray text-mid-gray",
  attention: "border-[#f2c94c]/45 text-[#f2c94c]",
  alerte: "border-[#ff8a7a]/45 text-[#ff8a7a]",
  nouveau: "border-accent-secondary/50 text-accent-secondary",
};

const DOT_CLASS: Record<BadgeTone, string> = {
  neutre: "bg-mid-gray",
  attention: "bg-[#f2c94c]",
  alerte: "bg-[#ff8a7a]",
  nouveau: "bg-accent-secondary",
};

function Badge({ badge }: { badge: NavBadge }) {
  return (
    <span
      aria-hidden
      className={`ml-auto shrink-0 border px-1.5 font-mono text-[10px] leading-[18px] tracking-[0.04em] ${BADGE_CLASS[badge.tone]}`}
    >
      {badge.text}
    </span>
  );
}

function linkLabel(item: NavItem): string {
  return item.badge ? `${item.label} (${item.badge.description})` : item.label;
}

const ROW =
  "group relative flex items-center gap-3 border-l-2 font-inter-tight text-sm transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-accent-secondary";

function Entree({ item, collapsed }: { item: NavItem; collapsed: boolean }) {
  const Icon = ICONS[item.key];
  const lien = (
    <Link
      href={item.href}
      aria-current={item.active ? "page" : undefined}
      aria-label={collapsed ? linkLabel(item) : undefined}
      className={`${ROW} ${collapsed ? "justify-center px-0 py-2.5" : "px-3 py-2"} ${
        item.active
          ? "border-l-accent-secondary bg-overlay-gray text-foreground"
          : "border-l-transparent text-mid-gray hover:bg-overlay-gray hover:text-foreground"
      }`}
    >
      <Icon aria-hidden className="h-4 w-4 shrink-0" strokeWidth={1.7} />
      {collapsed ? (
        item.badge ? (
          <span aria-hidden className={`absolute right-3.5 top-1.5 h-1.5 w-1.5 ${DOT_CLASS[item.badge.tone]}`} />
        ) : null
      ) : (
        <>
          <span className="min-w-0 truncate">{item.label}</span>
          {item.badge ? (
            <>
              <Badge badge={item.badge} />
              <span className="sr-only">{`, ${item.badge.description}`}</span>
            </>
          ) : null}
        </>
      )}
    </Link>
  );

  return collapsed ? <Bulle texte={linkLabel(item)}>{lien}</Bulle> : lien;
}

/** L'info-bulle du rail. Radix : rendue hors de la barre, donc jamais coupée par son défilement. */
function Bulle({ texte, children }: { texte: string; children: ReactNode }) {
  return (
    <Tooltip.Root>
      <Tooltip.Trigger asChild>{children}</Tooltip.Trigger>
      <Tooltip.Portal>
        <Tooltip.Content
          side="right"
          sideOffset={10}
          className="z-50 border border-dark-gray bg-jet px-2.5 py-1.5 font-inter-tight text-xs text-foreground shadow-lg"
        >
          {texte}
        </Tooltip.Content>
      </Tooltip.Portal>
    </Tooltip.Root>
  );
}

function Outil({
  collapsed,
  icon: Icon,
  label,
  href,
  onClick,
  type,
}: {
  collapsed: boolean;
  icon: LucideIcon;
  label: string;
  href?: string;
  onClick?: () => void;
  type?: "submit";
}) {
  const className = `${ROW} w-full border-l-transparent text-mid-gray hover:bg-overlay-gray hover:text-foreground ${
    collapsed ? "justify-center px-0 py-2.5" : "px-3 py-2"
  }`;
  const contenu = (
    <>
      <Icon aria-hidden className="h-4 w-4 shrink-0" strokeWidth={1.7} />
      {collapsed ? null : <span className="truncate">{label}</span>}
    </>
  );
  const element = href ? (
    <a href={href} aria-label={collapsed ? label : undefined} className={className}>
      {contenu}
    </a>
  ) : (
    <button type={type ?? "button"} onClick={onClick} aria-label={collapsed ? label : undefined} className={className}>
      {contenu}
    </button>
  );
  return collapsed ? <Bulle texte={label}>{element}</Bulle> : element;
}

function Theme({ collapsed }: { collapsed: boolean }) {
  const { resolvedTheme, setTheme } = useTheme();
  const [pret, setPret] = useState(false);
  useEffect(() => setPret(true), []);
  const sombre = !pret || resolvedTheme !== "light";
  return (
    <Outil
      collapsed={collapsed}
      icon={sombre ? Sun : Moon}
      label={sombre ? "Passer en clair" : "Passer en sombre"}
      onClick={() => setTheme(sombre ? "light" : "dark")}
    />
  );
}

const TONE_TEXTE: Record<SituationTone, string> = {
  neutre: "text-foreground",
  attention: "text-[#f2c94c]",
  alerte: "text-[#ff8a7a]",
  fait: "text-[#7fd8a4]",
};

const TONE_POINT: Record<SituationTone, string> = {
  neutre: "bg-mid-gray",
  attention: "bg-[#f2c94c]",
  alerte: "bg-[#ff8a7a]",
  fait: "bg-[#7fd8a4]",
};

function resume(situation: Situation): string {
  return [
    situation.site ? `Site : ${situation.site.verdict}` : null,
    situation.audit ? `${situation.audit.titre}${situation.audit.mesures ? `, ${situation.audit.mesures}` : ""}` : null,
  ]
    .filter(Boolean)
    .join(" · ");
}

function SituationActuelle({ situation, collapsed }: { situation: Situation; collapsed: boolean }) {
  const { site, audit } = situation;

  // Rail : un seul repère, sa couleur est celle du site (ou neutre sans suivi),
  // et le résumé complet est dans l'info-bulle et l'étiquette.
  if (collapsed) {
    const cible = site?.href ?? audit?.href;
    if (!cible) return null;
    const texte = `Situation actuelle. ${resume(situation)}`;
    return (
      <div className="border-b border-dark-gray px-2 py-2">
        <Bulle texte={resume(situation)}>
          <Link href={cible} aria-label={texte} className={`${ROW} justify-center border-l-transparent px-0 py-2.5 text-mid-gray hover:bg-overlay-gray hover:text-foreground`}>
            <Gauge aria-hidden className="h-4 w-4" strokeWidth={1.7} />
            {site ? <span aria-hidden className={`absolute right-3.5 top-1.5 h-1.5 w-1.5 ${TONE_POINT[site.tone]}`} /> : null}
          </Link>
        </Bulle>
      </div>
    );
  }

  return (
    <section aria-labelledby="situation-titre" className="border-b border-dark-gray px-4 py-4">
      <h2 id="situation-titre" className="font-mono text-[10px] uppercase tracking-[0.16em] text-mid-gray/70">
        Situation actuelle
      </h2>

      {site ? (
        <div className="mt-2.5">
          {site.href ? (
            <Link href={site.href} className="group flex items-start gap-2 font-inter-tight text-sm text-foreground">
              <span aria-hidden className={`mt-[7px] h-2 w-2 shrink-0 ${TONE_POINT[site.tone]}`} />
              <span className="group-hover:text-accent-secondary">{site.verdict}</span>
            </Link>
          ) : (
            <p className="flex items-start gap-2 font-inter-tight text-sm text-foreground">
              <span aria-hidden className={`mt-[7px] h-2 w-2 shrink-0 ${TONE_POINT[site.tone]}`} />
              {site.verdict}
            </p>
          )}
          {site.releve ? <p className="mt-1 pl-4 font-inter-tight text-[11px] text-mid-gray">{site.releve}</p> : null}
          {site.enEchec ? (
            <p className="mt-1 pl-4 font-inter-tight text-[11px] text-[#ff8a7a]">Dernier relevé en échec : chiffres du précédent.</p>
          ) : null}
          {site.lignes.length > 0 ? (
            <dl className="mt-2.5 grid grid-cols-[minmax(0,1fr)_auto] gap-x-3 gap-y-1 pl-4 font-inter-tight text-xs">
              {site.lignes.map((ligne) => (
                <div key={ligne.label} className="contents">
                  <dt className="truncate text-mid-gray">{ligne.label}</dt>
                  <dd className={`text-right tabular-nums ${TONE_TEXTE[ligne.tone]}`}>{ligne.valeur}</dd>
                </div>
              ))}
            </dl>
          ) : null}
        </div>
      ) : null}

      {audit ? (
        <div className={site ? "mt-3 border-t border-dark-gray pt-3" : "mt-2.5"}>
          <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-mid-gray">Dernier audit</p>
          <Link href={audit.href} className="mt-1 block font-inter-tight text-sm leading-snug text-foreground hover:text-accent-secondary">
            {audit.titre}
          </Link>
          <p className="mt-0.5 font-inter-tight text-[11px] text-mid-gray">
            {audit.mesures ?? "Date des mesures non renseignée"}
            {audit.autres > 0 ? ` · ${audit.autres} ${audit.autres > 1 ? "précédents" : "précédent"}` : ""}
          </p>
        </div>
      ) : null}
    </section>
  );
}

function Contenu({
  props,
  collapsed,
  entete,
  navigation = true,
}: {
  props: SidebarProps;
  collapsed: boolean;
  /** Le bouton du coin : replier (bureau) ou fermer (feuille). */
  entete: ReactNode;
  /** Faux dans la feuille mobile : la navigation y est déjà, en bas d'écran. */
  navigation?: boolean;
}) {
  return (
    <>
      <div
        className={`flex min-h-[64px] items-center gap-3 border-b border-dark-gray ${
          collapsed ? "flex-col justify-center gap-2 px-0 py-3" : "px-4 py-3"
        }`}
      >
        <span
          aria-hidden
          className="grid h-8 w-8 shrink-0 place-items-center border border-dark-gray font-mono text-[11px] text-accent-secondary"
        >
          NI
        </span>
        {collapsed ? null : (
          <div className="min-w-0 flex-1 leading-tight">
            <p className="truncate font-sans text-sm font-medium text-foreground">{props.company}</p>
            {props.person ? <p className="truncate font-inter-tight text-xs text-mid-gray">{props.person}</p> : null}
          </div>
        )}
        {entete}
      </div>

      {/* Situation et navigation défilent ensemble : sur un petit écran, la
          situation ne doit pas réduire la navigation à trois lignes. */}
      <div className="min-h-0 flex-1 overflow-y-auto">
        {props.situation ? <SituationActuelle situation={props.situation} collapsed={collapsed} /> : null}
        {navigation ? (
        <nav aria-label="Sections de votre espace" className="px-2 py-3">
          <ul className="space-y-4">
            {props.groups.map((groupe, index) => (
              <li key={groupe.label ?? `groupe-${index}`}>
                {groupe.label && !collapsed ? (
                  <p className="px-3 pb-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-mid-gray/70">
                    {groupe.label}
                  </p>
                ) : null}
                {groupe.label && collapsed ? <span className="mx-3 mb-2 block border-t border-dark-gray" aria-hidden /> : null}
                <ul className="space-y-0.5" aria-label={groupe.label ?? undefined}>
                  {groupe.items.map((item) => (
                    <li key={item.key}>
                      <Entree item={item} collapsed={collapsed} />
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </nav>
        ) : null}
      </div>

      <div className="border-t border-dark-gray px-2 py-3">
        {collapsed ? (
          <div className="space-y-0.5">
            <Outil collapsed icon={Mail} label="Écrire à Agathe" href={props.contact.mailto} />
            <Outil collapsed icon={CalendarPlus} label="Réserver un créneau" href={props.contact.calendly} />
          </div>
        ) : (
          <div className="mx-1 mb-3 border border-dark-gray px-3 py-3">
            <p className="font-inter-tight text-xs leading-snug text-mid-gray">
              Une question, un devis à relire, une décision à prendre ?
            </p>
            <div className="mt-2.5 flex flex-wrap gap-2">
              <a
                href={props.contact.mailto}
                className="border border-accent-secondary bg-accent-secondary px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-obsidian hover:opacity-90"
              >
                Écrire
              </a>
              <a
                href={props.contact.calendly}
                target="_blank"
                rel="noreferrer noopener"
                className="border border-dark-gray px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-foreground hover:border-accent-secondary"
              >
                Réserver ↗
              </a>
            </div>
          </div>
        )}
        <div className="mt-1 space-y-0.5">
          {props.appareilsHref ? (
            <Outil collapsed={collapsed} icon={KeyRound} label="Mes appareils" href={props.appareilsHref} />
          ) : null}
          <Outil collapsed={collapsed} icon={Download} label={props.restitution.label} href={props.restitution.href} />
          <Theme collapsed={collapsed} />
          {props.admin ? null : (
            <form action={deconnexion} onSubmit={() => void viderPagesHorsLigne()}>
              <Outil collapsed={collapsed} icon={LogOut} label="Se déconnecter" type="submit" />
            </form>
          )}
        </div>
      </div>
    </>
  );
}

// ─── Mobile et tablette ──────────────────────────────────────────────────

const TON_RANG: Record<BadgeTone, number> = { neutre: 0, nouveau: 1, attention: 2, alerte: 3 };

/** La pastille la plus pressante d'un onglet : c'est elle qu'il porte. */
function tonDe(items: NavItem[]): BadgeTone | null {
  let ton: BadgeTone | null = null;
  for (const item of items) {
    if (item.badge && (ton === null || TON_RANG[item.badge.tone] > TON_RANG[ton])) ton = item.badge.tone;
  }
  return ton;
}

/**
 * Les onglets du bas : l'accueil, puis un onglet par groupe (Missions, Votre
 * site, Agir, Veille) — cinq au plus, la limite au-delà de laquelle un
 * libellé ne tient plus sur un téléphone de 320 px. Un onglet mène à la
 * première entrée de son groupe ; les autres sont dans les sous-onglets.
 */
function BarreDuBas({ groups }: { groups: NavGroup[] }) {
  const onglets = groups.flatMap((groupe) =>
    groupe.label
      ? groupe.items.length > 0
        ? [{ cle: groupe.label, label: groupe.label, items: groupe.items }]
        : []
      : groupe.items.map((item) => ({ cle: item.key, label: item.label, items: [item] })),
  );

  return (
    <nav
      aria-label="Sections de votre espace"
      className="fixed inset-x-0 bottom-0 z-30 border-t border-dark-gray bg-obsidian/95 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden"
    >
      <ul className="mx-auto grid max-w-2xl" style={{ gridTemplateColumns: `repeat(${onglets.length}, minmax(0, 1fr))` }}>
        {onglets.map((onglet) => {
          const [premier] = onglet.items;
          const Icon = ICONS[premier.key];
          const actif = onglet.items.some((item) => item.active);
          const ton = tonDe(onglet.items);
          const descriptions = onglet.items.flatMap((item) => (item.badge ? [item.badge.description] : []));
          return (
            <li key={onglet.cle}>
              <Link
                href={premier.href}
                aria-current={premier.active ? "page" : actif ? "true" : undefined}
                aria-label={descriptions.length > 0 ? `${onglet.label} (${descriptions.join(", ")})` : undefined}
                className={`flex min-h-[56px] flex-col items-center justify-center gap-1 border-t-2 px-1 pb-1.5 pt-2 font-inter-tight text-[10px] leading-none transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-accent-secondary ${
                  actif ? "border-t-accent-secondary text-foreground" : "border-t-transparent text-mid-gray hover:text-foreground"
                }`}
              >
                <span className="relative">
                  <Icon aria-hidden className="h-5 w-5" strokeWidth={1.7} />
                  {ton ? <span aria-hidden className={`absolute -right-1.5 -top-0.5 h-1.5 w-1.5 ${DOT_CLASS[ton]}`} /> : null}
                </span>
                <span className="max-w-full truncate">{onglet.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

/** Les entrées du groupe courant, sous la barre du haut, quand il en a plusieurs. */
function SousOnglets({ groups }: { groups: NavGroup[] }) {
  const groupe = groups.find(
    (candidat) => candidat.label && candidat.items.length > 1 && candidat.items.some((item) => item.active),
  );
  if (!groupe) return null;

  return (
    <nav aria-label={groupe.label ?? undefined} className="border-t border-dark-gray">
      <ul className="flex gap-1.5 overflow-x-auto px-4 py-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {groupe.items.map((item) => (
          <li key={item.key} className="shrink-0">
            <Link
              href={item.href}
              aria-current={item.active ? "page" : undefined}
              className={`flex items-center gap-1.5 border px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.12em] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-secondary ${
                item.active ? "border-accent-secondary text-foreground" : "border-dark-gray text-mid-gray hover:text-foreground"
              }`}
            >
              {item.label}
              {item.badge ? (
                <>
                  <span aria-hidden className={`h-1.5 w-1.5 ${DOT_CLASS[item.badge.tone]}`} />
                  <span className="sr-only">{`, ${item.badge.description}`}</span>
                </>
              ) : null}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export function Sidebar(props: SidebarProps) {
  const [collapsed, setCollapsed] = useState(props.initialCollapsed);
  const [ouvert, setOuvert] = useState(false);
  const pathname = usePathname();

  const basculer = useCallback(() => {
    setCollapsed((valeur) => {
      const suivant = !valeur;
      document.cookie = `${NAV_COOKIE}=${suivant ? "rail" : "large"}; path=/; max-age=31536000; samesite=lax`;
      return suivant;
    });
  }, []);

  // Le tiroir se referme à chaque navigation : on ne garde pas le menu ouvert
  // par-dessus la page qu'on vient de demander.
  useEffect(() => setOuvert(false), [pathname]);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key !== "[" || event.ctrlKey || event.metaKey || event.altKey) return;
      const cible = event.target as HTMLElement | null;
      if (cible && (cible.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(cible.tagName))) return;
      if (!window.matchMedia("(min-width: 1024px)").matches) return;
      event.preventDefault();
      basculer();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [basculer]);

  const coin = "grid h-8 w-8 shrink-0 place-items-center border border-transparent text-mid-gray transition-colors hover:border-dark-gray hover:text-foreground";

  return (
    <Tooltip.Provider delayDuration={150}>
      {/* Mobile et tablette : barre du haut, sous-onglets, barre d'onglets en bas. */}
      <div className="sticky top-0 z-30 border-b border-dark-gray bg-obsidian/95 pt-[env(safe-area-inset-top)] backdrop-blur lg:hidden">
        <div className="flex items-center gap-3 px-4 py-2.5">
          <span
            aria-hidden
            className="grid h-8 w-8 shrink-0 place-items-center border border-dark-gray font-mono text-[11px] text-accent-secondary"
          >
            NI
          </span>
          <p className="min-w-0 flex-1 truncate font-sans text-sm font-medium text-foreground">{props.company}</p>
          {props.signal ? (
            <span className={`shrink-0 border px-2 font-mono text-[10px] uppercase leading-5 tracking-[0.08em] ${BADGE_CLASS[props.signal.tone]}`}>
              {props.signal.text}
            </span>
          ) : null}
          <Dialog.Root open={ouvert} onOpenChange={setOuvert}>
            <Dialog.Trigger asChild>
              <button type="button" aria-label="Situation, contact et réglages" className={coin}>
                <Menu aria-hidden className="h-5 w-5" strokeWidth={1.7} />
              </button>
            </Dialog.Trigger>
            <Dialog.Portal>
              <Dialog.Overlay className="fixed inset-0 z-40 bg-black/50 lg:hidden" />
              <Dialog.Content
                aria-describedby={undefined}
                className="fixed inset-x-0 bottom-0 z-50 flex max-h-[85dvh] flex-col border-t border-dark-gray bg-jet pb-[env(safe-area-inset-bottom)] text-foreground shadow-2xl sm:inset-x-auto sm:inset-y-0 sm:right-0 sm:max-h-none sm:w-[380px] sm:border-l sm:border-t-0 lg:hidden"
              >
                <Dialog.Title className="sr-only">Situation, contact et réglages</Dialog.Title>
                <Contenu
                  props={props}
                  collapsed={false}
                  navigation={false}
                  entete={
                    <Dialog.Close asChild>
                      <button type="button" aria-label="Fermer" className={`${coin} ml-auto`}>
                        <X aria-hidden className="h-4 w-4" strokeWidth={1.8} />
                      </button>
                    </Dialog.Close>
                  }
                />
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
        </div>
        <SousOnglets groups={props.groups} />
      </div>
      <BarreDuBas groups={props.groups} />

      {/* Bureau : barre fixe, repliable. */}
      <aside
        id="espace-navigation"
        className={`sticky top-0 hidden h-screen shrink-0 flex-col border-r border-dark-gray bg-jet/60 transition-[width] duration-200 motion-reduce:transition-none lg:flex ${
          collapsed ? "w-16" : "w-[248px]"
        }`}
      >
        <Contenu
          props={props}
          collapsed={collapsed}
          entete={
            <button
              type="button"
              onClick={basculer}
              aria-expanded={!collapsed}
              aria-controls="espace-navigation"
              aria-label={collapsed ? "Déplier le menu (raccourci [)" : "Replier le menu (raccourci [)"}
              title={collapsed ? "Déplier le menu  [" : "Replier le menu  ["}
              className={`${coin} ${collapsed ? "" : "ml-auto"}`}
            >
              {collapsed ? (
                <PanelLeftOpen aria-hidden className="h-4 w-4" strokeWidth={1.7} />
              ) : (
                <PanelLeftClose aria-hidden className="h-4 w-4" strokeWidth={1.7} />
              )}
            </button>
          }
        />
      </aside>
    </Tooltip.Provider>
  );
}

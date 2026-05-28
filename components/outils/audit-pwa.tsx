"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { AlertTriangle, CheckCircle2, Info, XCircle } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { useLocale } from "next-intl";
import type { Locale } from "@/i18n/routing";

interface CheckResult {
  id: string;
  labelFr: string;
  labelEn: string;
  status: "ok" | "warn" | "ko";
  detailFr: string;
  detailEn: string;
  weight: number;
}

type FormState = {
  mobileUsage: "high" | "medium" | "low";
  repeatUsage: "frequent" | "occasional" | "rare";
  fieldContext: "yes" | "maybe" | "no";
  installValue: "yes" | "maybe" | "no";
  offlineNeed: "yes" | "maybe" | "no";
  deviceFeatures: "yes" | "maybe" | "no";
  storeNeed: "none" | "maybe" | "required";
  nativeComplexity: "low" | "medium" | "high";
  technicalBase: "ready" | "partial" | "weak";
};

const INITIAL: FormState = {
  mobileUsage: "medium",
  repeatUsage: "occasional",
  fieldContext: "maybe",
  installValue: "maybe",
  offlineNeed: "maybe",
  deviceFeatures: "maybe",
  storeNeed: "none",
  nativeComplexity: "low",
  technicalBase: "partial",
};

export default function AuditPwa() {
  const locale = useLocale() as Locale;
  const isEn = locale === "en";
  const [state, setState] = useState<FormState>(INITIAL);
  const [submitted, setSubmitted] = useState(false);
  const [submitCount, setSubmitCount] = useState(0);
  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!submitted || submitCount === 0 || typeof window === "undefined") return;
    if (!window.matchMedia("(max-width: 768px)").matches) return;

    resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [submitted, submitCount]);

  const results = useMemo<CheckResult[]>(() => {
    const r: CheckResult[] = [];

    r.push({
      id: "mobileUsage",
      labelFr: "Usage mobile attendu",
      labelEn: "Expected mobile usage",
      status: state.mobileUsage === "high" ? "ok" : state.mobileUsage === "medium" ? "warn" : "ko",
      detailFr:
        state.mobileUsage === "high"
          ? "Très bon signal : si l'usage principal se fait sur smartphone, la PWA peut améliorer l'accès, la rétention et la fluidité."
          : state.mobileUsage === "medium"
          ? "Opportunité possible : la PWA devient pertinente si certains parcours clés sont vraiment mobiles."
          : "Signal faible : si vos utilisateurs restent surtout sur desktop, une PWA risque d'apporter peu de valeur immédiate.",
      detailEn:
        state.mobileUsage === "high"
          ? "Strong signal: if the main usage happens on smartphones, a PWA can improve access, retention and UX."
          : state.mobileUsage === "medium"
          ? "Possible opportunity: a PWA makes sense if key journeys are genuinely mobile."
          : "Weak signal: if users mostly stay on desktop, a PWA may bring limited immediate value.",
      weight: 18,
    });

    r.push({
      id: "repeatUsage",
      labelFr: "Usage récurrent",
      labelEn: "Recurring usage",
      status: state.repeatUsage === "frequent" ? "ok" : state.repeatUsage === "occasional" ? "warn" : "ko",
      detailFr:
        state.repeatUsage === "frequent"
          ? "Très favorable : l'installation sur l'écran d'accueil a du sens quand l'utilisateur revient souvent."
          : state.repeatUsage === "occasional"
          ? "À cadrer : la PWA peut aider, mais il faut identifier le moment où l'utilisateur voudra l'installer."
          : "Peu favorable : pour un usage unique, un bon site mobile suffit souvent.",
      detailEn:
        state.repeatUsage === "frequent"
          ? "Very favorable: home-screen install makes sense when users come back often."
          : state.repeatUsage === "occasional"
          ? "To scope: a PWA can help, but the install moment must be clear."
          : "Less favorable: for one-off usage, a good mobile site is often enough.",
      weight: 16,
    });

    r.push({
      id: "fieldContext",
      labelFr: "Contexte terrain ou mobilité",
      labelEn: "Field or on-the-go context",
      status: state.fieldContext === "yes" ? "ok" : state.fieldContext === "maybe" ? "warn" : "ko",
      detailFr:
        state.fieldContext === "yes"
          ? "Très bon cas PWA : intervention terrain, tourisme, événementiel, suivi mobile ou outil interne nomade."
          : state.fieldContext === "maybe"
          ? "Potentiel à clarifier : la PWA est intéressante si l'utilisateur agit vraiment en déplacement."
          : "Si l'expérience n'a pas de contexte mobile fort, la priorité peut rester un site responsive performant.",
      detailEn:
        state.fieldContext === "yes"
          ? "Strong PWA use case: field operations, tourism, events, mobile tracking or internal mobile tools."
          : state.fieldContext === "maybe"
          ? "Potential to clarify: a PWA is interesting if users truly act on the go."
          : "Without a strong mobile context, a performant responsive site may remain the priority.",
      weight: 14,
    });

    r.push({
      id: "installValue",
      labelFr: "Valeur de l'installation",
      labelEn: "Install value",
      status: state.installValue === "yes" ? "ok" : state.installValue === "maybe" ? "warn" : "ko",
      detailFr:
        state.installValue === "yes"
          ? "Bon signal : icône, plein écran, raccourci et notifications peuvent renforcer l'expérience."
          : state.installValue === "maybe"
          ? "À tester : l'installation doit résoudre un vrai irritant, pas seulement faire plus applicatif."
          : "Si l'installation n'apporte rien à l'utilisateur, la PWA risque d'être cosmétique.",
      detailEn:
        state.installValue === "yes"
          ? "Good signal: icon, full-screen mode, shortcut and notifications can strengthen the experience."
          : state.installValue === "maybe"
          ? "Worth testing: install should solve a real friction point, not just look more app-like."
          : "If install brings no user value, the PWA may be mostly cosmetic.",
      weight: 12,
    });

    r.push({
      id: "offlineNeed",
      labelFr: "Tolérance aux zones sans réseau",
      labelEn: "Tolerance to poor connectivity",
      status: state.offlineNeed === "yes" ? "ok" : state.offlineNeed === "maybe" ? "warn" : "ok",
      detailFr:
        state.offlineNeed === "yes"
          ? "Très favorable : le hors-ligne est un des meilleurs arguments pour créer une PWA."
          : state.offlineNeed === "maybe"
          ? "Opportunité modérée : un cache simple peut déjà rendre l'expérience plus robuste."
          : "Pas bloquant : une PWA peut être utile sans mode hors-ligne complet, si l'usage mobile est fort.",
      detailEn:
        state.offlineNeed === "yes"
          ? "Very favorable: offline support is one of the strongest reasons to build a PWA."
          : state.offlineNeed === "maybe"
          ? "Moderate opportunity: a simple cache can already make the experience more resilient."
          : "Not blocking: a PWA can still help without full offline mode if mobile usage is strong.",
      weight: 10,
    });

    r.push({
      id: "deviceFeatures",
      labelFr: "Fonctions smartphone utiles",
      labelEn: "Useful smartphone features",
      status: state.deviceFeatures === "yes" ? "ok" : state.deviceFeatures === "maybe" ? "warn" : "ko",
      detailFr:
        state.deviceFeatures === "yes"
          ? "Bon signal : géolocalisation, appareil photo, stockage local ou notifications cadrent bien avec une PWA."
          : state.deviceFeatures === "maybe"
          ? "À préciser : la PWA devient plus convaincante si ces fonctions soutiennent un parcours métier."
          : "Signal limité : sans capacité mobile spécifique, le gain par rapport au site responsive est plus faible.",
      detailEn:
        state.deviceFeatures === "yes"
          ? "Good signal: geolocation, camera, local storage or notifications fit well with a PWA."
          : state.deviceFeatures === "maybe"
          ? "To clarify: a PWA is more convincing when these features support a business journey."
          : "Limited signal: without mobile-specific capabilities, the gain over responsive web is lower.",
      weight: 10,
    });

    r.push({
      id: "storeNeed",
      labelFr: "Besoin d'App Store / Play Store",
      labelEn: "App Store / Play Store need",
      status: state.storeNeed === "none" ? "ok" : state.storeNeed === "maybe" ? "warn" : "ko",
      detailFr:
        state.storeNeed === "none"
          ? "Très favorable : si la distribution peut passer par un lien ou un QR code, la PWA évite les stores."
          : state.storeNeed === "maybe"
          ? "À arbitrer : le store apporte de la visibilité seulement dans certains cas. La PWA peut rester une excellente V1."
          : "Attention : si la présence store est stratégique ou obligatoire, il faut comparer avec une app native.",
      detailEn:
        state.storeNeed === "none"
          ? "Very favorable: if distribution can happen through a link or QR code, a PWA avoids app stores."
          : state.storeNeed === "maybe"
          ? "Decision needed: stores bring visibility only in some cases. A PWA can still be an excellent V1."
          : "Caution: if store presence is strategic or mandatory, compare against native app development.",
      weight: 10,
    });

    r.push({
      id: "nativeComplexity",
      labelFr: "Complexité native indispensable",
      labelEn: "Mandatory native complexity",
      status: state.nativeComplexity === "low" ? "ok" : state.nativeComplexity === "medium" ? "warn" : "ko",
      detailFr:
        state.nativeComplexity === "low"
          ? "Bon terrain PWA : formulaires, cartes, contenus, comptes, paiement web ou outil métier restent très adaptés."
          : state.nativeComplexity === "medium"
          ? "À vérifier : certains besoins avancés peuvent rester compatibles, mais il faut cadrer les limites iOS/Android."
          : "Risque élevé : si le projet dépend de widgets natifs, Bluetooth avancé, arrière-plan lourd ou 3D intensive, le natif peut s'imposer.",
      detailEn:
        state.nativeComplexity === "low"
          ? "Good PWA ground: forms, maps, content, accounts, web payment or business tools fit well."
          : state.nativeComplexity === "medium"
          ? "Needs checking: some advanced needs may still work, but iOS/Android limits must be scoped."
          : "High risk: if the project depends on native widgets, advanced Bluetooth, heavy background work or intensive 3D, native may be required.",
      weight: 12,
    });

    r.push({
      id: "technicalBase",
      labelFr: "Base technique du site actuel",
      labelEn: "Current technical baseline",
      status: state.technicalBase === "ready" ? "ok" : state.technicalBase === "partial" ? "warn" : "ko",
      detailFr:
        state.technicalBase === "ready"
          ? "Bonne base : HTTPS, responsive et performance mobile facilitent une transformation PWA."
          : state.technicalBase === "partial"
          ? "Prévoir un socle technique : manifest, service worker, cache, UX mobile et tests appareils."
          : "Avant la PWA, il faudra probablement moderniser le site mobile et la performance.",
      detailEn:
        state.technicalBase === "ready"
          ? "Good baseline: HTTPS, responsive design and mobile performance make PWA conversion easier."
          : state.technicalBase === "partial"
          ? "Plan a technical baseline: manifest, service worker, cache, mobile UX and real-device tests."
          : "Before the PWA, the mobile site and performance probably need modernization.",
      weight: 8,
    });

    return r;
  }, [state]);

  const score = useMemo(() => {
    let total = 0;
    let maxTotal = 0;
    results.forEach((r) => {
      maxTotal += r.weight;
      if (r.status === "ok") total += r.weight;
      else if (r.status === "warn") total += r.weight * 0.5;
    });
    return Math.round((total / maxTotal) * 100);
  }, [results]);

  const verdict = useMemo(() => {
    if (score >= 80) {
      return {
        fr: "Très forte opportunité : une PWA semble pertinente pour améliorer l'expérience mobile, éviter une app native coûteuse et accélérer la mise en marché.",
        en: "Very strong opportunity: a PWA looks relevant to improve mobile UX, avoid costly native development and ship faster.",
        color: "#2a7a2a",
      };
    }
    if (score >= 55) {
      return {
        fr: "Opportunité à cadrer : une PWA peut être une bonne V1, à condition de valider les usages mobiles et les fonctionnalités vraiment utiles.",
        en: "Opportunity to scope: a PWA can be a good V1 if mobile usage and truly useful features are validated.",
        color: "#b85c09",
      };
    }
    return {
      fr: "Opportunité faible à ce stade : mieux vaut renforcer le site mobile ou clarifier le besoin avant d'investir dans une PWA.",
      en: "Weak opportunity for now: strengthen the mobile site or clarify the need before investing in a PWA.",
      color: "var(--accent-color)",
    };
  }, [score]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);
    setSubmitCount((count) => count + 1);
  };

  const statusColor = (status: "ok" | "warn" | "ko") => {
    if (status === "ok") return "#2a7a2a";
    if (status === "warn") return "#b85c09";
    return "var(--accent-color)";
  };

  return (
    <div style={{ width: "100%", border: "1px solid var(--rule)" }}>
      <div style={{ padding: "24px 32px", borderBottom: "1px solid var(--rule)" }}>
        <p
          style={{
            fontFamily: "var(--mono)",
            fontSize: "11px",
            textTransform: "uppercase",
            letterSpacing: "0.18em",
            color: "var(--muted-color)",
            marginBottom: "8px",
          }}
        >
          {isEn ? "PWA opportunity diagnostic" : "Diagnostic d'opportunité PWA"}
        </p>
        <p style={{ fontFamily: "var(--sans)", fontSize: "15px", color: "var(--ink)", lineHeight: 1.5 }}>
          {isEn
            ? "Should you turn your site or mobile idea into an installable PWA? Answer 9 strategic questions."
            : "Faut-il transformer votre site ou votre idée mobile en PWA installable ? Répondez à 9 questions de cadrage."}
        </p>
      </div>

      {submitted && (
        <div
          ref={resultRef}
          style={{
            borderBottom: "1px solid var(--rule)",
            padding: "32px",
            display: "flex",
            flexDirection: "column",
            gap: "32px",
          }}
        >
          <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "16px" }}>
            <div
              style={{
                border: "1px solid var(--rule)",
                background: "var(--paper-2)",
                padding: "24px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
              }}
            >
              <p
                style={{
                  fontFamily: "var(--mono)",
                  fontSize: "10px",
                  textTransform: "uppercase",
                  letterSpacing: "0.18em",
                  color: "var(--muted-color)",
                  marginBottom: "12px",
                }}
              >
                {isEn ? "Opportunity score" : "Score d'opportunité"}
              </p>
              <p className="ni-serif" style={{ fontSize: "56px", lineHeight: 1, color: "var(--ink)", fontWeight: 400 }}>
                {score}
                <span style={{ fontSize: "24px", color: "var(--muted-color)", fontFamily: "var(--sans)" }}>/100</span>
              </p>
            </div>
            <div
              style={{
                border: "1px solid var(--rule)",
                background: "var(--paper-2)",
                padding: "24px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <p
                style={{
                  fontFamily: "var(--mono)",
                  fontSize: "10px",
                  textTransform: "uppercase",
                  letterSpacing: "0.18em",
                  color: "var(--muted-color)",
                  marginBottom: "12px",
                }}
              >
                {isEn ? "Decision signal" : "Signal de décision"}
              </p>
              <p style={{ fontFamily: "var(--sans)", fontSize: "15px", lineHeight: 1.6, color: verdict.color }}>
                {isEn ? verdict.en : verdict.fr}
              </p>
            </div>
          </div>

          <div>
            <p
              style={{
                fontFamily: "var(--mono)",
                fontSize: "10px",
                textTransform: "uppercase",
                letterSpacing: "0.18em",
                color: "var(--muted-color)",
                marginBottom: "16px",
              }}
            >
              {isEn ? "Opportunity factors" : "Facteurs d'opportunité"}
            </p>
            <div>
              {results.map((r, i) => (
                <div
                  key={r.id}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "12px",
                    padding: "14px 16px",
                    borderBottom: i < results.length - 1 ? "1px solid var(--rule)" : undefined,
                    borderLeft: `3px solid ${statusColor(r.status)}`,
                  }}
                >
                  {r.status === "ok" ? (
                    <CheckCircle2 style={{ width: "16px", height: "16px", color: "#2a7a2a", flexShrink: 0, marginTop: "2px" }} />
                  ) : r.status === "warn" ? (
                    <AlertTriangle style={{ width: "16px", height: "16px", color: "#b85c09", flexShrink: 0, marginTop: "2px" }} />
                  ) : (
                    <XCircle style={{ width: "16px", height: "16px", color: "var(--accent-color)", flexShrink: 0, marginTop: "2px" }} />
                  )}
                  <div>
                    <p style={{ fontFamily: "var(--sans)", fontSize: "14px", fontWeight: 600, color: "var(--ink)", marginBottom: "4px" }}>
                      {isEn ? r.labelEn : r.labelFr}
                    </p>
                    <p style={{ fontFamily: "var(--sans)", fontSize: "13px", color: "var(--ink-2)", lineHeight: 1.6 }}>
                      {isEn ? r.detailEn : r.detailFr}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div
            style={{
              background: "var(--paper-2)",
              border: "1px solid var(--rule)",
              padding: "14px 16px",
              display: "flex",
              alignItems: "flex-start",
              gap: "10px",
            }}
          >
            <Info style={{ width: "13px", height: "13px", color: "var(--muted-color)", flexShrink: 0, marginTop: "2px" }} />
            <p style={{ fontFamily: "var(--sans)", fontSize: "12px", color: "var(--muted-color)", lineHeight: 1.6 }}>
              {isEn
                ? "This is an opportunity diagnostic, not a Lighthouse audit. The next step is to validate priority user journeys, then check manifest, service worker, cache strategy, mobile performance and real-device behavior."
                : "Ce diagnostic mesure l'intérêt de faire une PWA, pas seulement sa conformité technique. L'étape suivante consiste à valider les parcours prioritaires, puis à vérifier manifest, service worker, stratégie de cache, performance mobile et comportement sur appareils réels."}
            </p>
          </div>

          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <Link href="/contact">
              <button className="btn primary">{isEn ? "Scope my PWA opportunity" : "Cadrer mon opportunité PWA"}</button>
            </Link>
            <Link href="/documentation/applications-web-mobile/pwa-vs-application-native">
              <button className="btn">{isEn ? "Compare PWA and native" : "Comparer PWA et app native"}</button>
            </Link>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ padding: "32px" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "24px",
            marginBottom: "32px",
          }}
        >
          <Field
            label={isEn ? "How important is mobile usage?" : "Quelle est l'importance de l'usage mobile ?"}
            value={state.mobileUsage}
            onChange={(v) => setState({ ...state, mobileUsage: v as FormState["mobileUsage"] })}
            options={[
              { value: "high", labelFr: "Central", labelEn: "Central" },
              { value: "medium", labelFr: "Important", labelEn: "Important" },
              { value: "low", labelFr: "Secondaire", labelEn: "Secondary" },
            ]}
            isEn={isEn}
          />
          <Field
            label={isEn ? "Will users come back often?" : "Les utilisateurs reviendront-ils souvent ?"}
            value={state.repeatUsage}
            onChange={(v) => setState({ ...state, repeatUsage: v as FormState["repeatUsage"] })}
            options={[
              { value: "frequent", labelFr: "Souvent", labelEn: "Often" },
              { value: "occasional", labelFr: "Par moments", labelEn: "Sometimes" },
              { value: "rare", labelFr: "Rarement", labelEn: "Rarely" },
            ]}
            isEn={isEn}
          />
          <Field
            label={isEn ? "Is there a field or on-site context?" : "Y a-t-il un usage terrain ou sur site ?"}
            value={state.fieldContext}
            onChange={(v) => setState({ ...state, fieldContext: v as FormState["fieldContext"] })}
            options={[
              { value: "yes", labelFr: "Oui", labelEn: "Yes" },
              { value: "maybe", labelFr: "Peut-être", labelEn: "Maybe" },
              { value: "no", labelFr: "Non", labelEn: "No" },
            ]}
            isEn={isEn}
          />
          <Field
            label={isEn ? "Would home-screen install add value?" : "L'installation sur l'écran d'accueil apporte-t-elle une valeur ?"}
            value={state.installValue}
            onChange={(v) => setState({ ...state, installValue: v as FormState["installValue"] })}
            options={[
              { value: "yes", labelFr: "Oui", labelEn: "Yes" },
              { value: "maybe", labelFr: "À tester", labelEn: "To test" },
              { value: "no", labelFr: "Non", labelEn: "No" },
            ]}
            isEn={isEn}
          />
          <Field
            label={isEn ? "Should it tolerate poor connection?" : "Doit-elle fonctionner avec peu ou pas de réseau ?"}
            value={state.offlineNeed}
            onChange={(v) => setState({ ...state, offlineNeed: v as FormState["offlineNeed"] })}
            options={[
              { value: "yes", labelFr: "Oui", labelEn: "Yes" },
              { value: "maybe", labelFr: "Parfois", labelEn: "Sometimes" },
              { value: "no", labelFr: "Non", labelEn: "No" },
            ]}
            isEn={isEn}
          />
          <Field
            label={isEn ? "Are phone features useful?" : "Des fonctions smartphone sont-elles utiles ?"}
            value={state.deviceFeatures}
            onChange={(v) => setState({ ...state, deviceFeatures: v as FormState["deviceFeatures"] })}
            options={[
              { value: "yes", labelFr: "Oui", labelEn: "Yes" },
              { value: "maybe", labelFr: "Peut-être", labelEn: "Maybe" },
              { value: "no", labelFr: "Non", labelEn: "No" },
            ]}
            isEn={isEn}
          />
          <Field
            label={isEn ? "Is store presence mandatory?" : "La présence sur les stores est-elle indispensable ?"}
            value={state.storeNeed}
            onChange={(v) => setState({ ...state, storeNeed: v as FormState["storeNeed"] })}
            options={[
              { value: "none", labelFr: "Non", labelEn: "No" },
              { value: "maybe", labelFr: "À arbitrer", labelEn: "To decide" },
              { value: "required", labelFr: "Oui", labelEn: "Yes" },
            ]}
            isEn={isEn}
          />
          <Field
            label={isEn ? "How native-specific is the feature set?" : "Les fonctionnalités sont-elles très natives ?"}
            value={state.nativeComplexity}
            onChange={(v) => setState({ ...state, nativeComplexity: v as FormState["nativeComplexity"] })}
            options={[
              { value: "low", labelFr: "Peu", labelEn: "Low" },
              { value: "medium", labelFr: "À vérifier", labelEn: "To check" },
              { value: "high", labelFr: "Très natives", labelEn: "Very native" },
            ]}
            isEn={isEn}
          />
          <Field
            label={isEn ? "Current mobile technical baseline?" : "État technique mobile actuel ?"}
            value={state.technicalBase}
            onChange={(v) => setState({ ...state, technicalBase: v as FormState["technicalBase"] })}
            options={[
              { value: "ready", labelFr: "Solide", labelEn: "Solid" },
              { value: "partial", labelFr: "Partiel", labelEn: "Partial" },
              { value: "weak", labelFr: "À refaire", labelEn: "Weak" },
            ]}
            isEn={isEn}
          />
        </div>

        <button type="submit" className="btn primary">
          {isEn ? "Evaluate the PWA opportunity" : "Évaluer l'opportunité PWA"}
        </button>
      </form>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  options,
  isEn,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; labelFr: string; labelEn: string }[];
  isEn: boolean;
}) {
  return (
    <div>
      <p style={{ fontFamily: "var(--sans)", fontSize: "13px", color: "var(--ink-2)", marginBottom: "10px" }}>{label}</p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
        {options.map((opt) => {
          const selected = value === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange(opt.value)}
              style={{
                fontFamily: "var(--sans)",
                fontSize: "13px",
                padding: "6px 14px",
                border: "1px solid var(--rule)",
                borderLeft: selected ? "3px solid var(--accent-color)" : "1px solid var(--rule)",
                background: selected ? "var(--paper-2)" : "transparent",
                color: selected ? "var(--ink)" : "var(--muted-color)",
                cursor: "pointer",
                transition: "background 0.1s, color 0.1s",
              }}
            >
              {isEn ? opt.labelEn : opt.labelFr}
            </button>
          );
        })}
      </div>
    </div>
  );
}

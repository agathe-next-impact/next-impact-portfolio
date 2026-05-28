"use client";

import { FormEvent, useMemo, useState } from "react";
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Info,
} from "lucide-react";
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
  https: "yes" | "no";
  responsive: "yes" | "no" | "unsure";
  loadTime: "fast" | "medium" | "slow";
  touchTargets: "yes" | "no" | "unsure";
  manifest: "yes" | "no" | "unsure";
  serviceWorker: "yes" | "no" | "unsure";
  offlineNeed: "yes" | "no" | "maybe";
  geolocation: "yes" | "no" | "maybe";
  installPrompt: "yes" | "no" | "unsure";
};

const INITIAL: FormState = {
  https: "yes",
  responsive: "yes",
  loadTime: "medium",
  touchTargets: "unsure",
  manifest: "no",
  serviceWorker: "no",
  offlineNeed: "maybe",
  geolocation: "maybe",
  installPrompt: "no",
};

export default function AuditPwa() {
  const locale = useLocale() as Locale;
  const isEn = locale === "en";
  const [state, setState] = useState<FormState>(INITIAL);
  const [submitted, setSubmitted] = useState(false);

  const results = useMemo<CheckResult[]>(() => {
    const r: CheckResult[] = [];

    r.push({
      id: "https",
      labelFr: "HTTPS activé",
      labelEn: "HTTPS enabled",
      status: state.https === "yes" ? "ok" : "ko",
      detailFr:
        state.https === "yes"
          ? "HTTPS est indispensable pour une PWA. Aucun navigateur n'autorise l'installation d'une PWA en HTTP."
          : "HTTPS est OBLIGATOIRE pour une PWA. Il faut activer un certificat (Let's Encrypt suffit, gratuit).",
      detailEn:
        state.https === "yes"
          ? "HTTPS is a hard requirement for PWAs. No browser allows PWA install over plain HTTP."
          : "HTTPS is MANDATORY for a PWA. A certificate must be enabled (Let's Encrypt is free).",
      weight: 25,
    });

    r.push({
      id: "responsive",
      labelFr: "Design responsive mobile",
      labelEn: "Mobile-responsive design",
      status: state.responsive === "yes" ? "ok" : state.responsive === "unsure" ? "warn" : "ko",
      detailFr:
        state.responsive === "yes"
          ? "Un design qui s'adapte au mobile est un prérequis. ✓"
          : state.responsive === "unsure"
          ? "À vérifier — un test sur smartphone permet de constater la qualité du responsive."
          : "Sans responsive, l'expérience mobile sera frustrante. Refonte CSS / Tailwind nécessaire.",
      detailEn:
        state.responsive === "yes"
          ? "A mobile-responsive design is a prerequisite. ✓"
          : state.responsive === "unsure"
          ? "To verify — a smartphone test will reveal responsive quality."
          : "Without responsive, mobile UX will be frustrating. CSS/Tailwind rebuild needed.",
      weight: 15,
    });

    r.push({
      id: "loadTime",
      labelFr: "Temps de chargement mobile",
      labelEn: "Mobile load time",
      status:
        state.loadTime === "fast" ? "ok" : state.loadTime === "medium" ? "warn" : "ko",
      detailFr:
        state.loadTime === "fast"
          ? "Excellent — moins de 2 secondes garantit une bonne expérience PWA."
          : state.loadTime === "medium"
          ? "Acceptable mais perfectible. Une PWA optimisée vise < 2s en 4G."
          : "Lent (> 4s). Une PWA doit charger en moins de 2s, sinon les utilisateurs ne reviennent pas. Audit performance nécessaire.",
      detailEn:
        state.loadTime === "fast"
          ? "Excellent — under 2 seconds ensures great PWA UX."
          : state.loadTime === "medium"
          ? "Acceptable but improvable. An optimized PWA aims for < 2s on 4G."
          : "Slow (> 4s). A PWA must load in under 2s, otherwise users don't return. Performance audit needed.",
      weight: 15,
    });

    r.push({
      id: "touchTargets",
      labelFr: "Zones tactiles accessibles",
      labelEn: "Accessible touch targets",
      status: state.touchTargets === "yes" ? "ok" : state.touchTargets === "unsure" ? "warn" : "ko",
      detailFr:
        state.touchTargets === "yes"
          ? "Boutons et liens dimensionnés pour le tactile (minimum 44×44 px). ✓"
          : state.touchTargets === "unsure"
          ? "À vérifier — règle iOS Human Interface : minimum 44×44 px par cible tactile."
          : "Cibles tactiles trop petites = frustration. Ajustements CSS nécessaires.",
      detailEn:
        state.touchTargets === "yes"
          ? "Buttons and links sized for touch (minimum 44×44 px). ✓"
          : state.touchTargets === "unsure"
          ? "To verify — iOS Human Interface rule: minimum 44×44 px per touch target."
          : "Touch targets too small = frustration. CSS adjustments needed.",
      weight: 8,
    });

    r.push({
      id: "manifest",
      labelFr: "Web App Manifest",
      labelEn: "Web App Manifest",
      status: state.manifest === "yes" ? "ok" : "ko",
      detailFr:
        state.manifest === "yes"
          ? "Manifest présent. ✓ À vérifier qu'il contient name, icons, start_url, display."
          : "À ajouter — fichier JSON décrivant l'app (nom, icônes, splash, comportement). Simple à mettre en place.",
      detailEn:
        state.manifest === "yes"
          ? "Manifest present. ✓ Check it contains name, icons, start_url, display."
          : "To add — JSON file describing the app (name, icons, splash, behavior). Simple to set up.",
      weight: 10,
    });

    r.push({
      id: "serviceWorker",
      labelFr: "Service worker",
      labelEn: "Service worker",
      status: state.serviceWorker === "yes" ? "ok" : "ko",
      detailFr:
        state.serviceWorker === "yes"
          ? "Service worker en place. ✓ À auditer pour vérifier la stratégie de cache."
          : "À ajouter — c'est ce qui rend une PWA installable et fonctionnelle hors-ligne. Composant Next.js (next-pwa) ou implémentation custom.",
      detailEn:
        state.serviceWorker === "yes"
          ? "Service worker in place. ✓ To audit for cache strategy."
          : "To add — this is what makes a PWA installable and offline-capable. Next.js component (next-pwa) or custom.",
      weight: 12,
    });

    r.push({
      id: "offlineNeed",
      labelFr: "Besoin de mode hors-ligne",
      labelEn: "Offline mode need",
      status: state.offlineNeed === "yes" ? "warn" : "ok",
      detailFr:
        state.offlineNeed === "yes"
          ? "Besoin identifié — il faut une stratégie de cache offline-first et de synchronisation en arrière-plan."
          : state.offlineNeed === "maybe"
          ? "Pas critique — un cache simple des assets statiques suffit pour la plupart des cas."
          : "Pas de besoin offline — implémentation PWA simplifiée.",
      detailEn:
        state.offlineNeed === "yes"
          ? "Need identified — requires offline-first cache strategy and background sync."
          : state.offlineNeed === "maybe"
          ? "Not critical — a simple static-asset cache is enough for most cases."
          : "No offline need — simplified PWA implementation.",
      weight: 5,
    });

    r.push({
      id: "geolocation",
      labelFr: "Géolocalisation",
      labelEn: "Geolocation",
      status: state.geolocation === "yes" ? "warn" : "ok",
      detailFr:
        state.geolocation === "yes"
          ? "Pertinent — API navigateur native, fonctionne en PWA sans contrainte particulière."
          : "Pas de besoin géoloc — n'impacte pas la PWA.",
      detailEn:
        state.geolocation === "yes"
          ? "Relevant — native browser API, works in PWA without special constraints."
          : "No geo need — doesn't impact the PWA.",
      weight: 5,
    });

    r.push({
      id: "installPrompt",
      labelFr: "Onboarding installation",
      labelEn: "Install onboarding",
      status: state.installPrompt === "yes" ? "ok" : "warn",
      detailFr:
        state.installPrompt === "yes"
          ? "Onboarding installation en place. ✓"
          : "À prévoir — un mini-tutoriel visuel pour guider l'utilisateur (surtout sur iOS où l'install demande une action manuelle).",
      detailEn:
        state.installPrompt === "yes"
          ? "Install onboarding in place. ✓"
          : "To add — small visual tutorial to guide the user (especially on iOS where install requires a manual action).",
      weight: 5,
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
        fr: "Très bon niveau — votre site est largement prêt à devenir une PWA, peu d'ajustements nécessaires.",
        en: "Strong baseline — your site is largely PWA-ready, few adjustments needed.",
        color: "#2a7a2a",
      };
    }
    if (score >= 50) {
      return {
        fr: "Niveau intermédiaire — quelques chantiers à mener avant qu'une PWA livre toute sa valeur.",
        en: "Intermediate level — a few items to address before a PWA delivers full value.",
        color: "#b85c09",
      };
    }
    return {
      fr: "Travail conséquent — refonte ou modernisation nécessaire avant d'envisager une PWA performante.",
      en: "Significant work — modernization or rebuild needed before a performant PWA is feasible.",
      color: "var(--accent-color)",
    };
  }, [score]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const statusColor = (status: "ok" | "warn" | "ko") => {
    if (status === "ok") return "#2a7a2a";
    if (status === "warn") return "#b85c09";
    return "var(--accent-color)";
  };

  return (
    <div style={{ width: "100%", border: "1px solid var(--rule)" }}>
      {/* Header */}
      <div
        style={{
          padding: "24px 32px",
          borderBottom: "1px solid var(--rule)",
        }}
      >
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
          {isEn ? "PWA / mobile readiness audit" : "Audit PWA / mobile readiness"}
        </p>
        <p
          style={{
            fontFamily: "var(--sans)",
            fontSize: "15px",
            color: "var(--ink)",
            lineHeight: 1.5,
          }}
        >
          {isEn
            ? "Is your site ready to become an installable PWA? Test 9 criteria in 60 seconds."
            : "Votre site est-il prêt à devenir une PWA installable ? Évaluez 9 critères en 60 secondes."}
        </p>
      </div>

      {/* Results — shown above form after submit */}
      {submitted && (
        <div
          style={{
            borderBottom: "1px solid var(--rule)",
            padding: "32px",
            display: "flex",
            flexDirection: "column",
            gap: "32px",
          }}
        >
          {/* Score + Verdict */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 2fr",
              gap: "16px",
            }}
          >
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
                {isEn ? "Score" : "Score"}
              </p>
              <p
                className="ni-serif"
                style={{
                  fontSize: "56px",
                  lineHeight: 1,
                  color: "var(--ink)",
                  fontWeight: 400,
                }}
              >
                {score}
                <span
                  style={{
                    fontSize: "24px",
                    color: "var(--muted-color)",
                    fontFamily: "var(--sans)",
                  }}
                >
                  /100
                </span>
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
                {isEn ? "Verdict" : "Verdict"}
              </p>
              <p
                style={{
                  fontFamily: "var(--sans)",
                  fontSize: "15px",
                  lineHeight: 1.6,
                  color: verdict.color,
                }}
              >
                {isEn ? verdict.en : verdict.fr}
              </p>
            </div>
          </div>

          {/* Detailed checks */}
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
              {isEn ? "Detailed checks" : "Diagnostic détaillé"}
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
                    borderBottom:
                      i < results.length - 1 ? "1px solid var(--rule)" : undefined,
                    borderLeft: `3px solid ${statusColor(r.status)}`,
                  }}
                >
                  {r.status === "ok" ? (
                    <CheckCircle2
                      style={{
                        width: "16px",
                        height: "16px",
                        color: "#2a7a2a",
                        flexShrink: 0,
                        marginTop: "2px",
                      }}
                    />
                  ) : r.status === "warn" ? (
                    <AlertTriangle
                      style={{
                        width: "16px",
                        height: "16px",
                        color: "#b85c09",
                        flexShrink: 0,
                        marginTop: "2px",
                      }}
                    />
                  ) : (
                    <XCircle
                      style={{
                        width: "16px",
                        height: "16px",
                        color: "var(--accent-color)",
                        flexShrink: 0,
                        marginTop: "2px",
                      }}
                    />
                  )}
                  <div>
                    <p
                      style={{
                        fontFamily: "var(--sans)",
                        fontSize: "14px",
                        fontWeight: 600,
                        color: "var(--ink)",
                        marginBottom: "4px",
                      }}
                    >
                      {isEn ? r.labelEn : r.labelFr}
                    </p>
                    <p
                      style={{
                        fontFamily: "var(--sans)",
                        fontSize: "13px",
                        color: "var(--ink-2)",
                        lineHeight: 1.6,
                      }}
                    >
                      {isEn ? r.detailEn : r.detailFr}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Info box */}
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
            <Info
              style={{
                width: "13px",
                height: "13px",
                color: "var(--muted-color)",
                flexShrink: 0,
                marginTop: "2px",
              }}
            />
            <p
              style={{
                fontFamily: "var(--sans)",
                fontSize: "12px",
                color: "var(--muted-color)",
                lineHeight: 1.6,
              }}
            >
              {isEn
                ? "Self-assessment based on declared answers. A full PWA audit requires technical inspection (manifest contents, service worker strategy, Lighthouse mobile run, real-device tests)."
                : "Auto-évaluation basée sur les réponses déclarées. Un audit PWA complet nécessite une inspection technique (contenu du manifest, stratégie service worker, Lighthouse mobile, tests sur appareils réels)."}
            </p>
          </div>

          {/* CTAs */}
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <Link href="/contact">
              <button className="btn primary">
                {isEn ? "Discuss this audit" : "Discuter de cet audit"}
              </button>
            </Link>
            <Link href="/documentation/applications-web-mobile/installable-sans-store-le-pouvoir-de-la-pwa">
              <button className="btn">
                {isEn ? "Learn more about PWAs" : "En savoir plus sur les PWA"}
              </button>
            </Link>
          </div>
        </div>
      )}

      {/* Form */}
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
            label={isEn ? "Is HTTPS enabled?" : "HTTPS activé ?"}
            value={state.https}
            onChange={(v) => setState({ ...state, https: v as FormState["https"] })}
            options={[
              { value: "yes", labelFr: "Oui", labelEn: "Yes" },
              { value: "no", labelFr: "Non", labelEn: "No" },
            ]}
            isEn={isEn}
          />
          <Field
            label={isEn ? "Mobile-responsive design?" : "Design responsive mobile ?"}
            value={state.responsive}
            onChange={(v) => setState({ ...state, responsive: v as FormState["responsive"] })}
            options={[
              { value: "yes", labelFr: "Oui", labelEn: "Yes" },
              { value: "no", labelFr: "Non", labelEn: "No" },
              { value: "unsure", labelFr: "Je ne sais pas", labelEn: "Not sure" },
            ]}
            isEn={isEn}
          />
          <Field
            label={isEn ? "Mobile load time?" : "Temps de chargement mobile ?"}
            value={state.loadTime}
            onChange={(v) => setState({ ...state, loadTime: v as FormState["loadTime"] })}
            options={[
              { value: "fast", labelFr: "< 2 s", labelEn: "< 2 s" },
              { value: "medium", labelFr: "2-4 s", labelEn: "2-4 s" },
              { value: "slow", labelFr: "> 4 s", labelEn: "> 4 s" },
            ]}
            isEn={isEn}
          />
          <Field
            label={isEn ? "Accessible touch targets?" : "Zones tactiles ≥ 44×44 px ?"}
            value={state.touchTargets}
            onChange={(v) => setState({ ...state, touchTargets: v as FormState["touchTargets"] })}
            options={[
              { value: "yes", labelFr: "Oui", labelEn: "Yes" },
              { value: "no", labelFr: "Non", labelEn: "No" },
              { value: "unsure", labelFr: "Je ne sais pas", labelEn: "Not sure" },
            ]}
            isEn={isEn}
          />
          <Field
            label={isEn ? "Web app manifest in place?" : "Web app manifest en place ?"}
            value={state.manifest}
            onChange={(v) => setState({ ...state, manifest: v as FormState["manifest"] })}
            options={[
              { value: "yes", labelFr: "Oui", labelEn: "Yes" },
              { value: "no", labelFr: "Non", labelEn: "No" },
              { value: "unsure", labelFr: "Je ne sais pas", labelEn: "Not sure" },
            ]}
            isEn={isEn}
          />
          <Field
            label={isEn ? "Service worker installed?" : "Service worker installé ?"}
            value={state.serviceWorker}
            onChange={(v) => setState({ ...state, serviceWorker: v as FormState["serviceWorker"] })}
            options={[
              { value: "yes", labelFr: "Oui", labelEn: "Yes" },
              { value: "no", labelFr: "Non", labelEn: "No" },
              { value: "unsure", labelFr: "Je ne sais pas", labelEn: "Not sure" },
            ]}
            isEn={isEn}
          />
          <Field
            label={isEn ? "Offline mode needed?" : "Besoin de mode hors-ligne ?"}
            value={state.offlineNeed}
            onChange={(v) => setState({ ...state, offlineNeed: v as FormState["offlineNeed"] })}
            options={[
              { value: "yes", labelFr: "Oui", labelEn: "Yes" },
              { value: "maybe", labelFr: "Peut-être", labelEn: "Maybe" },
              { value: "no", labelFr: "Non", labelEn: "No" },
            ]}
            isEn={isEn}
          />
          <Field
            label={isEn ? "Geolocation needed?" : "Besoin de géolocalisation ?"}
            value={state.geolocation}
            onChange={(v) => setState({ ...state, geolocation: v as FormState["geolocation"] })}
            options={[
              { value: "yes", labelFr: "Oui", labelEn: "Yes" },
              { value: "maybe", labelFr: "Peut-être", labelEn: "Maybe" },
              { value: "no", labelFr: "Non", labelEn: "No" },
            ]}
            isEn={isEn}
          />
          <Field
            label={isEn ? "Install prompt / tutorial?" : "Onboarding installation prévu ?"}
            value={state.installPrompt}
            onChange={(v) => setState({ ...state, installPrompt: v as FormState["installPrompt"] })}
            options={[
              { value: "yes", labelFr: "Oui", labelEn: "Yes" },
              { value: "no", labelFr: "Non / pas encore", labelEn: "No / not yet" },
              { value: "unsure", labelFr: "Je ne sais pas", labelEn: "Not sure" },
            ]}
            isEn={isEn}
          />
        </div>

        <button type="submit" className="btn primary">
          {isEn ? "Get my PWA audit" : "Voir mon audit PWA"}
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
      <p
        style={{
          fontFamily: "var(--sans)",
          fontSize: "13px",
          color: "var(--ink-2)",
          marginBottom: "10px",
        }}
      >
        {label}
      </p>
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
                border: selected
                  ? "1px solid var(--rule)"
                  : "1px solid var(--rule)",
                borderLeft: selected
                  ? "3px solid var(--accent-color)"
                  : "1px solid var(--rule)",
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

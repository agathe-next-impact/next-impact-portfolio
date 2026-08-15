import {
  EMPTY_REPORT,
  isEmptyReport,
  purgeCancelledClients,
  purgeIntelRaw,
  purgeMagicLinks,
  purgeScans,
  purgeWrittenTexts,
} from "@sentinelle/retention";
import { inngest } from "../client";

/**
 * Application quotidienne de la politique de conservation (plan §9).
 *
 * 03 h 00 Europe/Paris : après la journée qu'on purge, avant la collecte de
 * 06 h 00 — un cron qui supprime ne doit pas croiser un cron qui écrit.
 *
 * Un step par catégorie, pour que l'échec d'une purge ne retienne pas les
 * autres et se relise seul dans le tableau de bord. `retries: 2` parce que
 * chaque étape est idempotente : la relancer ne trouve plus rien à faire.
 *
 * Le journal est volontairement bavard quand il y a quelque chose à dire, et
 * muet quand il n'y a rien : une purge qui journalise « 0 » tous les jours
 * finit par ne plus être lue le jour où elle affiche autre chose.
 */
export const retentionDaily = inngest.createFunction(
  {
    id: "sentinelle-retention-daily",
    name: "Sentinelle — conservation des données",
    triggers: [{ cron: "TZ=Europe/Paris 0 3 * * *" }],
    retries: 2,
  },
  async ({ step }) => {
    // Une seule horloge pour toute la passe : sans quoi un cron qui dure trois
    // minutes appliquerait trois seuils légèrement différents.
    const now = new Date();

    const scans = await step.run("purge-scans", async () => purgeScans(now));
    const clients = await step.run("purge-cancelled-clients", async () =>
      purgeCancelledClients(now),
    );
    const texts = await step.run("purge-written-texts", async () => purgeWrittenTexts(now));
    const intel = await step.run("purge-intel-raw", async () => purgeIntelRaw(now));
    const links = await step.run("purge-magic-links", async () => purgeMagicLinks(now));

    const report = { ...EMPTY_REPORT, ...scans, ...clients, ...texts, ...intel, ...links };

    if (isEmptyReport(report)) {
      console.info("[sentinelle] rétention : rien à purger");
    } else {
      console.info(
        `[sentinelle] rétention : ${Object.entries(report)
          .filter(([, count]) => count > 0)
          .map(([category, count]) => `${category}=${count}`)
          .join(" ")}`,
      );
    }

    return { purgedAt: now.toISOString(), ...report };
  },
);

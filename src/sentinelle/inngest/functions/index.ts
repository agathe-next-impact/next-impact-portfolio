import { alertSync } from "./alert-sync";
import { onClientSubscribed } from "./client-subscribed";
import { collectDaily } from "./collect-daily";
import { healthcheck } from "./healthcheck";
import { issueRebuild } from "./issue-rebuild";
import { newsletterBuild } from "./newsletter-build";
import { retentionDaily } from "./retention-daily";
import { scanAsync } from "./scan-async";

/** Toutes les fonctions servies par la route /api/sentinelle/inngest. */
export const functions = [
  healthcheck,
  scanAsync,
  retentionDaily,
  collectDaily,
  alertSync,
  newsletterBuild,
  issueRebuild,
  onClientSubscribed,
];

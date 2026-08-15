import { healthcheck } from "./healthcheck";
import { scanAsync } from "./scan-async";

/** Toutes les fonctions servies par la route /api/sentinelle/inngest. */
export const functions = [healthcheck, scanAsync];

// Onboarding post-paiement (phase 5).
//
// Ce module fait passer une fiche de « ce qu'un scan a pu voir » à « ce que le
// site contient vraiment ». C'est la promesse de la page d'offre, et c'est le
// seul geste qu'on demande à un abonné.
//
// `stack.ts` est pur et testé (slugs, versions, écosystèmes, fusion) ; `store.ts`
// porte les écritures et l'invariant « le déclaré ne se fait jamais écraser » ;
// `welcome.ts` envoie le seul e-mail du produit qui ne passe pas par une
// relecture — et explique pourquoi.

export {
  mergeStack,
  normalizeVersion,
  parseDeclaredComponents,
  resolveDeclared,
  slugify,
  stackItemsFromScan,
  DECLARABLE_TYPES,
  type DeclaredInput,
  type DeclaredOutcome,
  type StackDraft,
} from "./stack";

export {
  getFiche,
  importScannedStack,
  linkOriginScan,
  markWelcomeSent,
  saveDeclaredStack,
  type Fiche,
  type FicheComponent,
  type ProfilePatch,
} from "./store";

export { sendWelcome, watchedCount, type WelcomeOutcome } from "./welcome";

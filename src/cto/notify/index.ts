// API publique de la notification — processus séparé de la synchro Notion.
//
// Un seul point d'entrée, comme partout dans ce dépôt : `scripts/cto-notify.ts`
// importe d'ici, jamais de `./store` directement.

export { notifyPendingPublications, type NotifyReport } from "./store";

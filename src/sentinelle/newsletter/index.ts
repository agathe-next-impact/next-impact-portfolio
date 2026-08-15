// Newsletter bimensuelle (deux envois par mois) — palier unique à 19 €.
// L'assemblage des blocs et l'envoi arrivent en phase 4 ; le calcul de période
// existe dès maintenant parce que son format est un invariant de base.
export {
  NEWSLETTER_TIMEZONE,
  SECOND_ISSUE_DAY,
  formatNewsletterPeriod,
  newsletterPeriodAt,
  newsletterPeriodKey,
  parseNewsletterPeriod,
  previousNewsletterPeriod,
  type NewsletterPeriod,
} from "./period";

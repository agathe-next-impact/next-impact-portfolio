"use client"

import { useState } from "react"

const FAQ_ITEMS = [
  {
    q: "Quelle est la différence entre WordPress classique et WordPress Headless, et lequel convient le mieux à mon projet ?",
    a: "WordPress classique est une solution complète avec interface d'administration et affichage intégrés, idéale pour la plupart des sites web traditionnels. WordPress Headless sépare le back-end (gestion de contenu) du front-end (affichage), offrant plus de flexibilité et de performance pour des projets complexes ou multi-plateformes.\n\nLe choix dépend de vos besoins : WordPress classique pour la simplicité et les coûts maîtrisés, Headless pour des performances optimales et une expérience utilisateur sur-mesure.",
  },
  {
    q: "Combien coûte la création ou la refonte d'un site WordPress et quels sont les délais de réalisation ?",
    a: "Nos tarifs varient selon la complexité : site vitrine simple (1 500–3 500 €), site e-commerce (3 000–7 000 €), WordPress Headless sur-mesure (4 000–15 000 €+).\n\nLes délais s'échelonnent de 3–4 semaines pour un site basique à 8–12 semaines pour des projets complexes. Chaque devis est personnalisé après analyse de vos besoins spécifiques.",
  },
  {
    q: "Mon site actuel peut-il être migré vers WordPress sans perdre mon référencement et mes données ?",
    a: "Oui, je réalise des migrations complètes en préservant votre SEO grâce aux redirections 301, à la conservation de vos URLs et métadonnées. Toutes vos données (contenus, images, utilisateurs) sont transférées et vérifiées minutieusement.",
  },
  {
    q: "Le site sera-t-il responsive et optimisé pour les mobiles et les moteurs de recherche ?",
    a: "Absolument, tous nos sites sont conçus mobile-first et s'adaptent parfaitement à tous les écrans. L'optimisation SEO est intégrée dès la conception : structure technique optimisée, vitesse de chargement, balises sémantiques, et respect des bonnes pratiques Google.",
  },
  {
    q: "Pourrai-je modifier facilement le contenu de mon site une fois terminé, et proposez-vous une formation ?",
    a: "WordPress est reconnu pour sa facilité d'utilisation. Une formation personnalisée (1h à 2h selon la complexité) pour vous rendre autonome sur la gestion quotidienne est incluse. Un guide d'utilisation sur-mesure vous est également fourni avec captures d'écran et vidéos.",
  },
]

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <section id="faq">
      <div style={{ borderTop: "1px solid var(--rule)" }}>
        {FAQ_ITEMS.map((item, i) => (
          <div
            key={i}
            style={{ borderBottom: "1px solid var(--rule)", cursor: "pointer" }}
            onClick={() => setOpen(open === i ? null : i)}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "56px 1fr 24px",
                gap: 24,
                padding: "24px 0",
                alignItems: "baseline",
              }}
            >
              <span
                style={{
                  fontFamily: "var(--mono)",
                  fontSize: 11,
                  color: "var(--accent-color)",
                  letterSpacing: "0.08em",
                }}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3
                className="ni-serif"
                style={{
                  fontSize: 17,
                  margin: 0,
                  fontStyle: open === i ? "italic" : "normal",
                  color: "var(--ink)",
                }}
              >
                {item.q}
              </h3>
              <span
                style={{
                  fontFamily: "var(--mono)",
                  fontSize: 16,
                  color: "var(--muted-color)",
                  transform: open === i ? "rotate(45deg)" : "none",
                  transition: "transform 0.2s",
                  display: "inline-block",
                  textAlign: "center",
                }}
              >
                +
              </span>
            </div>
            {open === i && (
              <div
                style={{
                  paddingLeft: 80,
                  paddingBottom: 24,
                  fontSize: 14,
                  color: "var(--ink-2)",
                  lineHeight: 1.7,
                  whiteSpace: "pre-line",
                }}
              >
                {item.a}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}

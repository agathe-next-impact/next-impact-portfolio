# Next Impact — Handoff package
**Édition Suisse · v1.0 · mai 2026**

Ce dossier contient tout ce qu'il faut pour reprendre la refonte de **next-impact.digital** dans n'importe quel stack (React, Next.js, Astro, WordPress thème custom, etc.).

---

## Démarrage en 3 lectures

1. **`design-system/README.md`** — principes, stack, structure.
2. **`design-system/tokens.css`** — variables CSS canoniques (couleurs, typo, layout).
3. **`design-system/components.md`** — anatomie HTML de chaque pattern.

Puis lire **`design-system/copy-rules.md`** avant de toucher au moindre texte.

---

## Pour un agent de code

Si vous êtes Claude Code (ou équivalent) :

1. Ouvrez `design-system/tokens.css`. Copiez-le tel quel dans la cible — c'est portable partout.
2. Lisez `design-system/components.md`. Chaque pattern y est décrit avec son HTML minimal et ses tokens.
3. Référez-vous aux fichiers `src/` pour voir l'assemblage complet — **mais ne copiez pas la techno React/Babel-standalone**, c'est un prototype. Réimplémentez dans le stack cible.
4. Avant de générer du copy, lisez `design-system/copy-rules.md` : numérotation `№ 0X`, légendes `Fig. 0X`, italiques d'accent, etc.

---

## Pour un dev humain

- Les sources sont du React 18 UMD + Babel standalone (chargé via unpkg).
  C'est un format de prototype, **pas une cible de prod**.
- Pour porter en Next.js ou autre : ne reprenez que `styles.css` et la sémantique HTML générée par les composants. Les composants React sont des spécimens.
- Le panneau Tweaks (`src/tweaks-panel.jsx`) est un outil de design-time, à retirer en prod.

---

## Structure du dossier

```
handoff/
├── INDEX.md                       ← ce fichier
├── design-system/
│   ├── README.md                  ← principes du système
│   ├── tokens.css                 ← variables CSS canoniques
│   ├── components.md              ← anatomie de chaque pattern
│   └── copy-rules.md              ← règles éditoriales
└── src/                           ← implémentation de référence (prototype React)
    ├── index.html
    ├── services.html
    ├── styles.css
    ├── sections.jsx
    ├── services-sections.jsx
    ├── app.jsx
    ├── services-app.jsx
    └── tweaks-panel.jsx
```

---

## Conventions critiques (à ne pas casser)

- **Pas de rayon, pas d'ombre.** Le système n'admet aucun `border-radius` ni `box-shadow`.
- **Un seul accent.** Le vermilion ponctue, ne jamais l'utiliser en aplat de surface.
- **Numérotation systémique.** Toute section porte `№ 0X`, tout placeholder porte `Fig. 0X`.
- **Trois familles typo, jamais plus.** Serif éditorial, sans-serif, mono. Pas d'icon-font, pas d'emoji.
- **Grille toujours présente.** 12 colonnes, gouttière 24 px, container 1440 px.

---

## Pages de référence

- **Accueil** (`src/index.html`) — 6 sections : Hero / Capacités / Méthode / Étude de cas / Ressources / Contact.
- **Services** (`src/services.html`) — 13 sections : Hero (avec tabs matrice) / Stacks / Comparatif / Zoom Web App / Verdict / Réalisations / OETH / Méthode / Investissement / Outils / Process / FAQ / CTA.

Ces deux pages couvrent ~90 % des patterns. Toute nouvelle page doit s'inspirer d'un assemblage existant avant d'inventer.

---

## Contact

Pour toute question sur le système : Agathe Karinthi-Martin · agathe@next-impact.digital

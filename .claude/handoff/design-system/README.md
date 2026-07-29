# Next Impact — Design System
**Édition Suisse · v1.0 · 2026**

Système visuel pour les surfaces digitales de Next Impact (next-impact.digital).
Inspiration **minimalisme suisse** : héritier du Style International, typographie soignée, grille stricte, micro-détails techniques, hiérarchie typographique forte.

---

## 1 · Principes

1. **L'austérité avant l'ornement.** Pas de gradients, pas de glassmorphism, pas d'illustrations décoratives. Le contenu et la grille sont l'esthétique.
2. **Un accent, un seul.** Le vermilion `#d83a1a` est utilisé avec parcimonie pour ponctuer la lecture. Jamais en aplat de surface.
3. **Hiérarchie par contraste typo, pas par couleur.** Serif éditorial pour les énoncés, sans-serif pour la lecture, mono pour les méta-données.
4. **Grille toujours, même invisible.** 12 colonnes, gouttières 24 px, container max 1440 px. Tout aligne.
5. **Micro-détails techniques.** Numérotation `№ 0X`, légendes `Fig. 0X`, coordonnées géographiques, timestamp build, indicateurs de position. Ils créent l'identité.
6. **Pas de mouvement gratuit.** Les seules animations admises sont les transitions de hover (≤ 250 ms) et le pulse du statut « disponible ».

---

## 2 · Stack

- **Polices :** *Instrument Serif* (display), *Geist* (body), *Geist Mono* (annotations).
  - Variantes proposées : `Manrope + JetBrains Mono` (technique), `Geist only` (neutre).
- **Layout :** CSS Grid natif, 12 colonnes, gouttière 24 px.
- **JS :** React 18 (UMD via unpkg) + Babel standalone — implémentation actuelle, à adapter si nécessaire pour la cible de production.

---

## 3 · Lecture du dossier

```
design-system/
├── README.md          ← ce fichier
├── tokens.css         ← variables CSS canoniques
├── components.md      ← anatomie HTML/JSX de chaque pattern
└── copy-rules.md      ← règles de copywriting (numérotation, italiques, légendes)

src/
├── index.html         ← page d'accueil (référence)
├── services.html      ← page services (référence)
├── styles.css         ← feuille de styles complète
├── sections.jsx       ← composants partagés (Header / Footer / sections home)
├── services-sections.jsx
├── app.jsx            ← bootstrap home
├── services-app.jsx   ← bootstrap services
└── tweaks-panel.jsx   ← panneau de réglages (peut être retiré en prod)
```

---

## 4 · Mise en route pour un agent dev

1. Lire `tokens.css` — c'est la source de vérité pour les couleurs / typo / espacements.
2. Lire `components.md` — chaque pattern y est documenté avec son anatomie minimale.
3. Lire `copy-rules.md` — les ficelles éditoriales du système (numérotation, italiques d'accent).
4. Référencer `src/index.html` et `src/services.html` comme exemples canoniques d'assemblage.

Pour porter le système dans un autre stack (Next.js, Astro, etc.) :
- Réutilisez `tokens.css` tel quel (variables CSS = portable partout).
- Ré-implémentez les classes de `styles.css` dans votre solution de styling (CSS Modules, Tailwind layer, Vanilla Extract…).
- Les composants React de `src/` sont des **exemples**, pas des dépendances : la sémantique HTML est ce qui compte.

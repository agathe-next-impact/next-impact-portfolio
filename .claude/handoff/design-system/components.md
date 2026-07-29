# Components — anatomie

Documentation des patterns réutilisables. Chaque composant est défini par :
- **Rôle** : à quoi il sert
- **Anatomie** : HTML minimal
- **Tokens** : variables qu'il utilise
- **Variantes** : extensions admises
- **À éviter** : ce qui sort du système

> Référence visuelle : `src/index.html` (accueil) et `src/services.html` (services).

---

## Section wrapper

**Rôle.** Conteneur racine de chaque section de page. Pose la rythmique verticale.

```html
<section class="s" id="hero">
  <div class="container">
    <!-- contenu -->
  </div>
</section>
```

- `.s` — padding vertical `calc(96px * var(--density-y))` + filet de séparation entre deux sections consécutives.
- `.container` — max-width 1440 px, padding latéral `--gutter`.

---

## Section header (`.sec-head`)

**Rôle.** En-tête éditorial d'une section : numéro, titre, méta. Pilier du système.

```html
<div class="sec-head">
  <div class="sec-no">№ 02</div>
  <h2 class="sec-title">
    Quatre voies. <em>Un seul</em> partenaire.
  </h2>
  <div class="sec-meta">Capacités · Fig. 02</div>
</div>
```

- `sec-no` : 1 col, mono 12 px, accent.
- `sec-title` : 7 cols, serif `clamp(28px, 3.5vw, 44px)`, italique pour l'accent sémantique.
- `sec-meta` : 4 cols, mono 11 px aligné à droite.

**Variante header noir** (ex : section Contact / CTA final) — fond `--ink`, texte `--paper`, accent toujours `--accent`.

---

## Bouton (`.btn`)

```html
<a class="btn" href="…">
  Action <span class="arrow">→</span>
</a>

<a class="btn primary" href="…">
  <span class="dot"></span>
  Action primaire — 2 min
  <span class="arrow">→</span>
</a>
```

- Hauteur fixe 44 px, padding latéral 18 px.
- Bordure 1 px `--ink`, fond transparent (variante outline) ou plein (variante primary).
- `dot` (7 px, accent) = badge optionnel pour appeler l'attention sur les CTA principaux.
- `arrow` : translation 3 px au hover.

**Hover variants.**
- Outline → fond `--ink`, texte `--paper`.
- Primary → fond `--accent`, bordure `--accent`.

---

## Label (`.label`) et annotation (`.annot`)

**Label** — micro-étiquette mono uppercase.

```html
<span class="label">Pile technique</span>
<span class="label solid">WordPress · Next.js</span>   <!-- variante ink -->
```

**Annotation** — pied de méta avec un tiret horizontal en préfixe.

```html
<span class="annot">
  <span class="bar"></span> FIG. <em>01</em>
</span>
```

`em` à l'intérieur passe en accent. Format `FIG. 0X` est canonique pour toute illustration / placeholder.

---

## Filet (`.rule`)

```html
<hr class="rule" />          <!-- filet standard --rule -->
<hr class="rule strong" />   <!-- filet d'ouverture --ink -->
```

Utilisé pour scander la verticalité. À placer entre deux blocs sémantiquement distincts.

---

## Carte (`.card`)

```html
<div class="card">…</div>
<div class="card dark">…</div>   <!-- inversion ink ↔ paper -->
```

- Bordure 1 px `--rule`, padding 24 px, fond transparent.
- Pas de rayon, pas d'ombre.

---

## Ligne de capacité (`.cap-row`)

Composant signature de la section *Capacités* (page accueil). Lignes alignées avec hover discret.

```html
<div class="cap-row">
  <span class="cap-arrow">→</span>
  <div class="mono">01 / 04</div>
  <div>
    <h3 class="serif">Nom de la capacité</h3>
    <div class="label">Tagline</div>
  </div>
  <p>Description…</p>
  <div class="u-flex u-gap-s">
    <span class="mono [chip]">WP</span>
    <span class="mono [chip]">Next.js</span>
  </div>
</div>
```

- Grille interne : `56px 1.6fr 2fr 1fr`.
- Hover : `padding-left: 12px` + flèche accent qui glisse.
- Filet en haut, dernier élément filet en bas.

---

## Liste numérotée (`ol.steps`)

```html
<ol class="steps">
  <li>
    <h4>Cadrage</h4>
    <p>Audit de l'existant…</p>
  </li>
</ol>
```

- Numérotation automatique en `decimal-leading-zero` accent.
- Grille interne : `56px 1fr 1fr` (numéro · titre · description).
- Titre en serif 22 px.

---

## Tabs

Pattern de la matrice comparative du hero Services.

```html
<div class="tab-bar">
  <button onClick="…">
    <span class="mono">01</span> C'est quoi ?
  </button>
</div>
```

- Bordure haute `--ink`, bordure basse `--rule`.
- Onglet actif : `border-bottom: 2px solid var(--accent)`, marker numéro en accent.
- Onglet inactif : texte `--muted`, numéro `--muted`.

---

## Tableau comparatif

Matrice 12 cols. En-tête en mono uppercase, lignes séparées par `--rule`.

- Numéroter chaque ligne en préfixe mono : `01 · Critère…`
- `●` pour les inclusions (accent dans la colonne signature, ink ailleurs)
- `—` pour les exclusions (couleur `--rule-strong`)

---

## Repères de marge (`.edge-ticks`)

Élément fixe en bord gauche d'écran. Coordonnées + version en mono vertical.

```html
<div class="edge-ticks">
  <span>45°16′N · 02°37′E · TRIZAC / CANTAL</span>
  <span>NI · vol. 02 · ed. 2026</span>
</div>
```

- Visibilité contrôlée par `--edge-display`.
- Masqué sous 1100 px de viewport.

---

## Placeholder image (`.ph`)

Croix diagonale + bordure 1 px. Pour les zones où l'image finale n'est pas encore livrée. **Toujours préférer un placeholder à une image générée IA.**

```html
<div class="ph" style="aspect-ratio: 16/10;">
  <!-- contenu de superposition optionnel : titre serif italique géant -->
</div>
```

---

## À éviter (anti-patterns)

- Boutons à coins arrondis (`border-radius`).
- Ombres (`box-shadow`).
- Hover qui agrandit ou « soulève » une carte.
- Gradients de fond.
- Icônes décoratives en SVG inventées.
- Listes avec puces `•` standard ; utiliser `＋ / −` mono ou la numérotation décimale-leading-zéro.
- Mélanger plus de deux familles d'accents (le système n'en admet qu'un).

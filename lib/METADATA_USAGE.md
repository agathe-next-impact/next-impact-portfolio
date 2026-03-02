# Système de gestion des métadonnées

Ce système fournit une gestion centralisée et cohérente des métadonnées pour toutes les pages du site.

## Structure

- **Configuration centralisée** : `lib/metadata.ts`
- **Types TypeScript** : Assure la cohérence des métadonnées
- **Fonctions helpers** : Génération automatique des métadonnées complètes
- **Métadonnées prédéfinies** : Pour les pages principales

## Utilisation

### 1. Page simple avec métadonnées prédéfinies

```tsx
import { Metadata } from "next";
import { pageMetadata } from "@/lib/metadata";

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata.home();
}

export default function Page() {
  return <div>Contenu</div>;
}
```

### 2. Page personnalisée

```tsx
import { Metadata } from "next";
import { generatePageMetadata } from "@/lib/metadata";

export async function generateMetadata(): Promise<Metadata> {
  return generatePageMetadata({
    title: "Ma page personnalisée",
    description: "Description de ma page",
    path: "/ma-page",
    keywords: ["mot-clé 1", "mot-clé 2"],
  });
}

export default function Page() {
  return <div>Contenu</div>;
}
```

### 3. Page dynamique (étude de cas)

```tsx
import { Metadata } from "next";
import { generateArticleMetadata } from "@/lib/metadata";

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // Récupérer les données de l'article
  const article = await getArticle(params.slug);

  return generateArticleMetadata({
    title: article.title,
    description: article.excerpt,
    slug: params.slug,
    image: article.featuredImage,
    publishedTime: article.publishedAt,
    modifiedTime: article.updatedAt,
    authors: [article.author],
    tags: article.tags,
  });
}

export default function ArticlePage({ params }: Props) {
  return <div>Article</div>;
}
```

### 4. Page de documentation

```tsx
import { Metadata } from "next";
import { generateDocMetadata } from "@/lib/metadata";

interface Props {
  params: { category: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return generateDocMetadata({
    title: `Documentation ${params.category}`,
    description: `Guide complet sur ${params.category}`,
    category: params.category,
  });
}

export default function DocPage({ params }: Props) {
  return <div>Documentation</div>;
}
```

## Options disponibles

### generatePageMetadata

| Option | Type | Requis | Description |
|--------|------|--------|-------------|
| `title` | `string` | Oui | Titre de la page (sera complété avec "| Next Impact") |
| `description` | `string` | Oui | Description de la page |
| `path` | `string` | Non | Chemin de la page (ex: "/services") |
| `image` | `string \| object` | Non | Image OpenGraph (URL ou objet avec dimensions) |
| `keywords` | `string[]` | Non | Mots-clés spécifiques (s'ajoutent aux mots-clés par défaut) |
| `type` | `"website" \| "article" \| "profile"` | Non | Type OpenGraph (défaut: "website") |
| `publishedTime` | `string` | Non | Date de publication (format ISO 8601) |
| `modifiedTime` | `string` | Non | Date de modification (format ISO 8601) |
| `authors` | `string[]` | Non | Auteurs de la page |
| `noindex` | `boolean` | Non | Empêcher l'indexation par les moteurs de recherche |
| `canonical` | `string` | Non | URL canonique personnalisée |

## Métadonnées générées automatiquement

Le système génère automatiquement :

- ✅ Title avec le nom du site
- ✅ Description
- ✅ Mots-clés (combinés avec les mots-clés par défaut)
- ✅ OpenGraph (Facebook, LinkedIn, etc.)
- ✅ Twitter Cards
- ✅ URL canonique
- ✅ Robots (indexation)
- ✅ Images avec dimensions appropriées
- ✅ Locale (fr_FR)
- ✅ Auteurs et créateur

## Configuration du site

Modifier les valeurs par défaut dans `lib/metadata.ts` :

```typescript
export const siteConfig = {
  name: "Next Impact - Développeur WordPress Freelance",
  title: "Next Impact",
  description: "...",
  url: "https://next-impact.digital",
  ogImage: "/img/avatar.webp",
  // ...
};
```

## Bonnes pratiques

1. **Utilisez les métadonnées prédéfinies** quand c'est possible (pages principales)
2. **Personnalisez avec generatePageMetadata** pour les pages spécifiques
3. **Ajoutez des mots-clés pertinents** pour chaque page
4. **Fournissez des images OpenGraph** de qualité (1200x630px)
5. **Utilisez des descriptions uniques** de 150-160 caractères
6. **Définissez le type correct** (website, article, profile)
7. **Ajoutez publishedTime et modifiedTime** pour les articles

## Migration des pages existantes

### Avant
```tsx
export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Ma page | Next Impact",
    description: "Description",
    openGraph: {
      // ... beaucoup de configuration manuelle
    },
    // ...
  };
}
```

### Après
```tsx
import { generatePageMetadata } from "@/lib/metadata";

export async function generateMetadata(): Promise<Metadata> {
  return generatePageMetadata({
    title: "Ma page",
    description: "Description",
    path: "/ma-page",
  });
}
```

## Exemple complet avec options avancées

```tsx
import { Metadata } from "next";
import { generatePageMetadata } from "@/lib/metadata";

export async function generateMetadata(): Promise<Metadata> {
  return generatePageMetadata({
    title: "Guide complet WordPress Headless",
    description: "Tout ce qu'il faut savoir sur WordPress Headless : architecture, avantages, mise en place et bonnes pratiques.",
    path: "/documentation/wordpress-headless",
    image: {
      url: "/img/guides/wordpress-headless-cover.webp",
      width: 1200,
      height: 630,
      alt: "Guide WordPress Headless - Next Impact",
    },
    keywords: [
      "WordPress Headless",
      "Decoupled WordPress",
      "JAMstack",
      "API REST",
      "GraphQL",
    ],
    type: "article",
    publishedTime: "2026-01-15T10:00:00.000Z",
    modifiedTime: "2026-01-20T14:30:00.000Z",
    authors: ["Agathe"],
  });
}

export default function Page() {
  return <div>Contenu du guide</div>;
}
```

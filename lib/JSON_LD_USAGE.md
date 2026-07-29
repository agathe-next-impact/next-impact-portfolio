# Données Structurées JSON-LD

Les composants JSON-LD permettent d'ajouter des données structurées à vos pages pour améliorer le SEO et l'affichage dans les résultats de recherche Google.

## Composants disponibles

### 1. OrganizationJsonLd

Décrit votre entreprise/organisation. À utiliser dans le layout principal ou sur la page d'accueil.

```tsx
import { OrganizationJsonLd } from "@/components/json-ld";

export default function Layout() {
  return (
    <>
      <OrganizationJsonLd />
      {/* Reste du contenu */}
    </>
  );
}
```

### 2. WebsiteJsonLd

Décrit votre site web. À utiliser sur la page d'accueil.

```tsx
import { WebsiteJsonLd } from "@/components/json-ld";

export default function HomePage() {
  return (
    <>
      <WebsiteJsonLd />
      {/* Reste du contenu */}
    </>
  );
}
```

### 3. ArticleJsonLd

Pour les articles de blog, études de cas, ou contenus éditoriaux.

```tsx
import { ArticleJsonLd } from "@/components/json-ld";

export default function ArticlePage() {
  return (
    <>
      <ArticleJsonLd
        title="Mon article"
        description="Description de l'article"
        image="/img/article.webp"
        datePublished="2026-01-15T10:00:00.000Z"
        dateModified="2026-01-20T14:30:00.000Z"
        author="Agathe"
        url="/etudes-de-cas/mon-article"
      />
      {/* Reste du contenu */}
    </>
  );
}
```

### 4. BreadcrumbJsonLd

Pour le fil d'Ariane (améliore la navigation dans les résultats de recherche).

```tsx
import { BreadcrumbJsonLd } from "@/components/json-ld";

export default function ServicePage() {
  const breadcrumbItems = [
    { name: "Accueil", url: "/" },
    { name: "Services", url: "/services" },
    { name: "WordPress Headless", url: "/services/headless" },
  ];

  return (
    <>
      <BreadcrumbJsonLd items={breadcrumbItems} />
      {/* Reste du contenu */}
    </>
  );
}
```

### 5. ServiceJsonLd

Pour les pages de services.

```tsx
import { ServiceJsonLd } from "@/components/json-ld";

export default function ServicePage() {
  return (
    <>
      <ServiceJsonLd
        name="Développement WordPress Headless"
        description="Service de création de sites WordPress Headless avec Next.js"
        serviceType="Web Development"
        url="/services/headless"
      />
      {/* Reste du contenu */}
    </>
  );
}
```

### 6. FAQJsonLd

Pour les sections FAQ (peut générer des rich snippets dans Google).

```tsx
import { FAQJsonLd } from "@/components/json-ld";

export default function FAQPage() {
  const faqItems = [
    {
      question: "Qu'est-ce que WordPress Headless ?",
      answer: "WordPress Headless est une architecture qui sépare...",
    },
    {
      question: "Quels sont les avantages ?",
      answer: "Les avantages incluent...",
    },
  ];

  return (
    <>
      <FAQJsonLd questions={faqItems} />
      {/* Reste du contenu */}
    </>
  );
}
```

### 7. ContactPageJsonLd

Pour la page de contact.

```tsx
import { ContactPageJsonLd } from "@/components/json-ld";

export default function ContactPage() {
  return (
    <>
      <ContactPageJsonLd />
      {/* Reste du contenu */}
    </>
  );
}
```

### 8. PersonJsonLd

Pour les pages "À propos" ou profil.

```tsx
import { PersonJsonLd } from "@/components/json-ld";

export default function AboutPage() {
  return (
    <>
      <PersonJsonLd />
      {/* Reste du contenu */}
    </>
  );
}
```

### 9. ~~ReviewJsonLd~~ (retiré)

Helper supprimé volontairement. Un `aggregateRating` au niveau `Organization` /
`LocalBusiness` construit à partir d'avis auto-collectés est **contraire aux
consignes Google** : non éligible aux étoiles dans les résultats et passible d'une
action manuelle. Pour afficher une notation en rich result, elle doit porter sur un
item précis (`Product`, `Service`, `CreativeWork`…), jamais sur l'entité de marque.

## Utilisation complète - Exemple

Voici un exemple complet d'une page d'étude de cas avec métadonnées et JSON-LD :

```tsx
import { Metadata } from "next";
import { generateArticleMetadata } from "@/lib/metadata";
import {
  ArticleJsonLd,
  BreadcrumbJsonLd,
  OrganizationJsonLd,
} from "@/components/json-ld";

interface Props {
  params: { slug: string };
}

// Métadonnées de la page
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const article = await getArticle(params.slug);

  return generateArticleMetadata({
    title: article.title,
    description: article.excerpt,
    slug: params.slug,
    image: article.image,
    publishedTime: article.publishedAt,
    modifiedTime: article.updatedAt,
    tags: article.tags,
  });
}

export default async function ArticlePage({ params }: Props) {
  const article = await getArticle(params.slug);

  const breadcrumbItems = [
    { name: "Accueil", url: "/" },
    { name: "Études de cas", url: "/etudes-de-cas" },
    { name: article.title, url: `/etudes-de-cas/${params.slug}` },
  ];

  return (
    <>
      {/* Données structurées */}
      <OrganizationJsonLd />
      <BreadcrumbJsonLd items={breadcrumbItems} />
      <ArticleJsonLd
        title={article.title}
        description={article.excerpt}
        image={article.image}
        datePublished={article.publishedAt}
        dateModified={article.updatedAt}
        author={article.author}
        url={`/etudes-de-cas/${params.slug}`}
      />

      {/* Contenu de la page */}
      <article>
        <h1>{article.title}</h1>
        {/* ... */}
      </article>
    </>
  );
}
```

## Validation des données structurées

Pour vérifier que vos données structurées sont correctes :

1. **Rich Results Test** : https://search.google.com/test/rich-results
2. **Schema Markup Validator** : https://validator.schema.org/
3. **Google Search Console** : Section "Amélioration" après indexation

## Bonnes pratiques

1. ✅ **Soyez précis** : Utilisez des données réelles et exactes
2. ✅ **Ne dupliquez pas** : Un seul type de JSON-LD par page (sauf breadcrumb)
3. ✅ **Testez régulièrement** : Validez avec les outils Google
4. ✅ **Dates ISO 8601** : Format `YYYY-MM-DDTHH:mm:ss.sssZ`
5. ✅ **URLs complètes** : Utilisez des URLs absolues quand possible
6. ❌ **Pas de contenu caché** : Seules les données visibles sur la page

## Impact SEO

Les données structurées permettent :

- 🌟 **Rich Snippets** : Étoiles, FAQ, fil d'Ariane dans les résultats
- 📊 **Knowledge Graph** : Informations dans le panneau de droite Google
- 🔍 **Meilleure compréhension** : Google comprend mieux votre contenu
- 📱 **Mobile** : Affichage amélioré sur mobile
- 🎯 **Ciblage** : Apparition dans des recherches spécifiques

## Combinaison avec les métadonnées

Les composants JSON-LD complètent les métadonnées générées par `lib/metadata.ts` :

| Métadonnées | JSON-LD |
|-------------|---------|
| Pour les réseaux sociaux | Pour les moteurs de recherche |
| OpenGraph, Twitter Cards | Schema.org |
| Aperçu lors du partage | Rich snippets dans les résultats |
| `<meta>` tags | `<script type="application/ld+json">` |

Utilisez **les deux** pour une couverture complète !

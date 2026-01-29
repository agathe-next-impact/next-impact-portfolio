# Templates de Pages avec Métadonnées

Ces templates vous permettent de créer rapidement de nouvelles pages avec le système de métadonnées intégré.

## Template : Page Statique Simple

```tsx
import { Metadata } from "next";
import { generatePageMetadata } from "@/lib/metadata";

// Configuration du revalidation (optionnel)
export const revalidate = 3600; // 1 heure

// Métadonnées de la page
export async function generateMetadata(): Promise<Metadata> {
  return generatePageMetadata({
    title: "Titre de votre page",
    description: "Description de votre page (150-160 caractères recommandés)",
    path: "/votre-page",
    keywords: ["mot-clé 1", "mot-clé 2", "mot-clé 3"],
  });
}

export default function VotrePage() {
  return (
    <div>
      <h1>Titre de votre page</h1>
      {/* Votre contenu */}
    </div>
  );
}
```

## Template : Page avec Données Structurées

```tsx
import { Metadata } from "next";
import { generatePageMetadata } from "@/lib/metadata";
import { BreadcrumbJsonLd } from "@/components/json-ld";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  return generatePageMetadata({
    title: "Titre de votre page",
    description: "Description de votre page",
    path: "/section/votre-page",
    keywords: ["mot-clé 1", "mot-clé 2"],
  });
}

export default function VotrePage() {
  // Fil d'Ariane pour SEO
  const breadcrumbItems = [
    { name: "Accueil", url: "/" },
    { name: "Section", url: "/section" },
    { name: "Votre Page", url: "/section/votre-page" },
  ];

  return (
    <>
      <BreadcrumbJsonLd items={breadcrumbItems} />
      
      <div>
        <h1>Titre de votre page</h1>
        {/* Votre contenu */}
      </div>
    </>
  );
}
```

## Template : Page de Service

```tsx
import { Metadata } from "next";
import { generatePageMetadata } from "@/lib/metadata";
import { ServiceJsonLd, BreadcrumbJsonLd } from "@/components/json-ld";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  return generatePageMetadata({
    title: "Nom du Service",
    description: "Description détaillée de votre service",
    path: "/services/nom-service",
    keywords: ["service", "mot-clé spécifique"],
    image: "/img/services/service-cover.webp", // optionnel
  });
}

export default function ServicePage() {
  const breadcrumbItems = [
    { name: "Accueil", url: "/" },
    { name: "Services", url: "/services" },
    { name: "Nom du Service", url: "/services/nom-service" },
  ];

  return (
    <>
      <BreadcrumbJsonLd items={breadcrumbItems} />
      <ServiceJsonLd
        name="Nom du Service"
        description="Description détaillée de votre service"
        serviceType="Type de service"
        url="/services/nom-service"
      />
      
      <div>
        <h1>Nom du Service</h1>
        {/* Votre contenu */}
      </div>
    </>
  );
}
```

## Template : Page Dynamique (avec params)

```tsx
import { Metadata } from "next";
import { generatePageMetadata } from "@/lib/metadata";
import { notFound } from "next/navigation";

interface Props {
  params: { slug: string };
}

// Données exemple (à remplacer par votre source de données)
const ITEMS = [
  {
    slug: "item-1",
    title: "Item 1",
    description: "Description de l'item 1",
    image: "/img/item-1.webp",
  },
  // ...
];

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const item = ITEMS.find((i) => i.slug === params.slug);
  
  if (!item) {
    return {
      title: "Page introuvable",
      description: "La page demandée n'existe pas.",
    };
  }

  return generatePageMetadata({
    title: item.title,
    description: item.description,
    path: `/items/${item.slug}`,
    image: item.image,
    keywords: [item.slug, "votre", "mots-clés"],
  });
}

export default function ItemPage({ params }: Props) {
  const item = ITEMS.find((i) => i.slug === params.slug);

  if (!item) {
    notFound();
  }

  return (
    <div>
      <h1>{item.title}</h1>
      <p>{item.description}</p>
      {/* Votre contenu */}
    </div>
  );
}

// Générer les routes statiques (optionnel)
export async function generateStaticParams() {
  return ITEMS.map((item) => ({
    slug: item.slug,
  }));
}
```

## Template : Article/Blog avec JSON-LD

```tsx
import { Metadata } from "next";
import { generateArticleMetadata } from "@/lib/metadata";
import { ArticleJsonLd, BreadcrumbJsonLd } from "@/components/json-ld";

interface Props {
  params: { slug: string };
}

// Fonction pour récupérer l'article (à adapter)
async function getArticle(slug: string) {
  // Remplacer par votre logique de récupération
  return {
    title: "Titre de l'article",
    excerpt: "Extrait de l'article",
    content: "Contenu complet...",
    image: "/img/articles/article.webp",
    publishedAt: "2026-01-15T10:00:00.000Z",
    updatedAt: "2026-01-20T14:30:00.000Z",
    author: "Agathe",
    tags: ["tag1", "tag2"],
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const article = await getArticle(params.slug);

  return generateArticleMetadata({
    title: article.title,
    description: article.excerpt,
    slug: params.slug,
    image: article.image,
    publishedTime: article.publishedAt,
    modifiedTime: article.updatedAt,
    authors: [article.author],
    tags: article.tags,
  });
}

export default async function ArticlePage({ params }: Props) {
  const article = await getArticle(params.slug);

  const breadcrumbItems = [
    { name: "Accueil", url: "/" },
    { name: "Blog", url: "/blog" },
    { name: article.title, url: `/blog/${params.slug}` },
  ];

  return (
    <>
      <BreadcrumbJsonLd items={breadcrumbItems} />
      <ArticleJsonLd
        title={article.title}
        description={article.excerpt}
        image={article.image}
        datePublished={article.publishedAt}
        dateModified={article.updatedAt}
        author={article.author}
        url={`/blog/${params.slug}`}
      />

      <article>
        <h1>{article.title}</h1>
        <time dateTime={article.publishedAt}>
          {new Date(article.publishedAt).toLocaleDateString('fr-FR')}
        </time>
        <div>{article.content}</div>
      </article>
    </>
  );
}
```

## Template : Page de Documentation

```tsx
import { Metadata } from "next";
import { generateDocMetadata } from "@/lib/metadata";
import { BreadcrumbJsonLd } from "@/components/json-ld";

interface Props {
  params: { category: string; slug?: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return generateDocMetadata({
    title: `Documentation ${params.category}`,
    description: `Guide complet sur ${params.category}`,
    category: params.category,
    slug: params.slug,
  });
}

export default function DocPage({ params }: Props) {
  const breadcrumbItems = [
    { name: "Accueil", url: "/" },
    { name: "Documentation", url: "/documentation" },
    { name: params.category, url: `/documentation/${params.category}` },
  ];

  if (params.slug) {
    breadcrumbItems.push({
      name: params.slug,
      url: `/documentation/${params.category}/${params.slug}`,
    });
  }

  return (
    <>
      <BreadcrumbJsonLd items={breadcrumbItems} />
      
      <div>
        <h1>Documentation {params.category}</h1>
        {/* Votre contenu */}
      </div>
    </>
  );
}
```

## Template : Page FAQ

```tsx
import { Metadata } from "next";
import { generatePageMetadata } from "@/lib/metadata";
import { FAQJsonLd } from "@/components/json-ld";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  return generatePageMetadata({
    title: "Questions Fréquentes",
    description: "Trouvez les réponses aux questions les plus fréquentes sur nos services",
    path: "/faq",
    keywords: ["faq", "questions", "aide"],
  });
}

export default function FAQPage() {
  const faqItems = [
    {
      question: "Question 1 ?",
      answer: "Réponse détaillée à la question 1...",
    },
    {
      question: "Question 2 ?",
      answer: "Réponse détaillée à la question 2...",
    },
    // ... plus de questions
  ];

  return (
    <>
      <FAQJsonLd questions={faqItems} />
      
      <div>
        <h1>Questions Fréquentes</h1>
        {faqItems.map((item, index) => (
          <div key={index}>
            <h2>{item.question}</h2>
            <p>{item.answer}</p>
          </div>
        ))}
      </div>
    </>
  );
}
```

## Template : Page Contact

```tsx
import { Metadata } from "next";
import { pageMetadata } from "@/lib/metadata";
import { ContactPageJsonLd } from "@/components/json-ld";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata.contact(); // Utilise les métadonnées prédéfinies
}

export default function ContactPage() {
  return (
    <>
      <ContactPageJsonLd />
      
      <div>
        <h1>Contactez-nous</h1>
        {/* Votre formulaire de contact */}
      </div>
    </>
  );
}
```

## Checklist pour Nouvelle Page

Avant de publier une nouvelle page :

- [ ] Métadonnées définies avec `generateMetadata`
- [ ] Titre unique (60 caractères max)
- [ ] Description unique (150-160 caractères)
- [ ] Mots-clés pertinents ajoutés
- [ ] Path correct défini
- [ ] Image OpenGraph si pertinent (1200x630px)
- [ ] JSON-LD approprié ajouté si nécessaire
- [ ] Breadcrumb ajouté pour pages profondes
- [ ] Testé avec le debugger de métadonnées (mode dev)
- [ ] Validé avec Rich Results Test

## Raccourcis VS Code (optionnel)

Créez un snippet dans `.vscode/nextjs.code-snippets` :

```json
{
  "Next.js Page with Metadata": {
    "prefix": "npage",
    "body": [
      "import { Metadata } from \"next\";",
      "import { generatePageMetadata } from \"@/lib/metadata\";",
      "",
      "export const revalidate = 3600;",
      "",
      "export async function generateMetadata(): Promise<Metadata> {",
      "  return generatePageMetadata({",
      "    title: \"${1:Page Title}\",",
      "    description: \"${2:Page description}\",",
      "    path: \"/${3:page-path}\",",
      "    keywords: [\"${4:keyword}\"],",
      "  });",
      "}",
      "",
      "export default function ${5:PageName}() {",
      "  return (",
      "    <div>",
      "      <h1>${1:Page Title}</h1>",
      "      ${0}",
      "    </div>",
      "  );",
      "}"
    ],
    "description": "Create a Next.js page with metadata"
  }
}
```

# Système de Gestion des Métadonnées - Documentation Complète

Ce dossier contient un système complet de gestion des métadonnées et des données structurées pour optimiser le SEO et l'affichage dans les réseaux sociaux.

## 📁 Structure des Fichiers

```
lib/
├── metadata.ts          # Configuration et helpers de métadonnées
├── METADATA_USAGE.md    # Guide d'utilisation des métadonnées
└── JSON_LD_USAGE.md     # Guide d'utilisation du JSON-LD

components/
├── json-ld.tsx          # Composants pour données structurées
└── metadata-debugger.tsx # Outil de debug (dev seulement)
```

## 🚀 Démarrage Rapide

### 1. Page Simple

```tsx
import { Metadata } from "next";
import { pageMetadata } from "@/lib/metadata";

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata.home(); // ou .services(), .contact(), etc.
}

export default function Page() {
  return <div>Contenu</div>;
}
```

### 2. Page Personnalisée

```tsx
import { Metadata } from "next";
import { generatePageMetadata } from "@/lib/metadata";

export async function generateMetadata(): Promise<Metadata> {
  return generatePageMetadata({
    title: "Ma Page",
    description: "Description de ma page",
    path: "/ma-page",
    keywords: ["mot-clé 1", "mot-clé 2"],
  });
}

export default function Page() {
  return <div>Contenu</div>;
}
```

### 3. Avec Données Structurées (JSON-LD)

```tsx
import { Metadata } from "next";
import { generatePageMetadata } from "@/lib/metadata";
import { BreadcrumbJsonLd, ServiceJsonLd } from "@/components/json-ld";

export async function generateMetadata(): Promise<Metadata> {
  return generatePageMetadata({
    title: "Mon Service",
    description: "Description du service",
    path: "/services/mon-service",
  });
}

export default function Page() {
  const breadcrumbs = [
    { name: "Accueil", url: "/" },
    { name: "Services", url: "/services" },
    { name: "Mon Service", url: "/services/mon-service" },
  ];

  return (
    <>
      <BreadcrumbJsonLd items={breadcrumbs} />
      <ServiceJsonLd
        name="Mon Service"
        description="Description du service"
        url="/services/mon-service"
      />
      <div>Contenu</div>
    </>
  );
}
```

## 📚 Documentation Détaillée

### Métadonnées Standard

Voir [METADATA_USAGE.md](./METADATA_USAGE.md) pour :
- ✅ Configuration des métadonnées par défaut
- ✅ Génération de métadonnées personnalisées
- ✅ Métadonnées prédéfinies pour pages principales
- ✅ Gestion des images OpenGraph
- ✅ Twitter Cards
- ✅ Mots-clés et robots
- ✅ URLs canoniques

### Données Structurées (JSON-LD)

Voir [JSON_LD_USAGE.md](./JSON_LD_USAGE.md) pour :
- ✅ Composants JSON-LD disponibles
- ✅ Schema.org pour SEO avancé
- ✅ Rich Snippets Google
- ✅ Fil d'Ariane (Breadcrumb)
- ✅ FAQ, Articles, Services
- ✅ Avis clients et notations
- ✅ Validation des données

## 🛠️ Outils de Développement

### Debugger de Métadonnées

Un bouton flottant apparaît en mode développement (coin inférieur droit) pour visualiser toutes les métadonnées de la page actuelle :
- Titre et description
- Mots-clés
- OpenGraph (Facebook, LinkedIn)
- Twitter Cards
- Robots et indexation
- Images avec aperçu

### Validation

1. **Rich Results Test** : https://search.google.com/test/rich-results
2. **Schema Validator** : https://validator.schema.org/
3. **OpenGraph Debugger** : https://www.opengraph.xyz/
4. **Twitter Card Validator** : https://cards-dev.twitter.com/validator

## 📋 Pages Déjà Migrées

- ✅ Page d'accueil (`/`)
- ✅ Services (`/services`)
- ✅ Études de cas dynamiques (`/etudes-de-cas/[slug]`)

### À Migrer

- ⏳ Contact (`/contact`)
- ⏳ Audit (`/audit`)
- ⏳ Documentation (`/documentation`)
- ⏳ Simulateur tarifs (`/simulateur-tarifs`)
- ⏳ Brief (`/brief`)
- ⏳ Autres pages...

## 🎯 Métadonnées Prédéfinies Disponibles

| Fonction | Page | Description |
|----------|------|-------------|
| `pageMetadata.home()` | `/` | Page d'accueil |
| `pageMetadata.services()` | `/services` | Page services |
| `pageMetadata.audit()` | `/audit` | Audit gratuit |
| `pageMetadata.contact()` | `/contact` | Contact/Devis |
| `pageMetadata.caseStudies()` | `/etudes-de-cas` | Liste études de cas |
| `pageMetadata.documentation()` | `/documentation` | Documentation |
| `pageMetadata.simulateurTarifs()` | `/simulateur-tarifs` | Simulateur prix |
| `pageMetadata.brief()` | `/brief` | Brief projet |

## 🔧 Configuration

### Modifier les Valeurs par Défaut

Éditez `lib/metadata.ts` :

```typescript
export const siteConfig = {
  name: "Next Impact - Développeur WordPress Freelance",
  title: "Next Impact",
  description: "...",
  url: "https://next-impact.digital",
  ogImage: "/img/avatar.webp",
  // Personnalisez ici
};
```

### Ajouter une Nouvelle Page Prédéfinie

Dans `lib/metadata.ts`, section `pageMetadata` :

```typescript
export const pageMetadata = {
  // ... pages existantes
  
  maNouvellePage: (): Metadata =>
    generatePageMetadata({
      title: "Titre de ma page",
      description: "Description...",
      path: "/ma-page",
      keywords: ["mot-clé 1"],
    }),
};
```

## 📊 Impact SEO

### Métadonnées Standard
- 🔗 Partage sur réseaux sociaux (Facebook, LinkedIn, Twitter)
- 🖼️ Aperçus avec images optimisées
- 📝 Descriptions et titres personnalisés
- 🔍 Mots-clés ciblés

### Données Structurées (JSON-LD)
- ⭐ Rich Snippets dans Google
- 🗺️ Fil d'Ariane dans les résultats
- ❓ FAQ expandables
- ⭐ Avis avec étoiles
- 📊 Knowledge Graph
- 📱 Meilleur affichage mobile

## 🚨 Règles Importantes

### ✅ À FAIRE
- Utiliser des titres uniques pour chaque page
- Descriptions entre 150-160 caractères
- Images OpenGraph 1200x630px
- URLs canoniques pour éviter le duplicate content
- Tester les métadonnées après chaque modification
- Ajouter des mots-clés pertinents

### ❌ À ÉVITER
- Ne pas dupliquer les titres/descriptions
- Ne pas utiliser des données fictives dans JSON-LD
- Ne pas oublier les images OpenGraph
- Ne pas dépasser 60 caractères pour les titres
- Ne pas mettre de contenu caché dans JSON-LD
- Ne pas oublier de tester avec les outils Google

## 🔄 Migration d'une Page Existante

### Avant
```tsx
export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Ma page | Next Impact",
    description: "Description",
    openGraph: {
      title: "Ma page | Next Impact",
      description: "Description",
      url: "https://next-impact.digital/ma-page",
      type: "website",
      siteName: "Next Impact - Développeur WordPress Freelance",
      images: [
        {
          url: "/img/avatar.webp",
          width: 1200,
          height: 630,
          alt: "Next Impact",
        },
      ],
    },
    // ... beaucoup de code
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

**Avantages** :
- ✅ Code réduit de ~80%
- ✅ Cohérence automatique
- ✅ Maintenance simplifiée
- ✅ Génération automatique des tags Twitter, robots, etc.

## 📞 Support

Pour toute question :
1. Consulter [METADATA_USAGE.md](./METADATA_USAGE.md)
2. Consulter [JSON_LD_USAGE.md](./JSON_LD_USAGE.md)
3. Tester avec le debugger intégré (mode dev)
4. Valider avec les outils Google

## 🎉 Prochaines Étapes

1. ✅ Système de base créé
2. ✅ Pages principales migrées
3. ⏳ Migrer toutes les pages restantes
4. ⏳ Ajouter plus de types JSON-LD si nécessaire
5. ⏳ Optimiser les images OpenGraph
6. ⏳ Tester et valider toutes les pages

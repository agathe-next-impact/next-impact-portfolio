# 🏷️ Système de Gestion des Métadonnées

Un système complet de gestion des métadonnées et données structurées pour Next.js, optimisant le SEO et le partage social.

## 🚀 Démarrage Ultra-Rapide

```tsx
import { pageMetadata } from "@/lib/metadata";

export async function generateMetadata() {
  return pageMetadata.home(); // ou .services(), .contact(), etc.
}
```

## 📦 Composants Créés

### Core
- **`lib/metadata.ts`** - Configuration et helpers ⭐
- **`components/json-ld.tsx`** - Données structurées Schema.org
- **`components/metadata-debugger.tsx`** - Debugger visuel (dev)
- **`hooks/use-metadata.tsx`** - Hooks et partage social

### Documentation
- **`lib/README_METADATA.md`** - 📖 **COMMENCER ICI** - Guide complet
- **`lib/METADATA_USAGE.md`** - Guide d'utilisation détaillé
- **`lib/JSON_LD_USAGE.md`** - Guide JSON-LD et SEO
- **`lib/METADATA_TEMPLATES.md`** - Templates prêts à l'emploi
- **`lib/METADATA_FILES_INDEX.md`** - Index de tous les fichiers

## 🎯 Exemples d'Utilisation

### Page Simple
```tsx
import { generatePageMetadata } from "@/lib/metadata";

export async function generateMetadata() {
  return generatePageMetadata({
    title: "Ma Page",
    description: "Description de ma page",
    path: "/ma-page",
  });
}
```

### Avec JSON-LD
```tsx
import { BreadcrumbJsonLd } from "@/components/json-ld";

export default function Page() {
  return (
    <>
      <BreadcrumbJsonLd items={[
        { name: "Accueil", url: "/" },
        { name: "Ma Page", url: "/ma-page" }
      ]} />
      <h1>Contenu</h1>
    </>
  );
}
```

## 🛠️ Outils Inclus

1. **Debugger Métadonnées** - Bouton flottant en bas à droite (dev uniquement)
2. **Script d'Analyse** - `node scripts/check-metadata-migration.js`
3. **Page de Test** - `/demo/metadata-test` (en dev)
4. **Prévisualisation** - Composant `MetadataPreview`

## 📊 Fonctionnalités

✅ Métadonnées OpenGraph (Facebook, LinkedIn)  
✅ Twitter Cards  
✅ Données structurées JSON-LD (Schema.org)  
✅ Rich Snippets Google  
✅ Fil d'Ariane (Breadcrumb)  
✅ Configuration centralisée  
✅ TypeScript complet  
✅ Debugger visuel  
✅ Partage social intégré  
✅ Templates prêts à l'emploi  

## 📚 Documentation Complète

**Lisez [`lib/README_METADATA.md`](./lib/README_METADATA.md) pour commencer !**

## ✅ Pages Migrées

- ✅ Page d'accueil
- ✅ Services
- ✅ Études de cas (dynamique)

## 🔄 Migration d'une Page

**Avant** (30+ lignes) :
```tsx
export async function generateMetadata() {
  return {
    title: "Ma page | Next Impact",
    openGraph: { /* ... */ },
    twitter: { /* ... */ },
    // ... beaucoup de code
  };
}
```

**Après** (3 lignes) :
```tsx
export async function generateMetadata() {
  return pageMetadata.services();
}
```

## 🎉 Prochaines Étapes

1. Consulter [`lib/README_METADATA.md`](./lib/README_METADATA.md)
2. Migrer les pages restantes avec [`lib/METADATA_TEMPLATES.md`](./lib/METADATA_TEMPLATES.md)
3. Tester sur `/demo/metadata-test`
4. Valider avec [Rich Results Test](https://search.google.com/test/rich-results)

---

**Documentation** : [`lib/README_METADATA.md`](./lib/README_METADATA.md)  
**Templates** : [`lib/METADATA_TEMPLATES.md`](./lib/METADATA_TEMPLATES.md)  
**Version** : 1.0.0

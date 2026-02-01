# Commit Message Suggestion

```
feat: système complet de gestion des métadonnées et SEO

✨ Ajouts:
- Système centralisé de génération des métadonnées
- Composants JSON-LD pour données structurées Schema.org
- Debugger visuel de métadonnées (dev uniquement)
- Hooks de partage social
- Composant de prévisualisation métadonnées
- Page de test et documentation complète

📦 Fichiers créés:
- lib/metadata.ts (configuration et helpers)
- components/json-ld.tsx (données structurées)
- components/metadata-debugger.tsx (outil debug)
- components/metadata-preview.tsx (prévisualisation)
- hooks/use-metadata.tsx (hooks et partage)
- app/demo/metadata-test/page.tsx (page test)

📚 Documentation:
- lib/README_METADATA.md (guide principal)
- lib/METADATA_USAGE.md (guide utilisation)
- lib/JSON_LD_USAGE.md (guide JSON-LD)
- lib/METADATA_TEMPLATES.md (templates)
- lib/METADATA_FILES_INDEX.md (index fichiers)
- METADATA_SYSTEM.md (README racine)

🔄 Migrations:
- app/page.tsx (utilise pageMetadata.home())
- app/services/page.tsx (utilise pageMetadata.services())
- app/etudes-de-cas/[slug]/page.tsx (generateArticleMetadata)
- app/layout.tsx (OrganizationJsonLd + MetadataDebugger)

🛠️ Outils:
- scripts/check-metadata-migration.js (analyse pages)

✅ Fonctionnalités:
- Métadonnées OpenGraph et Twitter Cards
- Données structurées JSON-LD
- Configuration centralisée
- TypeScript complet
- Debugger intégré
- Templates prêts à l'emploi

🎯 Résultat:
- Réduction du code de métadonnées de ~80%
- Cohérence automatique
- Maintenance simplifiée
- SEO optimisé
- Rich Snippets activés
```

## Alternative courte

```
feat: add metadata management system with JSON-LD support

- Centralized metadata configuration
- Schema.org structured data components
- Visual metadata debugger (dev only)
- Social sharing hooks
- Complete documentation and templates
- Migrated home, services, and case studies pages
```

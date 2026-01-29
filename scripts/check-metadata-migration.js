/**
 * Script utilitaire pour lister les pages qui n'utilisent pas encore
 * le nouveau système de métadonnées
 * 
 * Usage: node scripts/check-metadata-migration.js
 */

const fs = require('fs');
const path = require('path');

const APP_DIR = path.join(__dirname, '..', 'app');

// Pages qui utilisent déjà le nouveau système
const MIGRATED_PAGES = [
  'page.tsx', // home
  'services/page.tsx',
  'etudes-de-cas/[slug]/page.tsx',
];

// Fonction pour trouver tous les fichiers page.tsx
function findPageFiles(dir, baseDir = dir, files = []) {
  const items = fs.readdirSync(dir);

  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      // Ignorer node_modules, .next, etc.
      if (!item.startsWith('.') && item !== 'node_modules') {
        findPageFiles(fullPath, baseDir, files);
      }
    } else if (item === 'page.tsx' || item === 'page.js') {
      const relativePath = path.relative(baseDir, fullPath);
      files.push(relativePath.replace(/\\/g, '/'));
    }
  }

  return files;
}

// Vérifier si un fichier utilise l'ancien système
function usesOldMetadataSystem(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  
  // Vérifier s'il y a des métadonnées définies
  const hasMetadata = content.includes('generateMetadata') || content.includes('export const metadata');
  
  if (!hasMetadata) {
    return { needsMigration: false, reason: 'no-metadata' };
  }
  
  // Vérifier s'il utilise le nouveau système
  const usesNewSystem = 
    content.includes('from "@/lib/metadata"') ||
    content.includes('pageMetadata.') ||
    content.includes('generatePageMetadata') ||
    content.includes('generateArticleMetadata') ||
    content.includes('generateDocMetadata');
  
  if (usesNewSystem) {
    return { needsMigration: false, reason: 'already-migrated' };
  }
  
  // Vérifier s'il définit des métadonnées manuellement
  const hasManualOpenGraph = content.includes('openGraph:');
  const hasManualTitle = content.match(/title:\s*["'`]/);
  
  if (hasManualOpenGraph || hasManualTitle) {
    return { needsMigration: true, reason: 'manual-metadata' };
  }
  
  return { needsMigration: false, reason: 'unknown' };
}

// Analyser toutes les pages
function analyzePage(filePath) {
  const fullPath = path.join(APP_DIR, filePath);
  const result = usesOldMetadataSystem(fullPath);
  
  return {
    path: filePath,
    ...result,
  };
}

// Main
console.log('🔍 Analyse des pages...\n');

const pageFiles = findPageFiles(APP_DIR);
const results = pageFiles.map(analyzePage);

// Pages à migrer
const toMigrate = results.filter(r => r.needsMigration);
const alreadyMigrated = results.filter(r => r.reason === 'already-migrated');
const noMetadata = results.filter(r => r.reason === 'no-metadata');

console.log('📊 Résultats :\n');
console.log(`✅ Pages migrées : ${alreadyMigrated.length}`);
console.log(`⚠️  Pages à migrer : ${toMigrate.length}`);
console.log(`ℹ️  Pages sans métadonnées : ${noMetadata.length}`);
console.log(`📄 Total pages : ${pageFiles.length}\n`);

if (toMigrate.length > 0) {
  console.log('⚠️  Pages à migrer :\n');
  toMigrate.forEach(page => {
    console.log(`   - ${page.path}`);
  });
  console.log();
}

if (alreadyMigrated.length > 0) {
  console.log('✅ Pages déjà migrées :\n');
  alreadyMigrated.forEach(page => {
    console.log(`   - ${page.path}`);
  });
  console.log();
}

if (noMetadata.length > 0) {
  console.log('ℹ️  Pages sans métadonnées (peuvent être ignorées) :\n');
  noMetadata.forEach(page => {
    console.log(`   - ${page.path}`);
  });
  console.log();
}

// Générer un rapport
const report = {
  date: new Date().toISOString(),
  total: pageFiles.length,
  migrated: alreadyMigrated.length,
  toMigrate: toMigrate.length,
  noMetadata: noMetadata.length,
  pages: {
    migrated: alreadyMigrated.map(p => p.path),
    toMigrate: toMigrate.map(p => p.path),
    noMetadata: noMetadata.map(p => p.path),
  },
};

const reportPath = path.join(__dirname, 'metadata-migration-report.json');
fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

console.log(`📝 Rapport sauvegardé dans : ${reportPath}\n`);

// Pourcentage de migration
const percentage = ((alreadyMigrated.length / (alreadyMigrated.length + toMigrate.length)) * 100).toFixed(1);
console.log(`🎯 Progression : ${percentage}% des pages avec métadonnées sont migrées\n`);

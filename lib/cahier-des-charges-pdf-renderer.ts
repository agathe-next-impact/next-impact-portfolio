import jsPDF from "jspdf";
import "jspdf-autotable";
import * as fs from "fs";
import * as path from "path";

// --- Couleurs ---
const C = {
  darkblue: [30, 58, 95] as [number, number, number],
  mediumblue: [31, 84, 191] as [number, number, number],
  coral: [255, 107, 107] as [number, number, number],
  yellow: [242, 229, 126] as [number, number, number],
  gray: [100, 116, 139] as [number, number, number],
  lightgray: [240, 244, 248] as [number, number, number],
  white: [255, 255, 255] as [number, number, number],
  black: [33, 33, 33] as [number, number, number],
  green: [5, 150, 105] as [number, number, number],
};

const PAGE_W = 210;
const PAGE_H = 297;
const MARGIN = 20;
const CONTENT_W = PAGE_W - MARGIN * 2;

// --- Helpers ---
function val(v: any): string {
  return v && typeof v === "string" && v.trim() ? v.trim() : "Non spécifié";
}

function getCheckedItems(data: Record<string, any> | undefined): { label: string; checked: boolean }[] {
  if (!data || typeof data !== "object") return [];
  return Object.values(data).map((v: any) => ({
    label: v?.label || "—",
    checked: !!v?.checked,
  }));
}

function loadLogo(): string | null {
  try {
    const logoPath = path.join(process.cwd(), "public", "img", "logo-small.png");
    const buffer = fs.readFileSync(logoPath);
    return `data:image/png;base64,${buffer.toString("base64")}`;
  } catch {
    return null;
  }
}

// --- Fonctions de rendu ---

function ensureSpace(doc: jsPDF, needed: number, currentY: number): number {
  if (currentY + needed > PAGE_H - 30) {
    doc.addPage();
    return MARGIN + 10;
  }
  return currentY;
}

function renderSectionTitle(doc: jsPDF, title: string, y: number): number {
  y = ensureSpace(doc, 16, y);
  doc.setFillColor(...C.darkblue);
  doc.roundedRect(MARGIN, y, CONTENT_W, 10, 2, 2, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(...C.white);
  doc.text(title, MARGIN + 4, y + 7);
  return y + 16;
}

function renderSubsectionTitle(doc: jsPDF, title: string, y: number): number {
  y = ensureSpace(doc, 12, y);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(...C.coral);
  doc.text(title, MARGIN + 2, y + 4);
  doc.setDrawColor(...C.coral);
  doc.setLineWidth(0.3);
  doc.line(MARGIN + 2, y + 6, MARGIN + 2 + doc.getTextWidth(title), y + 6);
  return y + 12;
}

function renderField(doc: jsPDF, label: string, value: string, y: number): number {
  y = ensureSpace(doc, 10, y);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(...C.darkblue);
  doc.text(label, MARGIN + 4, y);

  doc.setFont("helvetica", "normal");
  doc.setTextColor(...C.black);
  const lines = doc.splitTextToSize(value, CONTENT_W - 8);
  y = ensureSpace(doc, lines.length * 4.5 + 2, y);
  doc.text(lines, MARGIN + 4, y + 4.5);
  return y + lines.length * 4.5 + 4;
}

function renderCheckboxGroup(doc: jsPDF, items: { label: string; checked: boolean }[], y: number): number {
  if (items.length === 0) return y;
  y = ensureSpace(doc, items.length * 6 + 4, y);

  const tableBody = items.map((item) => [
    item.checked ? "V" : "—",
    item.label,
  ]);

  (doc as any).autoTable({
    startY: y,
    margin: { left: MARGIN + 4, right: MARGIN },
    head: [],
    body: tableBody,
    theme: "plain",
    styles: { fontSize: 8.5, cellPadding: 1.5, textColor: C.black },
    columnStyles: {
      0: {
        cellWidth: 8,
        halign: "center" as const,
        fontStyle: "bold" as const,
        textColor: items.some((i) => i.checked) ? C.green : C.gray,
      },
      1: { cellWidth: CONTENT_W - 16 },
    },
  });

  return (doc as any).lastAutoTable.finalY + 4;
}

function addFooters(doc: jsPDF, formData: Record<string, any>) {
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(...C.gray);
    doc.setDrawColor(...C.lightgray);
    doc.line(MARGIN, PAGE_H - 18, PAGE_W - MARGIN, PAGE_H - 18);
    doc.text(val(formData.organisation_name), MARGIN, PAGE_H - 13);
    doc.text(val(formData.date_redaction), PAGE_W / 2, PAGE_H - 13, { align: "center" });
    doc.text(`Page ${i}/${pageCount}`, PAGE_W - MARGIN, PAGE_H - 13, { align: "right" });
  }
}

// --- Point d'entrée ---

export async function generateCahierDesChargesPDF(formData: Record<string, any>): Promise<Buffer> {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const logo = loadLogo();

  // ===== PAGE DE COUVERTURE =====
  doc.setFillColor(...C.darkblue);
  doc.rect(0, 0, PAGE_W, PAGE_H, "F");

  if (logo) {
    doc.addImage(logo, "PNG", PAGE_W / 2 - 15, 40, 30, 30);
  }

  doc.setFont("helvetica", "bold");
  doc.setFontSize(28);
  doc.setTextColor(...C.white);
  doc.text("CAHIER DES CHARGES", PAGE_W / 2, 90, { align: "center" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(14);
  doc.setTextColor(...C.yellow);
  doc.text("Création / Refonte de site web", PAGE_W / 2, 102, { align: "center" });

  // Infos projet
  const infoY = 130;
  doc.setDrawColor(...C.yellow);
  doc.setLineWidth(0.5);
  doc.roundedRect(50, infoY - 5, 110, 50, 3, 3, "S");

  doc.setFontSize(10);
  doc.setTextColor(...C.white);
  const infos = [
    ["Organisation", val(formData.organisation_name)],
    ["Secteur", val(formData.secteur_activite)],
    ["Date", val(formData.date_redaction)],
    ["Rédacteur", val(formData.redacteur)],
  ];
  infos.forEach(([label, value], i) => {
    doc.setFont("helvetica", "bold");
    doc.text(`${label} :`, 56, infoY + 5 + i * 11);
    doc.setFont("helvetica", "normal");
    doc.text(value, 95, infoY + 5 + i * 11);
  });

  // Contact Next Impact
  doc.setFontSize(9);
  doc.setTextColor(...C.coral);
  doc.text("Accompagné par Next Impact Digital", PAGE_W / 2, 210, { align: "center" });
  doc.setTextColor(...C.white);
  doc.setFontSize(8);
  doc.text("agathe@next-impact.digital  |  06 73 98 16 38", PAGE_W / 2, 218, { align: "center" });
  doc.text("next-impact.digital", PAGE_W / 2, 224, { align: "center" });

  doc.setFontSize(7);
  doc.setTextColor(...C.gray);
  doc.text("Document confidentiel", PAGE_W / 2, PAGE_H - 20, { align: "center" });

  // ===== TABLE DES MATIÈRES =====
  doc.addPage();
  let y = MARGIN;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor(...C.darkblue);
  doc.text("TABLE DES MATIÈRES", PAGE_W / 2, y + 8, { align: "center" });
  y += 20;

  const sections = [
    "1. Présentation générale du projet",
    "2. Spécifications fonctionnelles",
    "3. Spécifications graphiques et ergonomiques",
    "4. Spécifications techniques",
    "5. Gestion de contenu",
    "6. Prestations attendues",
    "7. Planning et budget",
    "8. Modalités de réponse",
    "9. Annexes",
  ];
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  sections.forEach((s, i) => {
    doc.setTextColor(...C.darkblue);
    doc.text(s, MARGIN + 10, y + i * 10);
    doc.setDrawColor(...C.lightgray);
    doc.setLineWidth(0.2);
    doc.line(MARGIN + 10, y + i * 10 + 2, PAGE_W - MARGIN, y + i * 10 + 2);
  });

  // ===== SECTION 1 =====
  doc.addPage();
  y = MARGIN;
  y = renderSectionTitle(doc, "1. PRÉSENTATION GÉNÉRALE DU PROJET", y);
  y = renderSubsectionTitle(doc, "1.1 Contexte", y);
  y = renderField(doc, "Nom de l'organisation :", val(formData.organisation_name), y);
  y = renderField(doc, "Secteur d'activité :", val(formData.secteur_activite), y);
  y = renderField(doc, "Public cible :", val(formData.public_cible), y);
  y = renderField(doc, "Problématiques identifiées :", val(formData.problematiques), y);
  y = renderField(doc, "Objectifs principaux :", val(formData.objectifs_refonte), y);
  y = renderSubsectionTitle(doc, "1.2 Description du site existant", y);
  y = renderField(doc, "URL du site actuel :", val(formData.site_url), y);
  y = renderField(doc, "Date de création :", val(formData.site_creation_date), y);
  y = renderField(doc, "Technologies utilisées :", val(formData.technologies_actuelles), y);

  // ===== SECTION 2 =====
  y = ensureSpace(doc, 30, y + 6);
  y = renderSectionTitle(doc, "2. SPÉCIFICATIONS FONCTIONNELLES", y);
  y = renderSubsectionTitle(doc, "2.1 Architecture de l'information", y);
  y = renderField(doc, "Arborescence proposée :", val(formData.arborescence), y);
  y = renderField(doc, "Types de contenus :", val(formData.types_contenus), y);
  y = renderSubsectionTitle(doc, "2.2 Fonctionnalités standards", y);
  y = renderCheckboxGroup(doc, getCheckedItems(formData.fonctionnalites_standards), y);
  y = renderSubsectionTitle(doc, "2.3 Fonctionnalités avancées", y);
  y = renderCheckboxGroup(doc, getCheckedItems(formData.fonctionnalites_avancees), y);
  y = renderSubsectionTitle(doc, "2.4 Contraintes techniques", y);
  y = renderField(doc, "Contraintes techniques :", val(formData.contraintes_techniques), y);

  // ===== SECTION 3 =====
  y = ensureSpace(doc, 30, y + 6);
  y = renderSectionTitle(doc, "3. SPÉCIFICATIONS GRAPHIQUES ET ERGONOMIQUES", y);
  y = renderSubsectionTitle(doc, "3.1 Charte graphique", y);
  y = renderCheckboxGroup(doc, getCheckedItems(formData.charte_graphique), y);
  y = renderField(doc, "Sites d'inspiration :", val(formData.inspirations), y);
  y = renderField(doc, "Couleurs principales :", val(formData.couleurs), y);
  y = renderField(doc, "Typographie :", val(formData.typographies), y);
  y = renderField(doc, "Ambiance visuelle :", val(formData.ambiance), y);
  y = renderField(doc, "Priorité UX :", val(formData.ux_priorites), y);
  y = renderField(doc, "Responsive :", val(formData.responsive), y);
  y = renderSubsectionTitle(doc, "3.2 Ergonomie", y);
  y = renderField(doc, "Accessibilité :", val(formData.accessibilite), y);
  y = renderField(doc, "Navigation :", val(formData.navigation), y);

  // ===== SECTION 4 =====
  y = ensureSpace(doc, 30, y + 6);
  y = renderSectionTitle(doc, "4. SPÉCIFICATIONS TECHNIQUES", y);
  y = renderSubsectionTitle(doc, "4.1 Outils et Technologies", y);
  y = renderField(doc, "CMS ou Framework :", val(formData.cms_framework), y);
  y = renderField(doc, "Langages de programmation :", val(formData.langages), y);
  y = renderField(doc, "Base de données :", val(formData.base_donnees), y);
  y = renderSubsectionTitle(doc, "4.2 Hébergement", y);
  y = renderField(doc, "Type d'hébergement :", val(formData.hebergement), y);
  y = renderSubsectionTitle(doc, "4.3 Sécurité", y);
  y = renderField(doc, "Niveau de sécurité :", val(formData.securite), y);
  y = renderSubsectionTitle(doc, "4.4 Performance et SEO", y);
  y = renderField(doc, "Temps de chargement cible :", val(formData.performance), y);
  y = renderField(doc, "Exigences SEO :", val(formData.seo), y);

  // ===== SECTION 5 =====
  y = ensureSpace(doc, 30, y + 6);
  y = renderSectionTitle(doc, "5. GESTION DE CONTENU", y);
  y = renderSubsectionTitle(doc, "5.1 Contenus", y);
  y = renderField(doc, "Volume à migrer :", val(formData.migration_volume), y);
  y = renderField(doc, "Types de migration :", val(formData.migration_types), y);
  y = renderField(doc, "Contenus à créer :", val(formData.contenus_creer), y);
  y = renderField(doc, "Profils administrateurs :", val(formData.profils_admin), y);
  y = renderSubsectionTitle(doc, "5.2 Formation et support", y);
  y = renderField(doc, "Formation proposée :", val(formData.formation_proposee), y);
  y = renderField(doc, "Support technique :", val(formData.support_technique), y);

  // ===== SECTION 6 =====
  y = ensureSpace(doc, 30, y + 6);
  y = renderSectionTitle(doc, "6. PRESTATIONS ATTENDUES", y);
  y = renderSubsectionTitle(doc, "6.1 Phases du projet", y);
  y = renderCheckboxGroup(doc, getCheckedItems(formData.phases_projet), y);
  y = renderField(doc, "Méthodologie :", val(formData.methodologie), y);
  y = renderField(doc, "Garantie :", val(formData.garantie), y);

  // ===== SECTION 7 =====
  y = ensureSpace(doc, 30, y + 6);
  y = renderSectionTitle(doc, "7. PLANNING ET BUDGET", y);
  y = renderSubsectionTitle(doc, "7.1 Planning", y);
  y = renderField(doc, "Date de démarrage :", val(formData.date_demarrage), y);
  y = renderField(doc, "Date de mise en ligne :", val(formData.date_mise_en_ligne), y);
  y = renderSubsectionTitle(doc, "7.2 Budget", y);
  y = renderField(doc, "Budget global :", val(formData.budget_global), y);
  y = renderField(doc, "Budget maintenance :", val(formData.budget_maintenance), y);

  // ===== SECTION 8 =====
  y = ensureSpace(doc, 30, y + 6);
  y = renderSectionTitle(doc, "8. MODALITÉS DE RÉPONSE", y);
  y = renderSubsectionTitle(doc, "8.1 Modalités", y);
  y = renderField(doc, "Date limite :", val(formData.date_limite), y);
  y = renderField(doc, "Mode de réponse :", val(formData.mode_reponse), y);
  y = renderSubsectionTitle(doc, "8.2 Critères de sélection", y);
  y = renderField(doc, "Critères techniques :", val(formData.criteres_techniques), y);
  y = renderField(doc, "Critères financiers :", val(formData.criteres_financiers), y);
  y = renderSubsectionTitle(doc, "8.3 Contact", y);
  y = renderField(doc, "Personne référente :", val(formData.contact_nom), y);
  y = renderField(doc, "Email :", val(formData.contact_email), y);

  // ===== SECTION 9 =====
  y = ensureSpace(doc, 30, y + 6);
  y = renderSectionTitle(doc, "9. ANNEXES", y);
  y = renderSubsectionTitle(doc, "9.1 Documents fournis", y);
  y = renderCheckboxGroup(doc, getCheckedItems(formData.documents_fournis), y);

  // ===== DERNIÈRE PAGE — CONTACT NEXT IMPACT =====
  y = ensureSpace(doc, 50, y + 10);
  doc.setDrawColor(...C.coral);
  doc.setLineWidth(0.5);
  doc.roundedRect(MARGIN + 15, y, CONTENT_W - 30, 40, 3, 3, "S");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(...C.darkblue);
  doc.text("Next Impact Digital", PAGE_W / 2, y + 10, { align: "center" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...C.black);
  doc.text("agathe@next-impact.digital", PAGE_W / 2, y + 18, { align: "center" });
  doc.text("06 73 98 16 38", PAGE_W / 2, y + 24, { align: "center" });
  doc.setTextColor(...C.mediumblue);
  doc.text("next-impact.digital", PAGE_W / 2, y + 30, { align: "center" });

  // ===== FOOTERS =====
  addFooters(doc, formData);

  // ===== OUTPUT =====
  const arrayBuffer = doc.output("arraybuffer");
  return Buffer.from(arrayBuffer);
}

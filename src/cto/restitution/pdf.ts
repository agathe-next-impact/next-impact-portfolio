import { jsPDF } from "jspdf";
import autoTable, { type RowInput } from "jspdf-autotable";
import type { Block, Span } from "../notion/blocks";
import type {
  AuditPayload,
  CartographiePayload,
  DecisionPayload,
  Deliverable,
  DocumentPayload,
  PrestationPayload,
  RoadmapPayload,
  VeillePayload,
} from "../deliverables";
import type { RestitutionData } from "./collect";

// ─────────────────────────────────────────────────────────────────────────────
// Le dossier de restitution, en PDF.
//
// Un PDF plutôt qu'une archive de fichiers : c'est le format qu'un dirigeant
// transmet à son prochain prestataire sans explication, qu'il imprime pour un
// conseil d'administration, et qui se relit dans dix ans. Sobre à dessein —
// noir sur blanc, tableaux, dates partout : c'est une pièce, pas une plaquette.
//
// Les polices standard de jsPDF ne connaissent que le jeu WinAnsi ; `clean()`
// ramène tout texte à ce jeu plutôt que de laisser un caractère inconnu
// s'imprimer en symbole illisible.
// ─────────────────────────────────────────────────────────────────────────────

const MARGIN = 16;
const INK: [number, number, number] = [25, 25, 25];
const MUTED: [number, number, number] = [110, 110, 110];
const ACCENT: [number, number, number] = [226, 83, 54];
const RULE: [number, number, number] = [210, 210, 210];

/** Ramène un texte au jeu de caractères des polices standard (WinAnsi). */
export function clean(value: string | null | undefined): string {
  if (!value) return "";
  return value
    .replace(/→/g, "->")
    .replace(/←/g, "<-")
    .replace(/[≥]/g, ">=")
    .replace(/[≤]/g, "<=")
    .replace(/[  ]/g, " ")
    .replace(/[^\x09\x0A\x0D\x20-\x7E -ÿŒœŠšŸŽžƒˆ˜–—‘’‚“”„†‡•…‰‹›€™]/g, "");
}

function day(date: Date | null | undefined): string {
  if (!date) return "";
  return new Intl.DateTimeFormat("fr-FR", { dateStyle: "medium", timeZone: "Europe/Paris" }).format(date);
}

function euros(value: number | null | undefined): string {
  if (typeof value !== "number" || !Number.isFinite(value)) return "";
  return `${new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 }).format(value).replace(/ /g, " ")} EUR`;
}

function byKind(items: Deliverable[], kind: Deliverable["kind"]): Deliverable[] {
  return items
    .filter((item) => item.kind === kind)
    .sort((a, b) => (b.occurredAt?.getTime() ?? 0) - (a.occurredAt?.getTime() ?? 0));
}

class Writer {
  readonly doc = new jsPDF({ unit: "mm", format: "a4" });
  y = MARGIN;
  readonly width = this.doc.internal.pageSize.getWidth() - MARGIN * 2;
  readonly height = this.doc.internal.pageSize.getHeight();

  ensure(space: number) {
    if (this.y + space > this.height - MARGIN - 8) {
      this.doc.addPage();
      this.y = MARGIN;
    }
  }

  heading(text: string) {
    this.ensure(22);
    this.y += 6;
    this.doc.setFont("helvetica", "bold");
    this.doc.setFontSize(14);
    this.doc.setTextColor(...INK);
    this.doc.text(clean(text), MARGIN, this.y);
    this.y += 2.5;
    this.doc.setDrawColor(...ACCENT);
    this.doc.setLineWidth(0.6);
    this.doc.line(MARGIN, this.y, MARGIN + 18, this.y);
    this.y += 6;
  }

  subheading(text: string, size = 11) {
    this.ensure(14);
    this.y += 3;
    this.doc.setFont("helvetica", "bold");
    this.doc.setFontSize(size);
    this.doc.setTextColor(...INK);
    const lines = this.doc.splitTextToSize(clean(text), this.width) as string[];
    for (const line of lines) {
      this.ensure(size * 0.45 + 1);
      this.doc.text(line, MARGIN, this.y);
      this.y += size * 0.45;
    }
    this.y += 2;
  }

  paragraph(text: string, options: { size?: number; muted?: boolean } = {}) {
    this.doc.setFont("helvetica", "normal");
    this.doc.setFontSize(options.size ?? 10);
    this.doc.setTextColor(...(options.muted ? MUTED : INK));
    const lines = this.doc.splitTextToSize(clean(text), this.width) as string[];
    const lineHeight = (options.size ?? 10) * 0.45;
    for (const line of lines) {
      this.ensure(lineHeight + 1);
      this.doc.text(line, MARGIN, this.y);
      this.y += lineHeight;
    }
    this.y += 2;
  }

  table(head: string[], body: string[][], widths?: number[]) {
    if (body.length === 0) {
      this.paragraph("Rien de publié dans cette rubrique.", { muted: true, size: 9 });
      return;
    }
    autoTable(this.doc, {
      startY: this.y,
      margin: { left: MARGIN, right: MARGIN, top: MARGIN, bottom: MARGIN + 8 },
      head: [head.map(clean)],
      body: body.map((row) => row.map(clean)) as RowInput[],
      theme: "grid",
      styles: {
        font: "helvetica",
        fontSize: 8,
        cellPadding: 1.8,
        textColor: INK,
        lineColor: RULE,
        lineWidth: 0.2,
        overflow: "linebreak",
        valign: "top",
      },
      headStyles: { fillColor: [245, 245, 245], textColor: INK, fontStyle: "bold" },
      columnStyles: widths
        ? Object.fromEntries(widths.map((w, i) => [i, { cellWidth: w }]))
        : undefined,
    });
    this.y = (this.doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 6;
  }

  footer(company: string, generatedAt: Date) {
    const pages = this.doc.getNumberOfPages();
    for (let i = 1; i <= pages; i += 1) {
      this.doc.setPage(i);
      this.doc.setFont("helvetica", "normal");
      this.doc.setFontSize(7.5);
      this.doc.setTextColor(...MUTED);
      this.doc.text(
        clean(`${company} — dossier de restitution du ${day(generatedAt)}`),
        MARGIN,
        this.height - 8,
      );
      this.doc.text(`${i} / ${pages}`, this.doc.internal.pageSize.getWidth() - MARGIN, this.height - 8, {
        align: "right",
      });
    }
  }
}

function plain(spans: Span[]): string {
  return spans.map((span) => span.t).join("");
}

/**
 * Le corps d'un audit, bloc par bloc, dans le PDF.
 *
 * Le contenu entier, sans résumé : un audit restitué doit se relire sans
 * l'espace. La mise en forme se réduit à ce que l'impression garde — titres,
 * paragraphes, puces, tableaux. Une image devient sa légende : le fichier reste
 * téléchargeable depuis l'espace tant qu'il est ouvert.
 */
function writeBlocks(w: Writer, blocks: Block[]): void {
  let numero = 0;
  for (const bloc of blocks) {
    if (bloc.k !== "oli") numero = 0;
    switch (bloc.k) {
      case "h1":
      case "h2":
      case "h3":
        w.subheading(plain(bloc.s), bloc.k === "h1" ? 12 : bloc.k === "h2" ? 11 : 10);
        break;
      case "li":
        w.paragraph(`• ${plain(bloc.s)}`, { size: 9.5 });
        break;
      case "oli":
        numero += 1;
        w.paragraph(`${numero}. ${plain(bloc.s)}`, { size: 9.5 });
        break;
      case "hr":
        w.y += 2;
        break;
      case "code":
        w.paragraph(bloc.t, { size: 8.5, muted: true });
        break;
      case "box":
        if (bloc.s.length > 0) w.paragraph(plain(bloc.s));
        writeBlocks(w, bloc.c);
        break;
      case "table":
        if (bloc.title) w.subheading(bloc.title, 9.5);
        w.table(
          (bloc.head ?? bloc.rows[0]?.map(() => [] as Span[]) ?? []).map(plain),
          bloc.rows.map((row) => row.map(plain)),
        );
        break;
      case "img":
        w.paragraph(`[Image${bloc.alt ? ` : ${bloc.alt}` : ""}]`, { size: 8.5, muted: true });
        break;
      default:
        w.paragraph(plain(bloc.s), { size: 9.5 });
    }
  }
}

/** Le PDF complet, en octets. */
export function renderRestitutionPdf(data: RestitutionData): Uint8Array {
  const w = new Writer();
  const { doc } = w;

  // ─── Couverture ────────────────────────────────────────────────────────
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...MUTED);
  doc.text("NEXT IMPACT — DIRECTION TECHNIQUE", MARGIN, 40);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(24);
  doc.setTextColor(...INK);
  doc.text("Dossier de restitution", MARGIN, 54);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(16);
  doc.text(clean(data.company), MARGIN, 66);
  doc.setDrawColor(...ACCENT);
  doc.setLineWidth(0.8);
  doc.line(MARGIN, 72, MARGIN + 24, 72);
  w.y = 84;
  w.paragraph(`Établi le ${day(data.generatedAt)}.`, { muted: true });
  w.paragraph(
    "Ce dossier rassemble tout ce que l'accompagnement a produit et qui est publié à cette date : " +
      "relevé de décisions, roadmap, cartographie du système, documents relus, prestations, veille, " +
      "lettres, rapports de maintenance et audits, ces derniers en entier. Il se lit sans aucun compte ni outil : c'est l'objet même " +
      "de la clause de restitution.",
  );
  w.paragraph(
    "Les livrables ne sont jamais réécrits : une correction ajoute une version datée. La dernière " +
      "section donne, pour chaque livrable corrigé, la liste de ses versions — ce qui a été " +
      "communiqué reste traçable.",
    { muted: true },
  );

  const sommaire = [
    ["1", "Relevé de décisions", String(byKind(data.items, "decision").length)],
    ["2", "Roadmap", String(byKind(data.items, "roadmap").length)],
    ["3", "Cartographie du système", String(byKind(data.items, "cartographie").length)],
    ["4", "Documents", String(byKind(data.items, "document").length)],
    ["5", "Prestations", String(byKind(data.items, "prestation").length)],
    ["6", "Veille", String(byKind(data.items, "veille").length)],
    ["7", "Lettres de veille", String(data.letters.length)],
    ["8", "Rapports de maintenance", String(data.reports.length)],
    ["9", "Audits", String(byKind(data.items, "audit").length)],
    ["10", "Historique des corrections", String(data.corrections.length)],
  ];
  w.y += 4;
  w.table(["", "Rubrique", "Entrées"], sommaire, [10, w.width - 34, 24]);

  // ─── 1. Décisions ──────────────────────────────────────────────────────
  doc.addPage();
  w.y = MARGIN;
  w.heading("1. Relevé de décisions");
  w.table(
    ["Date", "Décision", "Nature", "Motif", "Option écartée"],
    byKind(data.items, "decision").map((item) => {
      const p = item.payload as DecisionPayload;
      return [
        day(item.occurredAt),
        item.title,
        p.nature === "ecartee" ? "Proposition écartée" : p.nature === "arbitrage" ? "Arbitrage" : "",
        p.motif ?? "",
        p.optionEcartee ?? "",
      ];
    }),
    [22, 40, 22, 48, w.width - 132],
  );

  // ─── 2. Roadmap ────────────────────────────────────────────────────────
  w.heading("2. Roadmap");
  w.table(
    ["Chantier", "Statut", "Échéance", "Budget", "Détail"],
    byKind(data.items, "roadmap").map((item) => {
      const p = item.payload as RoadmapPayload;
      return [
        p.nature === "opportunite" ? `${item.title} (opportunité)` : item.title,
        p.statut ?? "",
        day(item.occurredAt),
        euros(p.budget),
        p.detail ?? "",
      ];
    }),
    [46, 20, 24, 22, w.width - 112],
  );

  // ─── 3. Cartographie ───────────────────────────────────────────────────
  w.heading("3. Cartographie du système");
  w.table(
    ["Élément", "Type", "Criticité", "Détenteur", "Coût annuel", "Échéance", "Risque"],
    byKind(data.items, "cartographie").map((item) => {
      const p = item.payload as CartographiePayload;
      return [
        item.title,
        p.type ?? "",
        p.criticite ?? "",
        p.detenteur ?? "",
        euros(p.coutAnnuel),
        day(item.occurredAt),
        p.risque ?? "",
      ];
    }),
    [34, 20, 18, 24, 20, 20, w.width - 136],
  );

  // ─── 4. Documents ──────────────────────────────────────────────────────
  w.heading("4. Documents");
  w.table(
    ["Date", "Titre", "Type", "Verdict", "Montant", "Alternative", "Pièce"],
    byKind(data.items, "document").map((item) => {
      const p = item.payload as DocumentPayload;
      return [
        day(item.occurredAt),
        item.title,
        p.type ?? "",
        p.verdict ?? "",
        euros(p.montant),
        p.alternative ?? "",
        p.fichier?.name ?? "",
      ];
    }),
    [20, 34, 22, 20, 20, w.width - 150, 34],
  );
  w.paragraph(
    "Les pièces jointes elles-mêmes se téléchargent depuis l'espace, rubrique Direction technique, " +
      "tant que celui-ci reste ouvert pour la restitution.",
    { muted: true, size: 8.5 },
  );

  // ─── 5. Prestations ────────────────────────────────────────────────────
  w.heading("5. Prestations");
  w.table(
    ["Prestation", "Statut", "Début", "Livraison", "Montant", "Détail"],
    byKind(data.items, "prestation").map((item) => {
      const p = item.payload as PrestationPayload;
      return [
        item.title,
        p.statut ?? "",
        p.debut ? day(new Date(p.debut)) : "",
        day(item.occurredAt),
        euros(p.montant),
        p.detail ?? "",
      ];
    }),
    [40, 20, 22, 22, 22, w.width - 126],
  );

  // ─── 6. Veille ─────────────────────────────────────────────────────────
  w.heading("6. Veille");
  w.table(
    ["Date", "Sujet", "Ce qui change", "Ce que ça implique", "Source"],
    byKind(data.items, "veille").map((item) => {
      const p = item.payload as VeillePayload;
      return [day(item.occurredAt), item.title, p.fait ?? "", p.implication ?? "", p.source ?? ""];
    }),
    [20, 32, 48, 48, w.width - 148],
  );

  // ─── 7. Lettres ────────────────────────────────────────────────────────
  w.heading("7. Lettres de veille");
  w.table(
    ["Période", "Titre", "Portée", "Accroche"],
    data.letters.map((letter) => [
      letter.period
        ? new Intl.DateTimeFormat("fr-FR", { month: "long", year: "numeric", timeZone: "Europe/Paris" }).format(letter.period)
        : "",
      letter.title,
      letter.scope === "generale" ? "Générale" : letter.scope === "sectorielle" ? "Sectorielle" : "Personnalisée",
      letter.chapo ?? "",
    ]),
    [26, 50, 24, w.width - 100],
  );

  // ─── 8. Rapports ───────────────────────────────────────────────────────
  w.heading("8. Rapports de maintenance");
  w.table(
    ["Rapport", "Période", "Généré le"],
    data.reports.map((report) => [
      report.name,
      report.periodStart && report.periodEnd ? `${day(report.periodStart)} – ${day(report.periodEnd)}` : "",
      day(report.generatedAt),
    ]),
    [w.width - 90, 60, 30],
  );

  // ─── 9. Audits ─────────────────────────────────────────────────────────
  w.heading("9. Audits");
  const audits = byKind(data.items, "audit");
  if (audits.length === 0) {
    w.paragraph("Aucun audit publié.", { muted: true, size: 9 });
  }
  for (const audit of audits) {
    const p = audit.payload as AuditPayload;
    w.subheading(audit.title, 12);
    w.paragraph(
      [
        audit.occurredAt ? `Mesures du ${day(audit.occurredAt)}` : null,
        p.site,
        audit.version > 1 ? `version ${audit.version}, corrigée le ${day(audit.recordedAt)}` : null,
        p.annexe ? `annexe : ${p.annexe.name}` : null,
      ]
        .filter(Boolean)
        .join(" · "),
      { muted: true, size: 9 },
    );
    if (p.synthese.length > 0) {
      w.subheading("Synthèse");
      writeBlocks(w, p.synthese);
    }
    for (const partie of p.sections) {
      w.subheading(partie.titre, 11.5);
      writeBlocks(w, partie.corps);
    }
    w.y += 4;
  }

  // ─── 10. Corrections ───────────────────────────────────────────────────
  w.heading("10. Historique des corrections");
  if (data.corrections.length === 0) {
    w.paragraph("Aucun livrable n'a été corrigé après sa publication.", { muted: true, size: 9 });
  } else {
    w.table(
      ["Livrable", "Version", "Enregistrée le", "Titre à cette version"],
      data.corrections.flatMap(({ current, versions }) =>
        versions.map((version) => [
          current.title,
          version.withdrawn ? `${version.version} (retrait)` : String(version.version),
          day(version.recordedAt),
          version.withdrawn ? "" : version.title,
        ]),
      ),
      [52, 22, 30, w.width - 104],
    );
  }

  w.footer(data.company, data.generatedAt);
  return new Uint8Array(doc.output("arraybuffer"));
}

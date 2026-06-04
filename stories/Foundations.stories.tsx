import type { Meta, StoryObj } from "@storybook/nextjs";

/**
 * Fondations du design system « Édition Suisse ».
 * Documente les tokens de couleur et la règle d'usage du rouge :
 * RÉSERVÉ aux éléments cliquables (boutons, liens). Jamais sur du
 * décoratif (labels, chiffres, badges, puces → encre).
 */
const meta: Meta = {
  title: "Fondations/Tokens & couleur",
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj;

const swatch = (name: string, value: string, note?: string) => (
  <div key={name} style={{ border: "1px solid #ddd", display: "flex", flexDirection: "column" }}>
    <div style={{ height: 72, background: value }} />
    <div style={{ padding: "10px 12px", fontFamily: "monospace", fontSize: 12 }}>
      <div style={{ fontWeight: 600 }}>{name}</div>
      <div style={{ color: "#666" }}>{value}</div>
      {note && <div style={{ color: "#999", marginTop: 4 }}>{note}</div>}
    </div>
  </div>
);

export const Couleurs: Story = {
  render: () => (
    <div style={{ padding: 32, fontFamily: "system-ui, sans-serif" }}>
      <h2 style={{ fontFamily: "Georgia, serif", fontSize: 28, marginBottom: 8 }}>Palette éditoriale</h2>
      <p style={{ color: "#444", maxWidth: 560, marginBottom: 24, fontSize: 14 }}>
        Base papier / encre / règles. Le rouge <code>action</code> (vermilion) est
        réservé aux éléments <strong>cliquables</strong>. Tout élément décoratif
        (label, chiffre, badge, puce, numéro de section) reste en encre.
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 16 }}>
        {swatch("paper", "#ffffff")}
        {swatch("paper-2", "#F7F8F9")}
        {swatch("ink", "#0e0e0c")}
        {swatch("ink-2", "#2a2a26")}
        {swatch("rule", "rgba(14,14,12,0.18)")}
        {swatch("rule-strong", "rgba(14,14,12,0.42)")}
        {swatch("action (rouge)", "#d83a1a", "cliquable uniquement")}
      </div>
    </div>
  ),
};

export const UsageDuRouge: Story = {
  name: "Règle : rouge = action",
  render: () => (
    <div style={{ padding: 32, fontFamily: "system-ui, sans-serif", display: "flex", gap: 48 }}>
      <div>
        <h3 style={{ color: "#1a7f37", fontSize: 14, marginBottom: 12 }}>✓ Correct — rouge sur le cliquable</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 12, alignItems: "flex-start" }}>
          <a href="#" style={{ background: "#d83a1a", color: "#fff", padding: "10px 18px", textDecoration: "none", fontSize: 14 }}>
            Discutons de votre projet
          </a>
          <a href="#" style={{ color: "#d83a1a", fontSize: 14 }}>Voir des réalisations →</a>
        </div>
      </div>
      <div>
        <h3 style={{ color: "#b00", fontSize: 14, marginBottom: 12 }}>✗ À proscrire — rouge décoratif</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 12, fontFamily: "monospace", fontSize: 12 }}>
          <span style={{ color: "#d83a1a", textDecoration: "line-through" }}>№ 01 (numéro de section)</span>
          <span style={{ color: "#d83a1a", textDecoration: "line-through" }}>DISPONIBLE (badge)</span>
          <span style={{ color: "#d83a1a", textDecoration: "line-through" }}>à partir de 2 250 € (prix)</span>
          <span style={{ color: "#999" }}>→ ces éléments passent en encre (ink / ink-2)</span>
        </div>
      </div>
    </div>
  ),
};

export const Boutons: Story = {
  render: () => (
    <div style={{ padding: 32, display: "flex", gap: 12, background: "#fff" }}>
      <button style={{ background: "#d83a1a", color: "#fff", border: "1px solid #d83a1a", padding: "10px 18px", fontSize: 13, cursor: "pointer" }}>
        Bouton primaire (.btn.primary)
      </button>
      <button style={{ background: "transparent", color: "#0e0e0c", border: "1px solid rgba(14,14,12,0.42)", padding: "10px 18px", fontSize: 13, cursor: "pointer" }}>
        Bouton secondaire (.btn)
      </button>
    </div>
  ),
};

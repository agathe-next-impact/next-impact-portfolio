// Services page app — reuses Header/Footer from sections.jsx and the
// services-specific sections from services-sections.jsx.

const SERVICES_TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accent": "#d83a1a",
  "paper": "#ffffff",
  "fontPair": "Instrument + Geist",
  "showEdges": true,
  "density": "comfortable",
  "darkMode": false
}/*EDITMODE-END*/;

const SVC_ACCENT_OPTIONS = [
  "#d83a1a", "#b8732a", "#1a5d3a", "#0e0e0c",
  "#1e4dd8", "#0044ff", "#003a8c", "#5b8def"
];
const SVC_PAPER_OPTIONS = ["#f1ede4", "#ffffff", "#e8e3d6", "#ece8df"];
const SVC_FONT_PAIR_OPTIONS = [
  "Instrument + Geist",
  "Manrope + JetBrains",
  "Geist only"
];
const SVC_DENSITY_OPTIONS = ["compact", "comfortable", "spacious"];

const SVC_FONT_PAIRS = {
  "Instrument + Geist": {
    serif: '"Instrument Serif", "Times New Roman", serif',
    sans:  '"Geist", -apple-system, "Helvetica Neue", Arial, sans-serif',
    mono:  '"Geist Mono", "SFMono-Regular", "Menlo", monospace'
  },
  "Manrope + JetBrains": {
    serif: '"Manrope", -apple-system, "Helvetica Neue", Arial, sans-serif',
    sans:  '"Manrope", -apple-system, "Helvetica Neue", Arial, sans-serif',
    mono:  '"JetBrains Mono", "SFMono-Regular", "Menlo", monospace'
  },
  "Geist only": {
    serif: '"Geist", -apple-system, "Helvetica Neue", Arial, sans-serif',
    sans:  '"Geist", -apple-system, "Helvetica Neue", Arial, sans-serif',
    mono:  '"Geist Mono", "SFMono-Regular", "Menlo", monospace'
  }
};

function applyServicesTweaks(t) {
  const root = document.documentElement;
  root.style.setProperty("--accent", t.accent);

  if (t.darkMode) {
    root.style.setProperty("--paper", "#0e0e0c");
    root.style.setProperty("--paper-2", "#161614");
    root.style.setProperty("--ink", "#f1ede4");
    root.style.setProperty("--ink-2", "#c8c2b3");
    root.style.setProperty("--muted", "rgba(241,237,228,0.55)");
    root.style.setProperty("--rule", "rgba(241,237,228,0.18)");
    root.style.setProperty("--rule-strong", "rgba(241,237,228,0.45)");
  } else {
    root.style.setProperty("--paper", t.paper);
    root.style.setProperty("--paper-2", "#ebe9e3");
    root.style.setProperty("--ink", "#0e0e0c");
    root.style.setProperty("--ink-2", "#2a2a26");
    root.style.setProperty("--muted", "rgba(14,14,12,0.55)");
    root.style.setProperty("--rule", "rgba(14,14,12,0.18)");
    root.style.setProperty("--rule-strong", "rgba(14,14,12,0.42)");
  }

  root.style.setProperty("--grid-opacity", "0");
  root.style.setProperty("--edge-display", t.showEdges ? "flex" : "none");
  const densMap = { compact: 0.7, comfortable: 1, spacious: 1.3 };
  root.style.setProperty("--density-y", String(densMap[t.density] ?? 1));

  const pair = SVC_FONT_PAIRS[t.fontPair] || SVC_FONT_PAIRS["Instrument + Geist"];
  root.style.setProperty("--serif", pair.serif);
  root.style.setProperty("--sans",  pair.sans);
  root.style.setProperty("--mono",  pair.mono);
}

function ServicesApp() {
  const [t, setTweak] = useTweaks(SERVICES_TWEAK_DEFAULTS);
  React.useEffect(() => { applyServicesTweaks(t); }, [t]);

  return (
    <React.Fragment>
      <Header />
      <main>
        <ServicesHero />
        <Stacks />
        <Comparatif />
        <WebAppFocus />
        <Verdict />
        <Realisations />
        <OETHCallout />
        <Methode />
        <NiveauInvestissement />
        <Outils />
        <Process />
        <Faq />
        <ServicesCTA />
      </main>
      <Footer />

      <TweaksPanel title="Tweaks">
        <TweakSection label="Couleur">
          <TweakColor label="Accent" value={t.accent} options={SVC_ACCENT_OPTIONS}
            onChange={(v) => setTweak("accent", v)} />
          <TweakColor label="Papier" value={t.paper} options={SVC_PAPER_OPTIONS}
            onChange={(v) => setTweak("paper", v)} />
          <TweakToggle label="Mode sombre (encre)" value={t.darkMode}
            onChange={(v) => setTweak("darkMode", v)} />
        </TweakSection>

        <TweakSection label="Typographie">
          <TweakSelect label="Couple de polices" value={t.fontPair} options={SVC_FONT_PAIR_OPTIONS}
            onChange={(v) => setTweak("fontPair", v)} />
        </TweakSection>

        <TweakSection label="Mise en page">
          <TweakToggle label="Repères en marge" value={t.showEdges}
            onChange={(v) => setTweak("showEdges", v)} />
          <TweakRadio label="Densité" value={t.density} options={SVC_DENSITY_OPTIONS}
            onChange={(v) => setTweak("density", v)} />
        </TweakSection>
      </TweaksPanel>
    </React.Fragment>
  );
}

const servicesRoot = ReactDOM.createRoot(document.getElementById("root"));
servicesRoot.render(<ServicesApp />);

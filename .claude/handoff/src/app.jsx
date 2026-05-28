// Main app — wires sections together + Tweaks panel for live customization.

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accent": "#d83a1a",
  "paper": "#ffffff",
  "fontPair": "Instrument + Geist",
  "showEdges": true,
  "density": "comfortable",
  "darkMode": false
}/*EDITMODE-END*/;

const ACCENT_OPTIONS = [
  "#d83a1a", // vermilion (Swiss)
  "#b8732a", // ochre
  "#1a5d3a", // forest
  "#0e0e0c", // ink (no accent)
  "#1e4dd8", // cobalt
  "#0044ff", // electric blue
  "#003a8c", // navy
  "#5b8def"  // sky
];
const PAPER_OPTIONS = ["#f1ede4", "#ffffff", "#e8e3d6", "#ece8df"];
const FONT_PAIR_OPTIONS = [
  "Instrument + Geist",
  "Manrope + JetBrains",
  "Geist only"
];
const DENSITY_OPTIONS = ["compact", "comfortable", "spacious"];

const FONT_PAIRS = {
  "Instrument + Geist": {
    serif: '"Instrument Serif", "Times New Roman", serif',
    sans:  '"Geist", -apple-system, "Helvetica Neue", Arial, sans-serif',
    mono:  '"Geist Mono", "SFMono-Regular", "Menlo", monospace'
  },
  "Manrope + JetBrains": {
    // No editorial serif — Manrope serves both display and body, with extra
    // weight contrast for hierarchy. JetBrains Mono carries the annotations.
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

function applyTweaks(t) {
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

  const pair = FONT_PAIRS[t.fontPair] || FONT_PAIRS["Instrument + Geist"];
  root.style.setProperty("--serif", pair.serif);
  root.style.setProperty("--sans",  pair.sans);
  root.style.setProperty("--mono",  pair.mono);
}

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);

  React.useEffect(() => { applyTweaks(t); }, [t]);

  return (
    <React.Fragment>
      <Header />
      <main>
        <Hero />
        <Capacites />
        <Methode />
        <EtudeDeCas />
        <Ressources />
        <Contact />
      </main>
      <Footer />

      <TweaksPanel title="Tweaks">
        <TweakSection label="Couleur">
          <TweakColor label="Accent" value={t.accent} options={ACCENT_OPTIONS}
            onChange={(v) => setTweak("accent", v)} />
          <TweakColor label="Papier" value={t.paper} options={PAPER_OPTIONS}
            onChange={(v) => setTweak("paper", v)} />
          <TweakToggle label="Mode sombre (encre)" value={t.darkMode}
            onChange={(v) => setTweak("darkMode", v)} />
        </TweakSection>

        <TweakSection label="Typographie">
          <TweakSelect label="Couple de polices" value={t.fontPair} options={FONT_PAIR_OPTIONS}
            onChange={(v) => setTweak("fontPair", v)} />
        </TweakSection>

        <TweakSection label="Mise en page">
          <TweakToggle label="Repères en marge" value={t.showEdges}
            onChange={(v) => setTweak("showEdges", v)} />
          <TweakRadio label="Densité" value={t.density} options={DENSITY_OPTIONS}
            onChange={(v) => setTweak("density", v)} />
        </TweakSection>
      </TweaksPanel>
    </React.Fragment>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);

import { DocumentationToolbar } from "@/components/documentation/documentation-toolbar";
import { SpotlightSearch } from "@/components/documentation/spotlight-search";
import { EcoScoreFooter } from "@/components/documentation/eco-score-footer";

export default function DocumentationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen">
      <DocumentationToolbar />
      <SpotlightSearch />
      {children}
      <EcoScoreFooter />
    </div>
  );
}

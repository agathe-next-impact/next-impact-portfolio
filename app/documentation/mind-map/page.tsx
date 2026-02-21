import { Metadata } from "next"
import { generatePageMetadata } from "@/lib/metadata"
import { BreadcrumbJsonLd } from "@/components/json-ld"
import MindMapWrapper from "@/components/mind-map/mind-map-wrapper"

export async function generateMetadata(): Promise<Metadata> {
  return generatePageMetadata({
    title: "Mind Map — WordPress Headless Architecture",
    description:
      "Explorez l'architecture WordPress Headless de façon interactive : avantages, défis, expérience éditeur et roadmap de migration.",
    path: "/documentation/mind-map",
    keywords: [
      "WordPress Headless mind map",
      "architecture découplée",
      "WordPress Headless avantages",
      "migration WordPress",
    ],
  })
}

export default function MindMapPage() {
  const breadcrumbItems = [
    { name: "Accueil", url: "/" },
    { name: "Comprendre", url: "/documentation" },
    { name: "Mind Map", url: "/documentation/mind-map" },
  ]

  return (
    <main>
      <BreadcrumbJsonLd items={breadcrumbItems} />
      <div className="relative z-10 w-full min-h-screen flex flex-col">
        <section className="relative w-full pt-4 md:pt-8">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-3 py-6">
              <h1 className="font-googletitre font-medium text-center text-white">
                WordPress Headless
              </h1>
              <p className="text-lg text-white/60 text-center max-w-2xl font-googletexte">
                Explorez l&apos;architecture WordPress Headless et ses enjeux de façon interactive.
              </p>
            </div>
          </div>
        </section>

        <section className="flex-1 container px-4 md:px-6 pb-8">
          <MindMapWrapper />
        </section>
      </div>
    </main>
  )
}

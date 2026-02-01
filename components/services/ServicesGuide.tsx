import { ArrowRight, LucideIcon } from "lucide-react"

interface GuideItem {
  icon: LucideIcon
  need: string
  solution: string
}

export default function ServicesGuide({ needsGuide }: { needsGuide: GuideItem[] }) {
  return (
    <section className="py-20 md:py-28">
      <div className="mx-auto max-w-5xl px-6 lg:px-8">
        <div className="text-center mb-16 animate-fadeInUp">
          <h2 className="text-3xl md:text-4xl font-googletitre font-medium mb-6 text-white">
            Quelle stack pour quel projet
          </h2>
          <p className="text-lg text-white/80">Identifiez la solution adaptée à votre besoin principal</p>
        </div>
        <div className="space-y-4">
          {needsGuide.map((item, idx) => (
            <div
              key={idx}
              className="group flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 bg-darkblue/80 backdrop-blur-lg rounded-2xl border border-lightblue/10 transition-all"
              style={{ animationDelay: `${idx * 0.1}s` }}
            >
              <div className="flex items-center gap-4">
                <div className="hidden md:visible w-12 h-12 rounded-lg flex items-center justify-center">
                  <item.icon className="h-6 w-6 text-white transition-colors" />
                </div>
                <p className="text-mediumblue/80 text-lg text-white transition-colors">"{item.need}"</p>
              </div>
              <div className="flex items-center gap-3 md:ml-auto">
                <span className="font-googletitre font-medium text-xl whitespace-nowrap text-lightyellow transition-colors"> / {item.solution}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

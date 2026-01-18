import { ArrowRight } from "lucide-react"

export default function SolutionsGuide({ needsGuide }: { needsGuide: any[] }) {
  return (
    <section className="py-20 md:py-28">
      <div className="mx-auto max-w-5xl px-6 lg:px-8">
        <div className="text-center mb-16 animate-fadeInUp">
          <h2 className="text-4xl md:text-5xl font-googletitre font-medium mb-6 text-regularblue">
            Aidez-moi à <span className="text-coral">choisir</span>
          </h2>
          <p className="text-lg text-regularblue/80">Identifiez la solution adaptée à votre besoin principal</p>
        </div>
        <div className="space-y-4">
          {needsGuide.map((item, idx) => (
            <div
              key={idx}
              className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 bg-white/70 backdrop-blur-lg rounded-2xl border border-coral/20 hover:bg-white/10 transition-all"
              style={{ animationDelay: `${idx * 0.1}s` }}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg flex items-center justify-center">
                  <item.icon className="h-6 w-6 text-regularblue" />
                </div>
                <p className="text-mediumblue/80 text-lg">"{item.need}"</p>
              </div>
              <div className="flex items-center gap-3 md:ml-auto">
                <ArrowRight className="h-5 w-5 text-coral" />
                <span className="font-googletitre font-semibold text-xl text-regularblue whitespace-nowrap">{item.solution}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

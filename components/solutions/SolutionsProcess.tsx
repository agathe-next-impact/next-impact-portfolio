export default function SolutionsProcess({ processSteps }: { processSteps: any[] }) {
  return (
    <section className="bg-white/50 backdrop-blur-lg border-y border-extralightblue/30 py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="text-center mb-16 animate-fadeInUp">
          <h2 className="text-3xl md:text-5xl font-googletitre font-medium text-regularblue mb-6 text-balance">
            Notre <span className="text-lightblue">processus</span>
          </h2>
          <p className="text-lg text-mediumblue/70 max-w-3xl mx-auto">
            Un accompagnement structuré pour garantir le succès de votre projet
          </p>
        </div>
        <div className="grid md:grid-cols-4 gap-8">
          {processSteps.map((step, idx) => (
            <div key={idx} className="relative text-center group">
              {/* Connector line */}
              {idx < processSteps.length - 1 && (
                <div className="hidden md:block absolute top-12 left-1/2 w-full h-0.5 bg-gradient-to-r from-regularblue to-lightblue" />
              )}
              <div className="relative z-10 w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-regularblue to-mediumblue flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <step.icon className="h-10 w-10 text-white" />
                <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-coral flex items-center justify-center text-darkblue font-bold text-sm">
                  {step.step}
                </div>
              </div>
              <h3 className="text-xl font-medium text-regularblue mb-2">{step.title}</h3>
              <p className="text-mediumblue/70 text-sm">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

import AuditMigrationWordpressForm from "@/components/audit-migration-wordpress-form";
import PageHero from "@/components/page-hero";

export default function Page() {
  return (
    <main className="relative">
      <section className="md:h-screen grid grid-cols-1 md:grid-cols-2 gap-8 container mx-auto px-4 md:py-16 text-center relative z-10">
        <div className="h-max flex flex-col items-start justify-start gap-6 mt-12 mb-8 md:mb-12 bg-white/40 p-8 rounded-xl shadow-lg backdrop-blur-sm max-w-3xl animate-fadeInUp">
          <span className="w-max inline-flex items-center px-3 py-1 text-xs font-googletexte font-medium uppercase rounded-full bg-white text-mediumblue/60 tracking-wider">
            WORDPRESS HEADLESS
          </span>
          <h1 className="text-4xl text-left md:text-5xl font-medium text-coral tracking-tight mb-6">
            Audit gratuit <div className="mt-2 text-regularblue text-2xl md:text-4xl">Migration WordPress vers Headless</div>
          </h1>
          <p className="text-xl text-regularblue/80 text-left mb-8">
            Demandez notre audit gratuit pour évaluer l'opportunité d'une migration WordPress vers Headless. Vous recevrez des recommandations personnalisées pour une décision éclairée.
          </p>
        </div>
        <div className="h-max mx-auto w-full md:max-w-none md:mt-48 mr-0 mb-24 md:mb-0 animate-fadeInUp bg-white/90 backdrop-blur-sm p-6 rounded-xl border border-regularblue/10 shadow-lg">
          <AuditMigrationWordpressForm />
        </div>
      </section>
      {/* Illustration d'arrière-plan centrée en bas */}
      <img
        src="/illustrations/ai-audit-banner-light.svg"
        alt="Illustration audit AI"
        className="pointer-events-none select-none absolute left-1/2 bottom-24 translate-x-[-70%] z-0 w-[60vw] max-w-full opacity-80"
        style={{ objectFit: "contain" }}
      />
    </main>
  );
}

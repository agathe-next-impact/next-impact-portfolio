const ServicesSection = () => (
  <div className="w-full max-w-7xl mx-auto mt-24 px-6 py-12">
    <div className="mb-6 text-center bg-white/50 backdrop-blur-sm p-6 rounded-2xl border border-extralightblue/30">
      <h2 className="text-2xl md:text-3xl text-mediumblue/70 tracking-tight font-googletexte mb-4 line-clamp-5">
        <div className="text-4xl md:text-5xl text-regularblue font-googletitre font-medium">Services</div> WordPress & Headless
      </h2>
      <p className="text-regularblue/80 md:text-lg max-w-3xl mx-auto">
        Grâce à des développements spécifiques alignés sur vos besoins,
        nous créons des sites web WordPress, WordPress custom et des
        WordPress Headless qui allient performance, design actuel,
        puissance et évolutivité.
      </p>
      <h3 className="text-xl md:text-2xl mb-8">
        <strong>Résultat</strong> : Un site alliant performance et le
        back-office le plus utilisé
      </h3>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 py-8">
      {/* Première carte */}
      <div className="flex flex-col p-6 justify-start items-start bg-amber-50/30 backdrop-blur-lg rounded-2xl border border-extralightblue/30">
        <img
          src="/icons/frontend-icon-light.svg"
          alt="WordPress Logo"
          className="h-24 mb-5 object-contain"
        />
        <h3 className="text-3xl font-semibold text-regularblue ">
          Site vitrine standard
        </h3>
        <p className="text-coral font-googletitre text-2xl font-medium pb-12">
          WordPress
        </p>
        <div className="text-mediumblue/80">
          <div className="text-xl font-medium font-googletitre text-regularblue border-b border-coral pb-1 mb-4">
            Type d'entreprise
          </div>
          <p>
            TPE, PME, blogueurs, ou services marketing souhaitant une autonomie totale.
          </p>
        </div>
        <div className="mt-8 text-mediumblue/80">
          <div className="text-xl font-medium font-googletitre text-regularblue border-b border-orange pb-1 mb-4">
            Type de projets
          </div>
          <p>
            Blogs classiques, E-commerce avec WooCommerce (le plus simple à mettre en place), Projets avec un budget limité et des délais courts.
          </p>
        </div>
      </div>
      {/* Deuxième carte */}
      <div className="flex flex-col p-6 justify-start items-start bg-rose-50/30 backdrop-blur-lg rounded-2xl border border-extralightblue/30">
        <img
          src="/icons/brand-reach-icon-light.svg"
          alt="Astro Logo"
          className="h-24 mb-5 object-contain"
        />
        <h3 className="text-3xl font-semibold text-regularblue ">
          Sites vitrines Premium
        </h3>
        <p className="text-coral font-googletitre text-2xl font-medium pb-12">
          WordPress Headless + Astro
        </p>
        <div className="text-mediumblue/70">
          <div className="text-xl font-medium font-googletitre text-regularblue border-b border-coral pb-1 mb-4">
            Idéal pour
          </div>
          <p>
            Entreprises avec enjeu d'image, de SEO et de performance
          </p>
        </div>
        <div className="mt-8 text-mediumblue/80">
          <div className="text-xl font-medium font-googletitre text-regularblue border-b border-orange pb-1 mb-4">
            Type de projets
          </div>
          <p>
            Sites vitrines haut de gamme où l'expérience visuelle est centrale, Projets à gros volumes de contenus à charger rapidement.
          </p>
        </div>
      </div>
      {/* Troisième carte */}
      <div className="flex flex-col p-6 justify-start items-start bg-amber-50/30 backdrop-blur-lg rounded-2xl border border-extralightblue/30">
        <img
          src="/icons/saas-features-icon-light.svg"
          alt="Next.js Logo"
          className="h-24 mb-5 object-contain"
        />
        <h3 className="text-3xl font-semibold text-regularblue ">
          Web Applications
        </h3>
        <p className="text-coral font-googletitre text-2xl font-medium pb-12">
          WordPress Headless + Next.js
        </p>
        <div className="text-mediumblue/80">
          <div className="text-xl font-medium font-googletitre text-regularblue border-b border-coral pb-1 mb-4">
            Idéal pour
          </div>
          <p>
            Entreprises ayant besoin de fonctionnalités spécifiques
          </p>
        </div>
        <div className="mt-8 text-mediumblue/80">
          <div className="text-xl font-medium font-googletitre text-regularblue border-b border-orange pb-1 mb-4">
            Type de projets
          </div>
          <p>
            Sites hybrides avec éléments d'interaction avancés (recherche temps réel, compte client), Web Apps complexes avec portails clients, simulateurs ou tableaux de bord etc.
          </p>
        </div>
      </div>
    </div>
  </div>
);

export default ServicesSection;

export default function PourquoiSection() {
        return (
        <section
            className="flex flex-col gap-4 w-full max-w-7xl mx-auto px-6 pb-12 relative bg-cover bg-center"
            style={{ backgroundImage: "url('/img/performances.jpeg')" }}
        >
        <div className="text-center mb-12 relative z-10">
        <h2 className="text-4xl tracking-tight font-medium text-regularblue">
            WordPress Headless : pourquoi ?
        </h2>
        <p className="font-normal text-lg text-center text-foreground/80">Un site alliant performance et le back-office le plus utilisé</p>
        </div>
        <div className="w-4/5 grid grid-cols-1 md:grid-cols-3 gap-8 mt-8 mx-auto relative z-10">
        <div className="flex flex-col items-center text-center w-full mx-auto mb-8 bg-white/30 backdrop-blur-xl rounded-2xl ">
            <div className="w-3/4 -mt-4 mx-auto bg-regularblue rounded-2xl">
                <h3 className="text-2xl font-medium text-white py-3">Rapidité</h3>
            </div>
            <div className="pt-6 pb-8 px-6">
                <p className="text-mediumblue/70 text-lg">Des temps de chargement ultra-rapides pour une expérience optimale.</p>
            </div>
        </div>
        <div className="flex flex-col items-center text-center w-full mx-auto mb-8 bg-white/30 backdrop-blur-xl rounded-2xl ">
            <div className="w-3/4 -mt-4 mx-auto bg-regularblue rounded-2xl">
                <h3 className="text-2xl font-medium text-white py-3">Modernité</h3>
            </div>
            <div className="pt-6 pb-8 px-6">
                <p className="text-mediumblue/70 text-lg">Une flexibilité visuelle illimitée sans les contraintes d'un CMS traditionnel.</p>
            </div>
        </div>
        <div className="flex flex-col items-center text-center w-full mx-auto mb-8 bg-white/30 backdrop-blur-xl rounded-2xl ">
            <div className="w-3/4 -mt-4 mx-auto bg-regularblue rounded-2xl">
                <h3 className="text-2xl font-medium text-white py-3">Simplicité</h3>
            </div>
            <div className="pt-6 pb-8 px-6">
                <p className="text-mediumblue/70 text-lg">L'administration inutitive de WordPress pour une gestion efficace et facile.</p>
            </div>
        </div>
        </div>
        {/* Overlay pour améliorer la lisibilité du contenu */}
        <div className="absolute inset-0 bg-white/60 backdrop-blur-sm pointer-events-none z-0" />
    </section>
    )
};

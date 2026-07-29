export default function PourQuiSection() {
    return (
    <section className="flex flex-col gap-4 w-full max-w-7xl mt-12 mx-auto px-6 py-12">
        <div className="text-center">
        <h2 className="text-4xl tracking-tight font-medium text-regularblue">
            WordPress Headless : c'est quoi ?
        </h2>
        <p>Un site alliant performance et le back-office le plus utilisé</p>
        </div>
        <div className="w-4/5 grid grid-cols-1 md:grid-cols-3 gap-8 mt-8 mx-auto">
        <div className="flex flex-col items-center text-center p-6 border border-gray-200 rounded-lg ">
            <div className="mb-4">
            <svg className="w-12 h-12 text-blue-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Performance</h3>
            <p className="text-gray-600">Des temps de chargement ultra-rapides pour une expérience utilisateur optimale.</p>
        </div>
        <div className="flex flex-col items-center text-center p-6 border border-gray-200 rounded-lg ">
            <div className="mb-4">
            <svg className="w-12 h-12 text-blue-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v4a1 1 0 001 1h3m10-5h3a1 1 0 011 1v4m-6 4h6m-6 4h6m-6-8h6m-6 4h6M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Flexibilité</h3>
            <p className="text-gray-600">Une personnalisation du design illimitée sans les contraintes d'un CMS traditionnel.</p>
        </div>
        <div className="flex flex-col items-center text-center p-6 border border-gray-200 rounded-lg ">
            <div className="mb-4">
            <svg className="w-12 h-12 text-blue-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2
    3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8c-1.11 0-2.08.402-2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M12 16c1.11 0 2.08-.402 2.599-1M12 16v1m0-1v-8"></path></svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Simplicité</h3>
            <p className="text-gray-600">L'administration inutitive de WordPress pour une gestion efficace et facile.</p>
        </div>
        </div>
    </section>
    )
};

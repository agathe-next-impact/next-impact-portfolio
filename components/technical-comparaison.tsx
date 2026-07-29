export default function TechnicalComparison() {
    return (
              <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-medium mb-4">WordPress traditionnel vs Headless</h2>
            <p className="text-lg text-muted-foreground">
              Comprendre les différences techniques pour faire le bon choix
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse bg-white rounded-lg ">
              <thead>
                <tr className="border-b bg-slate-50">
                  <th className="text-left p-4 font-semibold">Critère</th>
                  <th className="text-center p-4 font-semibold text-green-600">WordPress Traditionnel</th>
                  <th className="text-center p-4 font-semibold text-blue-600">WordPress Headless</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Complexité", "Simple à maintenir", "Nécessite expertise technique"],
                  ["Performance", "Correcte avec optimisations", "Excellente (frontend optimisé)"],
                  ["Flexibilité UI", "Limitée aux thèmes", "Totale liberté créative"],
                  ["Multi-canal", "Un seul site web", "Web + mobile + autres"],
                  ["Intégrations", "Plugins existants", "APIs sur-mesure"],
                  ["Coût initial", "Modéré", "Plus élevé"],
                  ["Évolutivité", "Limitée par WordPress", "Scalabilité maximale"],
                  ["Équipe requise", "Utilisateurs lambda", "Développeurs techniques"],
                ].map(([criteria, traditional, headless], index) => (
                  <tr key={index} className="border-b hover:bg-slate-50">
                    <td className="p-4 font-medium">{criteria}</td>
                    <td className="p-4 text-center text-sm">{traditional}</td>
                    <td className="p-4 text-center text-sm">{headless}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    );
}
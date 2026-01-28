import Link from 'next/link';
import { Button } from "@/components/ui/button";

export default function VousEtesPage() {
  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center text-mediumblue">Qui êtes-vous ?</h1>
      <div className="grid gap-6 md:grid-cols-3">
        <Link href="/vous-etes/acteur-tourisme" className="block">
          <div className="h-full p-8 border rounded-lg hover:bg-slate-50 transition-colors shadow-sm flex flex-col items-center text-center">
            <h2 className="text-xl font-semibold mb-2 text-regularblue">Acteur du Tourisme</h2>
            <p className="text-muted-foreground">Découvrez nos solutions adaptées au secteur du tourisme et des loisirs.</p>
          </div>
        </Link>
        <Link href="/vous-etes/artisan" className="block">
          <div className="h-full p-8 border rounded-lg hover:bg-slate-50 transition-colors shadow-sm flex flex-col items-center text-center">
            <h2 className="text-xl font-semibold mb-2 text-regularblue">Artisan</h2>
            <p className="text-muted-foreground">Mettez en valeur votre savoir-faire avec un site vitrine professionnel.</p>
          </div>
        </Link>
        <Link href="/vous-etes/pme" className="block">
           <div className="h-full p-8 border rounded-lg hover:bg-slate-50 transition-colors shadow-sm flex flex-col items-center text-center">
            <h2 className="text-xl font-semibold mb-2 text-regularblue">PME</h2>
            <p className="text-muted-foreground">Modernisez votre communication et développez votre activité.</p>
          </div>
        </Link>
      </div>
    </div>
  );
}

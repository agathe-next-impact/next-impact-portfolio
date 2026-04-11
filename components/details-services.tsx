import React from "react";

const DetailsServices = () => {
  return (
    <section className="flex flex-col gap-4 w-full max-w-7xl mx-auto px-6 py-12">
      <div className="text-center">
        <h2 className="text-5xl tracking-tight font-medium text-regularblue">
            Détails des Services
        </h2>
      </div>
      <div className="relative w-3/4 mx-auto rounded-[4rem]">
        <div>
          <div className="text-center mb-16">
            <p className="text-xl text-regularblue/80 text-center max-w-2xl mx-auto">
              Trois stacks WordPress, du monolithique optimisé au headless
              Next.js : la solution s&apos;adapte au projet, pas l&apos;inverse.
            </p>
          </div>
        </div>
      </div>
      {/* Ajoutez ici d'autres sections ou composants pour détailler les services */}
      <div className="flex justify-evenly py-8">
        {/* ...section WordPress/Next.js... */}
      </div>
    </section>
  );
};

export default DetailsServices;

"use client";
import dynamic from "next/dynamic";

// Lazy load du formulaire de cahier des charges
const CahierDesChargesForm = dynamic(() => import("./cahier-des-charges-form").then(mod => ({ default: mod.CahierDesChargesForm })), {
  loading: () => (
    <div className="flex justify-center items-center min-h-[500px]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-regularblue"></div>
    </div>
  ),
  ssr: false,
});

export default CahierDesChargesForm;

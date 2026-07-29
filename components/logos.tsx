import { cn } from "@/lib/utils";
import Image from "next/image"; 
import LogoLoop from "./logo-loop";

export function Logos({ className }: { className?: string }) {
  const logos = [
    { src: "/img/logo-sowee.svg", alt: "Sowee" },  
    { src: "/img/logo-geofit.webp", alt: "Geofit" },
    { src: "/img/logo-aquitaine-robotics.webp", alt: "Aquitaine Robotics" },
    { src: "/img/logo-proditec.webp", alt: "Proditec" },
    { src: "/img/logo-infralliance.webp", alt: "Infralliance" },
    { src: "/img/logo-hermitage.webp", alt: "L'Hermitage" },
    { src: "/img/logo-transitions-pro.webp", alt: "Transitions Pro" },
    { src: "/img/logo-wagner-hamisky.webp", alt: "Wagner Hamisky" },  
  ];

  return (
    <div className={cn("w-full mx-auto grid gap-4 py-4", className)} style={{ gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr))" }}>
      <LogoLoop logos={logos} />
    </div>
  );
}

"use client";

import Image from "next/image";
import Link from "next/link";
import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu as MenuIcon, X as CloseIcon, ScreenShareIcon, File, BadgeEuro, Euro, DatabaseIcon, Presentation, UserCheck } from "lucide-react";
import { ChevronDown, PhoneCallIcon, MailIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { GlobalProfileSwitcher } from "@/components/global-profile-switcher";

export function NavBar() {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [openSubMenu, setOpenSubMenu] = React.useState<string | null>(null);

  // Ferme le menu mobile lors d'un clic sur un lien
  const handleMenuClick = () => {
    setMobileOpen(false);
    setOpenSubMenu(null);
  };

  // Gestion ouverture/fermeture des sous-menus
  const handleToggleSubMenu = (key: string) => {
    setOpenSubMenu((prev) => (prev === key ? null : key));
  };

  return (
    <>
      {/* Desktop */}
      <nav className="hidden md:flex px-4 py-2">
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <Link href="/services" className="font-googletitre text-white/90 text-lg text-regular px-2">
                Services & Tarifs
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/demo" className="font-googletitre text-white/90 text-lg text-regular px-2">
                Démo
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/outils" className="font-googletitre text-white/90 text-lg text-regular px-2">
                Outils
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/documentation" className="font-googletitre text-white/90 text-lg text-regular px-2">
                Comprendre
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/etudes-de-cas" className="font-googletitre text-white/90 text-lg text-regular px-2">
                Etudes de cas
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </nav>

      {/* Mobile */}
      <nav className="flex md:hidden items-center sticky">
        <button
          className="p-2 rounded-md shrink-0"
          aria-label={mobileOpen ? "Fermer le menu" : "Ouvrir le menu"}
          onClick={() => setMobileOpen((open) => !open)}
        >
          {mobileOpen ? (
            <CloseIcon className="w-10 h-10 text-white" />
          ) : (
            <MenuIcon className="w-10 h-10 text-white" />
          )}
        </button>
        <AnimatePresence>
          {mobileOpen && (
            <>
              <motion.div
                key="overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 z-40 bg-black/40"
                onClick={handleMenuClick}
              />
              <motion.div
                key="mobile-menu"
                initial={{ x: -300, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -300, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="fixed top-0 left-0 z-50 h-full w-full shadow-lg"
              >
                <div className="flex items-center justify-between px-6 py-2 bg-darkblue border-b">
                  <Image
                    src="/img/logo-blanc-carre.webp"
                    alt="Next Impact Digital"
                    width={40}
                    height={40}
                    className="mr-2"
                    priority
                    fetchPriority="high"
                    style={{ width: 'auto', height: 'auto' }}
                  />
                  <button
                    className="p-2 rounded-md focus:outline-none"
                    aria-label="Fermer le menu"
                    onClick={handleMenuClick}
                  >
                    <CloseIcon className="w-10 h-10 text-white" />
                  </button>
                </div>
                <div className="h-screen p-4 space-y-0 bg-darkblue backdrop-blur-md">
                  <MobileMenuLink href="/services" onClick={handleMenuClick}>Services & Tarifs</MobileMenuLink>
                  <MobileMenuLink href="/demo" onClick={handleMenuClick}>Démo</MobileMenuLink>
                  <MobileMenuLink href="/outils" onClick={handleMenuClick}>Outils</MobileMenuLink>
                  <MobileMenuLink href="/etudes-de-cas" onClick={handleMenuClick}>Etudes de cas</MobileMenuLink>
                  <MobileMenuLink href="/documentation" onClick={handleMenuClick} className="pb-4">Comprendre</MobileMenuLink>

                  <div className="pl-4 pt-4 flex items-center gap-8 border-t border-white/10">
                    <Link href="/a-propos" onClick={handleMenuClick}>
                    <UserCheck className="w-8 h-8 text-white/90 hover:text-white transition" />
                    </Link>
                    <Link href="/ressources/livre_blanc_wp_headless.pdf" target="_blank">
                      <File className="w-8 h-8 text-white/90 hover:text-white transition" />
                    </Link>
                    <Link href="tel:0673981638" className="md:inline-block">
                      <PhoneCallIcon className="w-8 h-8 text-white/90 hover:text-white transition" />
                    </Link>
                    <Link href="mailto:agathe@next-impact.digital" className="md:inline-block">
                      <MailIcon className="w-8 h-8 text-white/90 hover:text-white transition" />
                    </Link>
                    <Link href="https://calendar.app.google/RwZqaabSR5aDMnk46" target="_blank" className="md:inline-block">
                      <ScreenShareIcon className="w-8 h-8 text-white/90 hover:text-white transition" />         
                    </Link>
                  </div>
                  {/* <MobileMenuLink href="/simulateur-tarifs" onClick={handleMenuClick}>Tarifs</MobileMenuLink> */}
                  {/* Sous-menu "Vous êtes"
                  <button
                    className={cn(
                      "w-full text-left py-3 px-4 rounded-md text-white font-medium text-2xl hover:bg-lightblue/10 transition cursor-pointer select-none flex items-center justify-between",
                      openSubMenu === "vous-etes" && "bg-lightblue/10"
                    )}
                    onClick={() => handleToggleSubMenu("vous-etes")}
                    aria-expanded={openSubMenu === "vous-etes"}
                  >
                    Vous êtes
                    <span className={cn("transition-transform", openSubMenu === "vous-etes" ? "rotate-180" : "")}> <ChevronDown className="inline w-5 h-5 ml-2" /> </span>
                  </button>
                  <AnimatePresence initial={false}>
                    {openSubMenu === "vous-etes" && (
                      <motion.div
                        key="vous-etes-sub"
                        initial={{ y: -20, opacity: 0, height: 0 }}
                        animate={{ y: 0, opacity: 1, height: "auto" }}
                        exit={{ y: -20, opacity: 0, height: 0 }}
                        transition={{ duration: 0.25 }}
                        className="pl-4 overflow-hidden"
                      >
                        <MobileMenuLink href="/vous-etes/pme" onClick={handleMenuClick} className="pl-4">PME</MobileMenuLink>
                        <MobileMenuLink href="/vous-etes/ess" onClick={handleMenuClick} className="pl-4">ESS</MobileMenuLink>
                      </motion.div>
                    )}
                  </AnimatePresence>
                 Liens directs 
                  <MobileMenuLink href="/a-propos" onClick={handleMenuClick}>A propos</MobileMenuLink>
                  */}
                  {/*<MobileMenuLink href="/contact" onClick={handleMenuClick}>Contact</MobileMenuLink>
                */}
                  </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </nav>
    </>
  );
}

const MobileMenuLink = ({
  href,
  children,
  onClick,
  className,
}: {
  href: string;
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}) => (
  <Link
    href={href}
    onClick={onClick}
    className={cn(
      "block py-3 px-4 rounded-md text-white text-2xl hover:bg-lightblue/10 transition",
      className
    )}
  >
    {children}
  </Link>
);

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a"> & { title: string }
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-lightblue/10 hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-lg font-regular text-regularblue leading-none">
            {title}
          </div>
          <p className="line-clamp-2 text-xs leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";

export default function Header() {
  return (
    <header className="flex items-center justify-between border-b top-0 z-50 px-4 shadow-sm sticky bg-mediumblue/60 backdrop-blur-md h-16">
      {/* Logo */}
      <div className="shrink-0 pt-1">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <Image
            src="/img/logo-blanc-carre.png"
            alt="Next Impact Digital"
            width={30}
            height={30}
            priority
            fetchPriority="high"
            style={{ width: 'auto', height: 'auto' }}
          />
        </Link>
      </div>

      {/* Desktop nav (centre) */}
      <div className="w-full hidden md:flex justify-start pl-4">
        <NavBar />
      </div>

      {/* Mobile : switcher centré + hamburger */}
      <div className="flex md:hidden flex-1 items-center justify-end gap-2">
        <GlobalProfileSwitcher />
        <NavBar />
      </div>

      {/* Desktop : icônes de droite */}
      <div className="hidden md:flex items-center gap-4">
        <GlobalProfileSwitcher />
        <Link href="/a-propos">
          <UserCheck className="w-6 h-6 text-white/90 hover:text-white transition" />
        </Link>
        <Link href="/ressources/livre_blanc_wp_headless.pdf" target="_blank">
          <File className="w-6 h-6 text-white/90 hover:text-white transition" />
        </Link>
        <Link href="tel:0673981638">
          <PhoneCallIcon className="w-6 h-6 text-white/90 hover:text-white transition" />
        </Link>
        <Link href="mailto:agathe@next-impact.digital">
          <MailIcon className="w-6 h-6 text-white/90 hover:text-white transition" />
        </Link>
        <Link href="https://calendar.app.google/RwZqaabSR5aDMnk46" target="_blank">
          <ScreenShareIcon className="w-6 h-6 text-white/90 hover:text-white transition" />
        </Link>
      </div>
    </header>
  );
}

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
              <Link href="/solutions" className="font-googletitre text-white/90 text-lg text-regular px-2">
                Solutions
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/demonstration-headless" className="font-googletitre text-white/90 text-lg text-regular px-2">
                Démo
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/audit-site-ia" className="font-googletitre text-white/90 text-lg text-regular px-2">
                Audit
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/etudes-de-cas" className="font-googletitre text-white/90 text-lg text-regular px-2">
                Etudes de cas
              </Link>
            </NavigationMenuItem>
                           {/*
            <NavigationMenuItem>
              <Link href="/simulateur-tarifs" className="font-googletitre text-white/90 text-lg text-regular px-2">
                Tarifs
              </Link>
            </NavigationMenuItem>
            */}
          </NavigationMenuList>
        </NavigationMenu>
      </nav>

      {/* Mobile */}
      <nav className="flex w-full md:hidden items-center justify-end sticky">
        <button
          className="p-2 rounded-md"
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
                  <MobileMenuLink href="/solutions" onClick={handleMenuClick}>Solutions</MobileMenuLink>
                  <MobileMenuLink href="/demonstration-headless" onClick={handleMenuClick}>Démo</MobileMenuLink>
                  <MobileMenuLink href="/audit-site-ia" onClick={handleMenuClick}>Audit</MobileMenuLink>
                  <MobileMenuLink href="/etudes-de-cas" onClick={handleMenuClick} className="pb-8">Etudes de cas</MobileMenuLink>

                  <div className="pl-4 pt-8 flex items-center gap-8 border-t">
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
                  <MobileMenuLink href="/documentation" onClick={handleMenuClick}>Documentation</MobileMenuLink>
                  <MobileMenuLink href="/contact" onClick={handleMenuClick}>Contact</MobileMenuLink>
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
    <header className="border-b top-0 z-50 shadow-sm sticky bg-mediumblue/60 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between px-2">
        <div className="basis-3/12 pt-2 md:pl-0 pl-4">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <Image
              src="/img/logo-blanc-carre.png"
              alt="Next Impact Digital"
              width={40}
              height={40}
            />
          </Link>
        </div>
        <div className="basis-6/12 flex lg:justify-center justify-start">
          <NavBar />
        </div>

        <div className="md:basis-3/12 md:flex justify-end items-center gap-4 hidden">
          {/*<div className="relative group">
            <button
              className="flex items-center gap-2 px-3 py-2 text-white"
              type="button"
              aria-haspopup="listbox"
              aria-expanded="false"
            >
              <span className="font-normal text-white">Vous êtes</span>
              <ChevronDown className="w-4 h-4" />
            </button>
            <div className="absolute right-0 w-44 rounded-lg shadow-xl bg-gradient-to-b from-white/40 to-white/90 bg-opacity-90 backdrop-blur-sm border border-lightblue/30 z-50 hidden group-hover:block group-focus-within:block">
              <ul role="listbox">
                <li>
                  <Link
                    href="/vous-etes/pme"
                    className="block px-4 py-2 hover:bg-lightblue/30 text-white rounded transition"
                    role="option"
                  >
                    PME
                  </Link>
                </li>
                <li>
                  <Link
                    href="/vous-etes/ess"
                    className="block px-4 py-2 text-white hover:bg-lightblue/30 hover:text-white rounded transition"
                    role="option"
                  >
                    ESS
                  </Link>
                </li>
              </ul>
            </div>
          <Link href="/a-propos" className="hidden md:inline-block">
            <UserCheck className="w-6 h-6 text-white/90 hover:text-white transition" />
          </Link>
          <Link href="/documentation" className="hidden md:inline-block">
            <DatabaseIcon className="w-6 h-6 text-white/90 hover:text-white transition" />
          </Link>
          </div>*/}
          <Link href="tel:0673981638" className="hidden md:inline-block">
            <PhoneCallIcon className="w-6 h-6 text-white/90 hover:text-white transition" />
          </Link>
          <Link href="mailto:agathe@next-impact.digital" className="hidden md:inline-block">
            <MailIcon className="w-6 h-6 text-white/90 hover:text-white transition" />
          </Link>
          <Link href="https://calendar.app.google/RwZqaabSR5aDMnk46" target="_blank" className="hidden md:inline-block">
            <ScreenShareIcon className="w-6 h-6 text-white/90 hover:text-white transition" />         
          </Link>
        </div>
      </div>
    </header>
  );
}

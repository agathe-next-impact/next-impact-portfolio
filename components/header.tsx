"use client"

import Image from 'next/image'
import Link from 'next/link'
import { Button } from './ui/button'
import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Menu as MenuIcon, X as CloseIcon, PhoneIcon, MailIcon, CalendarIcon } from "lucide-react"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"

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
      <nav className="hidden md:flex">
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <Link href="/" className='font-googletitre text-regularblue text-lg font-medium px-6'>Accueil</Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuTrigger className='font-googletitre text-regularblue text-lg'>Services</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid gap-3 p-6 md:w-[500px] lg:w-[600px] lg:grid-cols-[.75fr_1fr]">
                  <li className="row-span-3">
                    <NavigationMenuLink asChild>
                      <a
                        className="flex h-full w-full select-none gap-8 flex-col justify-end rounded-md bg-gradient-to-b from-lightblue/10 to-lightblue/10 p-6 no-underline outline-none focus:shadow-md"
                        href="/"
                      >
                        <Image src="/img/logo-small.png" alt="Logo Next Impact Digital" width={48} height={48} />
                        <p className="text-sm leading-tight">
                          Des services de création et refonte de sites web conçus avec et pour vous.
                        </p>
                      </a>
                    </NavigationMenuLink>
                  </li>
                  <ListItem href="/services/wordpress" title="Sites web WordPress" className='h-22'>
                    <p className='text-xs text-regularblue/70'>Sites vitrines, institutionnels, d'information</p>
                  </ListItem>
                  <ListItem href="/services/headless" title="Sites web WP Headless" className='h-22'>
                    <p className='text-xs text-regularblue/70'>Intranet, Connexion à des applications tierces internes ou externes</p>
                  </ListItem>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/etudes-de-cas" className='font-googletitre text-regularblue text-lg font-medium px-2'>Réalisations</Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuTrigger className='font-googletitre text-regularblue text-lg'>Outils</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="flex lg:flex-row flex-col p-6 md:w-[500px] lg:w-[600px] gap-3">
                  <li className="lg:basis-1/3">
                    <NavigationMenuLink asChild>
                      <a
                        className="flex h-full w-full select-none gap-8 flex-col justify-end rounded-md bg-gradient-to-b from-lightblue/10 to-lightblue/10 p-6 no-underline outline-none focus:shadow-md"
                        href="/"
                      >
                        <Image src="/img/logo-small.png" alt="Logo Next Impact Digital" width={48} height={48} />
                        <p className="text-sm leading-tight">
                          Des outils en ligne pour vous aider à décider et à formaliser votre projet web.
                        </p>
                      </a>
                    </NavigationMenuLink>
                  </li>
                  <div className='lg:basis-2/3'>
                    <ListItem href="/cms-headless" title="WordPress ou Headless ? Décider" className='h-22'>
                      <p className='text-xs text-regularblue/70'>Quiz pour vous aider à choisir le CMS le plus adapté à votre projet.</p>
                    </ListItem>
                    <ListItem href="/simulateur-tarifs" title="Simulateur de budget" className='h-22'>
                      <p className='text-xs text-regularblue/70'>Outil interactif pour estimer le budget de votre projet web.</p>
                    </ListItem>
                    <ListItem href="/cahier-des-charges" title="Générateur de cahier des charges" className='h-22'>
                      <p className='text-xs text-regularblue/70'>Outil interactif pour vous guider dans la rédaction d'un cahier des charges.</p>
                    </ListItem>
                  </div>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </nav>

      {/* Mobile */}
      <nav className="flex w-full md:hidden items-center justify-end">
        <button
          className="p-2 rounded-md"
          aria-label={mobileOpen ? "Fermer le menu" : "Ouvrir le menu"}
          onClick={() => setMobileOpen((open) => !open)}
        >
          {mobileOpen ? (
            <CloseIcon className="w-10 h-10 text-regularblue" />
          ) : (
            <MenuIcon className="w-10 h-10 text-regularblue" />
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
                className="fixed top-0 left-0 z-50 h-full w-full bg-white shadow-lg"
              >
                <div className="flex items-center justify-between px-6 py-2 border-b">
                  <Image
                    src="/img/logo-small.png"
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
                    <CloseIcon className="w-10 h-10 text-regularblue" />
                  </button>
                </div>
                <div className="p-4 space-y-0">
                  <MobileMenuLink href="/" onClick={handleMenuClick}>Accueil</MobileMenuLink>
                  {/* Services sous-menu */}
                  <div>
                    <button
                      className={cn(
                        "w-full text-left py-3 px-4 rounded-md text-regularblue font-medium text-lg hover:bg-lightblue/10 transition cursor-pointer select-none flex items-center justify-between",
                        openSubMenu === "services" && "bg-lightblue/10"
                      )}
                      onClick={() => handleToggleSubMenu("services")}
                      aria-expanded={openSubMenu === "services"}
                    >
                      Services
                      <span className={cn("transition-transform", openSubMenu === "services" ? "rotate-180" : "")}>
                        <ChevronDown className="inline w-5 h-5 ml-2" />
                      </span>
                    </button>
                    <AnimatePresence initial={false}>
                      {openSubMenu === "services" && (
                        <motion.div
                          key="services-sub"
                          initial={{ y: -20, opacity: 0, height: 0 }}
                          animate={{ y: 0, opacity: 1, height: "auto" }}
                          exit={{ y: -20, opacity: 0, height: 0 }}
                          transition={{ duration: 0.25 }}
                          className="pl-4 overflow-hidden"
                        >
                          <MobileMenuLink href="/services/wordpress" onClick={handleMenuClick} className="pl-4">WordPress</MobileMenuLink>
                          <MobileMenuLink href="/services/headless" onClick={handleMenuClick} className="pl-4">WordPress Headless</MobileMenuLink>
                        </motion.div>
                      )}
                    </AnimatePresence>
                    <MobileMenuLink href="/etudes-de-cas" onClick={handleMenuClick}>Réalisations</MobileMenuLink>

                    <button
                      className={cn(
                        "w-full text-left py-3 px-4 rounded-md text-regularblue font-medium text-lg hover:bg-lightblue/10 transition cursor-pointer select-none flex items-center justify-between",
                        openSubMenu === "ressources" && "bg-lightblue/10"
                      )}
                      onClick={() => handleToggleSubMenu("ressources")}
                      aria-expanded={openSubMenu === "ressources"}
                    >
                      Ressources
                      <span className={cn("transition-transform", openSubMenu === "ressources" ? "rotate-180" : "")}>
                        <ChevronDown className="inline w-5 h-5 ml-2" />
                      </span>
                    </button>
                    <AnimatePresence initial={false}>
                      {openSubMenu === "ressources" && (
                        <motion.div
                          key="ressources-sub"
                          initial={{ y: -20, opacity: 0, height: 0 }}
                          animate={{ y: 0, opacity: 1, height: "auto" }}
                          exit={{ y: -20, opacity: 0, height: 0 }}
                          transition={{ duration: 0.25 }}
                          className="pl-4 overflow-hidden"
                        >
                          <MobileMenuLink href="/cms-headless" onClick={handleMenuClick} className="pl-4">WordPress CMS ou Headless ?</MobileMenuLink>
                          <MobileMenuLink href="/simulateur-tarifs" onClick={handleMenuClick} className="pl-4">Simulateur du budget</MobileMenuLink>
                          <MobileMenuLink href="/cahier-des-charges" onClick={handleMenuClick} className="pl-4">Générateur de cahier des charges</MobileMenuLink>
                          <MobileMenuLink href="/documentation" onClick={handleMenuClick} className="pl-4">Documentation & Blog</MobileMenuLink>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
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
  href: string
  children: React.ReactNode
  onClick?: () => void
  className?: string
}) => (
  <Link
    href={href}
    onClick={onClick}
    className={cn(
      "block py-3 px-4 rounded-md text-regularblue font-medium text-lg hover:bg-lightblue/10 transition",
      className
    )}
  >
    {children}
  </Link>
)

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
          <div className="text-lg font-regular text-regularblue leading-none">{title}</div>
          <p className="line-clamp-2 text-xs leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  )
})
ListItem.displayName = "ListItem"

export default function Header() {
  return (
    <header className="border-b top-0 z-50 shadow-sm sticky bg-white">
      <div className="container flex h-16 items-center justify-between px-2">
        <div className='basis-1/6 pt-2 md:pl-0 pl-4'>
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <Image src="/img/logo-small.png" alt="Next Impact Digital" width={40} height={40} />
          </Link>
        </div>
        <div className='basis-4/6 flex lg:justify-center justify-start'>
          <NavBar />
        </div>

        <div className='md:basis-1/6 md:flex justify-end items-end hidden'>
          <div className="flex items-center gap-4 pr-4">
            <Link
              href="tel:0673981638">
                <PhoneIcon className="text-regularblue" />
            </Link>
            <Link
            href="mailto:agathe@next-impact.digital"
            >
              <MailIcon className="text-regularblue" />
            </Link>
            <Link
              href="https://calendar.app.google/HuwRpoVGoKBj2PkX8"
            >
              <CalendarIcon className="text-regularblue" />
            </Link>
          </div>

        </div>
      </div>
    </header>
  )
}
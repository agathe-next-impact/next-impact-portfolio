"use client";

import Image from "next/image";
import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu as MenuIcon,
  X as CloseIcon,
  File,
  BookOpenText,
  ChevronDown,
  UserCheck,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { Link } from "@/i18n/navigation";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { GlobalProfileSwitcher } from "@/components/global-profile-switcher";
import { ThemeToggle } from "@/components/theme-toggle";
import { LocaleSwitcher } from "@/components/locale-switcher";
import { BrandLogo } from "@/components/brand-logo";

export function NavBar() {
  const t = useTranslations("nav");
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [openSubMenu, setOpenSubMenu] = React.useState<string | null>(null);

  const handleMenuClick = () => {
    setMobileOpen(false);
    setOpenSubMenu(null);
  };

  const handleToggleSubMenu = (key: string) => {
    setOpenSubMenu((prev) => (prev === key ? null : key));
  };

  return (
    <>
      {/* Desktop */}
      <nav className="hidden lg:flex px-4 py-2">
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <Link href="/services" className="font-googletitre text-white/90 text-base text-regular px-1.5">
                {t("services")}
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/avantage-oeth" className="font-googletitre text-white/90 text-base text-regular px-1.5">
                {t("oethAdvantage")}
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/demo" className="font-googletitre text-white/90 text-base text-regular px-1.5">
                {t("demo")}
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/outils" className="font-googletitre text-white/90 text-base text-regular px-1.5">
                {t("tools")}
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/documentation" className="font-googletitre text-white/90 text-base text-regular px-1.5">
                {t("documentation")}
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/etudes-de-cas" className="font-googletitre text-white/90 text-base text-regular px-1.5">
                {t("caseStudies")}
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </nav>

      {/* Mobile */}
      <nav className="flex lg:hidden items-center sticky">
        <button
          className="p-2 rounded-md shrink-0"
          aria-label={mobileOpen ? t("closeMenu") : t("openMenu")}
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
                className="fixed top-0 left-0 z-50 h-full w-full "
              >
                <div className="flex items-center justify-between px-6 py-2 bg-white dark:bg-darkblue border-b">
                  <BrandLogo
                    src="/img/logo-blanc-carre.webp"
                    srcLight="/img/logo-small.webp"
                    alt="Next Impact Digital"
                    width={40}
                    height={40}
                    className="mr-2"
                    priority
                    fetchPriority="high"
                  />
                  <button
                    className="p-2 rounded-md focus:outline-none"
                    aria-label={t("closeMenu")}
                    onClick={handleMenuClick}
                  >
                    <CloseIcon className="w-10 h-10 text-white" />
                  </button>
                </div>
                <div className="h-screen p-4 space-y-0 bg-white dark:bg-darkblue dark:backdrop-blur-md">
                  <MobileMenuLink href="/services" onClick={handleMenuClick}>{t("services")}</MobileMenuLink>
                  <MobileMenuLink href="/avantage-oeth" onClick={handleMenuClick}>{t("oethAdvantage")}</MobileMenuLink>
                  <MobileMenuLink href="/demo" onClick={handleMenuClick}>{t("demo")}</MobileMenuLink>
                  <MobileMenuLink href="/outils" onClick={handleMenuClick}>{t("tools")}</MobileMenuLink>
                  <MobileMenuLink href="/etudes-de-cas" onClick={handleMenuClick}>{t("caseStudies")}</MobileMenuLink>
                  <MobileMenuLink href="/documentation" onClick={handleMenuClick} className="pb-4">{t("documentation")}</MobileMenuLink>
                  <MobileMenuLink href="/contact" onClick={handleMenuClick} className="pb-4">{t("contact")}</MobileMenuLink>

                  <div className="pl-4 pt-4 flex items-center gap-8 border-t border-white/10">
                    <Link href="/a-propos" onClick={handleMenuClick} aria-label={t("about")}>
                      <UserCheck className="w-8 h-8 text-white/90 hover:text-white transition" />
                    </Link>
                    <a
                      href="/ressources/livre_blanc_wp_headless.pdf"
                      target="_blank"
                      rel="noopener noreferrer"
                      title={t("whitepaperTitle")}
                    >
                      <File className="w-8 h-8 text-white/90 hover:text-white transition" />
                    </a>
                    <ThemeToggle />
                    <LocaleSwitcher />
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
  href: string;
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}) => (
  // @ts-expect-error – href is a localized pathname string
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
  const t = useTranslations("nav");
  return (
    <header className="flex items-center justify-between border-b top-0 z-50 px-4 sticky bg-mediumblue/60 backdrop-blur-md h-16">
      {/* Logo */}
      <div className="shrink-0 pt-1">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <BrandLogo
            src="/img/logo-blanc-carre.png"
            srcLight="/img/logo-small.png"
            alt="Next Impact Digital"
            width={30}
            height={30}
            priority
            fetchPriority="high"
          />
        </Link>
      </div>

      {/* Desktop nav (centre) */}
      <div className="w-full hidden lg:flex justify-start pl-4">
        <NavBar />
      </div>

      {/* Mobile : switcher centré + hamburger */}
      <div className="flex lg:hidden flex-1 items-center justify-end gap-2">
        <GlobalProfileSwitcher />
        <LocaleSwitcher />
        <NavBar />
      </div>

      {/* Desktop : icônes de droite */}
      <div className="hidden lg:flex items-center gap-4">
        <GlobalProfileSwitcher />
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <Link href="/contact" className="font-googletitre text-white/90 text-lg text-regular px-2">
                {t("contact")}
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
        <a
          href="/ressources/livre_blanc_wp_headless.pdf"
          target="_blank"
          rel="noopener noreferrer"
          title={t("whitepaperTitle")}
        >
          <BookOpenText className="w-6 h-6 text-white/90 hover:text-white transition" />
        </a>
        <Link href="/a-propos" aria-label={t("about")}>
          <UserCheck className="w-6 h-6 text-white/90 hover:text-white transition" />
        </Link>
        <ThemeToggle />
        <LocaleSwitcher />
      </div>
    </header>
  );
}

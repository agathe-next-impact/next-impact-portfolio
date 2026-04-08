"use client";

import { useState, useEffect } from "react";
import { List } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
  SheetTrigger,
} from "@/components/ui/sheet";

interface MobileTocProps {
  tableOfContents: { id: string; text: string; level: number }[];
}

export function MobileToc({ tableOfContents }: MobileTocProps) {
  const [visible, setVisible] = useState(false);
  const [activeId, setActiveId] = useState("");

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 300);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const headings = tableOfContents
      .map((item) => document.getElementById(item.id))
      .filter(Boolean) as HTMLElement[];

    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
            break;
          }
        }
      },
      { rootMargin: "-80px 0px -60% 0px", threshold: 0 }
    );

    headings.forEach((h) => observer.observe(h));
    return () => observer.disconnect();
  }, [tableOfContents]);

  if (tableOfContents.length === 0) return null;

  return (
    <div
      className={cn(
        "fixed bottom-6 right-6 z-40 lg:hidden transition-all duration-300",
        visible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-4 pointer-events-none"
      )}
    >
      <Sheet>
        <SheetTrigger asChild>
          <button className="flex items-center gap-2 rounded-2xl bg-mediumblue/90 backdrop-blur-sm border border-lightblue/20 px-4 py-3 text-sm text-white hover:bg-mediumblue transition-colors">
            <List className="h-4 w-4 text-lightblue" />
            <span className="font-googletexte">Sommaire</span>
          </button>
        </SheetTrigger>
        <SheetContent
          side="bottom"
          className="bg-darkblue/95 backdrop-blur-md border-t border-lightblue/10 rounded-t-3xl pb-8"
        >
          <SheetHeader className="mb-4">
            <SheetTitle className="text-xs text-white/80 font-googletexte uppercase tracking-wider text-left">
              Sommaire
            </SheetTitle>
          </SheetHeader>
          <nav>
            <ul className="space-y-0.5 max-h-[60vh] overflow-y-auto">
              {tableOfContents.map((item) => (
                <li key={item.id}>
                  <SheetClose asChild>
                    <a
                      href={`#${item.id}`}
                      className={cn(
                        "block rounded-lg px-3 py-2 font-googletexte transition-all duration-200",
                        item.level === 3 ? "pl-6 text-xs" : "text-sm",
                        activeId === item.id
                          ? "text-white bg-regularblue/15 border-l-2 border-orange"
                          : "text-white/80 hover:text-white hover:bg-darkblue/40 border-l-2 border-transparent"
                      )}
                    >
                      {item.text}
                    </a>
                  </SheetClose>
                </li>
              ))}
            </ul>
          </nav>
        </SheetContent>
      </Sheet>
    </div>
  );
}

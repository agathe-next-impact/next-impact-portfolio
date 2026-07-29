"use client";

import { useEffect, useRef, useState } from "react";
import { Phone, Video, Mail, Newspaper, ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

const PHONE = "0673981638";
const PHONE_DISPLAY = "06 73 98 16 38";
const EMAIL = "agathe@next-impact.digital";
const VISIO_URL = "https://calendar.app.google/Cw7TGQBzeZ1szKU86";
const NEWSLETTER_URL = "https://substack.com/@comesattollo626215";

type OptionKey = "phone" | "visio" | "email" | "newsletter";

export function FloatingContact() {
  const [activeKey, setActiveKey] = useState<OptionKey | null>(null);
  const [visible, setVisible] = useState(false);
  const [hoveredKey, setHoveredKey] = useState<OptionKey | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();
  const railRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const t = useTranslations("floatingContact");

  type Option = {
    key: OptionKey;
    Icon: typeof Phone;
    label: string;
    sub: string;
    href: string;
    external?: boolean;
  };

  const options: Option[] = [
    {
      key: "phone",
      Icon: Phone,
      label: t("phone"),
      sub: PHONE_DISPLAY,
      href: `tel:${PHONE}`,
    },
    {
      key: "visio",
      Icon: Video,
      label: t("video"),
      sub: t("videoDescription"),
      href: VISIO_URL,
      external: true,
    },
    {
      key: "email",
      Icon: Mail,
      label: t("email"),
      sub: EMAIL,
      href: `mailto:${EMAIL}`,
    },
    {
      key: "newsletter",
      Icon: Newspaper,
      label: t("newsletter"),
      sub: t("newsletterDescription"),
      href: NEWSLETTER_URL,
      external: true,
    },
  ];

  const close = () => {
    setVisible(false);
    timerRef.current = setTimeout(() => setActiveKey(null), 180);
  };

  const toggle = (key: OptionKey) => {
    if (activeKey === key) {
      close();
      return;
    }
    clearTimeout(timerRef.current);
    setVisible(false);
    setActiveKey(key);
    requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)));
  };

  useEffect(() => {
    return () => clearTimeout(timerRef.current);
  }, []);

  useEffect(() => {
    if (!activeKey) return;

    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") close(); };
    const onDown = (e: MouseEvent) => {
      const t = e.target as Node;
      if (
        panelRef.current?.contains(t) ||
        railRef.current?.contains(t)
      ) return;
      close();
    };

    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onDown);
    };
  }, [activeKey]);

  const activeOption = options.find((o) => o.key === activeKey);

  return (
    <>
      {/* Panel — slides in from the right, anchored to rail */}
      {activeKey && (
        <div
          ref={panelRef}
          role="dialog"
          aria-modal="false"
          aria-label={t("ariaLabel")}
          className="fixed z-[49] w-64 border border-r-0 border-dark-gray bg-jet motion-reduce:!transition-none"
          style={{
            right: "2.5rem",
            top: "50%",
            transform: `translateY(-50%) translateX(${visible ? "0" : "100%"})`,
            transition: "transform 0.18s ease",
          }}
        >
          <div className="px-5 pb-4 pt-5">
            <div className="mb-2.5 font-mono text-[9px] uppercase tracking-[0.12em] text-mid-gray">
              {activeOption?.label}
            </div>

            <p className="mb-4 break-all font-mono text-[11px] leading-relaxed text-foreground">
              {activeOption?.sub}
            </p>

            <a
              href={activeOption?.href}
              {...(activeOption?.external
                ? { target: "_blank", rel: "noopener noreferrer" }
                : {})}
              className="inline-flex items-center gap-1.5 border border-charcoal bg-vermilion px-3 py-1.5 font-mono text-[11px] font-semibold uppercase tracking-[0.08em] text-white transition-colors hover:bg-vermilion-bright"
              onClick={close}
            >
              {activeOption?.label}
              <ArrowRight size={10} />
            </a>
          </div>
        </div>
      )}

      {/* Rail — fixed right edge, vertically centered */}
      <div
        ref={railRef}
        aria-label={t("ariaLabel")}
        className="fixed right-0 top-1/2 z-50 -translate-y-1/2 border border-dark-gray bg-obsidian"
      >
        {options.map((opt, i) => {
          const Icon = opt.Icon;
          const isActive = activeKey === opt.key;
          return (
            <button
              key={opt.key}
              type="button"
              aria-label={opt.label}
              aria-expanded={isActive}
              onClick={() => toggle(opt.key)}
              className={cn(
                "flex h-10 w-10 cursor-pointer items-center justify-center border-l-[3px] bg-transparent transition-colors duration-150",
                i > 0 && "border-t border-t-dark-gray",
                isActive
                  ? "border-l-accent-secondary bg-jet text-accent-secondary"
                  : hoveredKey === opt.key
                  ? "border-l-transparent text-foreground"
                  : "border-l-transparent text-mid-gray",
              )}
              onMouseEnter={() => setHoveredKey(opt.key)}
              onMouseLeave={() => setHoveredKey(null)}
            >
              <Icon size={14} strokeWidth={1.5} />
            </button>
          );
        })}
      </div>
    </>
  );
}

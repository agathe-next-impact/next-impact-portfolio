"use client";

import { useEffect, useRef, useState } from "react";
import { Phone, Video, Mail, Newspaper, ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";

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
          style={{
            position: "fixed",
            right: "2.5rem",
            top: "50%",
            transform: `translateY(-50%) translateX(${visible ? "0" : "100%"})`,
            width: 256,
            background: "var(--paper)",
            border: "1px solid var(--rule)",
            borderRight: "none",
            zIndex: 49,
            transition: "transform 0.18s ease",
          }}
        >
          <div style={{ padding: "1.25rem 1.25rem 1rem" }}>
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 9,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "var(--muted-color)",
                marginBottom: 10,
              }}
            >
              {activeOption?.label}
            </div>

            <p
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 11,
                color: "var(--ink)",
                lineHeight: 1.5,
                marginBottom: 16,
                wordBreak: "break-all",
              }}
            >
              {activeOption?.sub}
            </p>

            <a
              href={activeOption?.href}
              {...(activeOption?.external
                ? { target: "_blank", rel: "noopener noreferrer" }
                : {})}
              className="btn primary"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                fontSize: 11,
                padding: "0.4rem 0.75rem",
              }}
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
        style={{
          position: "fixed",
          right: 0,
          top: "50%",
          transform: "translateY(-50%)",
          zIndex: 50,
          background: "var(--paper)",
          border: "1px solid var(--rule)",
        }}
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
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "2.5rem",
                height: "2.5rem",
                background: isActive ? "var(--paper-2)" : "transparent",
                border: "none",
                borderTop: i > 0 ? "1px solid var(--rule)" : "none",
                borderLeft: isActive
                  ? "3px solid var(--accent-color)"
                  : "3px solid transparent",
                cursor: "pointer",
                color: isActive
                  ? "var(--accent-color)"
                  : hoveredKey === opt.key
                  ? "var(--ink)"
                  : "var(--ink-2)",
                transition: "color 0.15s, background 0.15s, border-color 0.15s",
              }}
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

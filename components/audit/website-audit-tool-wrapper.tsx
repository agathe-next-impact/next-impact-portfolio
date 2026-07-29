"use client";
import dynamic from "next/dynamic";

// Lazy load de l'outil d'audit
const WebsiteAuditTool = dynamic(() => import("./website-audit-tool").then(mod => ({ default: mod.WebsiteAuditTool })), {
  loading: () => (
    <div className="flex min-h-[500px] items-center justify-center">
      <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-accent-secondary"></div>
    </div>
  ),
  ssr: false,
});

export default WebsiteAuditTool;

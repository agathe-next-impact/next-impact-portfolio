"use client";
import dynamic from "next/dynamic";

// Lazy load de l'outil d'audit
const WebsiteAuditTool = dynamic(() => import("./website-audit-tool").then(mod => ({ default: mod.WebsiteAuditTool })), {
  loading: () => (
    <div className="flex justify-center items-center min-h-[500px]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-regularblue"></div>
    </div>
  ),
  ssr: false,
});

export default WebsiteAuditTool;

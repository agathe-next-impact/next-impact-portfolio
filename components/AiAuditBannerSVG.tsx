import React from "react";

/**
 * AiAuditBannerSVG — bannière « scan / dashboard » de l'audit IA.
 * Réhabillé aux tokens du design system « Blueprint » : toutes les couleurs passent
 * par les variables CSS theme-aware (`--accent` indigo, `--accent-2` jaune,
 * `--mid-gray`/`--dark-gray` pour les traits, `--jet`/`--foreground` pour les
 * surfaces et textes). La bascule clair/sombre fonctionne donc sans condition.
 */
const ACCENT = "hsl(var(--accent))"; // indigo (primaire)
const GOLD = "hsl(var(--accent-2))"; // jaune (secondaire)
const LINE = "hsl(var(--mid-gray))"; // traits atténués
const TRACK = "hsl(var(--dark-gray))"; // pistes / fonds de jauge
const PANEL = "hsl(var(--jet))"; // surface de panneau
const TXT = "hsl(var(--foreground))"; // texte principal

const AiAuditBannerSVG: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 400" fill="none">
    <defs>
      {/* Gradients */}
      <linearGradient id="brainGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor={ACCENT} stopOpacity={1} />
        <stop offset="100%" stopColor={LINE} stopOpacity={0.3} />
      </linearGradient>
      <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor={GOLD} stopOpacity={0.8} />
        <stop offset="100%" stopColor={GOLD} stopOpacity={0.2} />
      </linearGradient>
      <linearGradient id="glowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor={ACCENT} stopOpacity={0} />
        <stop offset="50%" stopColor={ACCENT} stopOpacity={0.5} />
        <stop offset="100%" stopColor={ACCENT} stopOpacity={0} />
      </linearGradient>
      {/* Filters */}
      <filter id="glow">
        <feGaussianBlur stdDeviation="4" result="coloredBlur" />
        <feMerge>
          <feMergeNode in="coloredBlur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>
    {/* Data Flow (center) */}
    <g id="data-flow">
      {/* Animated data packets */}
      <circle cx="150" cy="180" r="4" fill={GOLD}>
        <animateMotion path="M 0 0 L 350 0" dur="3s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0;1;1;0" dur="3s" repeatCount="indefinite" />
      </circle>
      <circle cx="150" cy="200" r="4" fill={ACCENT}>
        <animateMotion path="M 0 0 L 350 0" dur="3s" begin="0.5s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0;1;1;0" dur="3s" begin="0.5s" repeatCount="indefinite" />
      </circle>
      <circle cx="150" cy="220" r="4" fill={ACCENT}>
        <animateMotion path="M 0 0 L 350 0" dur="3s" begin="1s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0;1;1;0" dur="3s" begin="1s" repeatCount="indefinite" />
      </circle>
      {/* Extended arrow from left to right */}
      <path d="M 100 200 L 480 200" stroke={LINE} strokeWidth="2" strokeDasharray="5,5" opacity="0.4" />
      <polygon points="480,200 470,195 470,205" fill={LINE} opacity="0.6" />
      {/* Scan lines effect */}
      <line x1="200" y1="120" x2="200" y2="280" stroke="url(#glowGradient)" strokeWidth="40" opacity="0.4">
        <animate attributeName="x1" values="100;480;100" dur="4s" repeatCount="indefinite" />
        <animate attributeName="x2" values="100;480;100" dur="4s" repeatCount="indefinite" />
      </line>
    </g>
    {/* Business Analytics Dashboard (right side) */}
    <g id="business-dashboard">
      {/* Dashboard background */}
      <rect x="520" y="100" width="240" height="200" rx="8" fill={PANEL} opacity="0.5" stroke={TRACK} strokeWidth="1" />
      {/* ROI Chart */}
      <g id="roi-chart">
        <text x="540" y="125" fill={TXT} fontSize="12" fontWeight="600">ROI Projection</text>
        {/* Bar chart */}
        <rect x="540" y="145" width="20" height="50" fill="url(#chartGradient)" rx="2">
          <animate attributeName="height" values="30;50;30" dur="3s" repeatCount="indefinite" />
          <animate attributeName="y" values="165;145;165" dur="3s" repeatCount="indefinite" />
        </rect>
        <rect x="570" y="135" width="20" height="60" fill="url(#chartGradient)" rx="2">
          <animate attributeName="height" values="40;60;40" dur="3s" begin="0.3s" repeatCount="indefinite" />
          <animate attributeName="y" values="155;135;155" dur="3s" begin="0.3s" repeatCount="indefinite" />
        </rect>
        <rect x="600" y="125" width="20" height="70" fill="url(#chartGradient)" rx="2">
          <animate attributeName="height" values="50;70;50" dur="3s" begin="0.6s" repeatCount="indefinite" />
          <animate attributeName="y" values="145;125;145" dur="3s" begin="0.6s" repeatCount="indefinite" />
        </rect>
        <rect x="630" y="110" width="20" height="85" fill="url(#chartGradient)" rx="2">
          <animate attributeName="height" values="65;85;65" dur="3s" begin="0.9s" repeatCount="indefinite" />
          <animate attributeName="y" values="130;110;130" dur="3s" begin="0.9s" repeatCount="indefinite" />
        </rect>
        {/* Growth arrow */}
        <path d="M 540 195 L 650 140" stroke={GOLD} strokeWidth="2" strokeDasharray="3,3" />
        <polygon points="650,140 645,145 648,150" fill={GOLD} />
      </g>
      {/* Performance Metrics */}
      <g id="metrics">
        <text x="680" y="125" fill={TXT} fontSize="12" fontWeight="600">Performance</text>
        {/* Speed gauge */}
        <circle cx="720" cy="160" r="25" fill="none" stroke={TRACK} strokeWidth="4" />
        <circle cx="720" cy="160" r="25" fill="none" stroke={GOLD} strokeWidth="4" strokeDasharray="120" strokeDashoffset="30" transform="rotate(-90 720 160)">
          <animate attributeName="stroke-dashoffset" values="30;10;30" dur="2s" repeatCount="indefinite" />
        </circle>
        <text x="720" y="165" fill={GOLD} fontSize="14" fontWeight="700" textAnchor="middle">↑</text>
      </g>
      {/* Cost Optimization */}
      <g id="cost-optimization">
        <text x="540" y="225" fill={TXT} fontSize="12" fontWeight="600">Cost Efficiency</text>
        {/* Pie chart segments */}
        <circle cx="580" cy="260" r="20" fill="none" stroke={ACCENT} strokeWidth="8" strokeDasharray="80 120" transform="rotate(-90 580 260)" />
        <circle cx="580" cy="260" r="20" fill="none" stroke={GOLD} strokeWidth="8" strokeDasharray="40 120" strokeDashoffset="-80" transform="rotate(-90 580 260)" />
        <circle cx="580" cy="260" r="20" fill="none" stroke={TRACK} strokeWidth="8" strokeDasharray="20 120" strokeDashoffset="-120" transform="rotate(-90 580 260)" />
        {/* Checkmark */}
        <circle cx="640" cy="260" r="18" fill={ACCENT} opacity="0.25" />
        <path d="M 632 260 L 638 266 L 648 254" stroke={GOLD} strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round">
          <animate attributeName="opacity" values="0;1;1;0" dur="2s" repeatCount="indefinite" />
        </path>
      </g>
      {/* Target/Recommendation indicator */}
      <g id="recommendation">
        <circle cx="720" cy="260" r="18" fill="none" stroke={GOLD} strokeWidth="2" opacity="0.6" />
        <circle cx="720" cy="260" r="12" fill="none" stroke={GOLD} strokeWidth="2" opacity="0.8" />
        <circle cx="720" cy="260" r="4" fill={GOLD}>
          <animate attributeName="r" values="4;6;4" dur="1.5s" repeatCount="indefinite" />
        </circle>
      </g>
    </g>
    {/* Decorative elements */}
    <g id="decorative">
      {/* Corner brackets */}
      <path d="M 100 80 L 80 80 L 80 100" stroke={LINE} strokeWidth="1.5" fill="none" opacity="0.5" />
      <path d="M 780 80 L 800 80 L 800 100" stroke={LINE} strokeWidth="1.5" fill="none" opacity="0.5" />
      <path d="M 100 320 L 80 320 L 80 300" stroke={LINE} strokeWidth="1.5" fill="none" opacity="0.5" />
      <path d="M 780 320 L 800 320 L 800 300" stroke={LINE} strokeWidth="1.5" fill="none" opacity="0.5" />
      {/* Floating particles */}
      <circle cx="120" cy="350" r="3" fill={ACCENT} opacity="0.5">
        <animate attributeName="cy" values="350;320;350" dur="4s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.5;0.8;0.5" dur="4s" repeatCount="indefinite" />
      </circle>
      <circle cx="750" cy="50" r="3" fill={GOLD} opacity="0.5">
        <animate attributeName="cy" values="50;80;50" dur="3s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.5;0.8;0.5" dur="3s" repeatCount="indefinite" />
      </circle>
    </g>
  </svg>
);

export default AiAuditBannerSVG;

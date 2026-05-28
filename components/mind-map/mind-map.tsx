"use client"

import React, {
  useState,
  useCallback,
  useRef,
  useEffect,
  useMemo,
} from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  ChevronRight,
  Layers,
  Zap,
  Eye,
  Shield,
  Code2,
  Pencil,
  AlertTriangle,
  Route,
  Globe,
  Server,
  MonitorSmartphone,
  Gauge,
  Sparkles,
  Lock,
  GitBranch,
  Users,
  FolderCog,
  ScanEye,
  RefreshCcw,
  DollarSign,
  Puzzle,
  Expand,
  Shrink,
  ExternalLink,
} from "lucide-react"
import Link from "next/link"
import { useTheme } from "next-themes"
import { useLocale } from "next-intl"
import type { Locale } from "@/i18n/routing"

// ══════════════════════════════════════════
// Types
// ══════════════════════════════════════════

interface NodeData {
  id: string
  label: string
  children?: NodeData[]
  color: string
  iconKey?: string
  href?: string
}

interface PositionedNode {
  id: string
  label: string
  x: number
  y: number
  w: number
  h: number
  depth: number
  color: string
  iconKey?: string
  href?: string
  hasChildren: boolean
  parentX?: number
  parentY?: number
  parentW?: number
  parentH?: number
}

// ══════════════════════════════════════════
// Icons map
// ══════════════════════════════════════════

const ICON_MAP: Record<string, React.ReactNode> = {
  globe: <Globe size={16} />,
  zap: <Zap size={14} />,
  layers: <Layers size={14} />,
  server: <Server size={13} />,
  code2: <Code2 size={13} />,
  monitor: <MonitorSmartphone size={13} />,
  gauge: <Gauge size={14} />,
  sparkles: <Sparkles size={13} />,
  eye: <Eye size={14} />,
  shield: <Shield size={14} />,
  lock: <Lock size={13} />,
  gitbranch: <GitBranch size={13} />,
  users: <Users size={13} />,
  pencil: <Pencil size={14} />,
  folderCog: <FolderCog size={13} />,
  scanEye: <ScanEye size={13} />,
  refresh: <RefreshCcw size={13} />,
  alert: <AlertTriangle size={14} />,
  dollar: <DollarSign size={13} />,
  puzzle: <Puzzle size={13} />,
  route: <Route size={14} />,
}

// ══════════════════════════════════════════
// Mind Map Data — WordPress Headless
// ══════════════════════════════════════════

const MIND_MAP_DATA_FR: NodeData = {
  id: "root",
  label: "WordPress Headless",
  color: "#F29F05",
  iconKey: "globe",
  children: [
    {
      id: "avantages",
      label: "Pourquoi découpler ?",
      color: "#d83a1a",
      iconKey: "zap",
      children: [
        {
          id: "architecture",
          label: "Backend et frontend séparés",
          color: "#3B82F6",
          iconKey: "layers",
          children: [
            { id: "content-hub", label: "WordPress gère le contenu", color: "#60A5FA", iconKey: "server", href: "/documentation/headless-cms/wordpress-headless-en-pratique" },
            { id: "api", label: "L'API expose les données", color: "#60A5FA", iconKey: "code2", href: "/documentation/headless-cms/wpgraphql" },
            { id: "frontend-indep", label: "Next.js affiche le site", color: "#60A5FA", iconKey: "monitor", href: "/documentation/headless-cms/nextjs-pour-wordpress-headless" },
          ],
        },
        {
          id: "performance",
          label: "Vitesse et SEO optimaux",
          color: "#10B981",
          iconKey: "gauge",
          children: [
            { id: "ssg-isr", label: "Pages pré-rendues, chargement instantané", color: "#34D399", iconKey: "sparkles", href: "/documentation/headless-cms/rendu-nextjs-ssg-ssr-isr" },
            { id: "cwv", label: "Scores Lighthouse proches de 100", color: "#34D399", iconKey: "gauge", href: "/documentation/headless-cms/performance-et-core-web-vitals" },
            { id: "edge-cdn", label: "Contenu distribué via CDN mondial", color: "#34D399", iconKey: "globe", href: "/documentation/headless-cms/deploiement-vercel-nextjs" },
          ],
        },
        {
          id: "ux",
          label: "Fluidité de navigation",
          color: "#8B5CF6",
          iconKey: "eye",
          children: [
            { id: "spa", label: "Transitions sans rechargement de page", color: "#A78BFA", iconKey: "zap", href: "/documentation/headless-cms/les-technos-frontend" },
            { id: "skeleton", label: "Interfaces perçues comme immédiates", color: "#A78BFA", iconKey: "layers", href: "/documentation/design-ui-ux/ux" },
            { id: "micro-interactions", label: "Animations React natives et fluides", color: "#A78BFA", iconKey: "sparkles", href: "/documentation/design-ui-ux/definir-son-ux" },
          ],
        },
        {
          id: "securite",
          label: "Surface d'attaque réduite",
          color: "#EF4444",
          iconKey: "shield",
          children: [
            { id: "isolation", label: "WordPress caché, inaccessible au public", color: "#F87171", iconKey: "lock", href: "/documentation/headless-cms/securite-wordpress-headless" },
            { id: "injections", label: "Pas de faille PHP côté visiteur", color: "#F87171", iconKey: "shield", href: "/documentation/headless-cms/securite-wordpress-headless" },
            { id: "ddos", label: "Frontend statique, résilient aux DDoS", color: "#F87171", iconKey: "lock", href: "/documentation/headless-cms/securite-wordpress-headless" },
          ],
        },
        {
          id: "dev-experience",
          label: "Stack moderne et productive",
          color: "#F59E0B",
          iconKey: "code2",
          children: [
            { id: "frameworks", label: "React et TypeScript en standard", color: "#FBBF24", iconKey: "code2", href: "/documentation/headless-cms/nextjs-pour-wordpress-headless" },
            { id: "git-ci", label: "Déploiement automatisé via CI/CD", color: "#FBBF24", iconKey: "gitbranch", href: "/documentation/headless-cms/deploiement-vercel-nextjs" },
            { id: "talents", label: "Stack qui attire les meilleurs talents", color: "#FBBF24", iconKey: "users", href: "/documentation/headless-cms/pourquoi-le-headless" },
          ],
        },
      ],
    },
    {
      id: "editeur",
      label: "L'éditeur garde ses repères",
      color: "#8B5CF6",
      iconKey: "pencil",
      children: [
        { id: "gutenberg-acf", label: "ACF structure, Gutenberg édite", color: "#A78BFA", iconKey: "folderCog", href: "/documentation/headless-cms/custom-post-types-et-acf" },
        { id: "live-preview", label: "Prévisualisation instantanée du rendu", color: "#A78BFA", iconKey: "scanEye", href: "/documentation/headless-cms/preview-et-workflow-editorial" },
        { id: "multi-canal", label: "Un contenu, plusieurs canaux de diffusion", color: "#A78BFA", iconKey: "refresh", href: "/documentation/headless-cms/comprendre-le-headless" },
      ],
    },
    {
      id: "defis",
      label: "Les contreparties à prévoir",
      color: "#EF4444",
      iconKey: "alert",
      children: [
        { id: "complexite", label: "Expertise frontend indispensable", color: "#F87171", iconKey: "alert", href: "/documentation/headless-cms/comment-creer-un-headless" },
        { id: "investissement", label: "Budget initial 2 à 3× supérieur", color: "#F87171", iconKey: "dollar", href: "/documentation/headless-cms/dois-je-passer-au-headless" },
        { id: "maintenance", label: "Deux environnements à maintenir", color: "#F87171", iconKey: "refresh", href: "/documentation/headless-cms/herbergement-et-mise-en-ligne" },
        { id: "plugins", label: "Certains plugins WP incompatibles", color: "#F87171", iconKey: "puzzle", href: "/documentation/wordpress/les-plugins" },
      ],
    },
    {
      id: "roadmap",
      label: "Migrer progressivement, sans rupture",
      color: "#10B981",
      iconKey: "route",
      href: "/documentation/headless-cms/migration-monolithique-vers-headless",
    },
  ],
}

const MIND_MAP_DATA_EN: NodeData = {
  id: "root",
  label: "Headless WordPress",
  color: "#F29F05",
  iconKey: "globe",
  children: [
    {
      id: "avantages",
      label: "Why decouple?",
      color: "#d83a1a",
      iconKey: "zap",
      children: [
        {
          id: "architecture",
          label: "Backend and frontend separated",
          color: "#3B82F6",
          iconKey: "layers",
          children: [
            { id: "content-hub", label: "WordPress handles content", color: "#60A5FA", iconKey: "server", href: "/documentation/headless-cms/wordpress-headless-en-pratique" },
            { id: "api", label: "The API exposes the data", color: "#60A5FA", iconKey: "code2", href: "/documentation/headless-cms/wpgraphql" },
            { id: "frontend-indep", label: "Next.js renders the site", color: "#60A5FA", iconKey: "monitor", href: "/documentation/headless-cms/nextjs-pour-wordpress-headless" },
          ],
        },
        {
          id: "performance",
          label: "Optimal speed and SEO",
          color: "#10B981",
          iconKey: "gauge",
          children: [
            { id: "ssg-isr", label: "Pre-rendered pages, instant load", color: "#34D399", iconKey: "sparkles", href: "/documentation/headless-cms/rendu-nextjs-ssg-ssr-isr" },
            { id: "cwv", label: "Lighthouse scores near 100", color: "#34D399", iconKey: "gauge", href: "/documentation/headless-cms/performance-et-core-web-vitals" },
            { id: "edge-cdn", label: "Content served via global CDN", color: "#34D399", iconKey: "globe", href: "/documentation/headless-cms/deploiement-vercel-nextjs" },
          ],
        },
        {
          id: "ux",
          label: "Smooth navigation",
          color: "#8B5CF6",
          iconKey: "eye",
          children: [
            { id: "spa", label: "Page transitions without reloads", color: "#A78BFA", iconKey: "zap", href: "/documentation/headless-cms/les-technos-frontend" },
            { id: "skeleton", label: "Interfaces that feel instant", color: "#A78BFA", iconKey: "layers", href: "/documentation/design-ui-ux/ux" },
            { id: "micro-interactions", label: "Smooth native React animations", color: "#A78BFA", iconKey: "sparkles", href: "/documentation/design-ui-ux/definir-son-ux" },
          ],
        },
        {
          id: "securite",
          label: "Reduced attack surface",
          color: "#EF4444",
          iconKey: "shield",
          children: [
            { id: "isolation", label: "WordPress hidden, not publicly accessible", color: "#F87171", iconKey: "lock", href: "/documentation/headless-cms/securite-wordpress-headless" },
            { id: "injections", label: "No PHP exploit on the visitor side", color: "#F87171", iconKey: "shield", href: "/documentation/headless-cms/securite-wordpress-headless" },
            { id: "ddos", label: "Static frontend, resilient to DDoS", color: "#F87171", iconKey: "lock", href: "/documentation/headless-cms/securite-wordpress-headless" },
          ],
        },
        {
          id: "dev-experience",
          label: "Modern, productive stack",
          color: "#F59E0B",
          iconKey: "code2",
          children: [
            { id: "frameworks", label: "React and TypeScript by default", color: "#FBBF24", iconKey: "code2", href: "/documentation/headless-cms/nextjs-pour-wordpress-headless" },
            { id: "git-ci", label: "Automated CI/CD deployment", color: "#FBBF24", iconKey: "gitbranch", href: "/documentation/headless-cms/deploiement-vercel-nextjs" },
            { id: "talents", label: "Stack that attracts top talent", color: "#FBBF24", iconKey: "users", href: "/documentation/headless-cms/pourquoi-le-headless" },
          ],
        },
      ],
    },
    {
      id: "editeur",
      label: "Editors keep their bearings",
      color: "#8B5CF6",
      iconKey: "pencil",
      children: [
        { id: "gutenberg-acf", label: "ACF structures, Gutenberg edits", color: "#A78BFA", iconKey: "folderCog", href: "/documentation/headless-cms/custom-post-types-et-acf" },
        { id: "live-preview", label: "Instant rendering preview", color: "#A78BFA", iconKey: "scanEye", href: "/documentation/headless-cms/preview-et-workflow-editorial" },
        { id: "multi-canal", label: "One content, multiple delivery channels", color: "#A78BFA", iconKey: "refresh", href: "/documentation/headless-cms/comprendre-le-headless" },
      ],
    },
    {
      id: "defis",
      label: "Trade-offs to plan for",
      color: "#EF4444",
      iconKey: "alert",
      children: [
        { id: "complexite", label: "Front-end expertise required", color: "#F87171", iconKey: "alert", href: "/documentation/headless-cms/comment-creer-un-headless" },
        { id: "investissement", label: "Initial budget 2 to 3× higher", color: "#F87171", iconKey: "dollar", href: "/documentation/headless-cms/dois-je-passer-au-headless" },
        { id: "maintenance", label: "Two environments to maintain", color: "#F87171", iconKey: "refresh", href: "/documentation/headless-cms/herbergement-et-mise-en-ligne" },
        { id: "plugins", label: "Some WP plugins are incompatible", color: "#F87171", iconKey: "puzzle", href: "/documentation/wordpress/les-plugins" },
      ],
    },
    {
      id: "roadmap",
      label: "Migrate progressively, no disruption",
      color: "#10B981",
      iconKey: "route",
      href: "/documentation/headless-cms/migration-monolithique-vers-headless",
    },
  ],
}

function getMindMapData(locale: Locale): NodeData {
  return locale === "en" ? MIND_MAP_DATA_EN : MIND_MAP_DATA_FR;
}

const MIND_MAP_DATA = MIND_MAP_DATA_FR;

// ══════════════════════════════════════════
// Layout constants
// ══════════════════════════════════════════

const NODE_WIDTHS = [280, 300, 290, 350]
const NODE_HEIGHTS = [64, 56, 54, 54]
const H_GAP = 64
const V_GAP = 10
const CANVAS_PADDING = 80

function getNodeDims(depth: number) {
  const d = Math.min(depth, 3)
  return { w: NODE_WIDTHS[d], h: NODE_HEIGHTS[d] }
}

// ══════════════════════════════════════════
// Layout engine
// ══════════════════════════════════════════

function subtreeHeight(
  node: NodeData,
  depth: number,
  expanded: Set<string>
): number {
  const { h } = getNodeDims(depth)
  if (!node.children?.length || !expanded.has(node.id)) return h

  let total = 0
  for (let i = 0; i < node.children.length; i++) {
    total += subtreeHeight(node.children[i], depth + 1, expanded)
    if (i < node.children.length - 1) total += V_GAP
  }
  return Math.max(h, total)
}

function layoutTree(
  node: NodeData,
  x: number,
  y: number,
  depth: number,
  expanded: Set<string>,
  parentCenter?: { x: number; y: number; w: number; h: number }
): PositionedNode[] {
  const { w, h } = getNodeDims(depth)
  const stH = subtreeHeight(node, depth, expanded)
  const nodeY = y + stH / 2 - h / 2

  const result: PositionedNode[] = [
    {
      id: node.id,
      label: node.label,
      x,
      y: nodeY,
      w,
      h,
      depth,
      color: node.color,
      iconKey: node.iconKey,
      href: node.href,
      hasChildren: !!node.children?.length,
      parentX: parentCenter?.x,
      parentY: parentCenter?.y,
      parentW: parentCenter?.w,
      parentH: parentCenter?.h,
    },
  ]

  if (node.children?.length && expanded.has(node.id)) {
    let childY = y
    const childX = x + w + H_GAP

    for (const child of node.children) {
      const childSH = subtreeHeight(child, depth + 1, expanded)
      result.push(
        ...layoutTree(child, childX, childY, depth + 1, expanded, {
          x,
          y: nodeY,
          w,
          h,
        })
      )
      childY += childSH + V_GAP
    }
  }

  return result
}

// ══════════════════════════════════════════
// SVG connection path
// ══════════════════════════════════════════

function connectionPath(
  fromX: number,
  fromY: number,
  toX: number,
  toY: number
): string {
  const midX = fromX + (toX - fromX) * 0.5
  return `M ${fromX} ${fromY} C ${midX} ${fromY}, ${midX} ${toY}, ${toX} ${toY}`
}

// ══════════════════════════════════════════
// ConnectionLine component
// ══════════════════════════════════════════

function ConnectionLine({
  fromX,
  fromY,
  toX,
  toY,
  color,
  index,
}: {
  fromX: number
  fromY: number
  toX: number
  toY: number
  color: string
  index: number
}) {
  const d = connectionPath(fromX, fromY, toX, toY)

  return (
    <motion.path
      d={d}
      stroke={color}
      strokeWidth={1.5}
      strokeOpacity={0.35}
      fill="none"
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity: 1 }}
      exit={{ pathLength: 0, opacity: 0 }}
      transition={{
        pathLength: { duration: 0.35, delay: index * 0.02, ease: "easeOut" },
        opacity: { duration: 0.25, delay: index * 0.02 },
      }}
    />
  )
}

// ══════════════════════════════════════════
// MindMapNode component
// ══════════════════════════════════════════

function MindMapNodeCard({
  node,
  isExpanded,
  onToggle,
  isLight,
}: {
  node: PositionedNode
  isExpanded: boolean
  onToggle: (id: string) => void
  isLight: boolean
}) {
  const isRoot = node.depth === 0
  const fontSize = isRoot ? 16 : node.depth === 1 ? 15 : 14
  const fontWeight = node.depth <= 1 ? 600 : 500

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ x: node.x, y: node.y, opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{
        type: "tween",
        duration: 0.2,
        ease: "easeOut",
      }}
      onClick={(e) => {
        e.stopPropagation()
        if (node.hasChildren) onToggle(node.id)
      }}
      data-mind-node
      className="absolute select-none"
      style={{
        width: node.w,
        height: node.h,
        zIndex: 10 + (3 - node.depth),
      }}
    >
      <div
        className={`
          relative flex items-center gap-2.5 w-full h-full px-3
          border backdrop-blur-sm
          transition-all duration-300 ease-out
          ${node.hasChildren || node.href ? "cursor-pointer" : "cursor-default"}
          ${isRoot ? "rounded-3xl" : "rounded-2xl"}
          group
        `}
        style={{
          background: isLight
            ? (isRoot
                ? `linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(208, 220, 242, 0.85) 50%, rgba(208, 220, 242, 0.95) 100%)`
                : `rgba(255, 255, 255, 0.85)`)
            : (isRoot
                ? `linear-gradient(135deg, rgba(216, 58, 26, 0.4) 0%, rgba(14, 14, 12, 0.6) 50%, rgba(14, 14, 12, 0.8) 100%)`
                : `rgba(14, 14, 12, 0.8)`),
          borderColor: isExpanded
            ? `${node.color}50`
            : (isLight ? `rgba(14, 14, 12, 0.15)` : `rgba(14, 14, 12, 0.1)`),
          borderLeftWidth: isRoot ? 1 : 3,
          borderLeftColor: node.color,
        }}
      >
        {/* Hover glow */}
        <div
          className={`absolute inset-0 ${isRoot ? "rounded-3xl" : "rounded-2xl"} opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`}
          style={{
            background: `radial-gradient(ellipse at center, ${node.color}0A 0%, transparent 70%)`,
          }}
        />

        {/* Icon */}
        {node.iconKey && ICON_MAP[node.iconKey] && (
          <div
            className="flex-shrink-0 flex items-center justify-center"
            style={{
              color: node.color,
              width: isRoot ? 32 : 26,
              height: isRoot ? 32 : 26,
            }}
          >
            {ICON_MAP[node.iconKey]}
          </div>
        )}

        {/* Label */}
        <span
          className="flex-1 leading-snug line-clamp-2 font-googletitre"
          style={{ fontSize, fontWeight, color: '#0e0e0c' }}
          title={node.label}
        >
          {node.label}
        </span>

        {/* Expand indicator */}
        {node.hasChildren && (
          <div className="flex items-center gap-1 flex-shrink-0">
            <span
              className="text-[10px] font-medium font-googletexte"
              style={{
                color: node.color,
              }}
            >
              {CHILDREN_COUNT.get(node.id) ?? 0}
            </span>
            <motion.div
              animate={{ rotate: isExpanded ? 90 : 0 }}
              transition={{ type: "tween", duration: 0.2, ease: "easeOut" }}
              style={{ color: node.color }}
            >
              <ChevronRight size={14} />
            </motion.div>
          </div>
        )}

        {/* Link indicator for leaf nodes */}
        {!node.hasChildren && node.href && (
          <Link
            href={node.href}
            onClick={(e) => e.stopPropagation()}
            className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-xl transition-colors duration-200 hover:bg-white/10"
            style={{ color: node.color }}
            title="Lire l'article"
          >
            <ExternalLink size={12} />
          </Link>
        )}
      </div>
    </motion.div>
  )
}

// We need children count in the node card - let's patch:
// Actually we don't have children data in PositionedNode. Let's add a lookup.

// ══════════════════════════════════════════
// Helpers: collect all node IDs with children
// ══════════════════════════════════════════

function collectExpandableIds(node: NodeData): string[] {
  const ids: string[] = []
  if (node.children?.length) {
    ids.push(node.id)
    for (const child of node.children) {
      ids.push(...collectExpandableIds(child))
    }
  }
  return ids
}

function collectChildrenCount(node: NodeData): Map<string, number> {
  const map = new Map<string, number>()
  function walk(n: NodeData) {
    if (n.children?.length) {
      map.set(n.id, n.children.length)
      n.children.forEach(walk)
    }
  }
  walk(node)
  return map
}

const ALL_EXPANDABLE = collectExpandableIds(MIND_MAP_DATA)
const CHILDREN_COUNT = collectChildrenCount(MIND_MAP_DATA)

// Find all IDs in a subtree rooted at targetId
function getSubtreeIds(root: NodeData, targetId: string): Set<string> | null {
  function find(node: NodeData): NodeData | null {
    if (node.id === targetId) return node
    for (const child of node.children ?? []) {
      const r = find(child)
      if (r) return r
    }
    return null
  }
  const target = find(root)
  if (!target) return null
  const ids = new Set<string>()
  function collect(n: NodeData) {
    ids.add(n.id)
    n.children?.forEach(collect)
  }
  collect(target)
  return ids
}

// ══════════════════════════════════════════
// Main MindMap component
// ══════════════════════════════════════════

export default function MindMap() {
  const { resolvedTheme } = useTheme()
  const locale = useLocale() as Locale
  const isEn = locale === "en"
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])
  const isLight = mounted && resolvedTheme === 'light'

  const mindMapData = useMemo(() => getMindMapData(locale), [locale])

  const [expanded, setExpanded] = useState<Set<string>>(new Set(["root"]))
  const [zoom, setZoom] = useState(1.15)
  const [pan, setPan] = useState({ x: 60, y: 40 })
  const [isDragging, setIsDragging] = useState(false)
  const dragRef = useRef({ startX: 0, startY: 0, panX: 0, panY: 0 })
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLDivElement>(null)
  const focusTargetRef = useRef<string | null>(null)

  // Layout computation
  const nodes = useMemo(
    () =>
      layoutTree(
        mindMapData,
        CANVAS_PADDING,
        CANVAS_PADDING,
        0,
        expanded
      ),
    [expanded, mindMapData]
  )

  // Canvas bounds
  const canvasSize = useMemo(() => {
    let maxX = 0,
      maxY = 0
    for (const n of nodes) {
      maxX = Math.max(maxX, n.x + n.w)
      maxY = Math.max(maxY, n.y + n.h)
    }
    return {
      width: maxX + CANVAS_PADDING * 2,
      height: maxY + CANVAS_PADDING * 2,
    }
  }, [nodes])

  // Connections
  const connections = useMemo(() => {
    const conns: {
      id: string
      fromX: number
      fromY: number
      toX: number
      toY: number
      color: string
    }[] = []
    for (const node of nodes) {
      if (
        node.parentX !== undefined &&
        node.parentY !== undefined &&
        node.parentW !== undefined &&
        node.parentH !== undefined
      ) {
        conns.push({
          id: `conn-${node.id}`,
          fromX: node.parentX + node.parentW,
          fromY: node.parentY + node.parentH / 2,
          toX: node.x,
          toY: node.y + node.h / 2,
          color: node.color,
        })
      }
    }
    return conns
  }, [nodes])

  // Toggle node
  const toggleNode = useCallback((id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        // Collapse: also collapse all descendants
        function removeDescendants(nodeData: NodeData) {
          if (nodeData.id === id && nodeData.children) {
            for (const child of nodeData.children) {
              collapseAllNodes(child)
            }
          } else if (nodeData.children) {
            for (const child of nodeData.children) {
              removeDescendants(child)
            }
          }
        }
        function collapseAllNodes(nodeData: NodeData) {
          next.delete(nodeData.id)
          nodeData.children?.forEach(collapseAllNodes)
        }
        next.delete(id)
        removeDescendants(mindMapData)
        focusTargetRef.current = null
      } else {
        next.add(id)
        focusTargetRef.current = id
      }
      return next
    })
  }, [])

  // Expand all
  const expandAll = useCallback(() => {
    focusTargetRef.current = null
    setExpanded(new Set(ALL_EXPANDABLE))
  }, [])

  // Collapse all
  const collapseAll = useCallback(() => {
    focusTargetRef.current = null
    setExpanded(new Set(["root"]))
  }, [])

  // Fit entire canvas to view
  const fitToView = useCallback(() => {
    const container = containerRef.current
    if (!container) return
    const rect = container.getBoundingClientRect()
    const pad = 40
    const scaleX = (rect.width - pad * 2) / canvasSize.width
    const scaleY = (rect.height - pad * 2) / canvasSize.height
    const newZoom = Math.min(scaleX, scaleY, 2)
    setZoom(newZoom)
    setPan({
      x: (rect.width - canvasSize.width * newZoom) / 2,
      y: (rect.height - canvasSize.height * newZoom) / 2,
    })
  }, [canvasSize])

  // Smart auto-center: on expand → zoom on subtree, otherwise → fit all
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const timer = setTimeout(() => {
      const rect = container.getBoundingClientRect()
      const focusId = focusTargetRef.current
      focusTargetRef.current = null

      // Center on expanded subtree
      if (focusId) {
        const ids = getSubtreeIds(mindMapData, focusId)
        const subtreeNodes = ids
          ? nodes.filter((n) => ids.has(n.id))
          : []

        if (subtreeNodes.length > 1) {
          let minX = Infinity,
            minY = Infinity,
            maxX = -Infinity,
            maxY = -Infinity
          for (const n of subtreeNodes) {
            minX = Math.min(minX, n.x)
            minY = Math.min(minY, n.y)
            maxX = Math.max(maxX, n.x + n.w)
            maxY = Math.max(maxY, n.y + n.h)
          }
          const pad = 60
          const scaleX = (rect.width - pad * 2) / (maxX - minX)
          const scaleY = (rect.height - pad * 2) / (maxY - minY)
          const newZoom = Math.max(0.95, Math.min(scaleX, scaleY, 1.8))
          const cx = (minX + maxX) / 2
          const cy = (minY + maxY) / 2
          setZoom(newZoom)
          setPan({
            x: rect.width / 2 - cx * newZoom,
            y: rect.height / 2 - cy * newZoom,
          })
          return
        }
      }

      // Default: fit everything
      const pad = 40
      const scaleX = (rect.width - pad * 2) / canvasSize.width
      const scaleY = (rect.height - pad * 2) / canvasSize.height
      const newZoom = Math.min(scaleX, scaleY, 2)
      setZoom(newZoom)
      setPan({
        x: (rect.width - canvasSize.width * newZoom) / 2,
        y: (rect.height - canvasSize.height * newZoom) / 2,
      })
    }, 120)

    return () => clearTimeout(timer)
  }, [nodes, canvasSize])

  // Wheel zoom
  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault()
      const delta = e.deltaY > 0 ? -0.08 : 0.08
      setZoom((prev) => {
        const newZoom = Math.max(0.15, Math.min(2.5, prev + delta))
        const rect = el.getBoundingClientRect()
        const mx = e.clientX - rect.left
        const my = e.clientY - rect.top
        const scale = newZoom / prev
        setPan((p) => ({
          x: mx - scale * (mx - p.x),
          y: my - scale * (my - p.y),
        }))
        return newZoom
      })
    }

    el.addEventListener("wheel", handleWheel, { passive: false })
    return () => el.removeEventListener("wheel", handleWheel)
  }, [])

  // Drag pan — store latest pan in ref so callbacks stay stable
  const panRef = useRef(pan)
  panRef.current = pan

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest("[data-mind-node]")) return
    setIsDragging(true)
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      panX: panRef.current.x,
      panY: panRef.current.y,
    }
    containerRef.current?.setPointerCapture(e.pointerId)
  }, [])

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDragging) return
    const dx = e.clientX - dragRef.current.startX
    const dy = e.clientY - dragRef.current.startY
    setPan({
      x: dragRef.current.panX + dx,
      y: dragRef.current.panY + dy,
    })
  }, [isDragging])

  const handlePointerUp = useCallback((e: React.PointerEvent) => {
    if (!isDragging) return
    setIsDragging(false)
    containerRef.current?.releasePointerCapture(e.pointerId)
  }, [isDragging])

  // Double-click on empty canvas → fit to view
  const handleDoubleClick = useCallback((e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest("[data-mind-node]")) return
    fitToView()
  }, [fitToView])

  const zoomIn = () =>
    setZoom((z) => Math.min(2.5, z + 0.15))
  const zoomOut = () =>
    setZoom((z) => Math.max(0.15, z - 0.15))

  const isAllExpanded = expanded.size === ALL_EXPANDABLE.length

  return (
    <div className="relative z-10 isolate w-full h-[calc(100vh-100px)] min-h-[500px] overflow-hidden rounded-3xl border border-lightblue/10 bg-darkblue/60 backdrop-blur-md">
      {/* Dot grid background */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: isLight
            ? "radial-gradient(circle, rgba(14, 14, 12, 0.18) 1px, transparent 1px)"
            : "radial-gradient(circle, rgba(14,14,12,0.12) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      {/* Subtle radial gradient */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: isLight
            ? "radial-gradient(ellipse 60% 50% at 20% 50%, rgba(216, 58, 26, 0.05) 0%, transparent 100%)"
            : "radial-gradient(ellipse 60% 50% at 20% 50%, rgba(216, 58, 26, 0.08) 0%, transparent 100%)",
        }}
      />

      {/* Toolbar */}
      <div className="absolute top-4 right-4 z-30 flex items-center gap-1.5 bg-darkblue/60 backdrop-blur-md rounded-2xl border border-lightblue/10 px-1.5 py-1.5">
        <ToolbarButton onClick={zoomOut} title={isEn ? "Zoom out" : "Zoom arrière"}>
          <ZoomOut size={16} />
        </ToolbarButton>
        <div className="px-2 py-1 text-xs text-white/50 font-googletexte tabular-nums min-w-[48px] text-center">
          {Math.round(zoom * 100)}%
        </div>
        <ToolbarButton onClick={zoomIn} title={isEn ? "Zoom in" : "Zoom avant"}>
          <ZoomIn size={16} />
        </ToolbarButton>
        <div className="w-px h-5 bg-lightblue/10 mx-0.5" />
        <ToolbarButton onClick={fitToView} title={isEn ? "Fit to view" : "Ajuster à la vue"}>
          <Maximize2 size={16} />
        </ToolbarButton>
        <div className="w-px h-5 bg-lightblue/10 mx-0.5" />
        <ToolbarButton
          onClick={isAllExpanded ? collapseAll : expandAll}
          title={
            isAllExpanded
              ? isEn ? "Collapse all" : "Tout replier"
              : isEn ? "Expand all" : "Tout déplier"
          }
        >
          {isAllExpanded ? <Shrink size={16} /> : <Expand size={16} />}
        </ToolbarButton>
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 z-30 flex flex-wrap gap-2">
        {(isEn
          ? [
              { label: "Benefits", color: "#d83a1a" },
              { label: "Editor", color: "#8B5CF6" },
              { label: "Challenges", color: "#EF4444" },
              { label: "Roadmap", color: "#10B981" },
            ]
          : [
              { label: "Avantages", color: "#d83a1a" },
              { label: "Éditeur", color: "#8B5CF6" },
              { label: "Défis", color: "#EF4444" },
              { label: "Roadmap", color: "#10B981" },
            ]
        ).map((item) => (
          <div
            key={item.label}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] text-white/70 backdrop-blur-sm font-googletexte bg-darkblue/40 border border-lightblue/10"
          >
            <div
              className="w-2 h-2 rounded-full"
              style={{ background: item.color }}
            />
            {item.label}
          </div>
        ))}
      </div>

      {/* Hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.6 }}
        className="absolute bottom-4 right-4 z-30 text-[11px] text-white/25 select-none font-googletexte"
      >
        {isEn
          ? "Click to explore · Scroll to zoom · Drag to pan · Double-click to recenter"
          : "Cliquez pour explorer · Scroll pour zoomer · Glisser pour déplacer · Double-clic pour recentrer"}
      </motion.div>

      {/* Canvas container — pan & zoom */}
      <div
        ref={containerRef}
        className="absolute inset-0"
        style={{ cursor: isDragging ? "grabbing" : "grab" }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onDoubleClick={handleDoubleClick}
      >
        <div
          ref={canvasRef}
          className="absolute origin-top-left will-change-transform"
          style={{
            width: canvasSize.width,
            height: canvasSize.height,
            transform: `translate3d(${pan.x}px, ${pan.y}px, 0) scale(${zoom})`,
            transition: isDragging ? "none" : "transform 0.3s ease-out",
          }}
        >
          {/* SVG connections */}
          <svg
            width={canvasSize.width}
            height={canvasSize.height}
            className="absolute top-0 left-0 pointer-events-none"
          >
            <defs>
              {/* Glow filter */}
              <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>
            <AnimatePresence>
              {connections.map((conn, i) => (
                <ConnectionLine
                  key={conn.id}
                  fromX={conn.fromX}
                  fromY={conn.fromY}
                  toX={conn.toX}
                  toY={conn.toY}
                  color={conn.color}
                  index={i}
                />
              ))}
            </AnimatePresence>
          </svg>

          {/* Nodes */}
          <AnimatePresence>
            {nodes.map((node) => (
              <MindMapNodeCard
                key={node.id}
                node={node}
                isExpanded={expanded.has(node.id)}
                onToggle={toggleNode}
                isLight={isLight}
              />
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

// ══════════════════════════════════════════
// Toolbar button
// ══════════════════════════════════════════

function ToolbarButton({
  children,
  onClick,
  title,
}: {
  children: React.ReactNode
  onClick: () => void
  title?: string
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      className="flex items-center justify-center w-8 h-8 rounded-xl
        bg-mediumblue/40 hover:bg-mediumblue/60 border border-lightblue/10 hover:border-lightblue/20
        text-white/60 hover:text-white/90
        transition-all duration-300
        active:scale-95"
    >
      {children}
    </button>
  )
}

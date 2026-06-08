"use client";

import { motion } from "framer-motion";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { cn } from "@/lib/utils";

const SERIES_COLORS = ["--accent", "--accent-2", "--accent-champagne", "--mid-gray"];
const DONUT_COLORS = ["--accent", "--accent-2", "--accent-champagne", "--ebony", "--mid-gray"];

// recharts résout les CSS custom properties dans les attributs SVG :
// les couleurs suivent donc le thème (clair/sombre) automatiquement.
const TOOLTIP = {
  cursor: { stroke: "hsl(var(--dark-gray))", strokeWidth: 1 },
  contentStyle: {
    background: "hsl(var(--jet))",
    border: "1px solid hsl(var(--dark-gray))",
    borderRadius: 10,
    fontSize: 12,
  },
  labelStyle: { color: "hsl(var(--mid-gray))" },
  itemStyle: { color: "hsl(var(--foreground))" },
} as const;

const AXIS_TICK = { fill: "hsl(var(--mid-gray))", fontSize: 11 } as const;

type Datum = { label: string; value: number };

/** AreaTrend — courbe douce (monotone), trait fin + remplissage dégradé très léger + points discrets. */
export function AreaTrend({
  data,
  height = 220,
  className,
}: {
  data: Datum[];
  height?: number;
  className?: string;
}) {
  return (
    <div className={cn("w-full", className)} style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 8, bottom: 0, left: -14 }}>
          <defs>
            <linearGradient id="area-accent" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(var(--accent))" stopOpacity={0.28} />
              <stop offset="100%" stopColor="hsl(var(--accent))" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="hsl(var(--dark-gray))" strokeDasharray="2 4" vertical={false} />
          <XAxis dataKey="label" tick={AXIS_TICK} tickLine={false} axisLine={{ stroke: "hsl(var(--dark-gray))" }} />
          <YAxis tick={AXIS_TICK} tickLine={false} axisLine={false} width={34} />
          <Tooltip {...TOOLTIP} />
          <Area
            type="monotone"
            dataKey="value"
            stroke="hsl(var(--accent))"
            strokeWidth={1.5}
            fill="url(#area-accent)"
            dot={{ r: 2, fill: "hsl(var(--accent))", strokeWidth: 0 }}
            activeDot={{ r: 4, fill: "hsl(var(--accent-2))", strokeWidth: 0 }}
            isAnimationActive
            animationDuration={1400}
            animationEasing="ease-out"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

/** BarBreakdown — barres fines en pilules, teinte douce ; une barre mise en avant en jaune. */
export function BarBreakdown({
  data,
  highlightIndex = -1,
  height = 220,
  className,
}: {
  data: Datum[];
  highlightIndex?: number;
  height?: number;
  className?: string;
}) {
  return (
    <div className={cn("w-full", className)} style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 8, bottom: 0, left: -14 }} barCategoryGap="38%">
          <CartesianGrid stroke="hsl(var(--dark-gray))" strokeDasharray="2 4" vertical={false} />
          <XAxis dataKey="label" tick={AXIS_TICK} tickLine={false} axisLine={{ stroke: "hsl(var(--dark-gray))" }} />
          <YAxis tick={AXIS_TICK} tickLine={false} axisLine={false} width={34} />
          <Tooltip {...TOOLTIP} cursor={{ fill: "hsl(var(--accent) / 0.06)" }} />
          <Bar dataKey="value" radius={6} maxBarSize={14} isAnimationActive animationDuration={1100} animationEasing="ease-out">
            {data.map((_, i) => (
              <Cell
                key={i}
                fill={i === highlightIndex ? "hsl(var(--accent-2))" : "hsl(var(--accent) / 0.55)"}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

/** DonutBreakdown — répartition en anneau fin, label central optionnel. */
export function DonutBreakdown({
  data,
  height = 220,
  centerLabel,
  className,
}: {
  data: Datum[];
  height?: number;
  centerLabel?: string;
  className?: string;
}) {
  return (
    <div className={cn("relative w-full", className)} style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="label"
            innerRadius="64%"
            outerRadius="88%"
            paddingAngle={2}
            stroke="hsl(var(--obsidian))"
            strokeWidth={2}
            isAnimationActive
            animationDuration={1000}
          >
            {data.map((_, i) => (
              <Cell key={i} fill={`hsl(var(${DONUT_COLORS[i % DONUT_COLORS.length]}))`} />
            ))}
          </Pie>
          <Tooltip {...TOOLTIP} />
        </PieChart>
      </ResponsiveContainer>
      {centerLabel && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <span className="text-lg font-light text-foreground">{centerLabel}</span>
        </div>
      )}
    </div>
  );
}

/** MultiTrend — comparaison de plusieurs séries en lignes fines. */
export function MultiTrend({
  data,
  series,
  height = 220,
  className,
}: {
  data: Array<Record<string, string | number>>;
  series: { key: string; label?: string }[];
  height?: number;
  className?: string;
}) {
  return (
    <div className={cn("w-full", className)} style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 8, bottom: 0, left: -14 }}>
          <CartesianGrid stroke="hsl(var(--dark-gray))" strokeDasharray="2 4" vertical={false} />
          <XAxis dataKey="label" tick={AXIS_TICK} tickLine={false} axisLine={{ stroke: "hsl(var(--dark-gray))" }} />
          <YAxis tick={AXIS_TICK} tickLine={false} axisLine={false} width={34} />
          <Tooltip {...TOOLTIP} />
          {series.map((s, i) => (
            <Line
              key={s.key}
              type="monotone"
              dataKey={s.key}
              name={s.label ?? s.key}
              stroke={`hsl(var(${SERIES_COLORS[i % SERIES_COLORS.length]}))`}
              strokeWidth={1.5}
              dot={{ r: 2, strokeWidth: 0, fill: `hsl(var(${SERIES_COLORS[i % SERIES_COLORS.length]}))` }}
              activeDot={{ r: 4, strokeWidth: 0 }}
              isAnimationActive
              animationDuration={1200}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

/** MeterBar — barre de score fine qui se remplit au scroll. */
export function MeterBar({
  value = 72,
  label,
  sublabel,
  className,
}: {
  value?: number;
  label?: string;
  sublabel?: string;
  className?: string;
}) {
  const v = Math.max(0, Math.min(100, value));
  return (
    <div className={cn("w-full", className)}>
      {(label || sublabel) && (
        <div className="mb-2 flex items-baseline justify-between">
          {label && <span className="text-sm font-light text-foreground">{label}</span>}
          <span className="font-mono text-[11px] text-mid-gray">{sublabel ?? `${v}%`}</span>
        </div>
      )}
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-dark-gray">
        <motion.div
          className="h-full rounded-full"
          style={{
            background: "linear-gradient(90deg, hsl(var(--accent)), hsl(var(--accent-2)))",
            boxShadow: "0 0 8px hsl(var(--accent-2) / 0.5)",
          }}
          initial={{ width: 0 }}
          whileInView={{ width: `${v}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
    </div>
  );
}

/** Sparkline — micro-courbe inline (sans axes), pour les cartes KPI. */
export function Sparkline({
  data,
  height = 40,
  className,
}: {
  data: Datum[];
  height?: number;
  className?: string;
}) {
  return (
    <div className={cn("w-full", className)} style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 2, right: 0, bottom: 0, left: 0 }}>
          <defs>
            <linearGradient id="spark-accent" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(var(--accent))" stopOpacity={0.35} />
              <stop offset="100%" stopColor="hsl(var(--accent))" stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="value"
            stroke="hsl(var(--accent))"
            strokeWidth={1.25}
            fill="url(#spark-accent)"
            dot={false}
            isAnimationActive
            animationDuration={900}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { HEADLESS_TABS } from "@/lib/data/headless-explainer"
import TimelineStep from "./TimelineStep"
import ProjectGrid from "./ProjectGrid"
import StructureColumns from "./StructureColumns"
import ProsCons from "./ProsCons"

function TabPanel({ tab }: { tab: (typeof HEADLESS_TABS)[number] }) {
  const { content } = tab

  switch (content.variant) {
    case "timeline":
      return (
        <div>
          <p className="text-white/70 font-googletexte text-sm mb-6 max-w-2xl">
            {content.description}
          </p>
          <div className="max-w-lg pt-6">
            {content.steps.map((step, i) => (
              <TimelineStep
                key={step.label}
                step={i + 1}
                label={step.label}
                description={step.description}
                isLast={i === content.steps.length - 1}
              />
            ))}
          </div>
        </div>
      )
    case "grid":
      return <ProjectGrid items={content.items} />
    case "two-columns":
      return <StructureColumns groups={content.groups} />
    case "pros-cons":
      return <ProsCons pros={content.pros} cons={content.cons} />
  }
}

export default function HeadlessExplainer() {
  const [activeTab, setActiveTab] = useState(HEADLESS_TABS[0].id)
  const current = HEADLESS_TABS.find((t) => t.id === activeTab) ?? HEADLESS_TABS[0]

  return (
    <section aria-labelledby="headless-explainer-title" className="w-full bg-mediumblue/90 backdrop-blur-md pt-6 pb-10 rounded-2xl">
      <div className="max-w-5xl mx-auto">

        {/* Tab navigation */}
        <nav
          role="tablist"
          aria-label="Parcours WordPress Headless"
          className="flex flex-col sm:flex-row sm:overflow-x-auto scrollbar-none border-b border-white/10 mb-8 -mx-4 px-4 md:mx-0 md:px-0 md:justify-center gap-1"
        >
          {HEADLESS_TABS.map((tab) => (
            <button
              key={tab.id}
              role="tab"
              id={`tab-${tab.id}`}
              aria-selected={activeTab === tab.id}
              aria-controls={`panel-${tab.id}`}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "px-4 py-3 text-base sm:text-lg font-googletitre font-medium transition-colors relative sm:shrink-0 sm:whitespace-nowrap text-left",
                activeTab === tab.id
                  ? "text-lightyellow"
                  : "text-white/50 hover:text-white/80"
              )}
            >
              {tab.label}
              {activeTab === tab.id && (
                <>
                  <motion.div
                    layoutId="headless-tab-indicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-lightyellow hidden sm:block"
                  />
                  <motion.div
                    layoutId="headless-tab-indicator-mobile"
                    className="absolute top-0 bottom-0 left-0 w-0.5 bg-lightyellow sm:hidden"
                  />
                </>
              )}
            </button>
          ))}
        </nav>

        {/* Tab panel */}
        <div
          role="tabpanel"
          id={`panel-${current.id}`}
          aria-labelledby={`tab-${current.id}`}
          className="min-h-[280px]"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <h3 className="font-googletitre font-medium text-white text-2xl mb-5">
                {current.content.title}
              </h3>
              <TabPanel tab={current} />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}

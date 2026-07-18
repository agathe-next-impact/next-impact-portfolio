"use client";

import { AnimatePresence, m as motion } from "framer-motion";
import { useDocumentationMode } from "@/contexts/documentation-mode-context";
import type { ReactNode } from "react";

interface ConditionalContentProps {
  simple: ReactNode;
  advanced: ReactNode;
}

export function ConditionalContent({ simple, advanced }: ConditionalContentProps) {
  const { isAdvancedMode } = useDocumentationMode();

  return (
    <AnimatePresence mode="wait">
      {isAdvancedMode ? (
        <motion.div
          key="advanced"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {advanced}
        </motion.div>
      ) : (
        <motion.div
          key="simple"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {simple}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

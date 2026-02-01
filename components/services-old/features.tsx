"use client";

import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle } from "lucide-react"

type Feature = {
  title: string
  description: string
  detailedDescription: string
  benefits: string[]
  color: string
}

type FeaturesTabsProps = {
  features: Feature[]
}

export function FeaturesTabs({ features }: FeaturesTabsProps) {
  const [selectedFeature, setSelectedFeature] = useState(0)

  return (
    <section className="py-4">
      <div className="container mx-auto max-w-7xl">

        {/* Main Content Frame */}
        <div className="px-0 md:px-12 lg:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 md:gap-16 gap-4">
            {/* Left Sidebar - Features Grid */}
            <div className="lg:col-span-5">
              <div className="grid grid-cols-1 gap-4">
                {features.map((feature, index) => {
                  const isSelected = selectedFeature === index
                  return (
                    <motion.div
                      key={feature.title}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Card
                        className={`cursor-pointer transition-all duration-300 ${
                          isSelected
                            ? "bg-extralightblue/10"
                            : "hover:bg-extralightblue/20"
                        }`}
                        onClick={() => setSelectedFeature(index)}
                      >
                        <CardContent className="md:p-4 p-0 text-center">
                          <h4 className={`font-medium text-lg text-regularblue ${isSelected ? "text-regularblue" : ""}`}>{feature.title}</h4>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )
                })}
              </div>
            </div>

            {/* Right Content Area */}
            <div className="lg:col-span-7">
              <AnimatePresence mode="wait">
              <motion.div
                key={selectedFeature}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="h-full"
              >

                <div
                className={`h-max rounded-xl ${features[selectedFeature].color} md:px-8 px-0`}

                >
                {/* Feature Header */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="mb-4">
                  <h3 className="text-2xl font-medium text-regularblue mb-1">{features[selectedFeature].title}</h3>
                  <p className="text-mediumblue text-lg">{features[selectedFeature].description}</p>
                  </div>
                </div>

                {/* Detailed Description */}
                <div className="mb-6">
                  <p className="text-mediumblue leading-relaxed">
                  {features[selectedFeature].detailedDescription}
                  </p>
                </div>

                {/* Benefits */}
                <div className="mb-8">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {features[selectedFeature].benefits.map((benefit) => (
                    <motion.div
                    key={benefit}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="flex items-center gap-3 backdrop-blur-sm rounded-lg p-3"
                    >
                    <CheckCircle className="w-5 h-5 text-lightblue flex-shrink-0" />
                    <span className="text-sm font-medium">{benefit}</span>
                    </motion.div>
                  ))}
                  </div>
                </div>
                </div>
              </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}

"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/audit/tabs"
import { MeterBar } from "@/components/visuals/charts"
import { RadialGauge } from "@/components/visuals/radial-gauge"
import { Reveal } from "@/components/ui/reveal"
import type { AuditData, CategoryScore } from "@/lib/types"
import {
  BarChart,
  Zap,
  Search,
  FileText,
  TrendingUp,
  BarChart2,
  Share2,
  Users,
  ShoppingBag,
  Lightbulb,
} from "lucide-react"
import { CategoryDetail } from "@/components/audit/category-details"

interface AuditResultsProps {
  data: AuditData
}

export function AuditResults({ data }: AuditResultsProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "performance":
        return <Zap className="h-5 w-5" />
      case "seo":
        return <Search className="h-5 w-5" />
      case "content":
        return <FileText className="h-5 w-5" />
      case "conversion":
        return <TrendingUp className="h-5 w-5" />
      case "analytics":
        return <BarChart2 className="h-5 w-5" />
      case "acquisition":
        return <Share2 className="h-5 w-5" />
      case "social":
        return <Users className="h-5 w-5" />
      case "commercial":
        return <ShoppingBag className="h-5 w-5" />
      case "recommendations":
        return <Lightbulb className="h-5 w-5" />
      default:
        return <BarChart className="h-5 w-5" />
    }
  }

  // Couleurs de score — mappées sur les tokens du design system (theme-aware).
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-accent-secondary"
    if (score >= 60) return "text-accent"
    return "text-vermilion"
  }

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category)
  }

  return (
    <div className="space-y-6">
      <Reveal>
        <Card className="rounded-md border-dark-gray bg-jet">
          <CardHeader className="flex-row items-center justify-between gap-6">
            <div className="flex flex-col gap-1.5">
              <CardTitle className="font-light text-foreground">
                Score global
              </CardTitle>
              <CardDescription className="font-inter-tight text-mid-gray">
                Basé sur l'analyse de {data.url}
              </CardDescription>
              <p className="mt-2 max-w-md font-inter-tight text-sm text-mid-gray">
                {data.overallScore >= 80
                  ? "Excellent ! Votre site web est performant dans la plupart des domaines."
                  : data.overallScore >= 60
                    ? "Bon, mais plusieurs axes d'amélioration sont possibles."
                    : "Des améliorations importantes sont nécessaires sur plusieurs aspects."}
              </p>
            </div>
            <RadialGauge value={data.overallScore} size={120} className="shrink-0" />
          </CardHeader>
        </Card>
      </Reveal>
      <div className="mt-2 text-right font-mono text-[11px] uppercase tracking-[0.08em] text-mid-gray">
        Analyse réalisée le : {new Date(data.timestamp).toLocaleString("fr-FR")}
      </div>

      <Tabs defaultValue="scores" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="scores">Scores par catégorie</TabsTrigger>
          <TabsTrigger value="details">Analyse détaillée</TabsTrigger>
        </TabsList>
        <TabsContent value="scores">
          <Card className="rounded-md border-dark-gray bg-jet">
            <CardHeader className="flex-col">
              <CardTitle className="font-light text-foreground">Performance par catégorie</CardTitle>
              <CardDescription className="font-inter-tight text-mid-gray">
                Cliquez sur une catégorie pour voir les recommandations détaillées
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.categoryScores.map((category) => (
                  <button
                    type="button"
                    key={category.name}
                    className="flex w-full items-center space-x-4 rounded-sm p-2 text-left transition-colors hover:bg-obsidian/60"
                    onClick={() => handleCategoryClick(category.name)}
                  >
                    <div className="rounded-sm border border-dark-gray bg-obsidian p-2 text-accent-secondary">
                      {getCategoryIcon(category.name)}
                    </div>
                    <div className="flex-1">
                      <div className="mb-1.5 flex justify-between">
                        <span className="font-light capitalize text-foreground">{category.name}</span>
                        <span className={getScoreColor(category.score)}>{category.score}/100</span>
                      </div>
                      <MeterBar value={category.score} />
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="details">
          {selectedCategory ? (
            <CategoryDetail
              category={data.categoryScores.find((c) => c.name === selectedCategory) as CategoryScore}
              onBack={() => setSelectedCategory(null)}
            />
          ) : (
            <Card className="rounded-md border-dark-gray bg-jet">
              <CardHeader className="flex-col">
                <CardTitle className="font-light text-foreground">Sélectionnez une catégorie</CardTitle>
                <CardDescription className="font-inter-tight text-mid-gray">
                  Cliquez sur une catégorie dans l'onglet "Scores" pour voir l'analyse détaillée
                </CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {data.categoryScores.map((category) => (
                  <button
                    type="button"
                    key={category.name}
                    className="rounded-sm border border-dark-gray bg-obsidian p-4 text-left transition-colors hover:border-accent-secondary"
                    onClick={() => setSelectedCategory(category.name)}
                  >
                    <div className="mb-3 flex items-center space-x-2 text-accent-secondary">
                      {getCategoryIcon(category.name)}
                      <span className="font-light capitalize text-foreground">{category.name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <MeterBar value={category.score} className="w-3/4" />
                      <span className={`font-mono text-sm ${getScoreColor(category.score)}`}>{category.score}</span>
                    </div>
                  </button>
                ))}
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

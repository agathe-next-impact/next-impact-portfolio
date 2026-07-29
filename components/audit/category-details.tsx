"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MeterBar } from "@/components/visuals/charts"
import type { CategoryScore } from "@/lib/types"
import { ArrowLeft, ExternalLink } from "lucide-react"

interface CategoryDetailProps {
  category: CategoryScore
  onBack: () => void
}

export function CategoryDetail({ category, onBack }: CategoryDetailProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-accent-secondary"
    if (score >= 60) return "text-accent"
    return "text-vermilion"
  }

  return (
    <Card className="rounded-md border-dark-gray bg-jet">
      <CardHeader>
        <div className="flex items-center">
          <Button variant="ghost" size="sm" onClick={onBack} className="mr-2 text-mid-gray hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <CardTitle className="font-light capitalize text-foreground">{category.name} - Analyse</CardTitle>
            <CardDescription className="font-inter-tight text-mid-gray">
              Score : <span className={getScoreColor(category.score)}>{category.score}/100</span>
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="mb-3 font-mono text-[11px] uppercase tracking-[0.08em] text-mid-gray">Résumé</h3>
          <MeterBar value={category.score} className="mb-3" />
          <p className="font-inter-tight text-sm text-mid-gray">{category.summary}</p>
        </div>

        <div>
          <h3 className="mb-3 font-mono text-[11px] uppercase tracking-[0.08em] text-mid-gray">Points clés</h3>
          <ul className="space-y-2">
            {category.findings.map((finding, index) => (
              <li key={index} className="rounded-sm border border-dark-gray bg-obsidian p-3">
                <div className="flex items-start">
                  <div
                    className={`mr-2 mt-1.5 h-2 w-2 rounded-full ${
                      finding.impact === "high"
                        ? "bg-vermilion"
                        : finding.impact === "medium"
                          ? "bg-accent"
                          : "bg-accent-secondary"
                    }`}
                  />
                  <div>
                    <p className="font-light text-foreground">{finding.title}</p>
                    <p className="font-inter-tight text-sm text-mid-gray">{finding.description}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-3 font-mono text-[11px] uppercase tracking-[0.08em] text-mid-gray">Recommandations</h3>
          <ul className="space-y-2">
            {category.recommendations.map((recommendation, index) => (
              <li key={index} className="rounded-sm border border-dark-gray bg-obsidian p-3">
                <p className="font-light text-foreground">{recommendation.title}</p>
                <p className="font-inter-tight text-sm text-mid-gray">{recommendation.description}</p>
                {recommendation.link && (
                  <a
                    href={recommendation.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 flex items-center text-sm text-accent-secondary hover:underline"
                  >
                    En savoir plus <ExternalLink className="ml-1 h-3 w-3" />
                  </a>
                )}
              </li>
            ))}
          </ul>
        </div>

        {category.sources && category.sources.length > 0 && (
          <div>
            <h3 className="mb-3 font-mono text-[11px] uppercase tracking-[0.08em] text-mid-gray">Sources</h3>
            <ul className="font-inter-tight text-sm text-mid-gray">
              {category.sources.map((source, index) => (
                <li key={index} className="mb-1">
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-accent-secondary hover:underline"
                  >
                    {source.name} <ExternalLink className="ml-1 h-3 w-3" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

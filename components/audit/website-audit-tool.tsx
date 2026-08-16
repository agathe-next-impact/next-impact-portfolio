"use client"

import type React from "react"

import { useState } from "react"
import { Input } from "@/components/audit/input"
import { Card } from "@/components/ui/card"
import { AuditResults } from "@/components/audit/audit-results"
import { runAudit } from "@/lib/audit/audit-service"
import type { AuditData } from "@/lib/types"
import { Loader2 } from "lucide-react"

export function WebsiteAuditTool() {
  const [url, setUrl] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [auditData, setAuditData] = useState<AuditData | null>(null)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Basic URL validation
    if (!url) {
      setError("Veuillez saisir une URL")
      return
    }

    // More comprehensive URL validation
    let formattedUrl = url
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      formattedUrl = `https://${url}`
    }

    try {
      // Test if it's a valid URL format
      new URL(formattedUrl)
    } catch (e) {
      setError("Veuillez saisir une URL valide")
      return
    }

    try {
      setIsLoading(true)
      setError("")
      const data = await runAudit(formattedUrl)
      setAuditData(data)
    } catch (err) {
      setError("Échec de l'analyse du site. Veuillez vérifier l'URL et réessayer.")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="my-20 space-y-8">
      <Card className="mx-auto w-max max-w-full rounded-md border-dark-gray bg-jet p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="url" className="font-mono text-[11px] uppercase tracking-[0.08em] text-mid-gray">
              URL du site
            </label>
            <div className="flex max-w-[40rem] flex-col gap-2 sm:flex-row">
              <Input
                id="url"
                placeholder="exemple.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="flex-1"
              />
              <button
                type="submit"
                disabled={isLoading}
                className="inline-flex items-center justify-center gap-2 rounded-sm border border-accent-secondary bg-accent-secondary px-7 py-3 font-mono text-[11px] uppercase tracking-[0.08em] text-obsidian transition-colors hover:bg-accent-secondary/85 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyse en cours...
                  </>
                ) : (
                  "Analyser"
                )}
              </button>
            </div>
            {error && <p className="text-sm text-vermilion">{error}</p>}
          </div>
        </form>
      </Card>

      {isLoading && (
        <div className="flex flex-col items-center justify-center p-12">
          <Loader2 className="mb-4 h-12 w-12 animate-spin text-accent-secondary" />
          <p className="font-inter-tight text-mid-gray">Analyse du site en cours... Cela peut prendre une minute.</p>
        </div>
      )}

      {auditData && !isLoading && <AuditResults data={auditData} />}
    </div>
  )
}


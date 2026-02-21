"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

type WebsiteType = "vitrine" | "ecommerce" | "corporate" | "application" | "blog"
type AdditionalService = "content" | "seo" | "training"

interface PriceRange {
  min: number
  max: number
}

interface TimeFrame {
  min: number
  max: number
  unit: "semaines" | "mois"
}

interface WebsiteTypeData {
  name: string
  description: string
  prices: PriceRange
  timeframes: TimeFrame
  comments: string
}

interface AdditionalServiceData {
  name: string
  description: string
  prices: PriceRange
  unit?: string
}

const websiteTypesData: Record<WebsiteType, WebsiteTypeData> = {
  vitrine: {
    name: "Site Vitrine (5-10 pages)",
    description: "Site de présentation pour une entreprise ou un professionnel",
    prices: { min: 900, max: 1400 },
    timeframes: { min: 1, max: 3, unit: "semaines" },
    comments: "Prix variable selon l'expérience et la personnalisation demandée",
  },
  ecommerce: {
    name: "Site E-commerce (jusqu'à 100 produits)",
    description: "Boutique en ligne pour vendre des produits ou services",
    prices: { min: 1400, max: 2000 },
    timeframes: { min: 2, max: 4, unit: "mois" },
    comments: "Dépend du nombre de produits, des fonctionnalités de paiement et de la personnalisation",
  },
  corporate: {
    name: "Site Corporate (15-30 pages)",
    description: "Site institutionnel complet pour une entreprise",
    prices: { min: 1600, max: 2500 },
    timeframes: { min: 2, max: 4, unit: "mois" },
    comments: "Design professionnel, optimisation SEO, contenu sur mesure",
  },
  application: {
    name: "Application Web / Site Complexe",
    description: "Application web ou site avec fonctionnalités avancées",
    prices: { min: 1800, max: 3500 },
    timeframes: { min: 3, max: 8, unit: "mois" },
    comments: "Tarification généralement basée sur un TJM de 300€-600€",
  },
  blog: {
    name: "Blog / Site de Contenu",
    description: "Site axé sur la publication de contenu régulier",
    prices: { min: 600, max: 1300 },
    timeframes: { min: 2, max: 6, unit: "semaines" },
    comments: "Mise en place de la structure, personnalisation du design",
  },
}

const additionalServicesData: Record<AdditionalService, AdditionalServiceData> = {
  content: {
    name: "Rédaction de contenu",
    description: "Création de contenu pour votre site",
    prices: { min: 50, max: 100 },
    unit: "/page",
  },
  seo: {
    name: "Référencement (SEO)",
    description: "Optimisation pour les moteurs de recherche",
    prices: { min: 200, max: 1000 },
    unit: "pour l'optimisation initiale",
  },
  training: {
    name: "Formation à l'utilisation",
    description: "Formation pour gérer votre site",
    prices: { min: 100, max: 300 },
  },
}

const CALENDLY_LINK = "https://calendar.app.google/CiBQuqFLNu3vJwSc7"

export default function PricingCalculator() {
  const [websiteType, setWebsiteType] = useState<WebsiteType>("vitrine")
  const [additionalServices, setAdditionalServices] = useState<AdditionalService[]>([])
  const [basePrice, setBasePrice] = useState<PriceRange>({ min: 0, max: 0 })
  const [additionalPrice, setAdditionalPrice] = useState<PriceRange>({ min: 0, max: 0 })
  const [totalPrice, setTotalPrice] = useState<PriceRange>({ min: 0, max: 0 })
  const [timeframe, setTimeframe] = useState<TimeFrame>({ min: 0, max: 0, unit: "semaines" })
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [contact, setContact] = useState({ email: "", phone: "" })

  useEffect(() => {
    const selectedWebsiteData = websiteTypesData[websiteType]
    const newBasePrice = selectedWebsiteData.prices
    setBasePrice(newBasePrice)
    setTimeframe(selectedWebsiteData.timeframes)

    let additionalMin = 0
    let additionalMax = 0

    additionalServices.forEach((service) => {
      const serviceData = additionalServicesData[service]
      additionalMin += serviceData.prices.min
      additionalMax += serviceData.prices.max
    })

    setAdditionalPrice({ min: additionalMin, max: additionalMax })
    setTotalPrice({
      min: newBasePrice.min + additionalMin,
      max: newBasePrice.max + additionalMax,
    })
  }, [websiteType, additionalServices])

  const toggleAdditionalService = (service: AdditionalService) => {
    setAdditionalServices((prev) =>
      prev.includes(service) ? prev.filter((s) => s !== service) : [...prev, service]
    )
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(price)
  }

  // Envoi du devis par API
  const handleSendQuote = async () => {
    setSending(true)
    setSent(false)
    try {
      const response = await fetch("/api/devis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contact,
          estimation: `${totalPrice.min} - ${totalPrice.max}`,
          structure: websiteTypesData[websiteType].name,
          objectifs: additionalServices.map((s) => additionalServicesData[s].name),
          autonomie: "Non précisé",
          contenu: "Non précisé",
          pages: "Non précisé",
          calendlyLink: CALENDLY_LINK,
        }),
      })
      if (response.ok) {
        setSent(true)
      }
    } catch (e) {
      // Optionnel: gestion d'erreur utilisateur
    }
    setSending(false)
  }

  return (
    <div className="grid gap-8 md:grid-cols-2 mb-16">
      {/* Form Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-regularblue font-googletitre text-3xl">Options du Projet</CardTitle>
          <CardDescription className="text-regularblue/80">
            Sélectionnez les options pour obtenir une estimation de prix
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Website Type Selection */}
          <div className="space-y-2">
            <Label htmlFor="website-type" className="text-regularblue font-googletitre text-xl">
              Type de Site Web
            </Label>
            <Select value={websiteType} onValueChange={(value) => setWebsiteType(value as WebsiteType)}>
              <SelectTrigger id="website-type">
                <SelectValue placeholder="Sélectionnez un type de site" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(websiteTypesData).map(([key, data]) => (
                  <SelectItem key={key} value={key}>
                    {data.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-sm text-regularblue/70">{websiteTypesData[websiteType].description}</p>
          </div>

          {/* Additional Services */}
          <div className="space-y-3">
            <Label className="text-regularblue font-googletitre text-lg">Services Additionnels</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {Object.entries(additionalServicesData).map(([key, service]) => (
                <div key={key} className="flex items-start space-x-2">
                  <Checkbox
                    id={`service-${key}`}
                    checked={additionalServices.includes(key as AdditionalService)}
                    onCheckedChange={() => toggleAdditionalService(key as AdditionalService)}
                  />
                  <div className="grid gap-1.5">
                    <Label
                      htmlFor={`service-${key}`}
                      className="text-sm font-medium text-mediumblue leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {service.name}
                    </Label>
                    <p className="text-xs text-regularblue/60">{service.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Coordonnées */}
          <div className="space-y-2 pt-4">
            <Label htmlFor="email" className="text-regularblue font-googletitre text-lg">
              Votre email
            </Label>
            <Input
              id="email"
              type="email"
              required
              className="w-full border rounded px-3 py-2"
              placeholder="Votre adresse email"
              value={contact.email}
              onChange={(e) => setContact((c) => ({ ...c, email: e.target.value }))}
            />
            <Label htmlFor="phone" className="text-regularblue font-googletitre text-lg">
              Téléphone (optionnel)
            </Label>
            <Input
              id="phone"
              type="tel"
              className="w-full border rounded px-3 py-2"
              placeholder="Votre numéro"
              value={contact.phone}
              onChange={(e) => setContact((c) => ({ ...c, phone: e.target.value }))}
            />
          </div>
        </CardContent>
      </Card>

      {/* Results Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-regularblue font-googletitre text-3xl">Estimation de Prix</CardTitle>
          <CardDescription className="text-regularblue/80">Basée sur vos sélections</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Base Price */}
          <div>
            <h3 className="text-xl text-regularblue font-googletitre font-medium mb-2">Prix de Base</h3>
            <p className="text-2xl font-bold text-mediumblue">
              {formatPrice(basePrice.min)} - {formatPrice(basePrice.max)}
            </p>
            <p className="text-sm text-regularblue/80 mt-1">{websiteTypesData[websiteType].comments}</p>
          </div>

          {/* Additional Services Price */}
          {additionalServices.length > 0 && (
            <div>
              <h3 className="text-xl text-regularblue font-googletitre font-medium mb-2">Services Additionnels</h3>
              <p className="text-xl font-semibold text-mediumblue">
                {formatPrice(additionalPrice.min)} - {formatPrice(additionalPrice.max)}
              </p>
              <ul className="mt-2 space-y-1 text-sm">
                {additionalServices.map((service) => {
                  const serviceData = additionalServicesData[service]
                  return (
                    <li key={service} className="flex md:flex-row flex-col justify-between gap-2">
                      <span>{serviceData.name}</span>
                      <span>
                        {formatPrice(serviceData.prices.min)} - {formatPrice(serviceData.prices.max)}
                        {serviceData.unit ? ` ${serviceData.unit}` : ""}
                      </span>
                    </li>
                  )
                })}
              </ul>
            </div>
          )}

          <Separator />

          {/* Total Price */}
          <div>
            <h3 className="text-xl text-regularblue font-googletitre font-medium mb-2">Prix Total Estimé</h3>
            <p className="text-3xl font-bold  text-mediumblue">
              {formatPrice(totalPrice.min)} - {formatPrice(totalPrice.max)}
            </p>
          </div>



          {/* CTA Send Quote */}
          <div className="mt-12 flex flex-col gap-2">
            <Button
              type="button"
              className="gap-1 rounded-full text-white bg-regularblue/90 hover:bg-regularblue/80"
              onClick={handleSendQuote}
              disabled={sending || sent || !contact.email}
            >
              {sending ? "Envoi en cours..." : sent ? "Devis envoyé !" : "Envoyer mon devis"}
            </Button>
            {sent ? (
              <div className="flex flex-col items-center gap-2 animate-fade-in">
                <span className="text-pink-600 font-semibold text-center">
                  🎉 Votre demande de devis a bien été envoyée !
                </span>
                <a
                  href={CALENDLY_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline text-regularblue"
                >
                  Planifier un rendez-vous
                </a>
              </div>
            ) : (
              <>
              <p className="text-sm text-regularblue/70">
                L'envoi de ce devis a échoué. Veuillez réessayer ou contacter-nous directement.
              </p>
              <Button
                className="mt-2 gap-1 rounded-full text-regularblue bg-extralightblue/40 hover:bg-extralightblue/30"
                onClick={() => window.location.href = CALENDLY_LINK}
                disabled={sending || !contact.email}
              >
                Prendre rendez-vous
              </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

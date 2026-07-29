"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, ArrowRight, RotateCcw } from "lucide-react"

interface Question {
  id: string
  question: string
  options: {
    text: string
    value: number
    explanation: string
  }[]
}

interface Result {
  solution: "WordPress Natif" | "WordPress Headless + Next.js"
  score: number
  reasons: string[]
  advantages: string[]
  considerations: string[]
}

const questions: Question[] = [
  {
    id: "site-type",
    question: "Quel type de site web correspond le mieux à votre projet ?",
    options: [
      {
        text: "Site vitrine, institutionnel ou portfolio",
        value: -2,
        explanation:
          "Présentation d'entreprise, services, travaux créatifs - WordPress natif est parfait pour ces besoins",
      },
      {
        text: "Blog, magazine ou site de contenu éditorial",
        value: -1,
        explanation:
          "Publication d'articles, actualités, contenu régulier - WordPress natif excelle dans la gestion de contenu",
      },
      {
        text: "E-commerce ou marketplace",
        value: 1,
        explanation: "Boutique en ligne, vente de produits - le choix dépend du volume et des performances requises",
      },
      {
        text: "Plateforme communautaire, éducative ou de réservation",
        value: 1,
        explanation: "Interactions utilisateurs, formations, événements - flexibilité appréciée selon la complexité",
      },
      {
        text: "Application web complexe (SaaS, dashboard, intranet)",
        value: 3,
        explanation: "Interface riche, workflows métier, intégrations - React/Next.js apporte une valeur significative",
      },
      {
        text: "Site marketing, landing page ou campagne temporaire",
        value: 3,
        explanation: "Performance critique, conversion, SEO - SSG et CDN de Next.js sont optimaux",
      },
    ],
  },
  {
    id: "performance",
    question: "Quelle importance accordez-vous à la performance et aux temps de chargement ?",
    options: [
      {
        text: "Peu importante - temps de chargement standard acceptable",
        value: -1,
        explanation: "WordPress natif avec cache suffit",
      },
      {
        text: "Importante - bons temps de chargement souhaités",
        value: 1,
        explanation: "Les deux solutions peuvent convenir avec optimisation",
      },
      {
        text: "Critique - temps de chargement ultra-rapides requis",
        value: 3,
        explanation: "SSG et CDN de Next.js sont indispensables",
      },
    ],
  },
  {
    id: "traffic",
    question: "Quel volume de trafic attendez-vous ?",
    options: [
      {
        text: "Faible à modéré (< 10k visiteurs/mois)",
        value: -1,
        explanation: "WordPress natif gère facilement ce volume",
      },
      {
        text: "Élevé (10k - 100k visiteurs/mois)",
        value: 1,
        explanation: "Les deux solutions sont viables avec optimisation",
      },
      {
        text: "Très élevé (> 100k visiteurs/mois)",
        value: 3,
        explanation: "La distribution CDN et SSG sont essentielles",
      },
    ],
  },
  {
    id: "frontend-flexibility",
    question: "Avez-vous besoin d'une grande flexibilité pour l'interface utilisateur ?",
    options: [
      {
        text: "Non - thèmes standards suffisants",
        value: -2,
        explanation: "L'écosystème WordPress offre de nombreux thèmes",
      },
      {
        text: "Modérée - quelques personnalisations",
        value: 0,
        explanation: "Les deux solutions permettent des personnalisations",
      },
      {
        text: "Élevée - interface sur-mesure et interactions riches",
        value: 3,
        explanation: "React et Next.js offrent une flexibilité maximale",
      },
    ],
  },
  {
    id: "seo-importance",
    question: "Quelle est l'importance du SEO pour votre projet ?",
    options: [
      {
        text: "Faible - SEO de base suffisant",
        value: -1,
        explanation: "WordPress natif avec plugins SEO convient",
      },
      {
        text: "Importante - bon référencement souhaité",
        value: 1,
        explanation: "Les deux solutions offrent de bonnes capacités SEO",
      },
      {
        text: "Critique - SEO ultra-optimisé requis",
        value: 2,
        explanation: "SSR et Core Web Vitals de Next.js sont avantageux",
      },
    ],
  },
  {
    id: "technical-skills",
    question: "Quel est votre niveau de compétences techniques ?",
    options: [
      {
        text: "Débutant - préférence pour la simplicité",
        value: -3,
        explanation: "WordPress natif est plus accessible",
      },
      {
        text: "Intermédiaire - à l'aise avec les outils web",
        value: 0,
        explanation: "Les deux solutions sont envisageables",
      },
      {
        text: "Avancé - maîtrise React/Node.js",
        value: 2,
        explanation: "Vous pouvez tirer parti de l'approche headless",
      },
    ],
  },
  {
    id: "budget",
    question: "Quel est votre budget pour l'hébergement et la maintenance ?",
    options: [
      {
        text: "Limité - solution économique recherchée",
        value: -2,
        explanation: "WordPress natif a des coûts d'hébergement plus faibles",
      },
      {
        text: "Modéré - équilibre coût/performance",
        value: 0,
        explanation: "Les deux solutions sont viables",
      },
      {
        text: "Élevé - performance prioritaire sur le coût",
        value: 2,
        explanation: "L'investissement headless peut être justifié",
      },
    ],
  },
  {
    id: "integrations",
    question: "Avez-vous besoin d'intégrations avec des services externes modernes ?",
    options: [
      {
        text: "Non - fonctionnalités de base suffisantes",
        value: -1,
        explanation: "L'écosystème WordPress couvre les besoins standards",
      },
      {
        text: "Quelques intégrations simples",
        value: 0,
        explanation: "Les deux approches permettent des intégrations",
      },
      {
        text: "Nombreuses intégrations API modernes",
        value: 2,
        explanation: "Next.js facilite l'intégration d'APIs tierces",
      },
    ],
  },
]

export default function CmsQuiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [selectedAnswer, setSelectedAnswer] = useState<string>("")
  const [showResult, setShowResult] = useState(false)

  const handleAnswer = (value: number) => {
    const newAnswers = { ...answers, [questions[currentQuestion].id]: value }
    setAnswers(newAnswers)

    if (currentQuestion < questions.length - 1) {
      setTimeout(() => {
        setCurrentQuestion(currentQuestion + 1)
        setSelectedAnswer("")
      }, 500)
    } else {
      setTimeout(() => {
        setShowResult(true)
      }, 500)
    }
  }

  const calculateResult = (): Result => {
    const totalScore = Object.values(answers).reduce((sum, score) => sum + score, 0)

    if (totalScore <= -2) {
      return {
        solution: "WordPress Natif",
        score: totalScore,
        reasons: [
          "Installation et configuration rapides",
          "Large écosystème de thèmes et plugins",
          "Coûts d'hébergement réduits",
          "Courbe d'apprentissage faible",
          "Maintenance simplifiée",
        ],
        advantages: [
          "Interface d'administration intuitive",
          "Plugins SEO éprouvés (Yoast, RankMath)",
          "WooCommerce pour l'e-commerce",
          "Communauté très active",
          "Hébergement LAMP standard",
        ],
        considerations: [
          "Performances limitées sous forte charge",
          "Flexibilité front-end restreinte",
          "Dépendance aux plugins tiers",
          "Sécurité à surveiller régulièrement",
        ],
      }
    } else {
      return {
        solution: "WordPress Headless + Next.js",
        score: totalScore,
        reasons: [
          "Performances ultra-rapides avec SSG/SSR",
          "SEO optimisé et Core Web Vitals excellentes",
          "Flexibilité maximale pour l'interface",
          "Scalabilité et distribution CDN",
          "Intégrations modernes facilitées",
        ],
        advantages: [
          "Pages statiques servies via CDN",
          "Composants React réutilisables",
          "API REST/GraphQL pour le contenu",
          "Workflows d'édition découplés",
          "PWA et interactions riches possibles",
        ],
        considerations: [
          "Compétences React/Node.js requises",
          "Deux environnements à maintenir",
          "Coûts d'hébergement plus élevés",
          "Complexité de déploiement accrue",
          "Temps de développement initial plus long",
        ],
      }
    }
  }

  const resetQuiz = () => {
    setCurrentQuestion(0)
    setAnswers({})
    setSelectedAnswer("")
    setShowResult(false)
  }

  const progress = ((currentQuestion + 1) / questions.length) * 100

  if (showResult) {
    const result = calculateResult()

    return (
      <div className="max-w-3xl mx-auto md:p-6 pt-12">
        <Card className="bg-jet border border-dark-gray rounded-none">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center mb-4">
              <CheckCircle className="h-12 w-12 text-accent-secondary" />
            </div>
            <CardTitle className="text-3xl text-foreground font-medium tracking-tight">Recommandation :<br/>{result.solution}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-xl font-medium mb-3 text-foreground">Pourquoi cette solution ?</h3>
              <ul className="space-y-2">
                {result.reasons.map((reason, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-accent-secondary mr-4 mt-0.5 flex-shrink-0" />
                    <span className="text-foreground">{reason}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-3 text-foreground">Avantages clés</h4>
                <ul className="space-y-1 text-sm text-mid-gray">
                  {result.advantages.map((advantage, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-accent-secondary mr-2">•</span>
                      <span className="text-base">{advantage}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-medium mb-3 text-foreground">Points d'attention</h4>
                <ul className="space-y-1 text-sm text-mid-gray">
                  {result.considerations.map((consideration, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-accent-secondary mr-2">•</span>
                      <span className="text-base">{consideration}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="pt-4 border-t border-dark-gray">
              <Button onClick={resetQuiz} className="w-full gap-1 rounded-none text-base font-medium text-mid-gray bg-transparent hover:bg-transparent hover:text-foreground transition-all ease-in-out">
                <RotateCcw className="h-4 w-4 mr-2" />
                Refaire le quiz
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const question = questions[currentQuestion]

  return (
    <div className="max-w-3xl mx-auto md:p-6 pt-12">
      <Card className="bg-jet border border-dark-gray rounded-none">
        <CardHeader>
          <div className="space-y-4">
            <div className="flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.12em] text-mid-gray">
              <span>
                Question {currentQuestion + 1} sur {questions.length}
              </span>
              <span>{Math.round(progress)}% complété</span>
            </div>
            <Progress value={progress} className="w-full h-1 rounded-none bg-dark-gray [&>div]:bg-accent-secondary" />
            <CardTitle className="text-2xl font-medium tracking-tight text-foreground">{question.question}</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <RadioGroup value={selectedAnswer} onValueChange={setSelectedAnswer} className="space-y-4">
            {question.options.map((option, index) => (
              <div
                key={index}
                className={`border rounded-none p-4 cursor-pointer transition-all ${
                  selectedAnswer === index.toString()
                    ? "border-accent-secondary bg-accent-secondary/5"
                    : "border-dark-gray hover:bg-obsidian/40"
                }`}
                onClick={() => setSelectedAnswer(index.toString())}
              >
                <div className="flex items-start space-x-3">
                  <RadioGroupItem value={index.toString()} id={`option-${index}`} className="mt-1" />
                  <div className="flex-1">
                    <Label htmlFor={`option-${index}`} className="cursor-pointer font-normal text-foreground text-base">
                      {option.text}
                    </Label>
                    <p className="text-xs text-mid-gray mt-1">{option.explanation}</p>
                  </div>
                </div>
              </div>
            ))}
          </RadioGroup>

          <div className="mt-6">
            <Button
              onClick={() => handleAnswer(question.options[Number.parseInt(selectedAnswer)].value)}
              disabled={selectedAnswer === ""}
              className="w-full gap-2 rounded-none border border-charcoal bg-vermilion px-5 font-mono text-[12px] font-semibold uppercase tracking-[0.08em] text-white transition-colors hover:bg-vermilion-bright disabled:opacity-50"
            >
              {currentQuestion < questions.length - 1 ? (
                <>
                  Question suivante
                  <ArrowRight className="h-4 w-4 ml-2" />
                </>
              ) : (
                "Voir ma recommandation"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

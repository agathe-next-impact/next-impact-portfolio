"use client";
import { Check } from "lucide-react";
import { useState } from "react";

const results = {
  professionnel: {
    title: "WordPress Professionnel",
    description:
      "Votre PME a besoin d'un site WordPress optimisé, sécurisé et performant pour asseoir sa crédibilité et attirer de nouveaux clients.",
    badge: "💪",
    features: [
      "Design professionnel responsive",
      "Performance garantie < 2 secondes",
      "Sécurité renforcée",
      "SEO technique optimisé",
      "Formation équipe incluse",
      "Architecture évolutive",
    ],
    cta: "/services/wordpress",
    badgeClass: "professionnel",
  },
  avance: {
    title: "WordPress Avancé",
    description:
      "Votre PME en croissance nécessite des fonctionnalités métier sur-mesure et des intégrations pour optimiser vos processus business.",
    badge: "🎯",
    features: [
      "Développements spécifiques métier",
      "Intégrations CRM/ERP/API",
      "Workflows automatisés",
      "Espaces clients/membres",
      "Multi-sites si besoin",
      "Architecture headless-ready",
    ],
    cta: "/services/wordpress",
    badgeClass: "avance",
  },
  headless: {
    title: "WordPress Headless",
    description:
      "Votre PME ambitieuse mérite les technologies enterprise pour un avantage concurrentiel décisif en termes de performance et d'évolutivité.",
    badge: "🚀",
    features: [
      "Architecture découplée moderne",
      "Performance sub-seconde garantie",
      "Évolutivité maximale",
      "Sécurité enterprise",
      "Technologies future-proof",
      "Support premium inclus",
    ],
    cta: "/services/headless",
    badgeClass: "headless",
  },
};

const questions = [
  {
    question: "Quelle est la vitesse de chargement actuelle de votre site ?",
    answers: [
      {
        text: "Plus de 3 secondes",
        desc: "Votre site charge lentement, les visiteurs partent",
        value: "professionnel",
      },
      {
        text: "2 à 3 secondes",
        desc: "Correct mais peut être optimisé",
        value: "professionnel",
      },
      {
        text: "1 à 2 secondes",
        desc: "Bon, conforme aux standards actuels",
        value: "avance",
      },
      {
        text: "Moins de 1 seconde",
        desc: "Excellent, niveau enterprise",
        value: "headless",
      },
    ],
  },
  {
    question: "Quels sont vos principaux besoins actuels ?",
    answers: [
      {
        text: "Site professionnel et sécurisé",
        desc: "Design moderne, performance correcte, référencement",
        value: "professionnel",
      },
      {
        text: "Intégrations métier spécifiques",
        desc: "CRM, ERP, workflows automatisés, fonctionnalités sur-mesure",
        value: "avance",
      },
      {
        text: "Performance maximale et évolutivité",
        desc: "Technologies modernes, scaling international, avantage concurrentiel",
        value: "headless",
      },
      {
        text: "Présence web basique",
        desc: "Site vitrine simple, informations entreprise",
        value: "professionnel",
      },
    ],
  },
  {
    question: "Quel est votre budget pour ce projet ?",
    answers: [
      {
        text: "1 000 - 3 000 €",
        desc: "Budget maîtrisé pour un résultat professionnel",
        value: "professionnel",
      },
      {
        text: "2 000 - 4 000 €",
        desc: "Investissement pour des fonctionnalités avancées",
        value: "avance",
      },
      {
        text: "3 000 - 6 000 €",
        desc: "Budget pour technologies enterprise",
        value: "headless",
      },
      {
        text: "Plus de 5 000 €",
        desc: "Projet stratégique majeur",
        value: "headless",
      },
    ],
  },
  {
    question: "Votre vision pour les 2 prochaines années ?",
    answers: [
      {
        text: "Stabiliser et optimiser l'existant",
        desc: "Croissance régulière, pas de bouleversement prévu",
        value: "professionnel",
      },
      {
        text: "Développer de nouveaux services",
        desc: "Élargissement offre, nouveaux marchés, digitisation processus",
        value: "avance",
      },
      {
        text: "Forte croissance et expansion",
        desc: "Scaling rapide, international, innovation technologique",
        value: "headless",
      },
      {
        text: "Automatiser et optimiser",
        desc: "Efficiency opérationnelle, intégrations systèmes",
        value: "avance",
      },
    ],
  },
  {
    question: "Votre secteur d'activité ?",
    answers: [
      {
        text: "Services / Professions libérales",
        desc: "Cabinet, consultant, artisan, commerce local",
        value: "professionnel",
      },
      {
        text: "Industrie / B2B",
        desc: "Fabrication, distribution, services aux entreprises",
        value: "avance",
      },
      {
        text: "Tech / E-commerce",
        desc: "Startup, SaaS, boutique en ligne, innovation",
        value: "headless",
      },
      {
        text: "Association / Institution",
        desc: "Collectivité, fondation, organisme public",
        value: "avance",
      },
    ],
  },
];

export default function QuizNiveauWordpress() {
  const totalQuestions = questions.length;
  const [current, setCurrent] = useState(0);
  // answersState: { [questionIdx]: answerIdx }
  const [answersState, setAnswersState] = useState<{ [key: number]: number }>({});
  const [showResult, setShowResult] = useState(false);

  const handleSelect = (questionIdx: number, answerIdx: number) => {
    setAnswersState({ ...answersState, [questionIdx]: answerIdx });
  };

  const handlePrev = () => {
    if (current > 0) setCurrent(current - 1);
  };

  const handleNext = () => {
    if (current < totalQuestions - 1) {
      setCurrent(current + 1);
    } else {
      setShowResult(true);
    }
  };

  const calculateResult = () => {
    const scores = { professionnel: 0, avance: 0, headless: 0 };
    Object.entries(answersState).forEach(([qIdx, aIdx]) => {
      const value = questions[Number(qIdx)].answers[aIdx as unknown as number].value;
      scores[value as keyof typeof scores]++;
    });
    return Object.keys(scores).reduce((a, b) =>
      scores[a as keyof typeof scores] > scores[b as keyof typeof scores] ? a : b
    ) as keyof typeof results;
  };

  const resultKey = showResult ? calculateResult() : null;
  const result = resultKey ? results[resultKey] : null;

  return (
    <div className="max-w-2xl mx-auto mt-16 p-6 bg-white rounded-2xl">
      <div className="mb-6 text-center">
        <h1 className="text-3xl font-medium mb-2">Quel WordPress est fait pour moi ?</h1>
        <p className="text-mediumblue text-sm">Déterminez la solution WordPress adaptée à votre entreprise en 2 minutes</p>
      </div>
      {!showResult ? (
        <div>
          <div>
            <div className="text-xl text-regularblue font-medium font-googletitre mt-12 mb-4">{questions[current].question}</div>
            <div>
              {questions[current].answers.map((a, idx) => (
                <div
                  key={`${current}-${idx}`}
                  className={`border rounded-xl p-5 mb-3 cursor-pointer transition-colors ${
                    answersState[current] === idx
                      ? "bg-lightblue/20 border-lightblue/50"
                      : "bg-lightblue/5 border-lightblue/20 hover:border-lightblue/30"
                  }`}
                  onClick={() => handleSelect(current, idx)}
                >
                  <div className="font-medium">{a.text}</div>
                  <div className="text-mediumblue text-sm">{a.desc}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-between items-center mt-10">
            <div className="text-mediumblue text-sm">
              Question {current + 1} sur {totalQuestions}
            </div>
            <div>
              <button
                onClick={handlePrev}
                disabled={current === 0}
                className={`mr-2 px-4 py-2 rounded font-semibold ${
                  current === 0
                    ? "text-sm rounded-full bg-regularblue/10 text-white px-4 py-2 cursor-not-allowed"
                    : "text-sm rounded-full text-white px-4 py-2 bg-regularblue hover:bg-regularblue/90 transition"
                }`}
              >
                Précédent
              </button>
              <button
                onClick={handleNext}
                disabled={answersState[current] == null}
                className={`px-4 py-2 rounded font-semibold ${
                  answersState[current] == null
                    ? "text-sm rounded-full bg-regularblue/10 text-white px-4 py-2 cursor-not-allowed"
                    : "text-sm rounded-full text-white px-4 py-2 bg-regularblue hover:bg-regularblue/90 transition"
                }`}
              >
                {current === totalQuestions - 1
                  ? "Voir mon résultat"
                  : "Suivant"}
              </button>
            </div>
          </div>
        </div>
      ) : (
        result && (
          <div className="text-center">
            <div className="text-5xl mb-4">{result.badge}</div>
            <h2 className="text-3xl text-regularblue font-bold mb-2">{result.title}</h2>
            <p className="text-mediumblue mb-10">{result.description}</p>
            <div className="mb-8">
              <h4 className="font-semibold mb-2">Cette solution comprend :</h4>
              <ul className="text-left max-w-md mx-auto">
                {result.features.map((f, i) => (
                  <li key={i} className="py-2 flex items-center">
                    <span role="img" aria-label="check" className="mr-2"><Check /></span> {f}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex flex-wrap justify-center gap-4 mt-8">
              <a
                href={result.cta}
                className="text-sm font-googletitre rounded-full text-white px-4 py-2 bg-regularblue hover:text-white hover:bg-regularblue/90 transition"
              >
                Découvrir {result.title}
              </a>
              <a
                href="https://calendar.app.google/CiBQuqFLNu3vJwSc7"
                className="text-sm font-googletitre rounded-full bg-white px-4 py-2 text-regularblue border border-regularblue"
              >
                Rendez-vous conseil gratuit
              </a>
            </div>
          </div>
        )
      )}
    </div>
  );
}
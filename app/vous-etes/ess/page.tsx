"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, CheckCircle, Shield, Zap, TrendingUp, Rocket, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

const slides = [
  {
    id: 1,
    badge: "L'Excellence Technique pour la Solidarité",
    title: "Le Numérique Haute Performance au service de l'Impact",
    content: (
      <div className="space-y-6">
        <p className="text-lg text-mediumblue/80 font-googletexte leading-relaxed">
          Dans un contexte de raréfaction des financements, la crédibilité de votre structure passe par votre interface numérique.
        </p>
        <div className="bg-extralightblue/30 p-6 rounded-2xl border-l-4 border-regularblue">
          <p className="text-lg font-googletexte text-mediumblue">
            Nous créons des <span className="text-regularblue font-semibold">Web Apps et plateformes Headless</span> qui allient éthique sociale et standards de performance des géants de la Tech.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 mt-8">
          <Link href="/devis/wordpress">
            <Button size="lg" className="rounded-full text-white bg-regularblue/90 hover:bg-regularblue/80 gap-1">
              Engager ma transformation numérique
            </Button>
          </Link>
          <a href="https://calendly.com/agat-dev/brief-de-creation-de-site-web-wordpress" target="_blank" rel="noopener noreferrer">
            <Button size="lg" variant="outline" className="rounded-full text-regularblue bg-extralightblue/40 hover:bg-extralightblue/30 gap-1">
              Découvrir nos références ESS
            </Button>
          </a>
        </div>
      </div>
    ),
  },
  {
    id: 2,
    badge: "La Technologie comme Rempart à la Crise",
    title: "Le Constat Stratégique",
    content: (
      <div className="space-y-6">
        <div className="bg-coral/10 border-l-4 border-coral p-6 rounded-2xl">
          <h3 className="text-xl font-googletitre font-medium text-coral mb-1">
            Le « petit site associatif » est devenu un risque
          </h3>
        </div>
        <div className="space-y-3 text-lg text-mediumblue font-googletexte leading-relaxed">
          <p>
            Face à la crise des financements, <strong className="text-darkblue">la légitimité ne suffit plus : il faut rassurer</strong>.
          </p>
          <p>
            Un site lent, buggé ou daté est un frein pour les mécènes et les financeurs publics.
          </p>
        </div>
        <div className="bg-extralightblue/20 p-6 rounded-2xl mt-6">
          <h4 className="text-xl font-googletitre font-medium text-regularblue mb-3 flex items-center gap-2">
            <Shield className="w-6 h-6 text-coral" /> La Solution
          </h4>
          <p className="text-lg text-mediumblue font-googletexte leading-relaxed">
            Le passage au <span className="font-semibold text-regularblue">WordPress Headless</span> n&apos;est pas qu&apos;un choix technique,
            <strong className="text-darkblue"> c&apos;est un choix politique</strong>.
          </p>
          <p className="text-mediumblue/80 font-googletexte mt-3">
            C&apos;est offrir à vos partenaires une preuve tangible de votre professionnalisme, de votre transparence et de votre capacité à innover.
          </p>
        </div>
      </div>
    ),
  },
  {
    id: 3,
    badge: "Digitaliser vos Services",
    title: "De la Vitrine à la Web App",
    content: (
      <div className="space-y-6">
        <p className="text-lg text-mediumblue/80 font-googletexte italic mb-4">
          Transformer un site passif en un outil métier actif
        </p>
        <div className="grid gap-4">
          <div className="bg-extralightblue/20 p-5 rounded-2xl border-l-4 border-regularblue hover:scale-[1.02] transition-transform">
            <h4 className="font-googletitre font-medium text-regularblue mb-2 flex items-center gap-2">
              <Zap className="w-5 h-5 text-coral" /> Services aux bénéficiaires
            </h4>
            <p className="text-mediumblue font-googletexte">Création d&apos;espaces membres, de plateformes de formation ou de ressources partagées</p>
          </div>
          <div className="bg-extralightblue/20 p-5 rounded-2xl border-l-4 border-lightblue hover:scale-[1.02] transition-transform">
            <h4 className="font-googletitre font-medium text-regularblue mb-2 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-coral" /> Outils de Plaidoyer
            </h4>
            <p className="text-mediumblue font-googletexte">Visualisation de données d&apos;impact en temps réel, cartes interactives, simulateurs</p>
          </div>
          <div className="bg-extralightblue/20 p-5 rounded-2xl border-l-4 border-lightblue hover:scale-[1.02] transition-transform">
            <h4 className="font-googletitre font-medium text-regularblue mb-2 flex items-center gap-2">
              <Rocket className="w-5 h-5 text-coral" /> Expérience « App »
            </h4>
            <p className="text-mediumblue font-googletexte">Fluidité totale (Next.js), mode hors-ligne pour le terrain, et sécurité absolue des données sensibles</p>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 4,
    badge: "8 ans au service de l'Engagement",
    title: "L'Expertise Agat-Dev",
    content: (
      <div className="space-y-6">
        <div className="bg-extralightblue/20 p-6 rounded-2xl">
          <h3 className="text-xl font-googletitre font-medium text-regularblue mb-3 flex items-center gap-2">
            <Award className="w-6 h-6 text-coral" /> Le Profil
          </h3>
          <p className="text-lg text-mediumblue font-googletexte">
            <strong className="text-darkblue">Agathe</strong>, fondatrice de Next Impact Digital<br />
            Experte WordPress Headless &amp; React
          </p>
        </div>
        <div className="bg-extralightblue/20 p-6 rounded-2xl">
          <h3 className="text-xl font-googletitre font-medium text-regularblue mb-3">La Méthode</h3>
          <p className="text-lg text-mediumblue font-googletexte">
            Une approche <strong className="text-darkblue">« Pédagogie &amp; Code »</strong>. Pas de jargon inutile, mais une architecture robuste conçue pour durer <span className="text-regularblue font-semibold">10 ans, pas 2 ans</span>.
          </p>
        </div>
        <div className="bg-extralightblue/20 p-6 rounded-2xl">
          <h3 className="text-xl font-googletitre font-medium text-regularblue mb-3">Valeurs</h3>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex items-start gap-3 flex-1">
              <CheckCircle className="h-5 w-5 text-coral mt-1 shrink-0" />
              <p className="text-mediumblue font-googletexte"><strong className="text-darkblue">Éco-conception</strong><br />Sobriété énergétique native</p>
            </div>
            <div className="flex items-start gap-3 flex-1">
              <CheckCircle className="h-5 w-5 text-coral mt-1 shrink-0" />
              <p className="text-mediumblue font-googletexte"><strong className="text-darkblue">Accessibilité</strong><br />RGAA native</p>
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 5,
    badge: "Pourquoi le Headless sauve votre budget ?",
    title: "Comparatif",
    content: (
      <div className="space-y-4">
        <div className="overflow-x-auto rounded-2xl border border-extralightblue">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-mediumblue text-white">
                <th className="p-4 text-left font-googletitre font-medium">Enjeu</th>
                <th className="p-4 text-left font-googletitre font-medium">WordPress Classique</th>
                <th className="p-4 text-left font-googletitre font-medium">Web App Headless</th>
              </tr>
            </thead>
            <tbody className="font-googletexte text-mediumblue">
              <tr className="border-b border-extralightblue/50 hover:bg-extralightblue/10 transition-colors">
                <td className="p-4 font-semibold text-regularblue">Crédibilité</td>
                <td className="p-4 text-coral">Image « bricolée », lenteurs</td>
                <td className="p-4 text-regularblue">Image innovante, fluidité « Premium »</td>
              </tr>
              <tr className="border-b border-extralightblue/50 hover:bg-extralightblue/10 transition-colors">
                <td className="p-4 font-semibold text-regularblue">Évolutivité</td>
                <td className="p-4 text-coral">Limité par les plugins</td>
                <td className="p-4 text-regularblue">Possibilités infinies (Web App métier)</td>
              </tr>
              <tr className="border-b border-extralightblue/50 hover:bg-extralightblue/10 transition-colors">
                <td className="p-4 font-semibold text-regularblue">Coût Long Terme</td>
                <td className="p-4 text-coral">Maintenance lourde et refontes fréquentes</td>
                <td className="p-4 text-regularblue">Architecture pérenne et ultra-sécurisée</td>
              </tr>
              <tr className="hover:bg-extralightblue/10 transition-colors">
                <td className="p-4 font-semibold text-regularblue">Impact Éco</td>
                <td className="p-4 text-coral">Consommation serveur élevée</td>
                <td className="p-4 text-regularblue">Sobriété numérique (Statique/Edge)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    ),
  },
  {
    id: 6,
    badge: "Preuves d'Impact Mesurables",
    title: "Références & Impact",
    content: (
      <div className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-mediumblue p-6 rounded-2xl text-white shadow-lg hover:scale-105 transition-transform border border-white/10">
            <h4 className="font-googletitre font-medium text-xl mb-2">L&apos;Hermitage</h4>
            <p className="text-white/80 font-googletexte">Plateforme culturelle modernisée</p>
          </div>
          <div className="bg-regularblue p-6 rounded-2xl text-white shadow-lg hover:scale-105 transition-transform border border-white/10">
            <h4 className="font-googletitre font-medium text-xl mb-2">Médiatico</h4>
            <p className="text-white/80 font-googletexte">Application métier performante</p>
          </div>
        </div>
        <div className="bg-extralightblue/20 p-8 rounded-2xl border-2 border-regularblue/30 text-center">
          <div className="text-5xl font-googletitre font-bold text-regularblue mb-3">÷3</div>
          <p className="text-xl text-darkblue font-googletitre font-medium">
            Division par 3 du temps de chargement
          </p>
          <p className="text-mediumblue/80 font-googletexte mt-2">
            pour maximiser les dons et l&apos;engagement
          </p>
        </div>
      </div>
    ),
  },
  {
    id: 7,
    badge: "Lead Magnet",
    title: "Passage à l'Action",
    content: (
      <div className="space-y-6">
        <div className="bg-coral/10 p-6 rounded-2xl border-l-4 border-coral">
          <h3 className="text-xl font-googletitre font-medium text-darkblue">
            Votre outil numérique est-il un atout ou un frein pour vos prochains financements ?
          </h3>
        </div>
        <div className="bg-white p-8 rounded-2xl shadow-lg border border-extralightblue">
          <h4 className="text-xl font-googletitre font-medium text-regularblue mb-4">
            L&apos;Audit de Légitimité Numérique
          </h4>
          <p className="text-mediumblue font-googletexte mb-6">
            Analyse gratuite de vos performances, de votre accessibilité et de votre potentiel applicatif.
          </p>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Nom"
              className="w-full p-3 border border-extralightblue rounded-2xl text-mediumblue font-googletexte focus:border-regularblue focus:outline-none transition-colors"
            />
            <input
              type="text"
              placeholder="Structure"
              className="w-full p-3 border border-extralightblue rounded-2xl text-mediumblue font-googletexte focus:border-regularblue focus:outline-none transition-colors"
            />
            <input
              type="url"
              placeholder="URL du site"
              className="w-full p-3 border border-extralightblue rounded-2xl text-mediumblue font-googletexte focus:border-regularblue focus:outline-none transition-colors"
            />
            <Button className="w-full rounded-full bg-coral hover:bg-coral/80 text-white font-googletitre font-semibold text-lg py-3">
              Demander mon audit gratuit
            </Button>
          </div>
        </div>
      </div>
    ),
  },
];

export default function PresentationESS() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}

      {/* Progress Bar */}
      <div className="bg-extralightblue/30 h-1.5">
        <motion.div
          className="bg-regularblue h-1.5"
          initial={false}
          animate={{ width: `${((currentSlide + 1) / slides.length) * 100}%` }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
        />
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 md:px-6 py-6 flex-1 flex flex-col min-h-0 w-full">
        <div className="bg-white rounded-2xl shadow-lg border border-extralightblue/50 p-8 md:p-12 flex-1 relative">
          <div className="grid [&>*]:col-start-1 [&>*]:row-start-1">
            {slides.map((s, index) => {
              const isActive = index === currentSlide;
              return (
                <motion.div
                  key={s.id}
                  animate={{ opacity: isActive ? 1 : 0 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                  className={!isActive ? "pointer-events-none" : ""}
                  drag={isActive ? "x" : false}
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.3}
                  onDragEnd={(_e, { offset, velocity }) => {
                    const swipe = Math.abs(offset.x) * velocity.x;
                    if (swipe < -5000 || offset.x < -80) {
                      if (currentSlide < slides.length - 1) nextSlide();
                    } else if (swipe > 5000 || offset.x > 80) {
                      if (currentSlide > 0) prevSlide();
                    }
                  }}
                  style={{ touchAction: "pan-y" }}
                >
                  <div className="mb-8">
                    <Badge variant="outline" className="mb-4 border-regularblue/20 text-regularblue">
                      {s.badge}
                    </Badge>
                    <h2 className="text-3xl md:text-4xl font-googletitre font-medium text-darkblue mb-4">
                      {s.title}
                    </h2>
                    <div className="h-1 w-24 bg-regularblue rounded-full" />
                  </div>
                  {s.content}
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Navigation - toujours visible */}
        <div className="shrink-0 sticky bottom-0 bg-white/90 backdrop-blur-sm pt-4 pb-2">
          <div className="flex items-center justify-between">
            <Button
              onClick={prevSlide}
              disabled={currentSlide === 0}
              variant="outline"
              className="gap-2 rounded-full bg-white hover:bg-extralightblue/30 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
              Précédent
            </Button>

            <div className="flex gap-2">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    index === currentSlide
                      ? "bg-regularblue w-8"
                      : "bg-extralightblue hover:bg-lightblue w-2.5"
                  }`}
                />
              ))}
            </div>

            <Button
              onClick={nextSlide}
              disabled={currentSlide === slides.length - 1}
              className="gap-2 rounded-full text-white bg-regularblue/90 hover:bg-regularblue/80 disabled:opacity-40 disabled:cursor-not-allowed z-50"
            >
              Suivant
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>

          {/* Slide Counter */}
          <div className="text-center mt-2 text-mediumblue/60 font-googletexte text-sm">
            {currentSlide + 1} / {slides.length}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-mediumblue text-white py-4 border-t border-white/10">
        <div className="max-w-5xl mx-auto px-6 text-center font-googletexte">
          <p className="mb-1 font-medium">Codeur engagé pour une ESS forte</p>
          <p className="text-sm text-white/60">© Next Impact Digital - Agathe</p>
        </div>
      </div>
    </div>
  );
}

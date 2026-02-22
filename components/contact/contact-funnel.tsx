"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { FunnelProgress } from "./funnel-progress";
import { FunnelOption } from "./funnel-option";
import { StepResult, type ProfileType, type PainPoint, type BudgetRange, type SiteType } from "./step-result";
import { ContactModal } from "./contact-modal";
import { ContactDirectInfo } from "./contact-direct-info";

type Step = 1 | 2 | 3 | 4 | 5;

const TOTAL_STEPS = 5;

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -300 : 300,
    opacity: 0,
  }),
};

export function ContactFunnel() {
  const [step, setStep] = useState<Step>(1);
  const [direction, setDirection] = useState(1);
  const [profile, setProfile] = useState<ProfileType | null>(null);
  const [painPoint, setPainPoint] = useState<PainPoint | null>(null);
  const [budget, setBudget] = useState<BudgetRange | null>(null);
  const [siteType, setSiteType] = useState<SiteType | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const goToStep = useCallback((newStep: Step, dir: number = 1) => {
    setDirection(dir);
    setStep(newStep);
  }, []);

  const handleBack = useCallback(() => {
    if (step > 1) {
      goToStep((step - 1) as Step, -1);
    }
  }, [step, goToStep]);

  const handleProfileSelect = useCallback(
    (value: ProfileType) => {
      setProfile(value);
      setTimeout(() => goToStep(2), 250);
    },
    [goToStep]
  );

  const handlePainPointSelect = useCallback(
    (value: PainPoint) => {
      setPainPoint(value);
      setTimeout(() => goToStep(3), 250);
    },
    [goToStep]
  );

  const handleBudgetSelect = useCallback(
    (value: BudgetRange) => {
      setBudget(value);
      setTimeout(() => goToStep(4), 250);
    },
    [goToStep]
  );

  const handleSiteTypeSelect = useCallback(
    (value: SiteType) => {
      setSiteType(value);
      setTimeout(() => goToStep(5), 250);
    },
    [goToStep]
  );

  const handleCtaClick = useCallback(() => {
    setModalOpen(true);
  }, []);

  return (
    <section className="container mx-auto px-4">
      <div className="max-w-5xl mx-auto flex flex-col items-center gap-6 md:gap-10 bg-darkblue/40 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-12">
        {/* Progress bar */}
        <FunnelProgress currentStep={step} totalSteps={TOTAL_STEPS} />

        {/* Back button */}
        <AnimatePresence>
          {step > 1 && (
            <motion.button
              type="button"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              onClick={handleBack}
              className="self-start flex items-center gap-1.5 text-sm font-googletexte text-white/60 hover:text-white/80 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              Retour
            </motion.button>
          )}
        </AnimatePresence>

        {/* Steps container */}
        <div className="w-full relative min-h-[380px] sm:min-h-[420px] flex items-start justify-center">
          <AnimatePresence mode="wait" custom={direction}>
            {step === 1 && (
              <motion.div
                key="step-1"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.35, ease: "easeInOut" }}
                className="w-full space-y-8"
              >
                <div className="text-center space-y-3">
                  <p className="text-white/60 font-googletexte uppercase tracking-widest text-sm">
                    Votre profil
                  </p>
                  <h2 className="text-3xl md:text-4xl font-googletitre font-medium text-white">
                    Parlons de votre structure
                  </h2>
                  <p className="text-white/70 font-googletexte leading-relaxed max-w-lg mx-auto">
                    Pour vous orienter vers la bonne approche, parlez-moi de votre structure :
                  </p>
                </div>

                <div className="space-y-4 max-w-lg mx-auto">
                  <FunnelOption
                    icon="&#128296;"
                    label="Association / Acteur de l'ESS"
                    description="Budget limité"
                    selected={profile === "association"}
                    onClick={() => handleProfileSelect("association")}
                  />
                  <FunnelOption
                    icon="&#128188;"
                    label="PME / ETI / Institution"
                    description="Enjeux de performance métier"
                    selected={profile === "pme"}
                    onClick={() => handleProfileSelect("pme")}
                  />
                  <FunnelOption
                    icon="&#127959;"
                    label="Grand Compte / Agence"
                    description="Besoin technique spécifique"
                    selected={profile === "grand-compte"}
                    onClick={() => handleProfileSelect("grand-compte")}
                  />
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step-2"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.35, ease: "easeInOut" }}
                className="w-full space-y-8"
              >
                <div className="text-center space-y-3">
                  <p className="text-white/60 font-googletexte uppercase tracking-widest text-sm">
                    Vos enjeux
                  </p>
                  <h2 className="text-3xl md:text-4xl font-googletitre font-medium text-white">
                    Le défi de votre site actuel
                  </h2>
                  <p className="text-white/70 font-googletexte leading-relaxed max-w-lg mx-auto">
                    Quel est le défi majeur de votre site actuel ?
                  </p>
                </div>

                <div className="space-y-4 max-w-lg mx-auto">
                  <FunnelOption
                    icon="&#9889;"
                    label="Des lenteurs"
                    description="Perte de trafic ou d'acheteurs"
                    selected={painPoint === "lenteur"}
                    onClick={() => handlePainPointSelect("lenteur")}
                  />
                  <FunnelOption
                    icon="&#128274;"
                    label="Une sécurité défaillante"
                    description="Peur du piratage, maintenance lourde"
                    selected={painPoint === "securite"}
                    onClick={() => handlePainPointSelect("securite")}
                  />
                  <FunnelOption
                    icon="&#127912;"
                    label="Une refonte visuelle complète"
                    description="Besoin de modernité"
                    selected={painPoint === "refonte"}
                    onClick={() => handlePainPointSelect("refonte")}
                  />
                  <FunnelOption
                    icon="&#127793;"
                    label="Empreinte carbone trop forte"
                    description="Besoin d'éco-conception / Sobriété numérique"
                    selected={painPoint === "carbone"}
                    onClick={() => handlePainPointSelect("carbone")}
                  />
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step-3"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.35, ease: "easeInOut" }}
                className="w-full space-y-8"
              >
                <div className="text-center space-y-3">
                  <p className="text-white/60 font-googletexte uppercase tracking-widest text-sm">
                    Votre budget
                  </p>
                  <h2 className="text-3xl md:text-4xl font-googletitre font-medium text-white">
                    Budget de transformation
                  </h2>
                  <p className="text-white/70 font-googletexte leading-relaxed max-w-lg mx-auto">
                    Quel est le budget alloué à cette transformation ?
                  </p>
                </div>

                <div className="space-y-4 max-w-lg mx-auto">
                  <FunnelOption
                    icon="&#128176;"
                    label="Moins de 3 000 €"
                    selected={budget === "less-3000"}
                    onClick={() => handleBudgetSelect("less-3000")}
                  />
                  <FunnelOption
                    icon="&#128176;"
                    label="Entre 3 000 € et 5 000 €"
                    selected={budget === "3000-5000"}
                    onClick={() => handleBudgetSelect("3000-5000")}
                  />
                  <FunnelOption
                    icon="&#128176;"
                    label="Plus de 5 000 €"
                    selected={budget === "more-5000"}
                    onClick={() => handleBudgetSelect("more-5000")}
                  />
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div
                key="step-4"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.35, ease: "easeInOut" }}
                className="w-full space-y-8"
              >
                <div className="text-center space-y-3">
                  <p className="text-white/60 font-googletexte uppercase tracking-widest text-sm">
                    Votre projet
                  </p>
                  <h2 className="text-3xl md:text-4xl font-googletitre font-medium text-white">
                    Quel type de site recherchez-vous ?
                  </h2>
                  <p className="text-white/70 font-googletexte leading-relaxed max-w-lg mx-auto">
                    Sélectionnez le format qui correspond le mieux à votre besoin :
                  </p>
                </div>

                <div className="space-y-4 max-w-lg mx-auto">
                  <FunnelOption
                    icon="&#127760;"
                    label="Site vitrine"
                    description="Présenter votre activité et vos services"
                    selected={siteType === "vitrine"}
                    onClick={() => handleSiteTypeSelect("vitrine")}
                  />
                  <FunnelOption
                    icon="&#127963;"
                    label="Site institutionnel"
                    description="Communication corporate, multi-pages structuré"
                    selected={siteType === "institutionnel"}
                    onClick={() => handleSiteTypeSelect("institutionnel")}
                  />
                  <FunnelOption
                    icon="&#128240;"
                    label="Blog / Média"
                    description="Publication de contenu, articles, actualités"
                    selected={siteType === "blog"}
                    onClick={() => handleSiteTypeSelect("blog")}
                  />
                  <FunnelOption
                    icon="&#128187;"
                    label="Application web"
                    description="Plateforme interactive, espace membres, dashboard"
                    selected={siteType === "application"}
                    onClick={() => handleSiteTypeSelect("application")}
                  />
                  <FunnelOption
                    icon="&#127919;"
                    label="Landing page"
                    description="Page unique de conversion, campagne marketing"
                    selected={siteType === "landing"}
                    onClick={() => handleSiteTypeSelect("landing")}
                  />
                </div>
              </motion.div>
            )}

            {step === 5 && profile && painPoint && budget && siteType && (
              <motion.div
                key="step-5"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.35, ease: "easeInOut" }}
                className="w-full"
              >
                <StepResult
                  profile={profile}
                  painPoint={painPoint}
                  budget={budget}
                  siteType={siteType}
                  onCtaClick={handleCtaClick}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Direct contact info */}
        <ContactDirectInfo />

        {/* Contact Modal */}
        {profile && painPoint && budget && siteType && (
          <ContactModal
            open={modalOpen}
            onClose={() => setModalOpen(false)}
            funnelData={{ profile, painPoint, budget, siteType }}
          />
        )}
      </div>
    </section>
  );
}

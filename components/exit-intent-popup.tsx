"use client";

import { useEffect, useState, useCallback } from "react";
import { Mail, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import Image from "next/image";

interface ExitIntentPopupProps {
  title?: string;
  description?: string;
  buttonText?: string;
  sensitivity?: number;
  showOnce?: boolean;
}

export function ExitIntentPopup({
  title = "Recevez notre livre blanc",
  description = "Tout savoir sur WordPress Headless gratuitement. Pour quels types de projets est-il adapté et quels en sont les avantages ?",
  buttonText = "Recevoir le livre blanc",
  sensitivity = 20,
  showOnce = true,
}: ExitIntentPopupProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [hasShown, setHasShown] = useState(false);
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    phone: "",
    accepteConditions: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      accepteConditions: checked,
    }));
  };

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      // Detect exit intent when mouse moves to top of viewport
      if (e.clientY <= sensitivity && e.movementY < 0) {
        if (showOnce && hasShown) return;

        const alreadyShown = sessionStorage.getItem("exitPopupShown");
        if (showOnce && alreadyShown) return;

        setIsOpen(true);
        setHasShown(true);
        if (showOnce) {
          sessionStorage.setItem("exitPopupShown", "true");
        }
      }
    },
    [sensitivity, showOnce, hasShown],
  );

  useEffect(() => {
    document.addEventListener("mousemove", handleMouseMove);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, [handleMouseMove]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email || !emailRegex.test(formData.email)) {
      setSubmitStatus("error");
      setErrorMessage("Veuillez entrer une adresse email valide.");
      return;
    }

    if (!formData.accepteConditions) {
      setSubmitStatus("error");
      setErrorMessage(
        "Vous devez accepter de donner vos informations personnelles pour continuer.",
      );
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus("idle");
    setErrorMessage("");

    try {
      const response = await fetch("/api/livre-blanc", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Erreur lors de l'enregistrement");
      }

      setSubmitStatus("success");
      setFormData({
        nom: "",
        prenom: "",
        email: "",
        phone: "",
        accepteConditions: false,
      });

      // Close popup after 3 seconds on success
      setTimeout(() => {
        setIsOpen(false);
      }, 3000);
    } catch (error) {
      console.error("Error submitting form:", error);
      setSubmitStatus("error");
      setErrorMessage(
        error instanceof Error ? error.message : "Une erreur est survenue",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="flex flex-col md:flex-row sm:max-w-md border-none overflow-hidden p-0">
        <div className="p-6 bg-mediumblue backdrop-blur-lg">
          <div className="mx-auto flex items-center justify-center rounded-full">
            <Image
              alt="Logo Next Impact"
              src="/img/logo-blanc-carre.png"
              width={100}
              height={100}
              fetchPriority="high"
            />
          </div>
        </div>
        <div className="p-6 pt-4 bg-mediumblue/80 backdrop-blur-lg">
          <DialogHeader className="space-y-3 mb-6">
            <DialogTitle className="text-center text-2xl uppercase font-googletitre text-white">
              {title}
            </DialogTitle>
            <DialogDescription className="text-center text-white/90 leading-relaxed">
              {description}
            </DialogDescription>
          </DialogHeader>

          {submitStatus === "success" ? (
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 rounded-lg bg-mediumblue/80">
                <CheckCircle2 className="h-6 w-6 text-white/80 flex-shrink-0" />
                <p className="text-sm text-white/80 font-medium">
                  Enregistrement réussi ! Vous recevrez bientôt notre livre blanc.
                </p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="prenom" className="text-sm text-white/80">
                    Prénom *
                  </Label>
                  <Input
                    id="prenom"
                    name="prenom"
                    type="text"
                    required
                    value={formData.prenom}
                    onChange={handleChange}
                    placeholder="Prénom"
                    className="h-10 bg-extralightblue"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nom" className="text-sm text-white/80">
                    Nom *
                  </Label>
                  <Input
                    id="nom"
                    name="nom"
                    type="text"
                    required
                    value={formData.nom}
                    onChange={handleChange}
                    placeholder="Nom"
                    className="h-10 bg-extralightblue placeholder:text-mediumblue"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm text-white/80">
                  Email *
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="votre.email@exemple.com"
                  className="h-10 bg-extralightblue"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="phone"
                  className="text-sm text-white/80"
                >
                  Téléphone (optionnel)
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone || ""}
                  onChange={handleChange}
                  placeholder="Téléphone (optionnel)"
                  className="h-10 bg-extralightblue"
                />
              </div>

              <div className="flex items-start space-x-2">
                <Checkbox
                  id="accepteConditions"
                  checked={formData.accepteConditions}
                  onCheckedChange={handleCheckboxChange}
                  className="mt-1 bg-white/90"
                />
                <Label
                  htmlFor="accepteConditions"
                  className="text-xs leading-relaxed cursor-pointer font-normal text-white/70"
                >
                  J'accepte de donner mes informations personnelles pour
                  recevoir le livre blanc de Next Impact *
                </Label>
              </div>

              {submitStatus === "error" && (
                <div className="flex items-center gap-2 p-3 bg-red-50 border-2 border-red-500 rounded-lg">
                  <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                  <p className="text-xs text-red-700 font-medium">
                    {errorMessage}
                  </p>
                </div>
              )}

              <div className="space-y-2 pt-2 flex flex-col items-center">
                <Button
                  type="submit"
                  className="w-max rounded-full font-medium gap-2 bg-lightyellow hover:bg-lightyellow/90 text-darkblue"
                  size="lg"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      Enregistrement en cours...
                    </>
                  ) : (
                    <>
                      <Mail className="size-5" />
                      {buttonText}
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setIsOpen(false)}
                  className="w-full text-muted-foreground text-sm bg-transparent hover:bg-transparent"
                  disabled={isSubmitting}
                >
                  Non merci, je continue ma visite
                </Button>
              </div>
            </form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

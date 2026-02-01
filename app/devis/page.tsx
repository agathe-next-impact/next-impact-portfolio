"use client";

import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';

export default function EstimationForm() {
  const [formData, setFormData] = useState({
    structure: '',
    objectifs: [],
    autonomie: '',
    contenu: '',
    pages: 5,
    contact: {
      email: '',
      phone: '',
    },
    estimation: null,
    sent: false,
  });
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const estimation = estimatePrice(formData);
    setFormData(prev => ({ ...prev, estimation }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    formData.structure,
    formData.objectifs,
    formData.autonomie,
    formData.contenu,
    formData.pages,
  ]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value, sent: false }));
  };

  const handleContactChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      contact: { ...prev.contact, [field]: value },
      sent: false,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    setError(null);

    const response = await fetch('/api/devis', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...formData,
        calendlyLink: 'https://calendly.com/next-impact-digital/30min',
      }),
    });

    if (response.ok) {
      setFormData(prev => ({ ...prev, sent: true }));
    } else {
      setError("Une erreur est survenue lors de l'envoi de l'e-mail. Veuillez réessayer.");
    }
    setSending(false);
  };

  function estimatePrice(data) {
    let price = 0;

    // Structure
    switch (data.structure) {
      case 'association':
        price += 0;
        break;
      case 'entreprise':
        price += 100;
        break;
      case 'independant':
        price += 50;
        break;
      case 'autre':
        price += 0;
        break;
      default:
        break;
    }

    // Objectifs
    if (data.objectifs.includes('vitrine')) price += 0;
    if (data.objectifs.includes('contact')) price += 50;
    if (data.objectifs.includes('blog')) price += 150;
    if (data.objectifs.includes('portfolio')) price += 100;
    if (data.objectifs.includes('dons')) price += 200;

    // Autonomie
    switch (data.autonomie) {
      case 'oui':
        price += 100;
        break;
      case 'non':
        price += 0;
        break;
      case 'indifférent':
        price += 0;
        break;
      default:
        break;
    }

    // Contenu
    switch (data.contenu) {
      case 'complet':
        price += 0;
        break;
      case 'partiel':
        price += 150;
        break;
      case 'aucun':
        price += 300;
        break;
      case 'inconnu':
        price += 0;
        break;
      default:
        break;
    }

    // Pages (base 5 pages incluses)
    const pageCount = Number(data.pages) || 5;
    price += 900; // Base
    if (pageCount > 5) price += (pageCount - 5) * 50;

    return price;
  }

  return (
    <main>
      <section className="w-full mb-24 pt-4 md:pt-8 lg:pt-12 xl:pt-12">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col justify-center space-y-4 py-8">
            <h1 className="font-medium text-center">
              Simuler un devis WordPress
            </h1>
            <p className="text-regularblue/70 text-center max-w-3xl mx-auto">
              Obtenez une estimation personnalisée pour la création de votre site WordPress selon vos besoins et vos contenus.
            </p>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Colonne 1 : Questions */}
              <div className="space-y-6">
                <div className='space-y-2'>
                  <label className="text-xl font-googletitre text-regularblue">1. Quel est votre type de structure ?</label>
                    <Select
                    value={formData.structure}
                    onValueChange={(value) => handleChange('structure', value)}
                    >
                      <SelectTrigger
                        className="w-full p-4 rounded-full ring-0 active:ring-0 active:border-0 focus:ring-0 focus:border-0 border border-extralghtblue/30"
                        required
                      >
                        <SelectValue placeholder="Sélectionnez" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="association">Association</SelectItem>
                        <SelectItem value="entreprise">Entreprise (TPE/PME)</SelectItem>
                        <SelectItem value="independant">Indépendant / Artisan</SelectItem>
                        <SelectItem value="autre">Autre</SelectItem>
                      </SelectContent>
                    </Select>
                </div>

                <div className='space-y-2 mb-4'>
                  <label className="text-xl font-googletitre text-regularblue">2. Objectif principal du site</label>
                  <div className="space-y-1">
                    {[
                      { label: 'Présenter mon activité', value: 'vitrine' },
                      { label: 'Être contacté facilement', value: 'contact' },
                      { label: 'Publier des actualités', value: 'blog' },
                      { label: 'Valoriser des projets / réalisations', value: 'portfolio' },
                      { label: 'Collecter des dons ou adhésions', value: 'dons' },
                    ].map(opt => (
                      <div key={opt.value}>
                        <label>
                          <Checkbox
                            checked={formData.objectifs.includes(opt.value)}
                            onCheckedChange={(checked) => {
                              const newList = checked
                                ? [...formData.objectifs, opt.value]
                                : formData.objectifs.filter(val => val !== opt.value);
                              handleChange('objectifs', newList);
                            }}
                            className="mr-2"
                          />

                          {opt.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className='space-y-2 mb-4'>
                  <label className="text-xl font-googletitre text-regularblue">3. Souhaitez-vous pouvoir modifier le site vous-même ?</label>
                  <RadioGroup
                    value={formData.autonomie}
                    onValueChange={(value) => handleChange('autonomie', value)}
                    className="space-y-1"
                  >
                    {[
                      { label: 'Oui', value: 'oui' },
                      { label: 'Non', value: 'non' },
                      { label: 'Peu importe', value: 'indifférent' }
                    ].map(opt => (
                      <div key={opt.value} className="flex items-center space-x-2">
                        <RadioGroupItem value={opt.value} id={`autonomie-${opt.value}`} />
                        <label htmlFor={`autonomie-${opt.value}`} className="cursor-pointer">{opt.label}</label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                <div className='space-y-2 mb-4'>
                  <label className="text-xl font-googletitre text-regularblue">4. Quel est l'état de votre contenu ?</label>
                  <RadioGroup
                    value={formData.contenu}
                    onValueChange={(value) => handleChange('contenu', value)}
                    className="space-y-1"
                  >
                    {[
                      {
                        label: 'Tout est prêt (textes + images)',
                        value: 'complet'
                      },
                      {
                        label: 'Une partie est prête',
                        value: 'partiel'
                      },
                      {
                        label: 'Tout est à créer',
                        value: 'aucun'
                      },
                      {
                        label: 'Je ne sais pas encore',
                        value: 'inconnu'
                      }
                    ].map(opt => (
                      <div key={opt.value} className="flex items-center space-x-2">
                        <RadioGroupItem value={opt.value} id={`contenu-${opt.value}`} />
                        <label htmlFor={`contenu-${opt.value}`} className="cursor-pointer">{opt.label}</label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                <div className='space-y-2 mb-4'>
                  <label className="text-xl font-googletitre text-regularblue">5. Combien de pages souhaitez-vous pour votre site&nbsp;?</label>
                  <Input                    
                    type="number"
                    min={1}
                    max={20}
                    value={formData.pages}
                    onChange={e => handleChange('pages', Number(e.target.value))}
                    className="w-full border border-lightblue/30 p-2 rounded-full"
                    required
                  />
                  <p className="text-xs text-lightblue mt-1">5 pages incluses dans le forfait de base. +50&nbsp;€ par page supplémentaire.</p>
                </div>
              </div>

              {/* Colonne 2 : Estimation et coordonnées */}
              <div className="space-y-6">
                {formData.estimation && (
                  <div className="p-4 bg-pink-50 border border-pink-300 rounded-2xl">
                    <p className="font-semibold">
                      💡 Estimation de votre projet : à partir de {formData.estimation} € TTC
                    </p>
                    {!formData.sent && (
                      <p className="text-sm mt-2 text-pink-700">
                        Cette estimation est indicative et s’ajuste selon vos choix ci-contre.
                      </p>
                    )}
                  </div>
                )}

                {(formData.structure || formData.objectifs.length > 0 || formData.contenu || formData.pages > 0) && (
                  <div className="p-4 bg-white rounded-2xl text-sm">
                    <p className="font-semibold mb-2">Détail de l'estimation :</p>
                    <ul className="list-disc ml-6 space-y-1">
                      <li>Base site WordPress (5 pages) : <span className="font-semibold">900 €</span></li>
                      {formData.structure === 'entreprise' && (
                        <li>Supplément entreprise : <span className="font-semibold">+100 €</span></li>
                      )}
                      {formData.structure === 'independant' && (
                        <li>Supplément indépendant/artisan : <span className="font-semibold">+50 €</span></li>
                      )}
                      {formData.objectifs.includes('contact') && (
                        <li>Option contact facilité : <span className="font-semibold">+50 €</span></li>
                      )}
                      {formData.objectifs.includes('blog') && (
                        <li>Option blog/actualités : <span className="font-semibold">+150 €</span></li>
                      )}
                      {formData.objectifs.includes('portfolio') && (
                        <li>Option portfolio/projets : <span className="font-semibold">+100 €</span></li>
                      )}
                      {formData.objectifs.includes('dons') && (
                        <li>Option collecte de dons/adhésions : <span className="font-semibold">+200 €</span></li>
                      )}
                      {formData.autonomie === 'oui' && (
                        <li>Site administrable par vous-même : <span className="font-semibold">+100 €</span></li>
                      )}
                      {formData.contenu === 'partiel' && (
                        <li>Contenu partiellement prêt : <span className="font-semibold">+150 €</span></li>
                      )}
                      {formData.contenu === 'aucun' && (
                        <li>Contenu à créer entièrement : <span className="font-semibold">+300 €</span></li>
                      )}
                      {formData.pages > 5 && (
                        <li>
                          Pages supplémentaires ({formData.pages - 5} x 50 €) : <span className="font-semibold">+{(formData.pages - 5) * 50} €</span>
                        </li>
                      )}
                    </ul>
                  </div>
                )}

                {/* Section coordonnées et envoi */}
                {!formData.sent && (
                  <div className="p-4 bg-white border border-pink-100 rounded-2xl space-y-4">
                    <div>
                      <label className="font-semibold">Vos coordonnées</label>
                      <input
                        type="email"
                        placeholder="Votre adresse email"
                        value={formData.contact.email}
                        onChange={(e) => handleContactChange('email', e.target.value)}
                        required
                        className="w-full border p-2 rounded my-2"
                      />
                      <input
                        type="text"
                        placeholder="Votre téléphone (facultatif)"
                        value={formData.contact.phone}
                        onChange={(e) => handleContactChange('phone', e.target.value)}
                        className="w-full border p-2 rounded"
                      />
                    </div>
                    <button
                      type="submit"
                      className="bg-regularblue text-white px-4 py-2 rounded-full hover:bg-regularblue/90 w-full"
                      disabled={sending}
                    >
                      {sending ? "Envoi en cours..." : "Envoyer mon estimation pour devis"}
                    </button>
                    {error && (
                      <div className="mt-2 p-2 bg-red-100 border border-red-300 rounded">
                        <p className="text-red-700 font-semibold">{error}</p>
                      </div>
                    )}
                  </div>
                )}

                {formData.sent && (
                  <div className="p-4 bg-green-100 border border-green-300 rounded">
                    <p className="text-green-700 font-semibold">
                      Votre estimation vous a été envoyée par e-mail. Merci !
                    </p>
                    <p className="mt-2">
                      👉 <a
                        href="https://calendly.com/next-impact-digital/30min"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline"
                      >
                        Planifier un appel gratuit de 30 min avec notre équipe
                      </a>
                    </p>
                  </div>
                )}
              </div>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}

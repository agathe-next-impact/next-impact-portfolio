import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "./ui/accordion";

export default function FAQ() {

    return (
        <section id="faq">
            <div className="container">
                <div className="text-center md:mb-16">
                    <h2 className="text-3xl md:text-5xl text-regularblue font-medium mb-6">Questions fréquentes</h2>
                    <div className="hidden md:visible md:text-xl max-w-3xl mx-auto text-regularblue/70">
                        Vous avez des questions ? Voici les réponses aux questions les plus fréquentes que je reçois.
                    </div>
                </div>
                
            <div className="mx-auto max-w-3xl py-12">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>Quelle différence entre WordPress classique et WordPress Headless ?</AccordionTrigger>
                  <AccordionContent>
                    WordPress classique est une solution complète avec interface d'administration et affichage intégrés, 
                    idéale pour la plupart des sites web traditionnels. 
                    WordPress Headless sépare le back-end (gestion de contenu) du front-end (affichage), 
                    offrant plus de flexibilité et de performance pour des projets complexes ou multi-plateformes. <br /><br />
                    Le choix dépend de vos besoins : WordPress classique pour la simplicité et les coûts maîtrisés, 
                    Headless pour des performances optimales et une expérience utilisateur sur-mesure. 
                    Nous analyserons votre projet pour trouver l'approche la plus adaptée.
                    <br /><br />Quizz en ligne :  
                    <a href="/cms-headless" className="text-regularblue font-medium hover:underline"> Choisir mon CMS</a>.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger>Quels tarifs et quels délais ?</AccordionTrigger>
                  <AccordionContent>
                    Les délais s'échelonnent de 3-4 semaines pour un site basique à 8-12 semaines pour des projets complexes. 
                    Chaque devis est personnalisé après analyse de vos besoins spécifiques, du nombre de pages, 
                    des fonctionnalités requises et du niveau de personnalisation. <br /><br />
                  Nos tarifs varient selon la complexité : 
                    <a href="/simulateur-tarifs" className="text-regularblue font-medium hover:underline"> Simuler le tarif de mon site web</a>.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                  <AccordionTrigger>Comment se passe la migration vers WordPress Headless ?</AccordionTrigger>
                  <AccordionContent>
                    Oui, nous réalisons des migrations complètes en préservant votre SEO grâce aux redirections 301, à la conservation de vos URLs et métadonnées. 
                    Toutes vos données (contenus, images, utilisateurs) sont transférées et vérifiées minutieusement. <br /><br />
                    Nous metterons en place un plan de migration détaillé avec sauvegarde complète de l'existant et tests approfondis avant la mise en ligne. 
                    Le référencement est généralement maintenu, voire amélioré grâce à l'optimisation technique de WordPress.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-4">
                  <AccordionTrigger>Le site est-il optimisé pour les mobiles et le SEO ?</AccordionTrigger>
                  <AccordionContent>
                    Absolument, tous nos sites sont conçus mobile-first et s'adaptent parfaitement à tous les écrans (smartphones, tablettes, ordinateurs). <br /><br />
                    L'optimisation SEO est intégrée dès la conception : structure technique optimisée, vitesse de chargement, balises sémantiques, 
                    et respect des bonnes pratiques Google. En utilisant des thèmes performants et du code propre pour garantir une expérience 
                    utilisateur fluide sur tous les appareils et en testant chaque site sur différents navigateurs tout est garanti avant mise en ligne.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-5">
                  <AccordionTrigger>Comment modifier le contenu de mon site une fois terminé ?</AccordionTrigger>
                  <AccordionContent>
                    WordPress est reconnu pour sa facilité d'utilisation : vous pourrez modifier textes, images et pages via une interface intuitive, sans connaissances techniques.
                    <br /><br /> 
                    Une formation personnalisée (1h à 2h selon la complexité) pour vous rendre autonome sur la gestion quotidienne est incluse automatiquement. 
                    Un guide d'utilisation sur-mesure vous est également fourni avec captures d'écran et vidéos. <br /><br />
                    Des forfaits d'heures mobilisables à la demande sont disponibles pour toute assistance technique ou mise à jour future.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
            </div>
        </section>
    );
}
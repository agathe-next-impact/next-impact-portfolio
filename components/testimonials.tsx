import { Card, CardContent, CardFooter } from '@/components/ui/card';

const Testimonials = () => {
  const testimonials = [
    {
      quote: "Agathe se distingue par sa capacité à comprendre rapidement les enjeux business et à les traduire en solutions techniques efficaces. Pour notre projet, elle a su créer une landing page sur mesure qui reflète parfaitement notre identité de marque, tout en intégrant un système multilingue fluide et intuitif.",
      author: "Christophe Riboulet",
      position: "PDG",
      company: "Proditec",
      rating: 5
    },
    {
      quote: "Nous travaillons exclusivement avec Agathe désormais pour gérer notre site internet. Elle est très pro, de bons conseils et rapide. Ses offres sont claires et adaptées à nos besoins. Nous le recommandons très volontiers !",
      author: "Laura Schorestene",
      position: "Fondatrice",
      company: "Senza Nature",
      rating: 5
    },
    {
      quote: "Quand réactivité, savoir-faire sont réunis cela assure un résultat. Si en plus de cela l'échange même à distance est facile et efficace, cela rend la mission agréable…:) Merci Agathe.",
      author: "Philippe Barrat",
      position: "CTO",
      company: "Neway Partners",
      rating: 5
    }
  ];

  const renderStars = (rating: number) => {
    return Array(5).fill(0).map((_, i) => (
      <svg 
        key={i} 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 24 24" 
        fill={i < rating ? "currentColor" : "none"}
        stroke={i < rating ? "none" : "currentColor"}
        className={`w-5 h-5 ${i < rating ? 'text-yellow-500' : 'text-gray-600'}`}
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
      </svg>
    ));
  };

  return (
    <section id="testimonials" className="py-24 md:py-32 ">
      <div className="container">
        <div className='text-center'>
          <h2 className="text-3xl md:text-5xl text-regularblue font-medium mb-6">Ce qu'en disent mes clients</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
          {testimonials.map((testimonial, index) => (
            <Card 
              key={index} 
              className="bg-yellow-50/10 backdrop-blur-md border border-lightyellow/40 rounded-2xl transition-all overflow-hidden shadow-none"
            >
              <CardContent className="pt-8 flex-grow">     
                <div className="flex items-center mb-4">
                  {renderStars(testimonial.rating)}
                  <span className="ml-2 text-sm text-regularblue/70">
                    {testimonial.rating} étoiles
                  </span>
                </div>
               
                <p className="text-md mb-4 text-regularblue leading-relaxed">{testimonial.quote}</p>
              </CardContent>
              
              <CardFooter className="pt-2">
                <div>
                  <p className="font-medium font-googletitre text-base text-regularblue">{testimonial.author}</p>
                  <p className="text-sm font-googletitre text-regularblue/70">
                    {testimonial.position}</p>
                  <p className="mt-2 text-xs text-regularblue/70 uppercase">
                     {testimonial.company}
                  </p>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
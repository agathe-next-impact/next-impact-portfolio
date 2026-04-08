import Image from 'next/image';
import { CheckCircle } from 'lucide-react';

interface SolutionLandingProps {
    title?: string;
    subtitle?: string;
    imageUrl?: string;
    features?: string[];
}

export default function SolutionLanding({
    title,
    subtitle,
    imageUrl,
    features,
    }: SolutionLandingProps
) {
    return (
    <section className="bg-mediumblue/60 w-full mx-auto mt-24 flex flex-col backdrop-blur-xl border-y border-white/10 md:px-6 py-16 relative">
        <div className="max-w-5xl mx-auto mb-12">
          <h2 className="text-3xl font-medium text-white mb-4">
            {title}
          </h2>
          <p className="text-lg text-white/80">
            {subtitle}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        <div>
            <Image
                src={imageUrl || '/images/motivation-landing.jpg'}
                alt={title}
                width={600}
                height={400}
                className="w-full h-auto rounded-lg mb-8"
            />
        </div>
        <div className="max-w-2xl mx-auto">
        {features && features.length > 0 && (
            <ul className="mt-6 space-y-6 text-white text-lg">
                {features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-3 text-white/80">
                        <CheckCircle className="h-5 w-5 text-coral" />
                        {feature}
                    </li>
                ))}
            </ul>
        )}
        </div>
        </div>
      </section>
    );
    }
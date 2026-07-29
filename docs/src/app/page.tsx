import AspectDashboard from '@/components/sections/aspect-dashboard';
import AspectFaq from '@/components/sections/aspect-faq';
import AspectHero from '@/components/sections/aspect-hero';
import AspectLogos from '@/components/sections/aspect-logos';
import AspectPricing from '@/components/sections/aspect-pricing';
import AspectSeparator from '@/components/sections/aspect-separator';
import { AspectTabs } from '@/components/sections/aspect-tabs';
import AspectTestimonials from '@/components/sections/aspect-testimonials';
import AspectWorldMap from '@/components/sections/aspect-world-map';

export default function Home() {
  return (
    <>
      <AspectHero />
      <AspectLogos />
      <AspectTabs />
      <AspectTestimonials />
      <AspectDashboard />
      <AspectWorldMap />
      <AspectFaq />
      <AspectPricing />
      <AspectSeparator />
    </>
  );
}

import React from 'react';

import { AspectFeatures } from '@/components/sections/aspect-features';
import AspectFeaturesHero from '@/components/sections/aspect-features-hero';
import AspectSeparator from '@/components/sections/aspect-separator';
import AspectTestimonials from '@/components/sections/aspect-testimonials';

const page = () => {
  return (
    <>
      <AspectFeaturesHero />
      <AspectFeatures />
      <AspectTestimonials />
      <AspectSeparator />
    </>
  );
};

export default page;

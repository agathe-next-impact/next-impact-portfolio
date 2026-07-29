import React from 'react';

import AspectFaq from '@/components/sections/aspect-faq';
import { AspectFeatures } from '@/components/sections/aspect-features';
import AspectSeparator from '@/components/sections/aspect-separator';
import AspectSplitSection from '@/components/sections/aspect-split-section';
import AspectSupportHero from '@/components/sections/aspect-support-hero';

const page = () => {
  return (
    <>
      <AspectSupportHero />
      <AspectSplitSection
        header="Dedicated Experts on Call"
        description="Prefer a conversation? Tap the phone icon and you’ll reach a live FinSight advisor—no call centers, no scripts. From onboarding to complex reconciliations, our team is ready to walk you through every step so you can keep your finances moving smoothly."
        image="/images/about/split-section/3.webp"
        side="R"
      />
      <AspectFaq />
      <AspectSeparator />
      <AspectFeatures />
      <AspectSeparator />
    </>
  );
};

export default page;

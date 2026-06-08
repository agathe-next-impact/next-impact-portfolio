import React from 'react';

import AspectContactForm from '@/components/sections/aspect-contact-form';
import AspectContactHero from '@/components/sections/aspect-contact-hero';
import AspectSeparator from '@/components/sections/aspect-separator';

const page = () => {
  return (
    <>
      <AspectContactHero />
      <AspectSeparator />
      <AspectContactForm />
      <AspectSeparator />
    </>
  );
};

export default page;

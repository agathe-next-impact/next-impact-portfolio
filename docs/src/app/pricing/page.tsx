import React from 'react';

import AspectPricing from '@/components/sections/aspect-pricing';
import AspectPricingTable from '@/components/sections/aspect-pricing-table';
import AspectSeparator from '@/components/sections/aspect-separator';

const page = () => {
  return (
    <>
      <AspectPricing />
      <AspectSeparator />
      <AspectPricingTable />
      <AspectSeparator />
    </>
  );
};

export default page;

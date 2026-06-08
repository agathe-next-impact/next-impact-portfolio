import AspectAboutHero from '@/components/sections/aspect-about-hero';
import AspectOpenPositions from '@/components/sections/aspect-open-positions';
import AspectSeparator from '@/components/sections/aspect-separator';
import AspectSplitSection from '@/components/sections/aspect-split-section';
import AspectTeamCarousel from '@/components/sections/aspect-team-carousel';

export default function AboutPage() {
  return (
    <>
      <AspectAboutHero />
      <AspectSeparator />
      <AspectTeamCarousel />
      <AspectSplitSection
        header="Life at FinSight"
        description="We believe that great work comes from happy, inspired teams. That’s why we offer unlimited paid vacation, quarterly team-building retreats, and monthly hack days where anyone can pitch new ideas and build prototypes. From rafting down the Soča to board-game nights in our Ljubljana office, we’re always finding fresh ways to connect beyond the screen."
        image="/images/about/split-section/1.webp"
        side="R"
      />
      <AspectSplitSection
        header="Wellness & Perks"
        description="Your health matters to us. Every FinSight employee gets a Fit Pass—full access to partner gyms, yoga studios, and wellness classes across the city. We also host weekly guided meditation sessions, subsidize healthy meal deliveries, and provide ergonomic gear so you can feel your best, on and off the clock."
        image="/images/about/split-section/2.webp"
        side="L"
      />
      <AspectSeparator />
      <AspectOpenPositions />
      <AspectSeparator />
    </>
  );
}

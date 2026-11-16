import { CtaBand, FeaturedProperties, Hero, HowSteps, Services, WhyChoose } from "@/components/sections";

// Listings change from the admin; saving there revalidates this page. The
// hourly refresh is only a safety net.
export const revalidate = 3600;

export default function HomePage() {
  return (
    <>
      <Hero />
      <FeaturedProperties />
      <WhyChoose />
      <Services />
      <HowSteps compact />
      <CtaBand />
    </>
  );
}

import HeroSlider from "@/components/home/HeroSlider";
import DailyWisdomSection from "@/components/home/DailyWisdomSection";
import ServiceCarousel from "@/components/home/ServiceCarousel";
import QuranSection from "@/components/home/QuranSection";
import FounderSection from "@/components/home/FounderSection";
import PillarsSection from "@/components/home/PillarsSection";
import AboutImpactSection from "@/components/home/AboutImpactSection";
import FeaturedCourses from "@/components/academy/FeaturedCourses";
import WhyChoose from "@/components/academy/WhyChoose";
import ThreeSteps from "@/components/academy/ThreeSteps";
import InstitutionsSection from "@/components/home/InstitutionsSection";
import ServicesInstitutionsSection from "@/components/home/ServicesInstitutionsSection";
import MissionCareSection from "@/components/home/MissionCareSection";
import SupportUsSection from "@/components/home/SupportUsSection";
import WhatWeProvideSection from "@/components/home/WhatWeProvideSection";

export default function HomePage() {
  return (
    <>
      <HeroSlider />
      <DailyWisdomSection />
      <ServiceCarousel />
      <QuranSection />
      <FounderSection />
      <PillarsSection />
      <AboutImpactSection />
      <FeaturedCourses />
      <WhyChoose />
      <ThreeSteps />
      <InstitutionsSection />
      <ServicesInstitutionsSection />
      <MissionCareSection />
      <SupportUsSection />
      <WhatWeProvideSection />
    </>
  );
}

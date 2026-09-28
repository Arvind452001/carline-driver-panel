import { useState } from 'react';
import {
  HeroSection,
  StatsSection,
  AppShowcaseSection,
  BenefitsSection,
  RequirementsSection,
  TestimonialsSection,
  HowItWorksSection,
  FaqSection,
  CtaBannerSection,
  VideoModal,
} from '@/components/home';

export function HomePage() {
  const [showVideoModal, setShowVideoModal] = useState(false);
  return (
    <div className="bg-[#FFFFFF] text-[#1E293B] selection:bg-[#FF5B26] selection:text-white font-sans antialiased">
      <HeroSection onWatchVideo={() => setShowVideoModal(true)} />
      <StatsSection />
      <AppShowcaseSection />
      <BenefitsSection />
      <RequirementsSection />
      <TestimonialsSection onWatchVideo={() => setShowVideoModal(true)} />
      <HowItWorksSection />
      <FaqSection />
      <CtaBannerSection />
      <VideoModal
        isOpen={showVideoModal}
        onClose={() => setShowVideoModal(false)}
      />
    </div>
  );
}
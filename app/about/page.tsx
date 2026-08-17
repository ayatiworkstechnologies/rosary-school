import AboutContent from "../../components/about/AboutContent";
import FoundressSection from "../../components/about/FoundressSection";
import GoalsObjectives from "../../components/about/GoalsObjectives";
import PrincipalsSection from "../../components/about/PrincipalsSection";
import VisionMissionMotto from "../../components/about/VisionMissionMotto";
import InnerBanner from "../../components/common/InnerBanner";

export default function AboutPage() {
  return (
    <>
      <InnerBanner
        title="About Us"
        desktopImage="/images/ex-1.png"
        mobileImage="/images/ex-1.png"
        alt="Rosary School students"
      />

      <AboutContent />

      <VisionMissionMotto />

      <GoalsObjectives />

      <FoundressSection />

      <PrincipalsSection />

    </>
  );
}
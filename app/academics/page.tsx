
import AcademicsOverview from "../../components/academic/AcademicCard";
import InnerBanner from "../../components/common/InnerBanner";

export default function AcademicsPage() {
  return (
    <>
      <InnerBanner
        title="Academics"
        desktopImage="/images/academic-banner.png"
        mobileImage="/images/academic-banner-mobile.png"
        alt="Rosary School students"
      />

     <AcademicsOverview />

    </>
  );
}
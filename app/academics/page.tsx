
import AcademicsOverview from "../../components/academic/AcademicCard";
import InnerBanner from "../../components/common/InnerBanner";

export default function AcademicsPage() {
  return (
    <>
      <InnerBanner
        title="Academics"
        desktopImage="/images/ex-1.png"
        mobileImage="/images/ex-1.png"
        alt="Rosary School students"
      />

     <AcademicsOverview />

    </>
  );
}
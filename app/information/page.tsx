
import InnerBanner from "../../components/common/InnerBanner";
import AcademicsOverview from "../../components/information/informationcard";

export default function InformationPage() {
  return (
    <>
      <InnerBanner
        title="Information"
        desktopImage="/images/ex-1.png"
        mobileImage="/images/ex-1.png"
        alt="Rosary School students"
      />

    <AcademicsOverview />


    </>
  );
}
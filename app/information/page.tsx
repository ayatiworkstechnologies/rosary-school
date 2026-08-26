
import InnerBanner from "../../components/common/InnerBanner";
import AcademicsOverview from "../../components/information/informationcard";

export default function InformationPage() {
  return (
    <>
      <InnerBanner
        title="Information"
        desktopImage="/images/information-banner.png"
        mobileImage="/images/information-banner-mobile.png"
        alt="Rosary School students"
      />

    <AcademicsOverview />


    </>
  );
}
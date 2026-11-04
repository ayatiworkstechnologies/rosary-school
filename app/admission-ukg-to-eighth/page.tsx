
import AdmissionUkgToEighth from "@/components/admissions/admission-ukg-to-eighth";
import InnerBanner from "../../components/common/InnerBanner";


export default function AdmissionsUkgTOEighthPage() {
  return (
    <>
      <InnerBanner
        title="Admissions UKG to Std VIII"
        desktopImage="/images/admission--banner.png"
        mobileImage="/images/admission-banner-mobile-1.png"
        alt="Rosary School students"
      />

      <AdmissionUkgToEighth />



    </>
  );
}
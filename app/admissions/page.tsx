
import PreliminaryAdmissionForm from "../../components/admissions/PreliminaryAdmissionForm";
import InnerBanner from "../../components/common/InnerBanner";


export default function AdmissionsPage() {
  return (
    <>
      <InnerBanner
        title="Admissions"
        desktopImage="/images/admission-banner.png"
        mobileImage="/images/admission-banner-mobile.png"
        alt="Rosary School students"
      />

      <PreliminaryAdmissionForm />



    </>
  );
}
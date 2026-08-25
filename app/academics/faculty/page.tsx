


import FacultyShowcase from "../../../components/academic/faculty/FacultyShowcase";
import InnerBanner from "../../../components/common/InnerBanner";

export default function FacultyPage() {
  return (
    <>
      <InnerBanner
        title="Faculty"
        desktopImage="/images/faculty-banner.png"
        mobileImage="/images/faculty-banner-mobile.png"
        alt="Rosary School faculty"
      />
      

      <FacultyShowcase />
   

    </>
    
  );
}
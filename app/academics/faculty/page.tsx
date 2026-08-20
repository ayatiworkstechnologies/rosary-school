


import FacultyShowcase from "../../../components/academic/faculty/FacultyShowcase";
import InnerBanner from "../../../components/common/InnerBanner";

export default function FacultyPage() {
  return (
    <>
      <InnerBanner
        title="Faculty"
        desktopImage="/images/ex-1.png"
        mobileImage="/images/ex-1.png"
        alt="Rosary School faculty"
      />
      

      <FacultyShowcase />
   

    </>
    
  );
}
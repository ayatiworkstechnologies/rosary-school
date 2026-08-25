


import InnerBanner from "../../../components/common/InnerBanner";
import ImportantResources from "../../../components/community/parentcorner/ImportantResources";
import ParentCommunicationSupport from "../../../components/community/parentcorner/ParentCommunicationSupport";
import ParentUpdatesSection from "../../../components/community/parentcorner/ParentUpdatesSection";


export default function ParentCornerPage() {
  return (
    <>
      <InnerBanner
        title="Parent Corner"
        desktopImage="/images/parent-corner-banner.png"
        mobileImage="/images/parent-corner-banner-mobile.png"
        alt="Rosary School students"
      />
       
      <ParentUpdatesSection />
      <ImportantResources />

      <ParentCommunicationSupport />
     

    </>
    
  );
}



import InnerBanner from "../../../components/common/InnerBanner";
import ImportantResources from "../../../components/community/parentcorner/ImportantResources";
import ParentCommunicationSupport from "../../../components/community/parentcorner/ParentCommunicationSupport";
import ParentUpdatesSection from "../../../components/community/parentcorner/ParentUpdatesSection";


export default function ParentCornerPage() {
  return (
    <>
      <InnerBanner
        title="Parent Corner"
        desktopImage="/images/ex-1.png"
        mobileImage="/images/ex-1.png"
        alt="Rosary School students"
      />
       
      <ParentUpdatesSection />
      <ImportantResources />

      <ParentCommunicationSupport />
     

    </>
    
  );
}
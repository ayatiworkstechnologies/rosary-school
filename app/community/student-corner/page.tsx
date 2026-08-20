


import InnerBanner from "../../../components/common/InnerBanner";
import ExploreBeyondClassroom from "../../../components/community/studentcorner/ExploreBeyondClassroom";
import LatestStudentUpdates from "../../../components/community/studentcorner/LatestStudentUpdates";
import QuickAccessResources from "../../../components/community/studentcorner/QuickAccessResources";
import StudentSupportCTA from "../../../components/community/studentcorner/StudentSupportCTA";


export default function StudentCornerPage() {
  return (
    <>
      <InnerBanner
        title="Student Corner"
        desktopImage="/images/ex-1.png"
        mobileImage="/images/ex-1.png"
        alt="Rosary School students"
      />

     <LatestStudentUpdates />

      <ExploreBeyondClassroom />

      <QuickAccessResources /> 
      
      <StudentSupportCTA />

    </>
    
  );
}
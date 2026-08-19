


import StudentClubsActivities from "../../../components/academic/clubs/StudentClubsActivities";
import InnerBanner from "../../../components/common/InnerBanner";

export default function ClubsPage() {
  return (
    <>
      <InnerBanner
        title="Clubs"
        desktopImage="/images/ex-1.png"
        mobileImage="/images/ex-1.png"
        alt="Rosary School students"
      />

      <StudentClubsActivities />

    </>
    
  );
}
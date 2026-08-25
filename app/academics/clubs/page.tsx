


import StudentClubsActivities from "../../../components/academic/clubs/StudentClubsActivities";
import InnerBanner from "../../../components/common/InnerBanner";

export default function ClubsPage() {
  return (
    <>
      <InnerBanner
        title="Clubs"
        desktopImage="/images/clubs-banner.png"
        mobileImage="/images/clubs-banner-mobile.png"
        alt="Rosary School students"
      />

      <StudentClubsActivities />

    </>
    
  );
}
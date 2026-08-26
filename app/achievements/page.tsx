
import AchievementsGallery from "../../components/achievements/AchievementsGallery";
import InnerBanner from "../../components/common/InnerBanner";


export default function AchievementsPage() {
  return (
    <>
      <InnerBanner
        title="Achievements"
        desktopImage="/images/achievements-banner.png"
        mobileImage="/images/achievements-banner-mobile.png"
        alt="Rosary School students"
      />

      <AchievementsGallery />






    </>
  );
}
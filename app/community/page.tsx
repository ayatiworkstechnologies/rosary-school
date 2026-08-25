
import InnerBanner from "../../components/common/InnerBanner";
import Communitycard from "../../components/community/Communitycard";

export default function CommunityPage() {
  return (
    <>
      <InnerBanner
        title="Community"
        desktopImage="/images/community-banner.png"
        mobileImage="/images/community-banner-mobile.png"
        alt="Rosary School students"
      />

       <Communitycard />


    </>
  );
}
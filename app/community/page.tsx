
import InnerBanner from "../../components/common/InnerBanner";
import Communitycard from "../../components/community/Communitycard";

export default function CommunityPage() {
  return (
    <>
      <InnerBanner
        title="Community"
        desktopImage="/images/ex-1.png"
        mobileImage="/images/ex-1.png"
        alt="Rosary School students"
      />

       <Communitycard />


    </>
  );
}
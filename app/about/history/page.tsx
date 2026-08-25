import HistoryTimeline from "../../../components/about/HistoryTimeline";
import InnerBanner from "../../../components/common/InnerBanner";

export default function HistoryPage() {
  return (
    <>
      <InnerBanner
      title="History"
        desktopImage="/images/history-banner.png"
        mobileImage="/images/history-banner-mobile.png"
        alt="Rosary School students"
      
      />
      

      <HistoryTimeline />
     

    </>
  );
}
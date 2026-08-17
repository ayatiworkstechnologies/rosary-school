import HistoryTimeline from "../../../components/about/HistoryTimeline";
import InnerBanner from "../../../components/common/InnerBanner";

export default function HistoryPage() {
  return (
    <>
      <InnerBanner
      title="History"
        desktopImage="/images/ex-1.png"
        mobileImage="/images/ex-1.png"
        alt="Rosary School students"
      
      />
      

      <HistoryTimeline />
     

    </>
  );
}
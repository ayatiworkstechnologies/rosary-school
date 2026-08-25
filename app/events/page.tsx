
import InnerBanner from "../../components/common/InnerBanner";
import SchoolEventsSection from "../../components/events/SchoolEventsSection";

export default function EventsPage() {
  return (
    <>
      <InnerBanner
        title="Events"
        desktopImage="/images/ex-1.png"
        mobileImage="/images/ex-1.png"
        alt="Rosary School students"
      />

      <SchoolEventsSection />

    </>
  );
}
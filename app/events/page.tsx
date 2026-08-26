
import InnerBanner from "../../components/common/InnerBanner";
import SchoolEventsSection from "../../components/events/SchoolEventsSection";

export default function EventsPage() {
  return (
    <>
      <InnerBanner
        title="Events"
        desktopImage="/images/events-banner.png"
        mobileImage="/images/events-banner-mobile.png"
        alt="Rosary School students"
      />

      <SchoolEventsSection />

    </>
  );
}
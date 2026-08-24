
import InnerBanner from "../../components/common/InnerBanner";
import SchoolEventsSection from "../../components/news/SchoolEventsSection";

export default function NewsPage() {
  return (
    <>
      <InnerBanner
        title="News"
        desktopImage="/images/ex-1.png"
        mobileImage="/images/ex-1.png"
        alt="Rosary School students"
      />

      <SchoolEventsSection />

    </>
  );
}
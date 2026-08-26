
import InnerBanner from "../../components/common/InnerBanner";
import SchoolNews from "../../components/news/SchoolNews";

export default function NewsPage() {
  return (
    <>
      <InnerBanner
        title="News"
        desktopImage="/images/news-banner.png"
        mobileImage="/images/news-banner-mobile.png"
        alt="Rosary School students"
      />

      <SchoolNews />

  


    </>
  );
}
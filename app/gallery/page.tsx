
import InnerBanner from "../../components/common/InnerBanner";
import SchoolHighlightsGallery from "../../components/gallery/SchoolHighlightsGallery";

export default function GalleryPage() {
  return (
    <>
      <InnerBanner
        title="Gallery"
        desktopImage="/images/gallery-banner.png"
        mobileImage="/images/gallery-banner-mobile.png"
        alt="Rosary School students"
      />

      <SchoolHighlightsGallery />


    </>
  );
}
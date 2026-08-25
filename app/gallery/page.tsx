
import InnerBanner from "../../components/common/InnerBanner";
import SchoolHighlightsGallery from "../../components/gallery/SchoolHighlightsGallery";

export default function GalleryPage() {
  return (
    <>
      <InnerBanner
        title="Gallery"
        desktopImage="/images/ex-1.png"
        mobileImage="/images/ex-1.png"
        alt="Rosary School students"
      />

      <SchoolHighlightsGallery />


    </>
  );
}
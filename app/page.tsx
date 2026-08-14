import ConnectSection from "../components/Homepage/ConnectSection";
import GallerySection from "../components/Homepage/GallerySection";
import HeroBanner from "../components/Homepage/HeroBanner";
import NewsAnnouncement from "../components/Homepage/NewsAnnouncement";
import NoticeBoard from "../components/Homepage/NoticeBoard";
import PrincipalMessage from "../components/Homepage/PrincipalMessage";
import RosaryShowcase from "../components/Homepage/RosaryShowcase";
import UpcomingEvents from "../components/Homepage/UpcomingEvents";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
     

     
      <HeroBanner />

      <PrincipalMessage />

      <NewsAnnouncement />

      <UpcomingEvents />

     <NoticeBoard />

     <RosaryShowcase />

     <GallerySection />
     
     <ConnectSection />

    </main>
  );
}
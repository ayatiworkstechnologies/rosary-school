
import InnerBanner from "../../components/common/InnerBanner";
import ConnectWithRosary from "../../components/contact-us/ConnectWithRosary";
import GetInTouchSection from "../../components/contact-us/GetInTouchSection";

export default function ContactUsPage() {
  return (
    <>
      <InnerBanner
        title="Contact Us"
        desktopImage="/images/contactus-banner.png"
        mobileImage="/images/contactus-banner-mobile.png"
        alt="Rosary School students"
      />

      <ConnectWithRosary />

      <GetInTouchSection />


    </>
  );
}
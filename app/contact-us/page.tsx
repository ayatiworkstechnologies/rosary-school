
import InnerBanner from "../../components/common/InnerBanner";
import ConnectWithRosary from "../../components/contact-us/ConnectWithRosary";
import GetInTouchSection from "../../components/contact-us/GetInTouchSection";

export default function ContactUsPage() {
  return (
    <>
      <InnerBanner
        title="Contact Us"
        desktopImage="/images/ex-1.png"
        mobileImage="/images/ex-1.png"
        alt="Rosary School students"
      />

      <ConnectWithRosary />

      <GetInTouchSection />


    </>
  );
}
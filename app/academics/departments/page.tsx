

import DepartmentsOverview from "../../../components/academic/departments/DepartmentsOverview";
import WhatStudentsLearn from "../../../components/academic/departments/WhatStudentsLearn";
import InnerBanner from "../../../components/common/InnerBanner";

export default function DepartmentsPage() {
  return (
    <>
      <InnerBanner
        title="Departments"
        desktopImage="/images/departments-banner.png"
        mobileImage="/images/departments-banner-mobile.png"
        alt="Rosary School students"
      />

      <DepartmentsOverview />


       <WhatStudentsLearn />

    </>
  );
}
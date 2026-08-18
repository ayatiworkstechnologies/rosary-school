
import AcademicSchedule from "../../../components/academic/curriculum/AcademicSchedule";
import CurriculumIntro from "../../../components/academic/curriculum/CurriculumIntro";
import CurriculumStages from "../../../components/academic/curriculum/CurriculumStages";
import LearningApproach from "../../../components/academic/curriculum/LearningApproach";
import SubjectsWeOffer from "../../../components/academic/curriculum/SubjectsWeOffer";
import InnerBanner from "../../../components/common/InnerBanner";

export default function CurriculumPage() {
  return (
    <>
      <InnerBanner
        title="Curriculum"
        desktopImage="/images/ex-1.png"
        mobileImage="/images/ex-1.png"
        alt="Rosary School students"
      />

      <CurriculumIntro />

      <LearningApproach />

      <CurriculumStages />

      <SubjectsWeOffer />

      <AcademicSchedule />


    </>
  );
}
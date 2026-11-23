import gradeIcon from '../../../assets/images/student/documents/enrollment-certificate/guide-grade.png';
import illustration from '../../../assets/images/student/documents/enrollment-certificate/guide-illustration.png';
import schoolProgramIcon from '../../../assets/images/student/documents/enrollment-certificate/guide-school-program.png';
import { DocumentRegistrationInformation } from './DocumentRegistrationInformation';

type EnrollmentCertificateInformationProps = {
  onBack: () => void;
  onRegister: () => void;
};

const GUIDE_ITEMS = [
  { icon: schoolProgramIcon, label: '대학교 확인' },
  { icon: gradeIcon, label: '학년 확인' },
] as const;

export function EnrollmentCertificateInformation(
  props: EnrollmentCertificateInformationProps,
) {
  return (
    <DocumentRegistrationInformation
      description="대학교와 학년 정보를 위해 필요해요"
      guideItems={GUIDE_ITEMS}
      heading={['본인의 재학증명서를', '등록해주세요.']}
      illustration={illustration}
      title="재학증명서 등록"
      {...props}
    />
  );
}

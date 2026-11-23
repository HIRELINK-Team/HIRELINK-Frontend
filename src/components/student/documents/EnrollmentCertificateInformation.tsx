import gradeIcon from '../../../assets/images/student/documents/enrollment-certificate/guide-grade.png';
import illustration from '../../../assets/images/student/documents/enrollment-certificate/guide-illustration.png';
import schoolProgramIcon from '../../../assets/images/student/documents/enrollment-certificate/guide-school-program.png';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
  return (
    <DocumentRegistrationInformation
      description={t('my.documentFlow.enrollmentDescription')}
      guideItems={GUIDE_ITEMS.map((item, index) => ({ ...item, label: t(index === 0 ? 'my.documentFlow.schoolCheck' : 'my.documentFlow.yearCheck') }))}
      heading={[t('my.documentFlow.enrollmentHeading1'), t('my.documentFlow.registerPrompt')]}
      illustration={illustration}
      title={t('my.documentFlow.enrollmentTitle')}
      {...props}
    />
  );
}

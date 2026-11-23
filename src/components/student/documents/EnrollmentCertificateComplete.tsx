import completeIcon from '../../../assets/icons/student/documents/enrollment-certificate/complete-check.svg';
import { DocumentRegistrationComplete } from './DocumentRegistrationComplete';

type EnrollmentCertificateCompleteProps = {
  onBack: () => void;
  onConfirm: () => void;
};

export function EnrollmentCertificateComplete(
  props: EnrollmentCertificateCompleteProps,
) {
  return (
    <DocumentRegistrationComplete
      completeIcon={completeIcon}
      description={[
        '등록된 정보를 바탕으로',
        '대학교 및 학년 정보가 확인되었어요.',
      ]}
      {...props}
    />
  );
}

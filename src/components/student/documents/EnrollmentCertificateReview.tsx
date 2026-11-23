import scanIcon from '../../../assets/icons/student/documents/enrollment-certificate/camera-scan.svg';
import { STUDENT_ENROLLMENT_CERTIFICATE_DETAILS } from '../../../mocks/studentDocuments';
import { DocumentRecognitionReview } from './DocumentRecognitionReview';

type EnrollmentCertificateReviewProps = {
  onBack: () => void;
  onRetry: () => void;
  onConfirm: () => void;
};

const REVIEW_FIELDS = [
  {
    label: '대학교',
    value: STUDENT_ENROLLMENT_CERTIFICATE_DETAILS[0]?.value ?? '',
  },
  {
    label: '학년',
    value: STUDENT_ENROLLMENT_CERTIFICATE_DETAILS[2]?.value ?? '',
  },
].filter((field) => field.value);

export function EnrollmentCertificateReview(
  props: EnrollmentCertificateReviewProps,
) {
  return (
    <DocumentRecognitionReview
      documentTitle="재학증명서"
      fields={REVIEW_FIELDS}
      scanIcon={scanIcon}
      {...props}
    />
  );
}

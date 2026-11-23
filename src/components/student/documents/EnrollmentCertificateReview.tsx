import scanIcon from '../../../assets/icons/student/documents/enrollment-certificate/camera-scan.svg';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
  return (
    <DocumentRecognitionReview
      documentTitle={t('my.documents.enrollment')}
      fields={REVIEW_FIELDS.map((field, index) => ({ ...field, label: t(index === 0 ? 'my.documentFlow.school' : 'my.documentFlow.year') }))}
      scanIcon={scanIcon}
      {...props}
    />
  );
}

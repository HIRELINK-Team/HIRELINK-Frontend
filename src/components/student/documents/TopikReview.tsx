import scanIcon from '../../../assets/icons/student/documents/topik/camera-scan.svg';
import { STUDENT_TOPIK_DETAILS } from '../../../mocks/studentDocuments';
import { DocumentRecognitionReview } from './DocumentRecognitionReview';

type TopikReviewProps = {
  onBack: () => void;
  onRetry: () => void;
  onConfirm: () => void;
};

const REVIEW_FIELDS = [
  {
    label: 'TOPIK 등급',
    value: STUDENT_TOPIK_DETAILS[0]?.value ?? '',
  },
].filter((field) => field.value);

export function TopikReview(props: TopikReviewProps) {
  return (
    <DocumentRecognitionReview
      documentTitle="TOPIK 성적증명서"
      fields={REVIEW_FIELDS}
      scanIcon={scanIcon}
      {...props}
    />
  );
}

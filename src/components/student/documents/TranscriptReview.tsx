import scanIcon from '../../../assets/icons/student/documents/transcript/camera-scan.svg';
import { STUDENT_TRANSCRIPT_DETAILS } from '../../../mocks/studentDocuments';
import { DocumentRecognitionReview } from './DocumentRecognitionReview';

type TranscriptReviewProps = {
  onBack: () => void;
  onRetry: () => void;
  onConfirm: () => void;
};

const REVIEW_FIELDS = [
  {
    label: '성적',
    value: STUDENT_TRANSCRIPT_DETAILS[0]?.value ?? '',
  },
].filter((field) => field.value);

export function TranscriptReview(props: TranscriptReviewProps) {
  return (
    <DocumentRecognitionReview
      documentTitle="성적증명서"
      fields={REVIEW_FIELDS}
      scanIcon={scanIcon}
      {...props}
    />
  );
}

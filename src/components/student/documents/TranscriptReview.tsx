import scanIcon from '../../../assets/icons/student/documents/transcript/camera-scan.svg';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
  return (
    <DocumentRecognitionReview
      documentTitle={t('my.documents.transcript')}
      fields={REVIEW_FIELDS.map((field) => ({ ...field, label: t('my.documentFlow.grade') }))}
      scanIcon={scanIcon}
      {...props}
    />
  );
}

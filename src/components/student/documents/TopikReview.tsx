import scanIcon from '../../../assets/icons/student/documents/topik/camera-scan.svg';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
  return (
    <DocumentRecognitionReview
      documentTitle={t('my.documents.topik')}
      fields={REVIEW_FIELDS.map((field) => ({ ...field, label: t('my.documentFlow.topikLevel') }))}
      scanIcon={scanIcon}
      {...props}
    />
  );
}

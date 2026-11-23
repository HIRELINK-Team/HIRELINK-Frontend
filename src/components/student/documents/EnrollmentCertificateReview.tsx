import { useTranslation } from 'react-i18next';
import scanIcon from '../../../assets/icons/student/documents/enrollment-certificate/camera-scan.svg';
import type { EnrollmentPreviewResponse } from '../../../types/studentDocument';
import { DocumentRecognitionReview } from './DocumentRecognitionReview';

type EnrollmentCertificateReviewProps = {
  preview: EnrollmentPreviewResponse;
  onBack: () => void;
  onRetry: () => void;
  onConfirm: () => void;
};

export function EnrollmentCertificateReview({
  preview,
  ...props
}: EnrollmentCertificateReviewProps) {
  const { t } = useTranslation();
  return (
    <DocumentRecognitionReview
      documentTitle={t('my.documents.enrollment')}
      fields={[
        { label: t('my.documentFlow.school'), value: preview.universityName },
        { label: '???', value: preview.campusName ?? '-' },
        { label: t('my.documentFlow.year'), value: `${preview.gradeLevel}??` },
        { label: '?? ID', value: preview.draftId },
      ]}
      scanIcon={scanIcon}
      {...props}
    />
  );
}
